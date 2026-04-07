import { Box, Chip, LinearProgress, Paper, Typography } from "@mui/material";
import { Deal } from "../../../backend/domain/entity/Deal";

interface PipelineStage {
    id: string;
    name: string;
    color?: string;
}

interface PipelineViewProps {
    stages: PipelineStage[];
    deals: Deal[];
    onDealMove?: (dealId: string, targetStageId: string) => void;
}

const formatCurrency = (amount: number | null): string => {
    if (amount === null) return "未設定";
    return `¥${amount.toLocaleString()}`;
};

export const PipelineView = ({ stages, deals, onDealMove }: PipelineViewProps) => {
    const dealsByStage = stages.reduce<Record<string, Deal[]>>((acc, stage) => {
        acc[stage.id] = deals.filter((d) => d.status === stage.id);
        return acc;
    }, {});

    const totalAmount = deals.reduce((sum, d) => sum + (d.amount ?? 0), 0);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, stageId: string) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        if (dealId && onDealMove) {
            onDealMove(dealId, stageId);
        }
    };

    return (
        <Box>
            <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
                {stages.map((stage) => {
                    const stageDeals = dealsByStage[stage.id] ?? [];
                    const stageAmount = stageDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0);
                    const stageRatio = totalAmount > 0 ? (stageAmount / totalAmount) * 100 : 0;

                    return (
                        <Paper
                            key={stage.id}
                            elevation={0}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage.id)}
                            sx={{
                                minWidth: 200,
                                flex: "1 1 200px",
                                p: 2,
                                backgroundColor: "#f1f4f6",
                                borderRadius: "0.75rem",
                            }}
                        >
                            {/* Stage header */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {stage.name}
                                </Typography>
                                <Chip
                                    label={stageDeals.length}
                                    size="small"
                                    sx={{
                                        backgroundColor: stage.color ?? "#002045",
                                        color: "white",
                                        height: 20,
                                        fontSize: "0.7rem",
                                    }}
                                />
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stageRatio}
                                sx={{ mb: 2, height: 4, borderRadius: 2 }}
                            />

                            {/* Deal cards */}
                            {stageDeals.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ py: 2 }}
                                >
                                    案件がありません
                                </Typography>
                            ) : (
                                stageDeals.map((deal) => (
                                    <Paper
                                        key={deal.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("dealId", deal.id);
                                        }}
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            mb: 1,
                                            backgroundColor: "white",
                                            borderRadius: "0.5rem",
                                            cursor: "grab",
                                            "&:hover": {
                                                boxShadow: "0 4px 12px rgba(0,32,69,0.08)",
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold" noWrap>
                                            {deal.dealName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(deal.amount)}
                                        </Typography>
                                    </Paper>
                                ))
                            )}
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};
