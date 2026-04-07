import { Box } from "@mui/material";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    kpiSection?: ReactNode;
    chartSection?: ReactNode;
    listSection?: ReactNode;
    children?: ReactNode;
}

export const DashboardLayout = ({ kpiSection, chartSection, listSection, children }: DashboardLayoutProps) => {
    return (
        <Box>
            {children}
            {kpiSection && (
                <Box component="section" aria-label="KPIセクション" mb={3}>
                    {kpiSection}
                </Box>
            )}
            {chartSection && (
                <Box component="section" aria-label="グラフセクション" mb={3}>
                    {chartSection}
                </Box>
            )}
            {listSection && (
                <Box component="section" aria-label="リストセクション" mb={3}>
                    {listSection}
                </Box>
            )}
        </Box>
    );
};
