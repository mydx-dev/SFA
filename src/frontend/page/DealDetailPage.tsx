import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityForm, ActivityFormValues } from "../component/activity/ActivityForm";
import { ActivityList } from "../component/activity/ActivityList";
import { getDealById } from "../usecase/deals";
import { getActivitiesFromLocal, createActivity } from "../usecase/activities";

export const DealDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

    // Fetch deal details
    const { data: deal, isLoading: loadingDeal, error: dealError } = useQuery({
        queryKey: ["deal", id],
        queryFn: () => getDealById(id!),
        enabled: !!id,
    });

    // Fetch activities for this deal
    const { data: activities, isLoading: loadingActivities } = useQuery({
        queryKey: ["activities", id],
        queryFn: () => getActivitiesFromLocal(id),
        enabled: !!id,
    });

    const createActivityMutation = useMutation({
        mutationFn: (values: ActivityFormValues) => createActivity({
            dealId: values.dealId,
            activityType: values.activityType,
            activityDate: new Date(values.activityDate),
            content: values.content,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activities", id] });
            setIsActivityFormOpen(false);
        },
    });

    const handleCreateActivity = (values: ActivityFormValues) => {
        createActivityMutation.mutate(values);
    };

    if (loadingDeal || loadingActivities) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (dealError || !deal) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    const isClosed = deal.status === "クローズ(成功)" || deal.status === "クローズ(失敗)";

    return (
        <Box>
            <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">案件詳細</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate("/deals")}>
                            戻る
                        </Button>
                        {!isClosed && (
                            <>
                                <Button variant="contained" onClick={() => setIsActivityFormOpen(true)}>
                                    営業活動追加
                                </Button>
                                <Button variant="outlined" color="success">
                                    クローズ
                                </Button>
                            </>
                        )}
                    </Stack>
                </Box>

                <Paper sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">案件名</Typography>
                            <Typography variant="body1">{deal.dealName}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">金額</Typography>
                            <Typography variant="body1">
                                {deal.amount ? `¥${deal.amount.toLocaleString()}` : "未設定"}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">ステータス</Typography>
                            <Typography variant="body1">{deal.status}</Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Box>
                    <Typography variant="h5" mb={2}>営業活動</Typography>
                    <ActivityList activities={activities || []} />
                </Box>
            </Stack>

            <Dialog open={isActivityFormOpen} onClose={() => setIsActivityFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>営業活動追加</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <ActivityForm
                            dealId={id!}
                            onSubmit={handleCreateActivity}
                            onCancel={() => setIsActivityFormOpen(false)}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
