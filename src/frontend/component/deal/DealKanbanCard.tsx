import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Badge, Box, Chip, Paper, Typography } from "@mui/material";
import { Deal } from "../../../backend/domain/entity/Deal";

interface DealKanbanCardProps {
    deal: Deal;
    isDragging?: boolean;
    onClick?: (dealId: string) => void;
    assigneeName?: string;
    isPriority?: boolean;
}

const formatCurrency = (amount: number | null): string => {
    if (amount === null) return "未設定";
    return `¥${amount.toLocaleString()}`;
};

const formatDate = (date: Date | null): string => {
    if (date === null) return "未設定";
    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const isOverdue = (date: Date | null): boolean => {
    if (date === null) return false;
    return date < new Date();
};

export const DealKanbanCard = ({
    deal,
    isDragging = false,
    onClick,
    assigneeName,
    isPriority = false,
}: DealKanbanCardProps) => {
    const overdue = isOverdue(deal.expectedCloseDate);

    return (
        <Paper
            elevation={isDragging ? 8 : 1}
            onClick={() => onClick?.(deal.id)}
            sx={{
                p: 2,
                mb: 1,
                backgroundColor: "white",
                borderRadius: "0.5rem",
                cursor: onClick ? "pointer" : "default",
                opacity: isDragging ? 0.7 : 1,
                transition: "box-shadow 0.2s ease, opacity 0.2s ease",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 32, 69, 0.12)",
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="body2" fontWeight="bold" sx={{ flex: 1, mr: 1 }}>
                    {deal.dealName}
                </Typography>
                {isPriority && (
                    <Badge color="error" badgeContent={<PriorityHighIcon sx={{ fontSize: 10 }} />}>
                        <Chip
                            label="優先"
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                    </Badge>
                )}
            </Box>

            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <AttachMoneyIcon fontSize="small" sx={{ color: "#74777f", fontSize: 14 }} />
                <Typography variant="caption" color="text.secondary">
                    {formatCurrency(deal.amount)}
                </Typography>
            </Box>

            {assigneeName && (
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <PersonIcon fontSize="small" sx={{ color: "#74777f", fontSize: 14 }} />
                    <Typography variant="caption" color="text.secondary">
                        {assigneeName}
                    </Typography>
                </Box>
            )}

            <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon fontSize="small" sx={{ color: "#74777f", fontSize: 14 }} />
                <Typography
                    variant="caption"
                    sx={{ color: overdue ? "error.main" : "text.secondary" }}
                >
                    {formatDate(deal.expectedCloseDate)}
                </Typography>
            </Box>
        </Paper>
    );
};
