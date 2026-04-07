import EditIcon from "@mui/icons-material/Edit";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Deal } from "../../../backend/domain/entity/Deal";
import { Customer } from "./CustomerHierarchyTree";

interface Contact {
    id: string;
    name: string;
    title: string;
    email: string;
    phone: string;
}

interface CustomerDetailPanelProps {
    customer: Customer & {
        parentId?: string | null;
        parentName?: string;
        address?: string;
        phone?: string;
        email?: string;
        children?: Customer[];
    };
    relatedDeals?: Deal[];
    relatedContacts?: Contact[];
    onEdit?: () => void;
    onParentClick?: (parentId: string) => void;
    onDealClick?: (dealId: string) => void;
}

const formatCurrency = (amount: number | null): string => {
    if (amount === null) return "未設定";
    return `¥${amount.toLocaleString()}`;
};

export const CustomerDetailPanel = ({
    customer,
    relatedDeals = [],
    relatedContacts = [],
    onEdit,
    onParentClick,
    onDealClick,
}: CustomerDetailPanelProps) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: "0.75rem",
                height: "100%",
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        fontFamily="Manrope, sans-serif"
                        sx={{ mb: 0.5 }}
                    >
                        {customer.name}
                    </Typography>
                    <Chip label={customer.type} size="small" sx={{ backgroundColor: "#d6e3ff" }} />
                </Box>
                {onEdit && (
                    <IconButton onClick={onEdit} size="small">
                        <EditIcon />
                    </IconButton>
                )}
            </Box>

            {/* Basic Info */}
            <Grid container spacing={2} mb={2}>
                {customer.parentId && customer.parentName && (
                    <Grid size={12}>
                        <Typography variant="caption" color="text.secondary">
                            親顧客
                        </Typography>
                        <Box>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => onParentClick?.(customer.parentId!)}
                                sx={{ cursor: "pointer" }}
                            >
                                {customer.parentName}
                            </Link>
                        </Box>
                    </Grid>
                )}
                {customer.address && (
                    <Grid size={12}>
                        <Typography variant="caption" color="text.secondary">
                            住所
                        </Typography>
                        <Typography variant="body2">{customer.address}</Typography>
                    </Grid>
                )}
                {customer.phone && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                            電話番号
                        </Typography>
                        <Typography variant="body2">{customer.phone}</Typography>
                    </Grid>
                )}
                {customer.email && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                            メールアドレス
                        </Typography>
                        <Typography variant="body2">{customer.email}</Typography>
                    </Grid>
                )}
            </Grid>

            <Divider sx={{ mb: 2, opacity: 0.5 }} />

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
            >
                <Tab label={`子顧客 (${customer.children?.length ?? 0})`} />
                <Tab label={`関連案件 (${relatedDeals.length})`} />
                <Tab label={`担当者 (${relatedContacts.length})`} />
            </Tabs>

            {/* Tab content: Child customers */}
            {activeTab === 0 && (
                <Box>
                    {(customer.children ?? []).length === 0 ? (
                        <Typography color="text.secondary" variant="body2">
                            子顧客がありません
                        </Typography>
                    ) : (
                        customer.children!.map((child) => (
                            <Box key={child.id} sx={{ py: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    {child.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {child.type}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            )}

            {/* Tab content: Related deals */}
            {activeTab === 1 && (
                <Box>
                    {relatedDeals.length === 0 ? (
                        <Typography color="text.secondary" variant="body2">
                            関連案件がありません
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>案件名</TableCell>
                                    <TableCell>ステータス</TableCell>
                                    <TableCell>金額</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {relatedDeals.map((deal) => (
                                    <TableRow
                                        key={deal.id}
                                        hover
                                        onClick={() => onDealClick?.(deal.id)}
                                        sx={{ cursor: onDealClick ? "pointer" : "default" }}
                                    >
                                        <TableCell>{deal.dealName}</TableCell>
                                        <TableCell>
                                            <Chip label={deal.status} size="small" />
                                        </TableCell>
                                        <TableCell>{formatCurrency(deal.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            )}

            {/* Tab content: Contacts */}
            {activeTab === 2 && (
                <Box>
                    {relatedContacts.length === 0 ? (
                        <Typography color="text.secondary" variant="body2">
                            担当者がありません
                        </Typography>
                    ) : (
                        relatedContacts.map((contact) => (
                            <Box key={contact.id} sx={{ py: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    {contact.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {contact.title} · {contact.email}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            )}

            {onEdit && (
                <Box mt={3}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onEdit}
                        fullWidth
                        sx={{
                            background: "linear-gradient(135deg, #002045 0%, #1a365d 100%)",
                        }}
                    >
                        編集
                    </Button>
                </Box>
            )}
        </Paper>
    );
};
