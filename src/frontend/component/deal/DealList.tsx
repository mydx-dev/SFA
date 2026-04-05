import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Deal } from "../../../backend/domain/entity/Deal";

interface DealListProps {
    deals: Deal[];
    onDealClick: (dealId: string) => void;
}

export const DealList = ({ deals, onDealClick }: DealListProps) => {
    if (deals.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                案件がありません
            </Typography>
        );
    }

    const formatCurrency = (amount: number | null): string => {
        if (amount === null) return "未設定";
        return `¥${amount.toLocaleString()}`;
    };

    return (
        <List>
            {deals.map((deal) => (
                <ListItem key={deal.id} disablePadding>
                    <ListItemButton onClick={() => onDealClick(deal.id)}>
                        <ListItemText
                            primary={deal.dealName}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        {deal.status}
                                    </Typography>
                                    {" — "}
                                    {formatCurrency(deal.amount)}
                                </>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
