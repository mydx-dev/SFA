import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const STORAGE_KEY = "two-column-layout-width";
const DEFAULT_LEFT_WIDTH = 30;

interface TwoColumnLayoutProps {
    left: ReactNode;
    right: ReactNode;
    defaultLeftWidth?: number;
}

export const TwoColumnLayout = ({ left, right, defaultLeftWidth = DEFAULT_LEFT_WIDTH }: TwoColumnLayoutProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const [leftWidth, setLeftWidth] = useState<number>(stored ? Number(stored) : defaultLeftWidth);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);
    const isDragging = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(leftWidth));
    }, [leftWidth]);

    const handleMouseDown = useCallback(() => {
        isDragging.current = true;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.min(80, Math.max(10, newWidth)));
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    if (isMobile) {
        return (
            <Box>
                <Box aria-label="左カラム">{left}</Box>
                <Box aria-label="右カラム">{right}</Box>
            </Box>
        );
    }

    return (
        <Box ref={containerRef} sx={{ display: "flex", height: "100%", position: "relative" }}>
            {!leftCollapsed && (
                <Box
                    aria-label="左カラム"
                    sx={{ width: `${leftWidth}%`, overflow: "auto", flexShrink: 0 }}
                >
                    {left}
                </Box>
            )}
            <Box
                aria-label="リサイザー"
                sx={{
                    width: 8,
                    cursor: "col-resize",
                    bgcolor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
                onMouseDown={handleMouseDown}
            >
                <IconButton
                    size="small"
                    aria-label="左カラムを折りたたむ"
                    onClick={() => setLeftCollapsed(c => !c)}
                    sx={{ p: 0 }}
                >
                    <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    aria-label="右カラムを折りたたむ"
                    onClick={() => setRightCollapsed(c => !c)}
                    sx={{ p: 0 }}
                >
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>
            {!rightCollapsed && (
                <Box
                    aria-label="右カラム"
                    sx={{ flexGrow: 1, overflow: "auto" }}
                >
                    {right}
                </Box>
            )}
        </Box>
    );
};
