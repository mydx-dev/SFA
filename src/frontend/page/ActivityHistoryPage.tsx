import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityHistory } from "../component/activity/ActivityHistory";
import { SearchFilterPanel } from "../component/search/SearchFilterPanel";
import { getActivitiesFromLocal } from "../usecase/activities";

export const ActivityHistoryPage = () => {
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");

    const { data: activities, isLoading, error } = useQuery({
        queryKey: ["activities-history", filters, page, sortBy],
        queryFn: () => getActivitiesFromLocal(),
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
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                活動履歴
            </Typography>

            <Box mb={3}>
                <SearchFilterPanel
                    onSearch={() => {}}
                    onFilterChange={setFilters}
                    filterOptions={[]}
                />
            </Box>

            <Paper>
                <ActivityHistory activities={activities || []} />
            </Paper>

            <Box display="flex" justifyContent="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                    ページ {page}
                </Typography>
            </Box>
        </Box>
    );
};
