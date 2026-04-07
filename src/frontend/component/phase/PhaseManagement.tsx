import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PhaseForm, PhaseFormValues } from "./PhaseForm";

export interface Phase {
    id: string;
    name: string;
    order: number;
    probability: number;
    description?: string;
}

interface PhaseManagementProps {
    phases: Phase[];
    onPhaseAdd?: (phase: Omit<Phase, "id" | "order">) => void;
    onPhaseEdit?: (id: string, phase: Partial<Phase>) => void;
    onPhaseDelete?: (id: string) => void;
    onPhaseReorder?: (orderedIds: string[]) => void;
}

export const PhaseManagement = ({
    phases,
    onPhaseAdd,
    onPhaseEdit,
    onPhaseDelete,
    onPhaseReorder,
}: PhaseManagementProps) => {
    const [sortedPhases, setSortedPhases] = useState<Phase[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
    const [deleteDialogPhaseId, setDeleteDialogPhaseId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    useEffect(() => {
        setSortedPhases([...phases].sort((a, b) => a.order - b.order));
    }, [phases]);

    const handleAdd = (values: PhaseFormValues) => {
        onPhaseAdd?.({ name: values.name, probability: values.probability, description: values.description });
        setFormOpen(false);
    };

    const handleEdit = (values: PhaseFormValues) => {
        if (editingPhaseId) {
            onPhaseEdit?.(editingPhaseId, {
                name: values.name,
                probability: values.probability,
                description: values.description,
            });
        }
        setEditingPhaseId(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteDialogPhaseId) {
            onPhaseDelete?.(deleteDialogPhaseId);
        }
        setDeleteDialogPhaseId(null);
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("phaseId", id);
        setDraggingId(id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData("phaseId");
        if (sourceId === targetId) {
            setDraggingId(null);
            return;
        }
        const newOrder = [...sortedPhases];
        const sourceIndex = newOrder.findIndex((p) => p.id === sourceId);
        const targetIndex = newOrder.findIndex((p) => p.id === targetId);
        const [moved] = newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, moved);
        setSortedPhases(newOrder);
        onPhaseReorder?.(newOrder.map((p) => p.id));
        setDraggingId(null);
    };

    const editingPhase = sortedPhases.find((p) => p.id === editingPhaseId);

    return (
        <Box>
            {/* Add button */}
            <Box mb={2}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setFormOpen(true)}
                    sx={{ background: "linear-gradient(135deg, #002045 0%, #1a365d 100%)" }}
                >
                    フェーズを追加
                </Button>
            </Box>

            {/* Phase table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "0.75rem" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f1f4f6" }}>
                            <TableCell sx={{ width: 40 }}></TableCell>
                            <TableCell>フェーズ名</TableCell>
                            <TableCell>順序</TableCell>
                            <TableCell>成約確率</TableCell>
                            <TableCell align="right">アクション</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPhases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary" sx={{ py: 2 }}>
                                        フェーズがありません
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedPhases.map((phase, index) => (
                                <TableRow
                                    key={phase.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, phase.id)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, phase.id)}
                                    sx={{
                                        opacity: draggingId === phase.id ? 0.5 : 1,
                                        "&:hover": { backgroundColor: "#f7fafc" },
                                    }}
                                >
                                    <TableCell sx={{ cursor: "grab", color: "#74777f" }}>
                                        <DragHandleIcon />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {phase.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{index + 1}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{phase.probability}%</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => setEditingPhaseId(phase.id)}
                                            aria-label="編集"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => setDeleteDialogPhaseId(phase.id)}
                                            aria-label="削除"
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add form dialog */}
            <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>フェーズを追加</DialogTitle>
                <DialogContent>
                    <PhaseForm
                        mode="create"
                        onSubmit={handleAdd}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit form dialog */}
            <Dialog
                open={!!editingPhaseId}
                onClose={() => setEditingPhaseId(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>フェーズを編集</DialogTitle>
                <DialogContent>
                    {editingPhase && (
                        <PhaseForm
                            mode="edit"
                            initialPhase={editingPhase}
                            onSubmit={handleEdit}
                            onCancel={() => setEditingPhaseId(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog
                open={!!deleteDialogPhaseId}
                onClose={() => setDeleteDialogPhaseId(null)}
            >
                <DialogTitle>フェーズを削除</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        このフェーズを削除してもよろしいですか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogPhaseId(null)}>キャンセル</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        削除
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
