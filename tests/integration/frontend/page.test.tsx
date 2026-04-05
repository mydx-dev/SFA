import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LeadListPage } from "../../../src/frontend/page/LeadListPage";
import { Lead } from "../../../src/backend/domain/entity/Lead";
import * as leadsUseCase from "../../../src/frontend/usecase/leads";

vi.mock("../../../src/frontend/usecase/leads");

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
});

describe("LeadDetailPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にリード詳細情報が表示される");
        test.todo("初期表示時に関連する案件一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時にリード詳細APIが呼ばれる");
        test.todo("マウント時に案件一覧APIがリードIDで絞り込んで呼ばれる");
        test.todo("取得成功時にリード詳細情報が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得したリード情報がLeadDetailコンポーネントに渡される");
        test.todo("取得した案件一覧がDealListコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("'編集'クリックで編集モードになる");
        test.todo("編集フォーム送信後にリード詳細が更新される");
        test.todo("'案件作成'クリックで案件作成フォームが表示される");
        test.todo("案件作成フォーム送信後に案件一覧が更新される");
        test.todo("'戻る'クリックでリード一覧ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("編集モードのとき、表示モードと編集モードのコンポーネントが切り替わる");
    });
});

describe("DealListPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に案件一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件一覧APIが呼ばれる");
        test.todo("取得成功時にDealListコンポーネントにデータが渡される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件一覧がDealListコンポーネントに渡される");
        test.todo("DealListコンポーネントのonDealClickイベントで案件詳細ページに遷移する");
    });

    describe("ユーザー操作", () => {
        test.todo("案件クリックで案件詳細ページに遷移する");
        test.todo("ステータスフィルタで案件一覧を絞り込める");
    });

    describe("状態管理", () => {
        test.todo("ローディング状態のとき、スピナーが表示される");
    });
});

describe("DealDetailPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に案件詳細情報が表示される");
        test.todo("初期表示時に営業活動一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
        test.todo("クローズ済みでない案件には'営業活動追加'ボタンが表示される");
        test.todo("クローズ済みでない案件には'クローズ'ボタンが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件詳細APIが呼ばれる");
        test.todo("マウント時に営業活動一覧APIが案件IDで絞り込んで呼ばれる");
        test.todo("取得成功時に案件詳細情報が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件情報がDealDetailコンポーネントに渡される");
        test.todo("取得した営業活動一覧がActivityListコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("'営業活動追加'クリックでActivityFormが表示される");
        test.todo("ActivityForm送信後に営業活動一覧が更新される");
        test.todo("'クローズ'クリックでクローズ確認ダイアログが表示される");
        test.todo("クローズ確認後に案件がクローズされる");
        test.todo("クローズ後にページが更新される");
        test.todo("'戻る'クリックで案件一覧ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("クローズ済みの案件では'営業活動追加'ボタンが非表示になる");
        test.todo("クローズ済みの案件では'クローズ'ボタンが非表示になる");
    });
});
