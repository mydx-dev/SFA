import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DealKanbanBoard } from "../component/deal/DealKanbanBoard";
import { SearchFilterPanel } from "../component/search/SearchFilterPanel";

export const DealKanbanPage = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filters, setFilters] = useState({});
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const { data: deals, isLoading, error } = useQuery({
        queryKey: ["deals-kanban", filters, searchKeyword],
        queryFn: async () => ([]),
    });

    if (isLoading) {
        return (
            <Box p={3}>
                <Typography variant="body2">読み込み中...</Typography>
                {/* Skeleton cards would go here */}
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">案件カンバン</Typography>
            </Box>

            <Box mb={3}>
                <input
                    type="text"
                    placeholder="検索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{
                        width: "300px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                />
                <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} style={{ marginLeft: "8px" }}>
                    フィルター
                </button>
            </Box>

            {isFilterPanelOpen && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <SearchFilterPanel
                        onSearch={() => {}}
                        onFilterChange={setFilters}
                        filterOptions={[]}
                    />
                </Paper>
            )}

            <DealKanbanBoard deals={deals || []} onDealMove={() => {}} />
        </Box>
    );
};
