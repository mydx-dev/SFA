import { AppsScriptRouter } from "@mydx-dev/gas-boost-react-apps-script";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { queryClient } from "../lib/QueryClient";
import { theme } from "../lib/theme";
import { AppLayout } from "../layout/AppLayout";
import { LeadListPage } from "../page/LeadListPage";
import { LeadDetailPage } from "../page/LeadDetailPage";
import { DealListPage } from "../page/DealListPage";
import { DealDetailPage } from "../page/DealDetailPage";
import { DashboardPage } from "../page/DashboardPage";
import { ActivityHistoryPage } from "../page/ActivityHistoryPage";
import { CustomerManagementPage } from "../page/CustomerManagementPage";
import { PhaseManagementPage } from "../page/PhaseManagementPage";
import { DealKanbanPage } from "../page/DealKanbanPage";
import { MobileDealListPage } from "../page/MobileDealListPage";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppsScriptRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <HashRouter>
                            <AppLayout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/leads" element={<LeadListPage />} />
                                    <Route path="/leads/:id" element={<LeadDetailPage />} />
                                    <Route path="/deals" element={<DealListPage />} />
                                    <Route path="/deals/:id" element={<DealDetailPage />} />
                                    <Route path="/deals/kanban" element={<DealKanbanPage />} />
                                    <Route path="/deals/mobile" element={<MobileDealListPage />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/activities" element={<ActivityHistoryPage />} />
                                    <Route path="/customers" element={<CustomerManagementPage />} />
                                    <Route path="/phases" element={<PhaseManagementPage />} />
                                </Routes>
                            </AppLayout>
                        </HashRouter>
                    </QueryClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </AppsScriptRouter>
    </StrictMode>,
);
