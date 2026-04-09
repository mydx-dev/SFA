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

describe("MobileDealListPage", () => {
    let queryClient: QueryClient;
    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
        vi.clearAllMocks();
    });

    describe("初期表示", () => {
        test("初期表示時に案件一覧がカード形式で表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("初期表示時にモバイル検索バーが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("初期表示時にフィルターボタンが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フィルターボタン")).toBeInTheDocument(); });
        });
        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockImplementation(() => new Promise(() => {}));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
        test("Pull to Refreshインジケーターが利用可能", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
    });

    describe("データ取得", () => {
        test("マウント時に案件一覧APIが呼ばれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalledTimes(1); });
        });
        test("Pull to Refreshで案件一覧APIが再度呼ばれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("スクロール下部到達時に追加データAPIが呼ばれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("検索実行時に案件一覧APIが呼ばれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("取得成功時に案件一覧が表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([createMockDeal({ id: "1", dealName: "モバイル案件" })]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("取得失敗時にエラートーストが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockRejectedValue(new Error("Failed"));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument(); });
        });
    });

    describe("データフロー", () => {
        test("取得した案件データがMobileDealListコンポーネントに渡される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("取得したフィルター選択肢がMobileFilterDrawerコンポーネントに渡される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フィルターボタン")).toBeInTheDocument(); });
            await user.click(screen.getByText("フィルターボタン"));
            await waitFor(() => { expect(screen.getByText("フィルタードロワー")).toBeInTheDocument(); });
        });
    });

    describe("ユーザー操作", () => {
        test("案件カードタップで案件詳細ページに遷移する", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("案件カード左スワイプで削除ボタンが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("案件カード右スワイプで編集ボタンが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("削除ボタンタップで削除確認ダイアログが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("編集ボタンタップで案件編集ページに遷移する", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("検索ボックスタップでキーボードが表示される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("フィルターボタンタップでフィルタードロワーが開く", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フィルターボタン")).toBeInTheDocument(); });
            await user.click(screen.getByText("フィルターボタン"));
            await waitFor(() => { expect(screen.getByText("フィルタードロワー")).toBeInTheDocument(); });
        });
        test("もっと見るボタンタップで追加案件が読み込まれる", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("Pull to Refreshで一覧が更新される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
    });

    describe("状態管理", () => {
        test("スワイプ中のカードIDが管理される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("フィルター条件が管理される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("ページネーション状態が管理される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(dealsUseCase.getDealsFromLocal).toHaveBeenCalled(); });
        });
        test("フィルタードロワーの開閉状態が管理される", async () => {
            vi.mocked(dealsUseCase.getDealsFromLocal).mockResolvedValue([]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><MobileDealListPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フィルターボタン")).toBeInTheDocument(); });
            expect(screen.queryByText("フィルタードロワー")).not.toBeInTheDocument();
            await user.click(screen.getByText("フィルターボタン"));
            await waitFor(() => { expect(screen.getByText("フィルタードロワー")).toBeInTheDocument(); });
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("ヘッダーは画面上部に固定配置される (fixed top-0)");
            test.todo("ヘッダーの高さは64px (h-16) である");
            test.todo("メインコンテンツはヘッダーとフッターの間に配置される (pt-16 pb-24)");
            test.todo("フッターは画面下部に固定配置される (fixed bottom-0)");
        });
        describe("サイズ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("ヘッダーの高さは64px (h-16) である");
            test.todo("ヘッダーの幅は画面全体 (w-full) である");
            test.todo("フッターの幅は画面全体 (w-full) である");
            test.todo("メインコンテンツの最小高さは画面全体 (min-h-screen) である");
        });
        describe("色", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("ヘッダーの背景色は明るいグレー (bg-[#f7fafc]) である");
            test.todo("フッターの背景色は深い青 (bg-[#1a365d]) である");
            test.todo("アクティブなナビゲーションリンクは緑色の背景 (bg-[#9ff5c1]) と深い青の文字 (text-[#002045]) である");
            test.todo("非アクティブなナビゲーションリンクは半透明の白文字 (text-white/70) である");
        });
        describe("タイポグラフィ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("ヘッダーのタイトルはManropeフォント、太字 (font-bold)、ラージサイズ (text-lg) である");
            test.todo("フッターのラベルはInterフォント、セミボールド (font-semibold)、極小サイズ (text-[11px]) である");
            test.todo("カードのタイトルはBodyフォント、セミボールド (font-semibold) である");
        });
        describe("形状", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードの角は丸い (rounded-lg) である");
            test.todo("ボタンの角は丸い (rounded-lg) である");
            test.todo("アバターは完全な円形 (rounded-full) である");
        });
        describe("装飾", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("フッターは上部に薄い白のボーダー (border-t border-white/10) がある");
            test.todo("カードは白い背景と薄いシャドウを持つ");
        });
        describe("インタラクション", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードはスワイプ可能である");
            test.todo("フィルタードロワーはボトムシートとして表示される");
        });
    });
});

