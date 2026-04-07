import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const STORAGE_KEY = "two-column-layout-width";
const DEFAULT_LEFT_WIDTH = 40; // 40/60 split as per Stitch design

interface TwoColumnLayoutProps {
    left: ReactNode;
    right: ReactNode;
    defaultLeftWidth?: number;
}

/**
 * Two Column Layout
 * Based on The Digital Curator design system
 * - 40/60 split by default (left/right)
 * - Resizable divider with ghost border
 * - Collapse functionality
 * - Mobile responsive (stacked layout)
 */
export const TwoColumnLayout = ({ left, right, defaultLeftWidth = DEFAULT_LEFT_WIDTH }: TwoColumnLayoutProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        setLeftWidth(Math.min(80, Math.max(20, newWidth)));
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

    // Mobile: Stacked layout
    if (isMobile) {
        return (
            <Box>
                <Box aria-label="左カラム" mb={3}>
                    {left}
                </Box>
                <Box aria-label="右カラム">
                    {right}
                </Box>
            </Box>
        );
    }

    // Desktop: Resizable two-column layout
    return (
        <Box 
            ref={containerRef} 
            sx={{ 
                display: "flex", 
                minHeight: 600,
                position: "relative",
                gap: 0,
            }}
        >
            {!leftCollapsed && (
                <Box
                    aria-label="左カラム"
                    sx={{ 
                        width: `${leftWidth}%`, 
                        overflow: "auto", 
                        flexShrink: 0,
                        pr: 0,
                    }}
                >
                    {left}
                </Box>
            )}
            
            {/* Resizer with Digital Curator styling */}
            <Box
                aria-label="リサイザー"
                sx={{
                    width: leftCollapsed || rightCollapsed ? 40 : 6,
                    cursor: leftCollapsed || rightCollapsed ? "default" : "col-resize",
                    bgcolor: "background.default",
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    flexShrink: 0,
                    transition: "width 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                        bgcolor: leftCollapsed || rightCollapsed ? "background.default" : "rgba(0, 32, 69, 0.04)",
                    },
                }}
                onMouseDown={!leftCollapsed && !rightCollapsed ? handleMouseDown : undefined}
            >
                <IconButton
                    size="small"
                    aria-label={leftCollapsed ? "左カラムを表示" : "左カラムを折りたたむ"}
                    onClick={() => setLeftCollapsed(c => !c)}
                    sx={{ 
                        p: 0.5,
                        color: "text.secondary",
                        "&:hover": {
                            color: "primary.main",
                            bgcolor: "rgba(0, 32, 69, 0.08)",
                        },
                    }}
                >
                    {leftCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                </IconButton>
                <IconButton
                    size="small"
                    aria-label={rightCollapsed ? "右カラムを表示" : "右カラムを折りたたむ"}
                    onClick={() => setRightCollapsed(c => !c)}
                    sx={{ 
                        p: 0.5,
                        color: "text.secondary",
                        "&:hover": {
                            color: "primary.main",
                            bgcolor: "rgba(0, 32, 69, 0.08)",
                        },
                    }}
                >
                    {rightCollapsed ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </IconButton>
            </Box>
            
            {!rightCollapsed && (
                <Box
                    aria-label="右カラム"
                    sx={{ 
                        flexGrow: 1, 
                        overflow: "auto",
                        pl: 0,
                    }}
                >
                    {right}
                </Box>
            )}
        </Box>
    );
};
