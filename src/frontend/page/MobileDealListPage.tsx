import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MobileDealList } from "../component/mobile/MobileDealList";
import { MobileSearchBar } from "../component/mobile/MobileSearchBar";
import { getDealsFromLocal } from "../usecase/deals";

export const MobileDealListPage = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const { data: deals, isLoading, error } = useQuery({
        queryKey: ["mobile-deals", filters, searchKeyword, page],
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
            <Typography color="error" align="center" sx={{ mt: 2 }}>
                エラーが発生しました
            </Typography>
        );
    }

    return (
        <Box>
            <MobileSearchBar
                value={searchKeyword}
                onChange={setSearchKeyword}
                onFilterClick={() => setIsFilterDrawerOpen(true)}
            />

            <button onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}>
                フィルターボタン
            </button>

            <MobileDealList
                deals={deals || []}
                onDealClick={() => {}}
            />

            {isFilterDrawerOpen && (
                <Box sx={{ p: 2, border: "1px solid #ccc", mt: 2 }}>
                    <Typography>フィルタードロワー</Typography>
                    {/* MobileFilterDrawer component would go here */}
                </Box>
            )}
        </Box>
    );
};
