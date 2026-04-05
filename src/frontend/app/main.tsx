import { AppsScriptRouter } from "@mydx-dev/gas-boost-react-apps-script";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { queryClient } from "../lib/QueryClient";
import { AppLayout } from "../layout/AppLayout";
import { LeadListPage } from "../page/LeadListPage";
import { LeadDetailPage } from "../page/LeadDetailPage";
import { DealListPage } from "../page/DealListPage";
import { DealDetailPage } from "../page/DealDetailPage";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppsScriptRouter>
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
                                <Route path="/" element={<Navigate to="/leads" replace />} />
                                <Route path="/leads" element={<LeadListPage />} />
                                <Route path="/leads/:id" element={<LeadDetailPage />} />
                                <Route path="/deals" element={<DealListPage />} />
                                <Route path="/deals/:id" element={<DealDetailPage />} />
                            </Routes>
                        </AppLayout>
                    </HashRouter>
                </QueryClientProvider>
            </SnackbarProvider>
        </AppsScriptRouter>
    </StrictMode>,
);
