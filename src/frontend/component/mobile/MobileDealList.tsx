import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Deal } from "../../../backend/domain/entity/Deal";

type DealStatus = Deal["status"];

const statusColors: Record<DealStatus, "primary" | "warning" | "success" | "default"> = {
    提案: "primary",
    交渉: "warning",
    "クローズ(成功)": "success",
    "クローズ(失敗)": "default",
};

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

interface MobileDealListProps {
    deals: Deal[];
    onDealClick?: (dealId: string) => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onEdit?: (dealId: string) => void;
    onDelete?: (dealId: string) => void;
    isLoading?: boolean;
}

export const MobileDealList = ({
    deals,
    onDealClick,
    hasMore = false,
    onLoadMore,
    onEdit,
    onDelete,
    isLoading = false,
}: MobileDealListProps) => {
    const [swipedDealId, setSwipedDealId] = useState<string | null>(null);
    const [touchStartX, setTouchStartX] = useState<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent, dealId: string) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 60) {
            setSwipedDealId(swipedDealId === dealId ? null : dealId);
        }
    };

    return (
        <Box>
            {deals.length === 0 && !isLoading && (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    案件がありません
                </Typography>
            )}

            {deals.map((deal) => (
                <Box key={deal.id} sx={{ position: "relative", mb: 1 }}>
                    {/* Swipe action buttons */}
                    {swipedDealId === deal.id && (
                        <Box
                            sx={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                display: "flex",
                                zIndex: 1,
                            }}
                        >
                            {onEdit && (
                                <IconButton
                                    onClick={() => onEdit(deal.id)}
                                    sx={{ backgroundColor: "#002045", color: "white", borderRadius: 0 }}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            {onDelete && (
                                <IconButton
                                    onClick={() => onDelete(deal.id)}
                                    sx={{ backgroundColor: "error.main", color: "white", borderRadius: 0 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    )}

                    <Card
                        elevation={1}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={(e) => handleTouchEnd(e, deal.id)}
                        onClick={() => onDealClick?.(deal.id)}
                        sx={{
                            cursor: "pointer",
                            borderRadius: "0.75rem",
                            transform:
                                swipedDealId === deal.id ? "translateX(-120px)" : "translateX(0)",
                            transition: "transform 0.2s ease",
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <CardContent sx={{ pb: "12px !important" }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                mb={1}
                            >
                                <Typography variant="body1" fontWeight="bold" sx={{ flex: 1, mr: 1 }}>
                                    {deal.dealName}
                                </Typography>
                                <Chip
                                    label={deal.status}
                                    size="small"
                                    color={statusColors[deal.status]}
                                />
                            </Box>
                            <Box display="flex" gap={2}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <AttachMoneyIcon sx={{ fontSize: 14, color: "#74777f" }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatCurrency(deal.amount)}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <CalendarTodayIcon sx={{ fontSize: 14, color: "#74777f" }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(deal.expectedCloseDate)}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                        <Box
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        >
                            <ChevronRightIcon sx={{ color: "#c4c6cf" }} />
                        </Box>
                    </Card>
                </Box>
            ))}

            {isLoading && (
                <Box display="flex" justifyContent="center" py={3}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {hasMore && !isLoading && (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onLoadMore}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2, borderRadius: "0.75rem" }}
                >
                    もっと見る
                </Button>
            )}
        </Box>
    );
};
