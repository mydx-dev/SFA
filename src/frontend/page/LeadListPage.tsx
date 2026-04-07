import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeadList } from "../component/lead/LeadList";
import { LeadForm, LeadFormValues } from "../component/lead/LeadForm";
import { fetchLeads, createLead, getLeadsFromLocal } from "../usecase/leads";

export const LeadListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Fetch leads from local DB first, then from API
    const { data: leads, isLoading, error } = useQuery({
        queryKey: ["leads"],
        queryFn: async () => {
            const localLeads = await getLeadsFromLocal();
            // Trigger background fetch
            fetchLeads().catch(console.error);
            return localLeads;
        },
    });

    // Background sync
    useQuery({
        queryKey: ["leads-sync"],
        queryFn: fetchLeads,
        staleTime: 0,
    });

    const createMutation = useMutation({
        mutationFn: createLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            setIsFormOpen(false);
        },
    });

    const handleLeadClick = (leadId: string) => {
        navigate(`/leads/${leadId}`);
    };

    const handleCreateLead = (values: LeadFormValues) => {
        createMutation.mutate({
            name: values.name,
            companyName: values.companyName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            status: values.status,
            assigneeId: null,
        });
    };

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
                <Typography color="error" variant="h3">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h1">リード一覧</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setIsFormOpen(true)}
                    sx={{
                        px: 3,
                        py: 1.5,
                    }}
                >
                    新規作成
                </Button>
            </Box>
            
            <LeadList leads={leads || []} onLeadClick={handleLeadClick} />

            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>リード作成</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <LeadForm
                            onSubmit={handleCreateLead}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
