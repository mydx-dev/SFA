import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Deal } from "../../../backend/domain/entity/Deal";
import { DealKanbanCard } from "./DealKanbanCard";

type DealStatus = Deal["status"];

interface KanbanColumn {
    id: DealStatus;
    label: string;
    color: string;
}

interface FilterOption {
    assigneeId?: string;
    keyword?: string;
}

interface DealKanbanBoardProps {
    deals: Deal[];
    onDealMove?: (dealId: string, targetStatus: DealStatus) => void;
    onDealClick?: (dealId: string) => void;
    filterOptions?: FilterOption;
    assigneeNames?: Record<string, string>;
}

const COLUMNS: KanbanColumn[] = [
    { id: "提案", label: "提案", color: "#002045" },
    { id: "交渉", label: "交渉", color: "#555f71" },
    { id: "クローズ(成功)", label: "クローズ(成功)", color: "#003f25" },
    { id: "クローズ(失敗)", label: "クローズ(失敗)", color: "#74777f" },
];

export const DealKanbanBoard = ({
    deals,
    onDealMove,
    onDealClick,
    filterOptions,
    assigneeNames = {},
}: DealKanbanBoardProps) => {
    const [keyword, setKeyword] = useState(filterOptions?.keyword ?? "");
    const [draggingDealId, setDraggingDealId] = useState<string | null>(null);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterOption>(filterOptions ?? {});

    const filteredDeals = deals.filter((deal) => {
        if (keyword && !deal.dealName.toLowerCase().includes(keyword.toLowerCase())) return false;
        if (activeFilters.assigneeId && deal.assigneeId !== activeFilters.assigneeId) return false;
        return true;
    });

    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        e.dataTransfer.setData("dealId", dealId);
        setDraggingDealId(dealId);
    };

    const handleDragEnd = () => {
        setDraggingDealId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetStatus: DealStatus) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        if (dealId && onDealMove) {
            onDealMove(dealId, targetStatus);
        }
        setDraggingDealId(null);
    };

    return (
        <Box>
            {/* Search and filter bar */}
            <Box display="flex" gap={2} alignItems="center" mb={3}>
                <TextField
                    size="small"
                    placeholder="案件を検索..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1, maxWidth: 400 }}
                />
                <Tooltip title="フィルター">
                    <IconButton
                        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                        color={filterPanelOpen ? "primary" : "default"}
                    >
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Filter panel */}
            {filterPanelOpen && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: "#f1f4f6",
                        borderRadius: "0.75rem",
                    }}
                >
                    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        <Typography variant="subtitle2">フィルター:</Typography>
                        <Button
                            size="small"
                            onClick={() => setActiveFilters({})}
                            disabled={Object.keys(activeFilters).length === 0}
                        >
                            クリア
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Kanban columns */}
            <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 2 }}>
                {COLUMNS.map((column) => {
                    const columnDeals = filteredDeals.filter((d) => d.status === column.id);

                    return (
                        <Box
                            key={column.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                            sx={{
                                minWidth: 240,
                                flex: "1 1 240px",
                            }}
                        >
                            {/* Column header */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor: column.color,
                                    color: "white",
                                    borderRadius: "0.5rem 0.5rem 0 0",
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {column.label}
                                </Typography>
                                <Chip
                                    label={columnDeals.length}
                                    size="small"
                                    sx={{
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "white",
                                        height: 20,
                                        fontSize: "0.7rem",
                                    }}
                                />
                            </Box>

                            {/* Column body */}
                            <Box
                                sx={{
                                    minHeight: 200,
                                    p: 1,
                                    backgroundColor: "#f1f4f6",
                                    borderRadius: "0 0 0.5rem 0.5rem",
                                }}
                            >
                                {columnDeals.length === 0 ? (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="center"
                                        sx={{ py: 3 }}
                                    >
                                        案件がありません
                                    </Typography>
                                ) : (
                                    columnDeals.map((deal) => (
                                        <Box
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal.id)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <DealKanbanCard
                                                deal={deal}
                                                isDragging={draggingDealId === deal.id}
                                                onClick={onDealClick}
                                                assigneeName={assigneeNames[deal.assigneeId]}
                                            />
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
