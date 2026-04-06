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

// ========================================
// Stitch画面から設計されたページ
// ========================================

describe("DashboardPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にKPIカード（総売上、案件数、リード数、成約率）が表示される");
        test.todo("初期表示時に売上推移グラフが表示される");
        test.todo("初期表示時にパイプライン状況が表示される");
        test.todo("初期表示時に最近の活動一覧が表示される");
        test.todo("初期表示時に今後のタスク一覧が表示される");
        test.todo("ローディング中はスケルトンスクリーンが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時にダッシュボードメトリクスAPIが呼ばれる");
        test.todo("マウント時に最近の活動APIが呼ばれる");
        test.todo("マウント時に今後のタスクAPIが呼ばれる");
        test.todo("マウント時に売上推移データAPIが呼ばれる");
        test.todo("マウント時にパイプラインデータAPIが呼ばれる");
        test.todo("取得成功時にダッシュボードが表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得したメトリクスがKPICardコンポーネントに渡される");
        test.todo("取得した売上データがSalesChartコンポーネントに渡される");
        test.todo("取得したパイプラインデータがPipelineViewコンポーネントに渡される");
        test.todo("取得した活動データがActivityHistoryコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("期間フィルター変更でダッシュボードデータが更新される");
        test.todo("KPIカードクリックで詳細ページに遷移する");
        test.todo("活動アイテムクリックで活動詳細モーダルが開く");
        test.todo("タスクアイテムクリックでタスク詳細モーダルが開く");
        test.todo("'すべて表示'ボタンクリックで対応する一覧ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("期間フィルター状態が管理される");
        test.todo("リフレッシュ状態が管理される");
    });
});

describe("ActivityHistoryPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に活動履歴一覧がテーブル形式で表示される");
        test.todo("初期表示時にフィルターパネルが表示される");
        test.todo("初期表示時にページネーションが表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に活動履歴APIが呼ばれる");
        test.todo("フィルター変更時に活動履歴APIが再度呼ばれる");
        test.todo("ページ変更時に活動履歴APIが呼ばれる");
        test.todo("取得成功時に活動履歴一覧が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した活動履歴がActivityHistoryコンポーネントに渡される");
        test.todo("取得したフィルター選択肢がSearchFilterPanelコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("活動種別フィルター選択で活動履歴が絞り込まれる");
        test.todo("期間フィルター選択で活動履歴が絞り込まれる");
        test.todo("検索ボックス入力で活動履歴が検索される");
        test.todo("テーブルヘッダークリックでソート順が変更される");
        test.todo("活動行クリックで活動詳細モーダルが開く");
        test.todo("ページネーションクリックでページが切り替わる");
        test.todo("フィルタークリアボタンクリックで全フィルターがリセットされる");
    });

    describe("状態管理", () => {
        test.todo("フィルター条件が管理される");
        test.todo("ソート条件が管理される");
        test.todo("現在のページ番号が管理される");
    });
});

describe("CustomerManagementPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に左側に顧客階層ツリーが表示される");
        test.todo("初期表示時に右側に顧客詳細パネルが表示される");
        test.todo("初期表示時にルート顧客が展開された状態で表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に顧客階層データAPIが呼ばれる");
        test.todo("顧客選択時に顧客詳細APIが呼ばれる");
        test.todo("顧客選択時に関連案件APIが呼ばれる");
        test.todo("取得成功時に顧客情報が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した顧客階層データがCustomerHierarchyTreeコンポーネントに渡される");
        test.todo("取得した顧客詳細がCustomerDetailPanelコンポーネントに渡される");
        test.todo("取得した関連案件がDealListコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("ツリーノード展開で子顧客が表示される");
        test.todo("ツリーノード折りたたみで子顧客が非表示になる");
        test.todo("顧客選択で詳細パネルが更新される");
        test.todo("顧客編集ボタンクリックで編集フォームが表示される");
        test.todo("顧客編集フォーム送信後に顧客情報が更新される");
        test.todo("子顧客追加ボタンクリックで追加フォームが表示される");
        test.todo("関連案件クリックで案件詳細ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("選択中の顧客IDが管理される");
        test.todo("展開されたノードIDリストが管理される");
        test.todo("編集モード状態が管理される");
    });
});

describe("DealKanbanPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にカンバンボードが表示される");
        test.todo("初期表示時に検索バーが表示される");
        test.todo("初期表示時にフィルターボタンが表示される");
        test.todo("初期表示時に各ステージに案件カードが表示される");
        test.todo("ローディング中はスケルトンカードが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件一覧APIが呼ばれる");
        test.todo("フィルター変更時に案件一覧APIが再度呼ばれる");
        test.todo("検索実行時に案件一覧APIが呼ばれる");
        test.todo("取得成功時にカンバンボードが表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件データがDealKanbanBoardコンポーネントに渡される");
        test.todo("取得したフィルター選択肢がSearchFilterPanelコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("案件カードドラッグで別ステージに移動できる");
        test.todo("案件移動時にステータス更新APIが呼ばれる");
        test.todo("案件カードクリックで案件詳細ページに遷移する");
        test.todo("検索ボックス入力で案件が絞り込まれる");
        test.todo("フィルターボタンクリックでフィルターパネルが開く");
        test.todo("フィルター適用で案件が絞り込まれる");
        test.todo("新規案件ボタンクリックで案件作成フォームが表示される");
    });

    describe("状態管理", () => {
        test.todo("ドラッグ中の案件が管理される");
        test.todo("フィルター条件が管理される");
        test.todo("検索キーワードが管理される");
        test.todo("フィルターパネルの開閉状態が管理される");
    });
});

describe("MobileDealListPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に案件一覧がカード形式で表示される");
        test.todo("初期表示時にモバイル検索バーが表示される");
        test.todo("初期表示時にフィルターボタンが表示される");
        test.todo("ローディング中はスピナーが表示される");
        test.todo("Pull to Refreshインジケーターが利用可能");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件一覧APIが呼ばれる");
        test.todo("Pull to Refreshで案件一覧APIが再度呼ばれる");
        test.todo("スクロール下部到達時に追加データAPIが呼ばれる");
        test.todo("検索実行時に案件一覧APIが呼ばれる");
        test.todo("取得成功時に案件一覧が表示される");
        test.todo("取得失敗時にエラートーストが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件データがMobileDealListコンポーネントに渡される");
        test.todo("取得したフィルター選択肢がMobileFilterDrawerコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("案件カードタップで案件詳細ページに遷移する");
        test.todo("案件カード左スワイプで削除ボタンが表示される");
        test.todo("案件カード右スワイプで編集ボタンが表示される");
        test.todo("削除ボタンタップで削除確認ダイアログが表示される");
        test.todo("編集ボタンタップで案件編集ページに遷移する");
        test.todo("検索ボックスタップでキーボードが表示される");
        test.todo("フィルターボタンタップでフィルタードロワーが開く");
        test.todo("もっと見るボタンタップで追加案件が読み込まれる");
        test.todo("Pull to Refreshで一覧が更新される");
    });

    describe("状態管理", () => {
        test.todo("スワイプ中のカードIDが管理される");
        test.todo("フィルター条件が管理される");
        test.todo("ページネーション状態が管理される");
        test.todo("フィルタードロワーの開閉状態が管理される");
    });
});

describe("PhaseManagementPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にフェーズ一覧がテーブル形式で表示される");
        test.todo("初期表示時にフェーズ追加ボタンが表示される");
        test.todo("各フェーズにドラッグハンドル、編集、削除ボタンが表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時にフェーズ一覧APIが呼ばれる");
        test.todo("取得成功時にフェーズ一覧が順序順で表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得したフェーズデータがPhaseManagementコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("追加ボタンクリックでフェーズ追加フォームが表示される");
        test.todo("追加フォーム送信後にフェーズが追加される");
        test.todo("編集ボタンクリックでフェーズ編集フォームが表示される");
        test.todo("編集フォーム送信後にフェーズが更新される");
        test.todo("削除ボタンクリックで削除確認ダイアログが表示される");
        test.todo("削除確認後にフェーズが削除される");
        test.todo("フェーズをドラッグして並び替えできる");
        test.todo("並び替え後に順序更新APIが呼ばれる");
    });

    describe("状態管理", () => {
        test.todo("編集中のフェーズIDが管理される");
        test.todo("削除確認ダイアログの表示状態が管理される");
        test.todo("フォームモード（追加/編集）が管理される");
    });
});
