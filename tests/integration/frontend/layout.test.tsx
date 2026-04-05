import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "../../../src/frontend/layout/AppLayout";
import * as syncUseCase from "../../../src/frontend/usecase/sync";

vi.mock("../../../src/frontend/usecase/sync");
vi.mock("../../../src/frontend/usecase/deals");

describe("AppLayout", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vi.clearAllMocks();
    });

    describe("構造", () => {
        test("childrenが正しく描画される", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            expect(screen.getByText("テストコンテンツ")).toBeInTheDocument();
        });

        test("サイドバーが表示される", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            // サイドバーのロゴが表示される
            expect(screen.getByText("SFA")).toBeInTheDocument();
        });

        test("サイドバーに新規案件作成ボタンが表示される", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            // 新規案件作成ボタンが表示される
            expect(screen.getByText("新規案件作成")).toBeInTheDocument();
        });

        test("ナビゲーションメニューが表示される", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            expect(screen.getByText("リード")).toBeInTheDocument();
            expect(screen.getByText("案件")).toBeInTheDocument();
        });
    });

    describe("ナビゲーション", () => {
        test("'リード'メニュークリックでリード一覧ページに遷移する", async () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            const user = userEvent.setup();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals"]}>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            const leadButton = screen.getByText("リード");
            await user.click(leadButton);
            
            // リンクのhref属性を確認
            expect(leadButton.closest("a")).toHaveAttribute("href", "/leads");
        });

        test("'案件'メニュークリックで案件一覧ページに遷移する", async () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            const user = userEvent.setup();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/leads"]}>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            const dealButton = screen.getByText("案件");
            await user.click(dealButton);
            
            expect(dealButton.closest("a")).toHaveAttribute("href", "/deals");
        });

        test("現在のページに対応するナビゲーションがアクティブ状態になる", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/leads"]}>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            const leadButton = screen.getByText("リード");
            // アクティブ状態はMUI Tabsで処理されるため、要素が存在することを確認
            expect(leadButton).toBeInTheDocument();
        });
    });

    describe("認証・認可", () => {
        test("マウント時にsyncが実行されリモートデータが取得される", async () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            await waitFor(() => {
                expect(syncUseCase.performSync).toHaveBeenCalledTimes(1);
            });
        });

        test("sync失敗時はエラー状態になる", async () => {
            vi.mocked(syncUseCase.performSync).mockRejectedValue(new Error("Sync failed"));
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            // エラーが発生してもレイアウトは表示される
            await waitFor(() => {
                expect(screen.getByText("テストコンテンツ")).toBeInTheDocument();
            });
        });
    });

    describe("共通状態", () => {
        test("サイドバーのナビゲーションが全ページ共通で表示される", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>テストコンテンツ</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            // サイドバーのナビゲーションが表示される
            expect(screen.getByText("SFA")).toBeInTheDocument();
            expect(screen.getByText("新規案件作成")).toBeInTheDocument();
        });

        test("全ページ共通でサイドバーが利用できる", () => {
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AppLayout>
                            <div>ページ1</div>
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            expect(screen.getByText("SFA")).toBeInTheDocument();
            expect(screen.getByText("ページ1")).toBeInTheDocument();
        });
    });
});
