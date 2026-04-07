import { Box, CircularProgress, Typography, IconButton, Drawer } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
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
            <Typography color="error" align="center" variant="h3" sx={{ mt: 2 }}>
                エラーが発生しました
            </Typography>
        );
    }

    return (
        <Box sx={{ pb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h1" sx={{ fontSize: "1.5rem" }}>
                    案件一覧
                </Typography>
                <IconButton 
                    onClick={() => setIsFilterDrawerOpen(true)}
                    color="primary"
                >
                    <FilterListIcon />
                </IconButton>
            </Box>

            <Box mb={2}>
                <MobileSearchBar
                    value={searchKeyword}
                    onChange={setSearchKeyword}
                    onFilterClick={() => setIsFilterDrawerOpen(true)}
                />
            </Box>

            <MobileDealList
                deals={deals || []}
                onDealClick={() => {}}
            />

            <Drawer 
                anchor="right" 
                open={isFilterDrawerOpen} 
                onClose={() => setIsFilterDrawerOpen(false)}
            >
                <Box sx={{ width: 300, p: 3 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontSize: "1.25rem" }}>
                        フィルター
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        フィルター機能は開発中です
                    </Typography>
                </Box>
            </Drawer>
        </Box>
    );
};
