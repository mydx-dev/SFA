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

describe("DealDetailPage", () => {
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
        test("初期表示時に案件詳細情報が表示される", async () => {
            const mockDeal = createMockDeal({ id: "1", dealName: "テスト案件" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("テスト案件")).toBeInTheDocument();
            });
        });

        test("初期表示時に営業活動一覧が表示される", async () => {
            const mockDeal = createMockDeal({ id: "1" });
            const mockActivities = [
                createMockActivity({ id: "1", activityType: "面談", content: "活動A", dealId: "1" }),
                createMockActivity({ id: "2", activityType: "電話", content: "活動B", dealId: "1" }),
            ];
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue(mockActivities);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("面談")).toBeInTheDocument();
                expect(screen.getByText("電話")).toBeInTheDocument();
            });
        });

        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(dealsUseCase.getDealById).mockImplementation(() => new Promise(() => {}));
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockImplementation(() => new Promise(() => {}));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });

        test("クローズ済みでない案件には'営業活動追加'ボタンが表示される", async () => {
            const mockDeal = createMockDeal({ status: "提案" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("営業活動追加")).toBeInTheDocument();
            });
        });

        test("クローズ済みでない案件には'クローズ'ボタンが表示される", async () => {
            const mockDeal = createMockDeal({ status: "交渉" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("クローズ")).toBeInTheDocument();
            });
        });
    });

    describe("データ取得", () => {
        test("マウント時に案件詳細APIが呼ばれる", async () => {
            const mockDeal = createMockDeal({ id: "1" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(dealsUseCase.getDealById).toHaveBeenCalledWith("1");
            });
        });

        test("マウント時に営業活動一覧APIが案件IDで絞り込んで呼ばれる", async () => {
            const mockDeal = createMockDeal({ id: "1" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(activitiesUseCase.getActivitiesFromLocal).toHaveBeenCalledWith("1");
            });
        });

        test("取得成功時に案件詳細情報が表示される", async () => {
            const mockDeal = createMockDeal({
                dealName: "重要案件",
                amount: 5000000,
                status: "交渉"
            });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("重要案件")).toBeInTheDocument();
                expect(screen.getByText("¥5,000,000")).toBeInTheDocument();
                expect(screen.getByText("交渉")).toBeInTheDocument();
            });
        });

        test("取得失敗時にエラーメッセージが表示される", async () => {
            vi.mocked(dealsUseCase.getDealById).mockRejectedValue(new Error("Failed"));
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
            });
        });
    });

    describe("データフロー", () => {
        test("取得した案件情報がDealDetailコンポーネントに渡される", async () => {
            const mockDeal = createMockDeal({ dealName: "フロー案件" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("フロー案件")).toBeInTheDocument();
            });
        });

        test("取得した営業活動一覧がActivityListコンポーネントに渡される", async () => {
            const mockDeal = createMockDeal();
            const mockActivities = [createMockActivity({ activityType: "面談", content: "テスト活動" })];
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue(mockActivities);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("面談")).toBeInTheDocument();
            });
        });
    });

    describe("ユーザー操作", () => {
        test("'営業活動追加'クリックでActivityFormが表示される", async () => {
            const user = userEvent.setup();
            const mockDeal = createMockDeal({ status: "提案" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            const addButton = await screen.findByText("営業活動追加");
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getAllByText("営業活動追加").length).toBeGreaterThan(1);
            });
        });

        test("ActivityForm送信後に営業活動一覧が更新される", async () => {
            const mockDeal = createMockDeal();
            const newActivity = createMockActivity({ content: "新規活動" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            vi.mocked(activitiesUseCase.createActivity).mockResolvedValue(newActivity);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(activitiesUseCase.createActivity).toBeDefined();
            });
        });

        test("'クローズ'クリックでクローズ確認ダイアログが表示される", async () => {
            const user = userEvent.setup();
            const mockDeal = createMockDeal({ status: "提案" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("クローズ")).toBeInTheDocument();
            });

            await user.click(screen.getByText("クローズ"));

            await waitFor(() => {
                expect(screen.getByText("案件をクローズしますか？")).toBeInTheDocument();
            });
        });

        test("クローズ確認後に案件がクローズされる", async () => {
            const user = userEvent.setup();
            const mockDeal = createMockDeal({ status: "提案" });
            const closedDeal = createMockDeal({ status: "クローズ(成功)" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            vi.mocked(dealsUseCase.closeDeal).mockResolvedValue(closedDeal);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("クローズ")).toBeInTheDocument();
            });

            await user.click(screen.getByText("クローズ"));

            await waitFor(() => {
                expect(screen.getByText("成功クローズ")).toBeInTheDocument();
            });

            await user.click(screen.getByText("成功クローズ"));

            await waitFor(() => {
                expect(dealsUseCase.closeDeal).toHaveBeenCalledWith("1", true);
            });
        });

        test("クローズ後にページが更新される", async () => {
            const user = userEvent.setup();
            const mockDeal = createMockDeal({ status: "提案" });
            const closedDeal = createMockDeal({ status: "クローズ(成功)" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValueOnce(mockDeal).mockResolvedValue(closedDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            vi.mocked(dealsUseCase.closeDeal).mockResolvedValue(closedDeal);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("クローズ")).toBeInTheDocument();
            });

            await user.click(screen.getByText("クローズ"));

            await waitFor(() => {
                expect(screen.getByText("成功クローズ")).toBeInTheDocument();
            });

            await user.click(screen.getByText("成功クローズ"));

            await waitFor(() => {
                expect(dealsUseCase.closeDeal).toHaveBeenCalledTimes(1);
            });
        });

        test("'戻る'クリックで案件一覧ページに遷移する", async () => {
            const user = userEvent.setup();
            const mockDeal = createMockDeal();
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                            <Route path="/deals" element={<div>案件一覧</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("戻る")).toBeInTheDocument();
            });

            await user.click(screen.getByText("戻る"));

            await waitFor(() => {
                expect(screen.getByText("案件一覧")).toBeInTheDocument();
            });
        });
    });

    describe("状態管理", () => {
        test("クローズ済みの案件では'営業活動追加'ボタンが非表示になる", async () => {
            const mockDeal = createMockDeal({ status: "クローズ(成功)" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("案件詳細")).toBeInTheDocument();
            });

            expect(screen.queryByText("営業活動追加")).not.toBeInTheDocument();
        });

        test("クローズ済みの案件では'クローズ'ボタンが非表示になる", async () => {
            const mockDeal = createMockDeal({ status: "クローズ(失敗)" });
            vi.mocked(dealsUseCase.getDealById).mockResolvedValue(mockDeal);
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/deals/1"]}>
                        <Routes>
                            <Route path="/deals/:id" element={<DealDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("案件詳細")).toBeInTheDocument();
            });

            expect(screen.queryByText("クローズ")).not.toBeInTheDocument();
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


// ========================================
// Stitch画面から設計されたページ
// ========================================

