import { Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CustomerHierarchyTree } from "../component/customer/CustomerHierarchyTree";
import { CustomerDetailPanel } from "../component/customer/CustomerDetailPanel";
import { DealList } from "../component/deal/DealList";
import { getCustomerHierarchy, getCustomerDetail, getCustomerDeals } from "../usecase/customers";

export const CustomerManagementPage = () => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

    const { data: customerHierarchy, isLoading: loadingHierarchy, error: hierarchyError } = useQuery({
        queryKey: ["customer-hierarchy"],
        queryFn: getCustomerHierarchy,
    });

    const { data: customerDetail, isLoading: loadingDetail } = useQuery({
        queryKey: ["customer", selectedCustomerId],
        queryFn: () => getCustomerDetail(selectedCustomerId!),
        enabled: !!selectedCustomerId,
    });

    const { data: relatedDeals, isLoading: loadingDeals } = useQuery({
        queryKey: ["customer-deals", selectedCustomerId],
        queryFn: () => getCustomerDeals(selectedCustomerId!),
        enabled: !!selectedCustomerId,
    });

    const isLoading = loadingHierarchy;

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
                <Typography color="error" variant="h3">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
                顧客管理
            </Typography>

            <Grid container spacing={3}>
                {/* Left Column: Customer Hierarchy Tree - 40% */}
                <Grid item xs={12} lg={5}>
                    <Card sx={{ minHeight: 600 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h2" gutterBottom sx={{ mb: 3, fontSize: "1.25rem" }}>
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
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column: Customer Detail - 60% */}
                <Grid item xs={12} lg={7}>
                    <Card sx={{ minHeight: 600 }}>
                        <CardContent sx={{ p: 3 }}>
                            {selectedCustomerId ? (
                                <>
                                    {loadingDetail ? (
                                        <Box display="flex" justifyContent="center" py={4}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <CustomerDetailPanel customer={customerDetail} />
                                            <Box mt={4}>
                                                <Typography variant="h2" gutterBottom sx={{ mb: 2, fontSize: "1.25rem" }}>
                                                    関連案件
                                                </Typography>
                                                {loadingDeals ? (
                                                    <Box display="flex" justifyContent="center" py={2}>
                                                        <CircularProgress size={32} />
                                                    </Box>
                                                ) : (
                                                    <DealList deals={relatedDeals || []} onDealClick={() => {}} />
                                                )}
                                            </Box>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Box 
                                    display="flex" 
                                    justifyContent="center" 
                                    alignItems="center" 
                                    minHeight={400}
                                >
                                    <Typography variant="body1" color="text.secondary">
                                        左側の階層ツリーから顧客を選択してください
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
