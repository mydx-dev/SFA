import { AppBar, Box, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Tab, Tabs, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { TaskList } from "../component/task/TaskList";
import { performSync } from "../usecase/sync";
import { useAuth } from "../lib/AuthContext";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const auth = useAuth();

    // 初回マウント時にsyncを実行
    const { error } = useQuery({
        queryKey: ["sync"],
        queryFn: performSync,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (error) {
            console.error("Sync failed:", error);
        }
    }, [error]);

    // AuthContextが提供されていてuserがnullの場合はログインページへリダイレクト
    if (auth === null) {
        return <Navigate to="/login" replace />;
    }

    // 現在のパスに基づいてタブの値を決定
    const getTabValue = () => {
        if (location.pathname.startsWith("/leads")) return "/leads";
        if (location.pathname.startsWith("/deals")) return "/deals";
        if (location.pathname.startsWith("/dashboard")) return "/dashboard";
        if (location.pathname.startsWith("/activities")) return "/activities";
        if (location.pathname.startsWith("/customers")) return "/customers";
        if (location.pathname.startsWith("/phases")) return "/phases";
        return "/leads";
    };

    const navItems = [
        { label: "ダッシュボード", path: "/dashboard" },
        { label: "リード", path: "/leads" },
        { label: "案件", path: "/deals" },
        { label: "顧客管理", path: "/customers" },
        { label: "活動履歴", path: "/activities" },
        { label: "フェーズ管理", path: "/phases" },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar position="static" component="header" color="primary" elevation={0}>
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open menu"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography 
                        variant="h1" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1, 
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        SFA
                    </Typography>
                    <TaskList />
                </Toolbar>
                {!isMobile && (
                    <Tabs 
                        value={getTabValue()} 
                        textColor="inherit" 
                        sx={{
                            bgcolor: "primary.dark",
                            "& .MuiTab-root": {
                                color: "rgba(255, 255, 255, 0.7)",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                letterSpacing: "0.02em",
                                minHeight: 48,
                                "&.Mui-selected": {
                                    color: "#ffffff",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#ffffff",
                                height: 3,
                            },
                        }}
                    >
                        {navItems.map((item) => (
                            <Tab key={item.path} label={item.label} value={item.path} component={Link} to={item.path} />
                        ))}
                    </Tabs>
                )}
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    component="nav"
                    sx={{ width: 280 }}
                    role="navigation"
                    onClick={() => setDrawerOpen(false)}
                >
                    <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                        <Typography variant="h2" sx={{ fontSize: "1.25rem" }}>
                            SFA
                        </Typography>
                    </Box>
                    <List sx={{ py: 2 }}>
                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    selected={location.pathname.startsWith(item.path)}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        "&.Mui-selected": {
                                            bgcolor: "rgba(0, 32, 69, 0.08)",
                                            borderLeft: "3px solid",
                                            borderColor: "primary.main",
                                            "&:hover": {
                                                bgcolor: "rgba(0, 32, 69, 0.12)",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemText 
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: location.pathname.startsWith(item.path) ? 600 : 400,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Container 
                    component="main" 
                    maxWidth="xl" 
                    sx={{ 
                        flexGrow: 1, 
                        py: { xs: 3, md: 4 },
                        px: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    {children}
                </Container>
            </Box>

            <Box 
                component="footer" 
                sx={{ 
                    py: 2.5, 
                    px: 3,
                    textAlign: "center", 
                    borderTop: "1px solid", 
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    © 2026 SFA System - The Digital Curator
                </Typography>
            </Box>
        </Box>
    );
};
