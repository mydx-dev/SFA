import { Box, Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { KPICard } from "../component/dashboard/KPICard";
import { SalesChart } from "../component/dashboard/SalesChart";
import { PipelineView } from "../component/dashboard/PipelineView";
import { ActivityHistory } from "../component/activity/ActivityHistory";
import { getDashboardMetrics, getRecentActivities, getUpcomingTasks, getSalesTrend, getPipelineData } from "../usecase/dashboard";

export const DashboardPage = () => {
    // Mock data fetching for now
    const { data: metrics, isLoading: loadingMetrics } = useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: getDashboardMetrics,
    });

    const { data: activities, isLoading: loadingActivities } = useQuery({
        queryKey: ["recent-activities"],
        queryFn: getRecentActivities,
    });

    const { data: tasks, isLoading: loadingTasks } = useQuery({
        queryKey: ["upcoming-tasks"],
        queryFn: getUpcomingTasks,
    });

    const { data: salesData, isLoading: loadingSales } = useQuery({
        queryKey: ["sales-trend"],
        queryFn: getSalesTrend,
    });

    const { data: pipelineData, isLoading: loadingPipeline } = useQuery({
        queryKey: ["pipeline-data"],
        queryFn: getPipelineData,
    });

    const isLoading = loadingMetrics || loadingActivities || loadingTasks || loadingSales || loadingPipeline;
    const hasError = !metrics && !loadingMetrics;

    if (isLoading) {
        return (
            <Box>
                <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
                    ダッシュボード
                </Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                    <Grid item xs={12} lg={8}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (hasError) {
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
                    color: "text.primary",
                }}
            >
                ダッシュボード
            </Typography>

            {/* KPI Cards - 4 columns */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard 
                        title="総売上" 
                        value={`¥${metrics?.totalRevenue?.toLocaleString() || 0}`} 
                        trend={metrics?.revenueTrend}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard 
                        title="案件数" 
                        value={String(metrics?.dealsCount || 0)} 
                        trend={metrics?.dealsTrend}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard 
                        title="リード数" 
                        value={String(metrics?.leadsCount || 0)} 
                        trend={metrics?.leadsTrend}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard 
                        title="成約率" 
                        value={`${((metrics?.conversionRate || 0) * 100).toFixed(1)}%`} 
                        trend={metrics?.conversionTrend}
                    />
                </Grid>

                {/* Sales Chart - 8 columns */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ height: "100%", minHeight: 400 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h2" gutterBottom sx={{ mb: 3, fontSize: "1.25rem" }}>
                                売上推移
                            </Typography>
                            <SalesChart data={salesData || []} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pipeline View - 4 columns */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ height: "100%", minHeight: 400 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h2" gutterBottom sx={{ mb: 3, fontSize: "1.25rem" }}>
                                パイプライン状況
                            </Typography>
                            <PipelineView
                                stages={(pipelineData || []).map(d => ({ id: d.stage, name: d.stage }))}
                                deals={[]}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activities - 6 columns */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", minHeight: 350 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h2" gutterBottom sx={{ mb: 3, fontSize: "1.25rem" }}>
                                最近の活動
                            </Typography>
                            <Box sx={{ maxHeight: 280, overflow: "auto" }}>
                                <ActivityHistory activities={activities || []} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Upcoming Tasks - 6 columns */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", minHeight: 350 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h2" gutterBottom sx={{ mb: 3, fontSize: "1.25rem" }}>
                                今後のタスク
                            </Typography>
                            <Box sx={{ maxHeight: 280, overflow: "auto" }}>
                                {(tasks || []).length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                                        タスクがありません
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
