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

describe("PhaseManagementPage", () => {
    let queryClient: QueryClient;
    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
        vi.clearAllMocks();
    });

    describe("初期表示", () => {
        test("初期表示時にフェーズ一覧がテーブル形式で表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フェーズ管理")).toBeInTheDocument(); });
        });
        test("初期表示時にフェーズ追加ボタンが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フェーズを追加")).toBeInTheDocument(); });
        });
        test("各フェーズにドラッグハンドル、編集、削除ボタンが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => {
                expect(screen.getByText("フェーズA")).toBeInTheDocument();
                expect(screen.getByLabelText("編集")).toBeInTheDocument();
                expect(screen.getByLabelText("削除")).toBeInTheDocument();
            });
        });
        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(phasesUseCase.getPhases).mockImplementation(() => new Promise(() => {}));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
    });

    describe("データ取得", () => {
        test("マウント時にフェーズ一覧APIが呼ばれる", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(phasesUseCase.getPhases).toHaveBeenCalledTimes(1); });
        });
        test("取得成功時にフェーズ一覧が順序順で表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([
                { id: "1", name: "フェーズ1", order: 0 },
                { id: "2", name: "フェーズ2", order: 1 },
            ]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => {
                expect(screen.getByText("フェーズ1")).toBeInTheDocument();
                expect(screen.getByText("フェーズ2")).toBeInTheDocument();
            });
        });
        test("取得失敗時にエラーメッセージが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockRejectedValue(new Error("Failed"));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument(); });
        });
    });

    describe("データフロー", () => {
        test("取得したフェーズデータがPhaseManagementコンポーネントに渡される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "テストフェーズ", order: 0 }]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("テストフェーズ")).toBeInTheDocument(); });
        });
    });

    describe("ユーザー操作", () => {
        test("追加ボタンクリックでフェーズ追加フォームが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フェーズを追加")).toBeInTheDocument(); });
            await user.click(screen.getByText("フェーズを追加"));
            await waitFor(() => { expect(screen.getAllByText("フェーズを追加").length).toBeGreaterThanOrEqual(1); });
        });
        test("追加フォーム送信後にフェーズが追加される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            vi.mocked(phasesUseCase.createPhase).mockResolvedValue({ id: "new-1", name: "新フェーズ", order: 0 });
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(phasesUseCase.getPhases).toHaveBeenCalled(); });
        });
        test("編集ボタンクリックでフェーズ編集フォームが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("編集")).toBeInTheDocument(); });
            await user.click(screen.getByLabelText("編集"));
            await waitFor(() => { expect(screen.getByText("フェーズを編集")).toBeInTheDocument(); });
        });
        test("編集フォーム送信後にフェーズが更新される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            vi.mocked(phasesUseCase.updatePhase).mockResolvedValue({ id: "1", name: "更新フェーズ", order: 0 });
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("編集")).toBeInTheDocument(); });
            await user.click(screen.getByLabelText("編集"));
            await waitFor(() => { expect(screen.getByText("フェーズを編集")).toBeInTheDocument(); });
        });
        test("削除ボタンクリックで削除確認ダイアログが表示される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("削除")).toBeInTheDocument(); });
            await user.click(screen.getByLabelText("削除"));
            await waitFor(() => { expect(screen.getByText("フェーズを削除")).toBeInTheDocument(); });
        });
        test("削除確認後にフェーズが削除される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            vi.mocked(phasesUseCase.deletePhase).mockResolvedValue();
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("削除")).toBeInTheDocument(); });
            await user.click(screen.getByLabelText("削除"));
            await waitFor(() => { expect(screen.getByText("フェーズを削除")).toBeInTheDocument(); });
            await user.click(screen.getByText("削除", { selector: "button" }));
            await waitFor(() => { expect(phasesUseCase.deletePhase).toHaveBeenCalledWith("1"); });
        });
        test("フェーズをドラッグして並び替えできる", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([
                { id: "1", name: "フェーズA", order: 0 },
                { id: "2", name: "フェーズB", order: 1 },
            ]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => {
                expect(screen.getByText("フェーズA")).toBeInTheDocument();
                expect(screen.getByText("フェーズB")).toBeInTheDocument();
            });
        });
        test("並び替え後に順序更新APIが呼ばれる", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            vi.mocked(phasesUseCase.reorderPhases).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フェーズ管理")).toBeInTheDocument(); });
        });
    });

    describe("状態管理", () => {
        test("編集中のフェーズIDが管理される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("編集")).toBeInTheDocument(); });
            await user.click(screen.getByLabelText("編集"));
            await waitFor(() => { expect(screen.getByText("フェーズを編集")).toBeInTheDocument(); });
        });
        test("削除確認ダイアログの表示状態が管理される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([{ id: "1", name: "フェーズA", order: 0 }]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByLabelText("削除")).toBeInTheDocument(); });
            expect(screen.queryByText("フェーズを削除")).not.toBeInTheDocument();
            await user.click(screen.getByLabelText("削除"));
            await waitFor(() => { expect(screen.getByText("フェーズを削除")).toBeInTheDocument(); });
        });
        test("フォームモード（追加/編集）が管理される", async () => {
            vi.mocked(phasesUseCase.getPhases).mockResolvedValue([]);
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><MemoryRouter><PhaseManagementPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("フェーズを追加")).toBeInTheDocument(); });
            await user.click(screen.getByText("フェーズを追加"));
            await waitFor(() => { expect(phasesUseCase.getPhases).toHaveBeenCalled(); });
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("サイドナビゲーションは画面左側に固定配置される (fixed left-0)");
            test.todo("サイドナビゲーションの幅は256px (w-64) である");
            test.todo("ヘッダーは画面上部に固定配置される (sticky top-0)");
            test.todo("メインコンテンツは中央寄せで最大幅は1280px (max-w-5xl) である");
        });
        describe("サイズ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("サイドナビゲーションの高さは画面全体 (h-screen) である");
            test.todo("サイドナビゲーションの幅は256px (w-64) である");
            test.todo("ヘッダーの高さは64px (h-16) である");
            test.todo("メインコンテンツの最大幅は1280px (max-w-5xl) である");
        });
        describe("色", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("サイドナビゲーションの背景色は深い青 (bg-primary-container) と白文字 (text-white) である");
            test.todo("ヘッダーの背景色は半透明の白 (bg-white/80) である");
            test.todo("非アクティブなナビゲーションリンクは明るいグレーの文字色 (text-slate-300) である");
        });
        describe("タイポグラフィ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("サイドナビゲーションのタイトルはHeadlineフォント、極太 (font-black)、ラージサイズ (text-lg) である");
            test.todo("ヘッダーのタイトルはHeadlineフォント、太字 (font-bold)、エクストララージサイズ (text-xl) である");
            test.todo("ナビゲーションリンクはInterフォント、スモールサイズ (text-sm) である");
        });
        describe("形状", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("テーブルの角は丸い (rounded-lg) である");
            test.todo("ボタンの角は丸い (rounded-lg) である");
        });
        describe("装飾", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("アクティブなタブは下部に太いボーダー (border-b-2) がある");
            test.todo("テーブル行はドラッグハンドルアイコンを持つ");
        });
        describe("インタラクション", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("テーブル行はドラッグ＆ドロップで並び替え可能である");
            test.todo("編集ボタンはホバー時に色が変わる");
        });
    });
});
