import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
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
                <CircularProgress sx={{ color: "#002045" }} />
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
            <Typography 
                variant="h1" 
                gutterBottom 
                sx={{ 
                    mb: 4,
                    color: "#002045",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: "32px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em"
                }}
            >
                活動履歴
            </Typography>

            <Box mb={3}>
                <SearchFilterPanel
                    onSearch={() => {}}
                    onFilterChange={setFilters}
                    filterOptions={[]}
                />
            </Box>

            <Card sx={{ borderRadius: "0.75rem", boxShadow: "none", border: "1px solid rgba(85, 95, 113, 0.15)" }}>
                <CardContent sx={{ p: 0 }}>
                    <ActivityHistory activities={activities || []} />
                </CardContent>
            </Card>

            {page && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Typography variant="caption" color="text.secondary">
                        ページ {page}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
