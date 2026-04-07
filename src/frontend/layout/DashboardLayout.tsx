import { Box, Grid } from "@mui/material";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    kpiSection?: ReactNode;
    chartSection?: ReactNode;
    listSection?: ReactNode;
    children?: ReactNode;
}

/**
 * Dashboard Layout
 * Based on The Digital Curator design system
 * - Grid-based layout with proper spacing
 * - KPI cards in a row
 * - Chart and sidebar sections
 * - Activity lists below
 */
export const DashboardLayout = ({ kpiSection, chartSection, listSection, children }: DashboardLayoutProps) => {
    return (
        <Box>
            {children}
            
            {/* KPI Section - 4 columns */}
            {kpiSection && (
                <Box component="section" aria-label="KPIセクション" mb={4}>
                    {kpiSection}
                </Box>
            )}
            
            {/* Chart Section - Grid layout */}
            {chartSection && (
                <Box component="section" aria-label="グラフセクション" mb={4}>
                    <Grid container spacing={3}>
                        {chartSection}
                    </Grid>
                </Box>
            )}
            
            {/* List Section - Activity lists */}
            {listSection && (
                <Box component="section" aria-label="リストセクション">
                    <Grid container spacing={3}>
                        {listSection}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};
