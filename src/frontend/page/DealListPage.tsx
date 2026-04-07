import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealList } from "../component/deal/DealList";
import { fetchDeals, getDealsFromLocal } from "../usecase/deals";

export const DealListPage = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>("");

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

    const filteredDeals = statusFilter
        ? (deals || []).filter(d => d.status === statusFilter)
        : (deals || []);

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
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>ステータス</InputLabel>
                    <Select
                        value={statusFilter}
                        label="ステータス"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">すべて</MenuItem>
                        <MenuItem value="提案">提案</MenuItem>
                        <MenuItem value="交渉">交渉</MenuItem>
                        <MenuItem value="クローズ(成功)">クローズ(成功)</MenuItem>
                        <MenuItem value="クローズ(失敗)">クローズ(失敗)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <DealList deals={filteredDeals} onDealClick={handleDealClick} />
        </Box>
    );
};
