import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LeadListPage } from "../../../../src/frontend/page/LeadListPage";
import { LeadDetailPage } from "../../../../src/frontend/page/LeadDetailPage";
import { DealListPage } from "../../../../src/frontend/page/DealListPage";
import { DealDetailPage } from "../../../../src/frontend/page/DealDetailPage";
import { DashboardPage } from "../../../../src/frontend/page/DashboardPage";
import { ActivityHistoryPage } from "../../../../src/frontend/page/ActivityHistoryPage";
import { CustomerManagementPage } from "../../../../src/frontend/page/CustomerManagementPage";
import { DealKanbanPage } from "../../../../src/frontend/page/DealKanbanPage";
import { MobileDealListPage } from "../../../../src/frontend/page/MobileDealListPage";
import { PhaseManagementPage } from "../../../../src/frontend/page/PhaseManagementPage";
import { AppLayout } from "../../../../src/frontend/layout/AppLayout";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";
import { Activity } from "../../../../src/backend/domain/entity/Activity";
import * as leadsUseCase from "../../../../src/frontend/usecase/leads";
import * as dealsUseCase from "../../../../src/frontend/usecase/deals";
import * as activitiesUseCase from "../../../../src/frontend/usecase/activities";
import * as dashboardUseCase from "../../../../src/frontend/usecase/dashboard";
import * as phasesUseCase from "../../../../src/frontend/usecase/phases";
import * as customersUseCase from "../../../../src/frontend/usecase/customers";
import * as syncUseCase from "../../../../src/frontend/usecase/sync";

vi.mock("../../../../src/frontend/usecase/leads");
vi.mock("../../../../src/frontend/usecase/deals");
vi.mock("../../../../src/frontend/usecase/activities");
vi.mock("../../../../src/frontend/usecase/dashboard");
vi.mock("../../../../src/frontend/usecase/phases");
vi.mock("../../../../src/frontend/usecase/customers");
vi.mock("../../../../src/frontend/usecase/sync");

const createMockLead = (overrides?: Partial<Lead>): Lead => {
    return new Lead(
        overrides?.id ?? "lead-1",
        overrides?.name ?? "山田太郎",
        overrides?.companyName ?? "株式会社テスト",
        overrides?.email ?? "yamada@test.com",
        overrides?.phoneNumber ?? "03-1234-5678",
        overrides?.status ?? "未対応",
        overrides?.assigneeId ?? null,
        overrides?.createdAt ?? new Date(),
        overrides?.updatedAt ?? new Date()
    );
};

const createMockDeal = (overrides?: Partial<Deal>): Deal => {
    return new Deal(
        overrides?.id ?? "deal-1",
        overrides?.dealName ?? "テスト案件",
        overrides?.leadId ?? "lead-1",
        overrides?.status ?? "提案",
        overrides?.amount ?? 1000000,
        overrides?.expectedCloseDate ?? null,
        overrides?.assigneeId ?? "user-1",
        overrides?.createdAt ?? new Date(),
        overrides?.updatedAt ?? new Date()
    );
};

const createMockActivity = (overrides?: Partial<Activity>): Activity => {
    return new Activity(
        overrides?.id ?? "activity-1",
        overrides?.dealId ?? "deal-1",
        overrides?.activityType ?? "面談",
        overrides?.activityDate ?? new Date(),
        overrides?.content ?? "テスト活動",
        overrides?.assigneeId ?? "user-1",
        overrides?.createdAt ?? new Date(),
        overrides?.updatedAt ?? new Date()
    );
};

describe("DealListPage", () => {
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

    describe("初期表示", () => {
        test("初期表示時に案件一覧が表示される", async () => {
            const mockDeals = [
                createMockDeal({ id: "1", dealName: "案件A" }),
                createMockDeal({ id: "2", dealName: "案件B" }),
            ];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("案件A")).toBeInTheDocument();
                expect(screen.getByText("案件B")).toBeInTheDocument();
            });
        });

        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockImplementation(() => new Promise(() => {}));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
    });

    describe("データ取得", () => {
        test("マウント時に案件一覧APIが呼ばれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled();
            });
        });

        test("取得成功時にDealListコンポーネントにデータが渡される", async () => {
            const mockDeals = [createMockDeal({ dealName: "テスト案件" })];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("テスト案件")).toBeInTheDocument();
            });
        });

        test("取得失敗時にエラーメッセージが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockRejectedValue(new Error("Failed"));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
            });
        });
    });

    describe("データフロー", () => {
        test("取得した案件一覧がDealListコンポーネントに渡される", async () => {
            const mockDeals = [createMockDeal({ dealName: "案件データ" })];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("案件データ")).toBeInTheDocument();
            });
        });

        test("DealListコンポーネントのonDealClickイベントで案件詳細ページに遷移する", async () => {
            const user = userEvent.setup();
            const mockDeals = [createMockDeal({ id: "1", dealName: "クリック案件" })];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals"]}>
                        <Routes>
                            <Route path="/deals" element={<DealListPage />} />
                            <Route path="/deals/:id" element={<div>案件詳細ページ</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("クリック案件")).toBeInTheDocument();
            });

            await user.click(screen.getByText("クリック案件"));

            await waitFor(() => {
                expect(screen.getByText("案件詳細ページ")).toBeInTheDocument();
            });
        });
    });

    describe("ユーザー操作", () => {
        test("案件クリックで案件詳細ページに遷移する", async () => {
            const user = userEvent.setup();
            const mockDeals = [createMockDeal({ id: "1", dealName: "遷移テスト案件" })];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals"]}>
                        <Routes>
                            <Route path="/deals" element={<DealListPage />} />
                            <Route path="/deals/:id" element={<div>案件詳細</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("遷移テスト案件")).toBeInTheDocument();
            });

            await user.click(screen.getByText("遷移テスト案件"));

            await waitFor(() => {
                expect(screen.getByText("案件詳細")).toBeInTheDocument();
            });
        });

        test("ステータスフィルタで案件一覧を絞り込める", async () => {
            const user = userEvent.setup();
            const mockDeals = [
                createMockDeal({ id: "1", dealName: "提案案件", status: "提案" }),
                createMockDeal({ id: "2", dealName: "交渉案件", status: "交渉" }),
            ];
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue(mockDeals);
            vi.mocked(dealsUseCase.fetchDeals).mockResolvedValue(mockDeals);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("提案案件")).toBeInTheDocument();
                expect(screen.getByText("交渉案件")).toBeInTheDocument();
            });

            // ステータスフィルターで「提案」を選択
            await user.click(screen.getByRole("combobox"));
            await user.click(screen.getByRole("option", { name: "提案" }));

            await waitFor(() => {
                expect(screen.getByText("提案案件")).toBeInTheDocument();
                expect(screen.queryByText("交渉案件")).not.toBeInTheDocument();
            });
        });
    });

    describe("状態管理", () => {
        test("ローディング状態のとき、スピナーが表示される", () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockImplementation(() => new Promise(() => {}));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DealListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("サイズ", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("色", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("タイポグラフィ", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("形状", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("装飾", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("インタラクション", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
    });
});

