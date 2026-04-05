import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeadForm, LeadFormValues } from "../component/lead/LeadForm";
import { DealList } from "../component/deal/DealList";
import { getLeadById, updateLead } from "../usecase/leads";
import { getDealsFromLocal, createDeal } from "../usecase/deals";

export const LeadDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isDealFormOpen, setIsDealFormOpen] = useState(false);

    // Fetch lead details
    const { data: lead, isLoading: loadingLead, error: leadError } = useQuery({
        queryKey: ["lead", id],
        queryFn: () => getLeadById(id!),
        enabled: !!id,
    });

    // Fetch deals for this lead
    const { data: deals, isLoading: loadingDeals } = useQuery({
        queryKey: ["deals", id],
        queryFn: () => getDealsFromLocal(id),
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: (values: LeadFormValues) => updateLead(id!, {
            name: values.name,
            companyName: values.companyName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            status: values.status,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead", id] });
            setIsEditing(false);
        },
    });

    const createDealMutation = useMutation({
        mutationFn: (dealName: string) => createDeal({
            leadId: id!,
            dealName,
            amount: null,
            status: "提案中",
            assigneeId: null,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals", id] });
            setIsDealFormOpen(false);
        },
    });

    const handleUpdateLead = (values: LeadFormValues) => {
        updateMutation.mutate(values);
    };

    const handleDealClick = (dealId: string) => {
        navigate(`/deals/${dealId}`);
    };

    if (loadingLead || loadingDeals) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (leadError || !lead) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">リード詳細</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate("/leads")}>
                            戻る
                        </Button>
                        {!isEditing && (
                            <Button variant="contained" onClick={() => setIsEditing(true)}>
                                編集
                            </Button>
                        )}
                    </Stack>
                </Box>

                <Paper sx={{ p: 3 }}>
                    {isEditing ? (
                        <LeadForm
                            initialValues={{
                                name: lead.name,
                                companyName: lead.companyName,
                                email: lead.email,
                                phoneNumber: lead.phoneNumber,
                                status: lead.status as LeadFormValues["status"],
                            }}
                            onSubmit={handleUpdateLead}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">氏名</Typography>
                                <Typography variant="body1">{lead.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">会社名</Typography>
                                <Typography variant="body1">{lead.companyName}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">メールアドレス</Typography>
                                <Typography variant="body1">{lead.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">電話番号</Typography>
                                <Typography variant="body1">{lead.phoneNumber}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">ステータス</Typography>
                                <Typography variant="body1">{lead.status}</Typography>
                            </Box>
                        </Stack>
                    )}
                </Paper>

                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">関連案件</Typography>
                        <Button variant="contained" onClick={() => setIsDealFormOpen(true)}>
                            案件作成
                        </Button>
                    </Box>
                    <DealList deals={deals || []} onDealClick={handleDealClick} />
                </Box>
            </Stack>

            <Dialog open={isDealFormOpen} onClose={() => setIsDealFormOpen(false)}>
                <DialogTitle>案件作成</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        {/* Simplified deal creation form */}
                        <Typography>案件作成フォーム（簡易版）</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
