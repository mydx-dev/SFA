import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DealForm, type DealFormValues } from "../component/deal/DealForm";
import { createDeal } from "../usecase/deals";

export const Sidebar = () => {
    const location = useLocation();
    const queryClient = useQueryClient();
    const [openDealDialog, setOpenDealDialog] = useState(false);

    const createDealMutation = useMutation({
        mutationFn: createDeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            setOpenDealDialog(false);
        },
    });

    const handleCreateDeal = (values: DealFormValues) => {
        createDealMutation.mutate({
            dealName: values.dealName,
            leadId: values.leadId,
            status: values.status,
            amount: values.amount,
            expectedCloseDate: values.expectedCloseDate,
            assigneeId: values.assigneeId,
        });
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navigationItems = [
        { label: "ダッシュボード", icon: <DashboardIcon />, path: "/" },
        { label: "リード", icon: <PeopleIcon />, path: "/leads" },
        { label: "案件", icon: <BusinessCenterIcon />, path: "/deals" },
    ];

    return (
        <>
            <Box
                sx={{
                    width: 240,
                    height: "100vh",
                    bgcolor: "white",
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Logo/Brand */}
                <Box sx={{ p: 3, pb: 2 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        SFA
                    </Typography>
                </Box>

                {/* Primary Action Button */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDealDialog(true)}
                        sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            py: 1.2,
                            fontWeight: 600,
                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        }}
                    >
                        新規案件作成
                    </Button>
                </Box>

                {/* Navigation Menu */}
                <List sx={{ flexGrow: 1, px: 1 }}>
                    {navigationItems.map((item) => (
                        <ListItem key={`${item.path}-${item.label}`} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={isActive(item.path)}
                                sx={{
                                    borderRadius: 1,
                                    "&.Mui-selected": {
                                        bgcolor: "action.selected",
                                        "&:hover": {
                                            bgcolor: "action.selected",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            sx={{
                                borderRadius: 1,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="タスク" />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* Bottom Section */}
                <Box>
                    <Divider />
                    <List sx={{ px: 1, py: 1 }}>
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton disabled sx={{ borderRadius: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="設定" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton disabled sx={{ borderRadius: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <HelpOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="サポート" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Box>

            {/* Deal Creation Dialog */}
            <Dialog
                open={openDealDialog}
                onClose={() => setOpenDealDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>新規案件作成</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <DealForm
                            onSubmit={handleCreateDeal}
                            onCancel={() => setOpenDealDialog(false)}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};
