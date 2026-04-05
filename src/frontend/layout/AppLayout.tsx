import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { performSync } from "../usecase/sync";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
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

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};
