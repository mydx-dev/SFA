import { AppsScriptRouter } from "@mydx-dev/gas-boost-react-apps-script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

/**
 * スクリプトレットで値を受け取る
 * https://developers.google.com/apps-script/guides/html/templates?hl=ja#scriptlets
 * const serverData = Number((document.getElementById('server-data') as HTMLInputElement)?.value || '');
 */

createRoot(document.getElementById("root")!).render(
    <AppsScriptRouter>
        <StrictMode>
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
        </StrictMode>
    </AppsScriptRouter>,
);
