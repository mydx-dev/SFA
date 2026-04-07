import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CustomerHierarchyTree } from "../component/customer/CustomerHierarchyTree";
import { CustomerDetailPanel } from "../component/customer/CustomerDetailPanel";
import { DealList } from "../component/deal/DealList";

export const CustomerManagementPage = () => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

    const { data: customerHierarchy, isLoading: loadingHierarchy, error: hierarchyError } = useQuery({
        queryKey: ["customer-hierarchy"],
        queryFn: async () => ([]),
    });

    const { data: customerDetail, isLoading: loadingDetail } = useQuery({
        queryKey: ["customer", selectedCustomerId],
        queryFn: async () => null,
        enabled: !!selectedCustomerId,
    });

    const { data: relatedDeals, isLoading: loadingDeals } = useQuery({
        queryKey: ["customer-deals", selectedCustomerId],
        queryFn: async () => ([]),
        enabled: !!selectedCustomerId,
    });

    const isLoading = loadingHierarchy || loadingDetail || loadingDeals;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (hierarchyError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                顧客管理
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, minHeight: "600px" }}>
                        <Typography variant="h6" gutterBottom>
                            顧客階層
                        </Typography>
                        <CustomerHierarchyTree
                            customers={customerHierarchy || []}
                            selectedId={selectedCustomerId}
                            expandedNodes={expandedNodes}
                            onSelect={setSelectedCustomerId}
                            onToggle={(id) => {
                                setExpandedNodes(prev =>
                                    prev.includes(id)
                                        ? prev.filter(n => n !== id)
                                        : [...prev, id]
                                );
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, minHeight: "600px" }}>
                        {selectedCustomerId ? (
                            <>
                                <CustomerDetailPanel customer={customerDetail} />
                                <Box mt={3}>
                                    <Typography variant="h6" gutterBottom>
                                        関連案件
                                    </Typography>
                                    <DealList deals={relatedDeals || []} onDealClick={() => {}} />
                                </Box>
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                顧客を選択してください
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
