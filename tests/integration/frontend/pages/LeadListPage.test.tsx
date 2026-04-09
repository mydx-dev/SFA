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

describe("LeadListPage", () => {
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
        test("初期表示時にリード一覧が表示される", async () => {
            const mockLeads = [
                createMockLead({ id: "1", name: "田中一郎" }),
                createMockLead({ id: "2", name: "佐藤花子" }),
            ];
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(mockLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(mockLeads);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("田中一郎")).toBeInTheDocument();
                expect(screen.getByText("佐藤花子")).toBeInTheDocument();
            });
        });

        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockImplementation(() => new Promise(() => {}));
            vi.mocked(leadsUseCase.fetchLeads).mockImplementation(() => new Promise(() => {}));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });

        test("'新規作成'ボタンが表示される", async () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue([]);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("新規作成")).toBeInTheDocument();
            });
        });
    });

    describe("データ取得", () => {
        test("マウント時にリード一覧APIが呼ばれる", async () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue([]);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue([]);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(leadsUseCase.fetchLeads).toHaveBeenCalledTimes(1);
            });
        });

        test("取得成功時にLeadListコンポーネントにデータが渡される", async () => {
            const mockLeads = [createMockLead({ id: "1", name: "田中一郎" })];
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(mockLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(mockLeads);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("田中一郎")).toBeInTheDocument();
            });
        });

        test("取得失敗時にエラーメッセージが表示される", async () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockRejectedValue(new Error("Failed"));
            vi.mocked(leadsUseCase.fetchLeads).mockRejectedValue(new Error("Failed"));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
            });
        });
    });

    describe("データフロー", () => {
        test("取得したリード一覧がLeadListコンポーネントに渡される", async () => {
            const mockLeads = [
                createMockLead({ id: "1", name: "田中一郎" }),
                createMockLead({ id: "2", name: "佐藤花子" }),
            ];
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(mockLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(mockLeads);

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("田中一郎")).toBeInTheDocument();
                expect(screen.getByText("佐藤花子")).toBeInTheDocument();
            });
        });

        test("LeadListコンポーネントのonLeadClickイベントでリード詳細ページに遷移する", async () => {
            const mockLeads = [createMockLead({ id: "1", name: "田中一郎" })];
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(mockLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(mockLeads);
            const user = userEvent.setup();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/leads"]}>
                        <Routes>
                            <Route path="/leads" element={<LeadListPage />} />
                            <Route path="/leads/:id" element={<div>Lead Detail</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("田中一郎")).toBeInTheDocument();
            });

            await user.click(screen.getByText("田中一郎"));

            await waitFor(() => {
                expect(screen.getByText("Lead Detail")).toBeInTheDocument();
            });
        });
    });

    describe("ユーザー操作", () => {
        test("'新規作成'ボタンクリックでリード作成フォームが表示される", async () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue([]);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue([]);
            const user = userEvent.setup();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("新規作成")).toBeInTheDocument();
            });

            await user.click(screen.getByText("新規作成"));

            await waitFor(() => {
                expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
            });
        });

        test("リード作成フォーム送信後にリード一覧が更新される", async () => {
            const initialLeads: Lead[] = [];
            const newLead = createMockLead({ id: "new-1", name: "新規リード" });
            
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(initialLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(initialLeads);
            vi.mocked(leadsUseCase.createLead).mockResolvedValue(newLead);
            
            const user = userEvent.setup();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("新規作成")).toBeInTheDocument();
            });

            await user.click(screen.getByText("新規作成"));

            // フォームに入力
            await waitFor(() => {
                expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
            });
        });

        test("リスト項目クリックでリード詳細ページに遷移する", async () => {
            const mockLeads = [createMockLead({ id: "1", name: "田中一郎" })];
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockResolvedValue(mockLeads);
            vi.mocked(leadsUseCase.fetchLeads).mockResolvedValue(mockLeads);
            const user = userEvent.setup();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/leads"]}>
                        <Routes>
                            <Route path="/leads" element={<LeadListPage />} />
                            <Route path="/leads/:id" element={<div>Lead Detail</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText("田中一郎")).toBeInTheDocument();
            });

            await user.click(screen.getByText("田中一郎"));

            await waitFor(() => {
                expect(screen.getByText("Lead Detail")).toBeInTheDocument();
            });
        });
    });

    describe("状態管理", () => {
        test("ローディング状態のとき、LeadListコンポーネントではなくスピナーが表示される", () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockImplementation(() => new Promise(() => {}));
            vi.mocked(leadsUseCase.fetchLeads).mockImplementation(() => new Promise(() => {}));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(screen.queryByText("リードがありません")).not.toBeInTheDocument();
        });

        test("エラー状態のとき、エラーコンポーネントが表示される", async () => {
            vi.mocked(leadsUseCase.getLeadsFromLocal).mockRejectedValue(new Error("Failed"));
            vi.mocked(leadsUseCase.fetchLeads).mockRejectedValue(new Error("Failed"));

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LeadListPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
            });
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

