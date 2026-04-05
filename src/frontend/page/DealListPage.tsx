import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DealList } from "../component/deal/DealList";
import { fetchDeals, getDealsFromLocal } from "../usecase/deals";

export const DealListPage = () => {
    const navigate = useNavigate();

    // Fetch deals from local DB first, then from API
    const { data: deals, isLoading, error } = useQuery({
        queryKey: ["deals"],
        queryFn: async () => {
            const localDeals = await getDealsFromLocal();
            // Trigger background fetch
            fetchDeals().catch(console.error);
            return localDeals;
        },
    });

    // Background sync
    useQuery({
        queryKey: ["deals-sync"],
        queryFn: fetchDeals,
        staleTime: 0,
    });

    const handleDealClick = (dealId: string) => {
        navigate(`/deals/${dealId}`);
    };

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">案件一覧</Typography>
            </Box>
            
            <DealList deals={deals || []} onDealClick={handleDealClick} />
        </Box>
    );
};
