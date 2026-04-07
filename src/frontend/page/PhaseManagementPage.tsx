import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PhaseManagement } from "../component/phase/PhaseManagement";

export const PhaseManagementPage = () => {
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

    const { data: phases, isLoading, error } = useQuery({
        queryKey: ["phases"],
        queryFn: async () => ([]),
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
                <Typography color="error">エラーが発生しました</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">フェーズ管理</Typography>
                <Button
                    variant="contained"
                    onClick={() => setFormMode("add")}
                >
                    フェーズ追加
                </Button>
            </Box>

            <Paper>
                <PhaseManagement
                    phases={phases || []}
                    onEdit={(id) => {
                        setEditingPhaseId(id);
                        setFormMode("edit");
                    }}
                    onDelete={(id) => {
                        setEditingPhaseId(id);
                        setShowDeleteConfirm(true);
                    }}
                    onReorder={() => {}}
                />
            </Paper>

            {showDeleteConfirm && (
                <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc" }}>
                    <Typography>削除確認ダイアログ</Typography>
                    <Button onClick={() => setShowDeleteConfirm(false)}>キャンセル</Button>
                    <Button onClick={() => setShowDeleteConfirm(false)}>削除</Button>
                </Box>
            )}

            {formMode && (
                <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc" }}>
                    <Typography>フェーズフォーム ({formMode})</Typography>
                    <Button onClick={() => setFormMode(null)}>閉じる</Button>
                </Box>
            )}
        </Box>
    );
};
