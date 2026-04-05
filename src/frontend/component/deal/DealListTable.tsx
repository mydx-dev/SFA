import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Deal } from "../../../backend/domain/entity/Deal";

interface DealListTableProps {
    deals: Deal[];
    onDealClick: (dealId: string) => void;
}

const statusColors: Record<Deal["status"], "primary" | "warning" | "success" | "default"> = {
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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
};

export const DealListTable = ({ deals, onDealClick }: DealListTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>案件名</TableCell>
                        <TableCell>ステータス</TableCell>
                        <TableCell>金額</TableCell>
                        <TableCell>予定クローズ日</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deals.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography variant="body1" color="text.secondary">
                                    案件がありません
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        deals.map((deal) => (
                            <TableRow
                                key={deal.id}
                                hover
                                onClick={() => onDealClick(deal.id)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>{deal.dealName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={deal.status}
                                        color={statusColors[deal.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{formatCurrency(deal.amount)}</TableCell>
                                <TableCell>{formatDate(deal.expectedCloseDate)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
