import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TaskList } from "../component/task/TaskList";
import { performSync } from "../usecase/sync";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const location = useLocation();
    
    // 初回マウント時にsyncを実行
    const { data, error } = useQuery({
        queryKey: ["sync"],
        queryFn: performSync,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (error) {
            console.error("Sync failed:", error);
        }
    }, [error]);

    // 現在のパスに基づいてタブの値を決定
    const getTabValue = () => {
        if (location.pathname.startsWith("/leads")) return "/leads";
        if (location.pathname.startsWith("/deals")) return "/deals";
        return "/leads";
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <AppBar position="static" component="header">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SFA
                    </Typography>
                    <TaskList />
                </Toolbar>
                <Tabs value={getTabValue()} textColor="inherit" indicatorColor="secondary">
                    <Tab label="リード" value="/leads" component={Link} to="/leads" />
                    <Tab label="案件" value="/deals" component={Link} to="/deals" />
                </Tabs>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                {children}
            </Container>
        </Box>
    );
};
