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
        { label: "リード", path: "/leads" },
        { label: "案件", path: "/deals" },
        { label: "ダッシュボード", path: "/dashboard" },
        { label: "活動履歴", path: "/activities" },
        { label: "顧客管理", path: "/customers" },
        { label: "フェーズ管理", path: "/phases" },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <AppBar position="static" component="header">
                <Toolbar>
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SFA
                    </Typography>
                    <TaskList />
                </Toolbar>
                {!isMobile && (
                    <Tabs value={getTabValue()} textColor="inherit" indicatorColor="secondary">
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
                    sx={{ width: 240 }}
                    role="navigation"
                    onClick={() => setDrawerOpen(false)}
                >
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                {!isMobile && (
                    <Box
                        component="aside"
                        sx={{ width: 0, flexShrink: 0 }}
                        aria-label="sidebar"
                    />
                )}
                <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                    {children}
                </Container>
            </Box>

            <Box component="footer" sx={{ py: 2, textAlign: "center", borderTop: "1px solid", borderColor: "divider" }}>
                <Typography variant="body2" color="text.secondary">
                    © SFA System
                </Typography>
            </Box>
        </Box>
    );
};
