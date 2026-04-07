import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
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
            <Box p={3}>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={120} />
                        </Grid>
                    ))}
                    <Grid item xs={12} md={8}>
                        <Skeleton variant="rectangular" height={300} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Skeleton variant="rectangular" height={300} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (hasError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                ダッシュボード
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="総売上" value={`¥${metrics?.totalRevenue?.toLocaleString() || 0}`} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="案件数" value={String(metrics?.dealsCount || 0)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="リード数" value={String(metrics?.leadsCount || 0)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="成約率" value={`${((metrics?.conversionRate || 0) * 100).toFixed(1)}%`} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>売上推移</Typography>
                        <SalesChart data={salesData || []} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>パイプライン状況</Typography>
                        <PipelineView
                            stages={(pipelineData || []).map(d => ({ id: d.stage, name: d.stage }))}
                            deals={[]}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>最近の活動</Typography>
                        <ActivityHistory activities={activities || []} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>今後のタスク</Typography>
                        {(tasks || []).length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                タスクがありません
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
