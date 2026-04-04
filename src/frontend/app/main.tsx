import { AppsScriptRouter } from "@mydx-dev/gas-boost-react-apps-script";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { queryClient } from "../lib/QueryClient";

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
                        <Routes>
                            <Route path="/"></Route>
                        </Routes>
                    </HashRouter>
                </QueryClientProvider>
            </SnackbarProvider>
        </AppsScriptRouter>
    </StrictMode>,
);
