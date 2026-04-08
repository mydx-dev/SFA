import { AppBar, Box, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
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

const SIDEBAR_WIDTH = 256; // 256px = w-64 in Tailwind

export const AppLayout = ({ children }: AppLayoutProps) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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

    const navItems = [
        { label: "ダッシュボード", path: "/dashboard" },
        { label: "リード", path: "/leads" },
        { label: "案件", path: "/deals" },
        { label: "顧客管理", path: "/customers" },
        { label: "活動履歴", path: "/activities" },
        { label: "フェーズ管理", path: "/phases" },
    ];

    const sidebarContent = (
        <Box
            component="aside"
            sx={{ 
                width: SIDEBAR_WIDTH,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.mode === "dark" ? "#0a0f1a" : "#1e293b", // slate-900
            }}
            role="complementary"
            aria-label="サイドナビゲーション"
        >
            <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <Typography 
                    variant="h2" 
                    sx={{ 
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        fontFamily: "Manrope, sans-serif",
                    }}
                >
                    SFA
                </Typography>
            </Box>
            <Box component="nav" role="navigation" sx={{ flexGrow: 1 }}>
                <List sx={{ py: 2 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    selected={isActive}
                                    role="tab"
                                    aria-selected={isActive}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        color: isActive ? "#10b981" : "#94a3b8", // text-emerald-500 : text-slate-400
                                        bgcolor: isActive ? "rgba(16, 185, 129, 0.1)" : "transparent", // bg-emerald-500/10
                                        fontFamily: "Manrope, sans-serif",
                                        "&:hover": {
                                            bgcolor: isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                        },
                                    }}
                                >
                                    <ListItemText 
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            <a
                className="flex items-center space-x-3 text-slate-400 px-6 py-4 hover:bg-slate-800/50 hover:text-white transition-colors text-sm font-semibold"
                href="/deals/new"
            >
                <span className="material-symbols-outlined" data-icon="add">add</span>
                <span>新規案件追加</span>
            </a>
            <div className="mt-auto px-6 py-8 border-t border-slate-800">
                <div className="space-y-1">
                    <a
                        className="flex items-center space-x-3 text-slate-400 py-2 hover:text-white transition-colors text-sm"
                        href="/settings"
                    >
                        <span className="material-symbols-outlined" data-icon="settings">settings</span>
                        <span>設定</span>
                    </a>
                </div>
            </div>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7fafc" }}> {/* bg-surface */}
            {/* Fixed Sidebar for Desktop - fixed left-0 top-0, z-index 40 */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: SIDEBAR_WIDTH,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: SIDEBAR_WIDTH,
                            boxSizing: "border-box",
                            border: 0,
                            position: "fixed", // fixed positioning
                            left: 0,
                            top: 0,
                            height: "100%", // h-full
                            zIndex: 40, // z-index 40
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    anchor="left"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: SIDEBAR_WIDTH,
                            border: 0,
                        },
                    }}
                >
                    <Box onClick={() => setMobileDrawerOpen(false)}>
                        {sidebarContent}
                    </Box>
                </Drawer>
            )}

            {/* Main Content Area - offset by sidebar width */}
            <Box 
                sx={{ 
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    marginLeft: isMobile ? 0 : `${SIDEBAR_WIDTH}px`, // ml-64 (256px offset)
                }}
            >
                {/* Sticky Top AppBar - sticky top-0, z-index 30 */}
                <AppBar 
                    position="sticky" 
                    component="header" 
                    elevation={0}
                    sx={{
                        top: 0,
                        zIndex: 30, // z-index 30
                        bgcolor: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.8)", // bg-slate-50/80
                        backdropFilter: "blur(8px)",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        width: "100%", // w-[calc(100%-16rem)] handled by marginLeft on parent
                    }}
                >
                    <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 1, sm: 1 } }}> {/* px-8 py-4 equivalent */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open menu"
                                edge="start"
                                onClick={() => setMobileDrawerOpen(true)}
                                sx={{ mr: 2, color: "text.primary" }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box sx={{ flexGrow: 1 }} />
                        <TaskList />
                    </Toolbar>
                </AppBar>

                {/* Main Content with padding p-8 (32px) */}
                <Container 
                    component="main" 
                    maxWidth={false}
                    sx={{ 
                        flexGrow: 1, 
                        py: 4, // p-8 equivalent (32px)
                        px: 4,
                        minHeight: "calc(100vh - 120px)", // min-h-screen minus header and footer
                        bgcolor: "#f7fafc", // bg-surface
                    }}
                >
                    {children}
                </Container>

                {/* Footer */}
                <Box 
                    component="footer" 
                    sx={{ 
                        py: 2.5, 
                        px: 4,
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
        </Box>
    );
};
