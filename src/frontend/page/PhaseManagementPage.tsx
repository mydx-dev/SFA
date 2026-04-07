import { Box, CircularProgress, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PhaseManagement } from "../component/phase/PhaseManagement";
import { getPhases, createPhase, updatePhase, deletePhase, reorderPhases } from "../usecase/phases";

export const PhaseManagementPage = () => {
    const queryClient = useQueryClient();

    const { data: phases, isLoading, error } = useQuery({
        queryKey: ["phases"],
        queryFn: getPhases,
    });

    const createMutation = useMutation({
        mutationFn: ({ name }: { name: string; probability: number; description?: string }) => createPhase(name),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["phases"] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string; probability?: number; description?: string }) =>
            updatePhase(id, { name }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["phases"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deletePhase(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["phases"] }),
    });

    const reorderMutation = useMutation({
        mutationFn: (orderedIds: string[]) => reorderPhases(orderedIds),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["phases"] }),
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error" variant="h3">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box mb={4}>
                <Typography variant="h1">フェーズ管理</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    案件のフェーズを管理します。ドラッグ&ドロップで並び替えができます。
                </Typography>
            </Box>

            <PhaseManagement
                phases={(phases || []).map(p => ({ ...p, probability: 0 }))}
                onPhaseAdd={(phase) => createMutation.mutate(phase)}
                onPhaseEdit={(id, phase) => updateMutation.mutate({ id, name: phase.name || "", ...phase })}
                onPhaseDelete={(id) => deleteMutation.mutate(id)}
                onPhaseReorder={(orderedIds) => reorderMutation.mutate(orderedIds)}
            />
        </Box>
    );
};
