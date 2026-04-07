import { Box, CircularProgress, Paper, TextField, Typography, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DealKanbanBoard } from "../component/deal/DealKanbanBoard";
import { SearchFilterPanel } from "../component/search/SearchFilterPanel";
import { getDealsFromLocal } from "../usecase/deals";

export const DealKanbanPage = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filters, setFilters] = useState({});
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const { data: deals, isLoading, error } = useQuery({
        queryKey: ["deals-kanban", filters, searchKeyword],
        queryFn: () => getDealsFromLocal(),
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error" variant="h3">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
                案件カンバン
            </Typography>

            <Box display="flex" gap={2} mb={3} alignItems="center">
                <TextField
                    placeholder="案件名で検索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    size="small"
                    sx={{ minWidth: 300 }}
                />
                <IconButton 
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    color={isFilterPanelOpen ? "primary" : "default"}
                >
                    <FilterListIcon />
                </IconButton>
            </Box>

            {isFilterPanelOpen && (
                <Paper sx={{ p: 3, mb: 3 }}>
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
