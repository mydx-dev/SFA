import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Activity } from "../../../backend/domain/entity/Activity";
import { Deal } from "../../../backend/domain/entity/Deal";
import { KPICard } from "./KPICard";
import { PipelineView } from "./PipelineView";
import { SalesChart, SalesChartDataPoint } from "./SalesChart";

interface DashboardMetrics {
    totalSales: number;
    dealCount: number;
    leadCount: number;
    winRate: number;
}

interface DashboardProps {
    metrics?: DashboardMetrics;
    recentActivities?: Activity[];
    upcomingTasks?: Array<{ id: string; label: string; dueDate: Date }>;
    salesChartData?: SalesChartDataPoint[];
    pipelineData?: Array<{ id: string; name: string; color?: string }>;
    deals?: Deal[];
    onActivityClick?: (activityId: string) => void;
    onTaskClick?: (taskId: string) => void;
    onNavigate?: (section: string) => void;
}

const PIPELINE_STAGES = [
    { id: "提案", name: "提案", color: "#002045" },
    { id: "交渉", name: "交渉", color: "#555f71" },
    { id: "クローズ(成功)", name: "クローズ(成功)", color: "#003f25" },
    { id: "クローズ(失敗)", name: "クローズ(失敗)", color: "#74777f" },
];

export const Dashboard = ({
    metrics,
    recentActivities = [],
    upcomingTasks = [],
    salesChartData = [],
    pipelineData,
    deals = [],
    onActivityClick,
    onTaskClick,
    onNavigate,
}: DashboardProps) => {
    const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

    const stages = pipelineData ?? PIPELINE_STAGES;

    return (
        <Box sx={{ p: 3 }}>
            {/* Period selector */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" fontFamily="Manrope, sans-serif">
                    ダッシュボード
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>期間</InputLabel>
                    <Select
                        label="期間"
                        value={period}
                        onChange={(e) =>
                            setPeriod(e.target.value as "monthly" | "quarterly" | "yearly")
                        }
                    >
                        <MenuItem value="monthly">月次</MenuItem>
                        <MenuItem value="quarterly">四半期</MenuItem>
                        <MenuItem value="yearly">年次</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <KPICard
                        title="総売上"
                        value={metrics ? `¥${metrics.totalSales.toLocaleString()}` : "データなし"}
                        icon={<AttachMoneyIcon />}
                        onClick={onNavigate ? () => onNavigate("sales") : undefined}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <KPICard
                        title="案件数"
                        value={metrics?.dealCount ?? "データなし"}
                        icon={<AssignmentIcon />}
                        onClick={onNavigate ? () => onNavigate("deals") : undefined}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <KPICard
                        title="リード数"
                        value={metrics?.leadCount ?? "データなし"}
                        icon={<PeopleIcon />}
                        onClick={onNavigate ? () => onNavigate("leads") : undefined}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <KPICard
                        title="成約率"
                        value={metrics ? `${metrics.winRate}%` : "データなし"}
                        icon={<AccountCircleIcon />}
                        onClick={onNavigate ? () => onNavigate("winrate") : undefined}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={4}>
                {/* Sales Chart */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            売上推移
                        </Typography>
                        {salesChartData.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                データがありません
                            </Typography>
                        ) : (
                            <SalesChart
                                data={salesChartData}
                                period={period}
                                onPeriodChange={setPeriod}
                            />
                        )}
                    </Box>
                </Grid>

                {/* Pipeline */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
                            height: "100%",
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                パイプライン状況
                            </Typography>
                            {onNavigate && (
                                <Button size="small" onClick={() => onNavigate("pipeline")}>
                                    すべて表示
                                </Button>
                            )}
                        </Box>
                        {deals.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                データがありません
                            </Typography>
                        ) : (
                            <PipelineView stages={stages} deals={deals} />
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Recent Activities */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                最近の活動
                            </Typography>
                            {onNavigate && (
                                <Button size="small" onClick={() => onNavigate("activities")}>
                                    すべて表示
                                </Button>
                            )}
                        </Box>
                        {recentActivities.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                データがありません
                            </Typography>
                        ) : (
                            recentActivities.map((activity, index) => (
                                <Box key={activity.id}>
                                    <Box
                                        sx={{
                                            py: 1.5,
                                            cursor: onActivityClick ? "pointer" : "default",
                                            "&:hover": onActivityClick
                                                ? { backgroundColor: "#f1f4f6" }
                                                : {},
                                            px: 1,
                                            borderRadius: "0.5rem",
                                        }}
                                        onClick={() => onActivityClick?.(activity.id)}
                                    >
                                        <Typography variant="body2" fontWeight="medium">
                                            {activity.activityType}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(activity.activityDate).toLocaleDateString(
                                                "ja-JP"
                                            )}{" "}
                                            — {activity.content}
                                        </Typography>
                                    </Box>
                                    {index < recentActivities.length - 1 && (
                                        <Divider sx={{ opacity: 0.5 }} />
                                    )}
                                </Box>
                            ))
                        )}
                    </Box>
                </Grid>

                {/* Upcoming Tasks */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                今後のタスク
                            </Typography>
                            {onNavigate && (
                                <Button size="small" onClick={() => onNavigate("tasks")}>
                                    すべて表示
                                </Button>
                            )}
                        </Box>
                        {upcomingTasks.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                データがありません
                            </Typography>
                        ) : (
                            [...upcomingTasks]
                                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                                .map((task, index) => (
                                    <Box key={task.id}>
                                        <Box
                                            sx={{
                                                py: 1.5,
                                                cursor: onTaskClick ? "pointer" : "default",
                                                "&:hover": onTaskClick
                                                    ? { backgroundColor: "#f1f4f6" }
                                                    : {},
                                                px: 1,
                                                borderRadius: "0.5rem",
                                            }}
                                            onClick={() => onTaskClick?.(task.id)}
                                        >
                                            <Typography variant="body2" fontWeight="medium">
                                                {task.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                期限:{" "}
                                                {task.dueDate.toLocaleDateString("ja-JP", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                            </Typography>
                                        </Box>
                                        {index < upcomingTasks.length - 1 && (
                                            <Divider sx={{ opacity: 0.5 }} />
                                        )}
                                    </Box>
                                ))
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
