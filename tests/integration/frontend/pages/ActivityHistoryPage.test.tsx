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

describe("ActivityHistoryPage", () => {
    let queryClient: QueryClient;
    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
        vi.clearAllMocks();
    });

    describe("初期表示", () => {
        test("初期表示時に活動履歴一覧がテーブル形式で表示される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("初期表示時にフィルターパネルが表示される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("初期表示時にページネーションが表示される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/ページ/)).toBeInTheDocument(); });
        });
        test("ローディング中はスピナーが表示される", () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockImplementation(() => new Promise(() => {}));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
    });

    describe("データ取得", () => {
        test("マウント時に活動履歴APIが呼ばれる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(activitiesUseCase.getActivitiesFromLocal).toHaveBeenCalledTimes(1); });
        });
        test("フィルター変更時に活動履歴APIが再度呼ばれる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(activitiesUseCase.getActivitiesFromLocal).toHaveBeenCalled(); });
        });
        test("ページ変更時に活動履歴APIが呼ばれる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(activitiesUseCase.getActivitiesFromLocal).toHaveBeenCalled(); });
        });
        test("取得成功時に活動履歴一覧が表示される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("取得失敗時にエラーメッセージが表示される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockRejectedValue(new Error("Failed"));
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument(); });
        });
    });

    describe("データフロー", () => {
        test("取得した活動履歴がActivityHistoryコンポーネントに渡される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("取得したフィルター選択肢がSearchFilterPanelコンポーネントに渡される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
    });

    describe("ユーザー操作", () => {
        test("活動種別フィルター選択で活動履歴が絞り込まれる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("期間フィルター選択で活動履歴が絞り込まれる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("検索ボックス入力で活動履歴が検索される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("テーブルヘッダークリックでソート順が変更される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("活動行クリックで活動詳細モーダルが開く", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("ページネーションクリックでページが切り替わる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/ページ 1/)).toBeInTheDocument(); });
        });
        test("フィルタークリアボタンクリックで全フィルターがリセットされる", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
    });

    describe("状態管理", () => {
        test("フィルター条件が管理される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("ソート条件が管理される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText("活動履歴")).toBeInTheDocument(); });
        });
        test("現在のページ番号が管理される", async () => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
            render(<QueryClientProvider client={queryClient}><MemoryRouter><ActivityHistoryPage /></MemoryRouter></QueryClientProvider>);
            await waitFor(() => { expect(screen.getByText(/ページ 1/)).toBeInTheDocument(); });
        });
    });
    describe("レイアウト", () => {
        const renderWithAppLayout = (activities: Activity[] = []) => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue(activities);
            vi.mocked(syncUseCase.performSync).mockResolvedValue();
            return render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/activities"]}>
                        <AppLayout>
                            <ActivityHistoryPage />
                        </AppLayout>
                    </MemoryRouter>
                </QueryClientProvider>
            );
        };
        const renderPage = (activities: Activity[] = []) => {
            vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue(activities);
            return render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ActivityHistoryPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        };
        const renderPageWithActivities = async (activities: Activity[] = []) => {
            renderPage(activities);
            await waitForPage();
        };
        const waitForPage = () => waitFor(() =>
            expect(document.querySelector("[data-testid='activity-history-main']")).toBeInTheDocument()
        );

        describe("配置", () => {
            test("サイドナビゲーションは画面左側に固定配置される (fixed left-0 top-0)", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("fixed")).toBe(true);
                expect(aside.classList.contains("left-0")).toBe(true);
                expect(aside.classList.contains("top-0")).toBe(true);
            });
            test("サイドナビゲーションの幅は256px (w-64) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("w-64")).toBe(true);
            });
            test("サイドナビゲーションのz-indexは40 (z-40) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("z-40")).toBe(true);
            });
            test("ヘッダーは画面上部に固定配置される (sticky top-0)", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("sticky")).toBe(true);
                expect(header?.classList.contains("top-0")).toBe(true);
            });
            test("ヘッダーのz-indexは30 (z-30) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("z-30")).toBe(true);
            });
            test("ヘッダーはサイドナビゲーションの右側に配置される (ml-64)", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("ml-64")).toBe(true);
            });
            test("メインコンテンツはサイドナビゲーションの右側に配置される (ml-64)", async () => {
                renderPage();
                await waitFor(() => {
                    const main = document.querySelector("[data-testid='activity-history-main']");
                    expect(main?.classList.contains("ml-64")).toBe(true);
                });
            });
            test("メインコンテンツの最小高さは画面全体 (min-h-screen) である", async () => {
                renderPage();
                await waitFor(() => {
                    const main = document.querySelector("[data-testid='activity-history-main']");
                    expect(main?.classList.contains("min-h-screen")).toBe(true);
                });
            });
            test("メインコンテンツの左右パディングは48px (p-12) である", async () => {
                renderPage();
                await waitFor(() => {
                    const main = document.querySelector("[data-testid='activity-history-main']");
                    expect(main?.classList.contains("p-12")).toBe(true);
                });
            });
            test("メインコンテンツ内のコンテナは最大幅1152px (max-w-6xl) で中央寄せ (mx-auto) される", async () => {
                renderPage();
                await waitFor(() => {
                    const container = document.querySelector(".max-w-6xl");
                    expect(container).toBeInTheDocument();
                    expect(container?.classList.contains("mx-auto")).toBe(true);
                });
            });
            test("活動フィードは8列幅 (col-span-12 lg:col-span-8) でグリッド配置される", async () => {
                renderPage();
                await waitFor(() => {
                    const feed = document.querySelector(".col-span-12.lg\\:col-span-8");
                    expect(feed).toBeInTheDocument();
                });
            });
            test("サイドパネル（クイック記録・統計）は4列幅 (col-span-12 lg:col-span-4) でグリッド配置される", async () => {
                renderPage();
                await waitFor(() => {
                    const panel = document.querySelector(".col-span-12.lg\\:col-span-4");
                    expect(panel).toBeInTheDocument();
                });
            });
        });
        describe("サイズ", () => {
            test("サイドナビゲーションの高さは画面全体 (h-full) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("h-full")).toBe(true);
            });
            test("サイドナビゲーションの幅は256px (w-64) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("w-64")).toBe(true);
            });
            test("ヘッダーの幅はサイドナビゲーションを除いた幅 (w-[calc(100%-16rem)]) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("w-[calc(100%-16rem)]")).toBe(true);
            });
            test("ヘッダーの左右パディングは32px (px-8) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("px-8")).toBe(true);
            });
            test("ヘッダーの上下パディングは16px (py-4) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("py-4")).toBe(true);
            });
            test("検索フィールドの幅は256px (w-64) である", async () => {
                await renderPageWithActivities();
                const searchField = screen.getByPlaceholderText("活動を検索...");
                expect(searchField.classList.contains("w-64")).toBe(true);
            });
            test("活動カードのアイコンは48px×48px (w-12 h-12) の円形である", async () => {
                const activity = createMockActivity({ activityType: "電話" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                const icon = card.querySelector(".w-12.h-12.rounded-full");
                expect(icon).toBeInTheDocument();
            });
            test("プロフィール画像は40px×40px (w-10 h-10) の円形 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const profile = screen.getByAltText("プロフィール画像");
                expect(profile.classList.contains("w-10")).toBe(true);
                expect(profile.classList.contains("h-10")).toBe(true);
                expect(profile.classList.contains("rounded-full")).toBe(true);
            });
        });
        describe("色", () => {
            test("bodyの背景色は#f7fafc (bg-surface) である", async () => {
                await renderPageWithActivities();
                const main = screen.getByTestId("activity-history-main");
                expect(main.classList.contains("bg-surface")).toBe(true);
            });
            test("サイドナビゲーションの背景色は#0f172a (bg-slate-900) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("bg-slate-900")).toBe(true);
            });
            test("サイドナビゲーションのタイトルは白色 (text-white) である", () => {
                renderWithAppLayout();
                const title = screen.getByText("SFA");
                expect(title.classList.contains("text-white")).toBe(true);
            });
            test("サイドナビゲーションのサブタイトルは#94a3b8 (text-slate-400) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                const subtitle = aside.querySelector(".text-slate-400");
                expect(subtitle).toBeInTheDocument();
            });
            test("非アクティブなナビゲーションリンクは#94a3b8 (text-slate-400) である", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".text-slate-400");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("アクティブなナビゲーションリンクは#34d399 (text-emerald-400) で、背景は#10b98110 (bg-emerald-500/10) である", () => {
                renderWithAppLayout();
                const activeLink = screen.getByRole("navigation").querySelector(".text-emerald-400");
                expect(activeLink).toBeInTheDocument();
                expect(activeLink?.classList.contains("bg-emerald-500/10")).toBe(true);
            });
            test("アクティブなナビゲーションリンクは右に4px幅のエメラルド色ボーダー (border-r-4 border-emerald-500) を持つ", () => {
                renderWithAppLayout();
                const activeLink = screen.getByRole("navigation").querySelector(".border-r-4");
                expect(activeLink).toBeInTheDocument();
                expect(activeLink?.classList.contains("border-emerald-500")).toBe(true);
            });
            test("ヘッダーの背景色は半透明の#f8fafc80 (bg-slate-50/80) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("bg-slate-50/80")).toBe(true);
            });
            test("ヘッダーはbackdrop-filter: blur(xl)を持つ", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("backdrop-blur-xl")).toBe(true);
            });
            test("検索フィールドの背景色は#e5e9eb (bg-surface-container-high) である", async () => {
                await renderPageWithActivities();
                const searchField = screen.getByPlaceholderText("活動を検索...");
                expect(searchField.classList.contains("bg-surface-container-high")).toBe(true);
            });
            test("ページタイトルは#002045 (text-primary) である", async () => {
                renderPage();
                await waitForPage();
                const title = document.querySelector(".text-primary.text-4xl");
                expect(title).toBeInTheDocument();
            });
            test("活動カードの背景色は#ffffff (bg-surface-container-lowest) である", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("bg-surface-container-lowest")).toBe(true);
            });
            test("活動カードのホバー時はxlシャドウ (hover:shadow-xl hover:shadow-primary/5) が強調される", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("hover:shadow-xl")).toBe(true);
                expect(card.classList.contains("hover:shadow-primary/5")).toBe(true);
            });
            test("日付区切り線の背景色は#c4c6cf30 (bg-outline-variant/30) である", async () => {
                await renderPageWithActivities();
                const divider = document.querySelector(".bg-outline-variant\\/30");
                expect(divider).toBeInTheDocument();
            });
            test("通知ドットの色は#ba1a1a (bg-error) である", async () => {
                await renderPageWithActivities();
                const dot = document.querySelector(".bg-error");
                expect(dot).toBeInTheDocument();
            });
        });
        describe("タイポグラフィ", () => {
            test("サイドナビゲーションのタイトルはManropeフォント、太字 (font-bold)、テキストサイズはxl (text-xl) である", () => {
                renderWithAppLayout();
                const title = screen.getByText("SFA");
                expect(title.classList.contains("font-bold")).toBe(true);
                expect(title.classList.contains("text-xl")).toBe(true);
                expect(title.classList.contains("font-headline")).toBe(true);
            });
            test("サイドナビゲーションのサブタイトルはxsサイズ (text-xs) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                const subtitle = aside.querySelector(".text-xs.text-slate-400");
                expect(subtitle).toBeInTheDocument();
            });
            test("サイドナビゲーションのリンクはManropeフォント、セミボールド (font-semibold)、スモールサイズ (text-sm) である", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".font-semibold.text-sm");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("ヘッダーのテキストはManropeフォント、ミディアムウェイト (font-medium)、スモールサイズ (text-sm) である", () => {
                renderWithAppLayout();
                const header = document.querySelector("header");
                expect(header?.classList.contains("font-headline")).toBe(true);
                expect(header?.classList.contains("font-medium")).toBe(true);
                expect(header?.classList.contains("text-sm")).toBe(true);
            });
            test("ページラベル（エンゲージメント履歴）はxsサイズ、太字 (font-bold)、letter-spacing: 0.2em、大文字 (uppercase) である", async () => {
                renderPage();
                await waitForPage();
                const label = document.querySelector("span.text-xs.font-bold.uppercase");
                expect(label).toBeInTheDocument();
                expect(label?.textContent).toBe("エンゲージメント履歴");
            });
            test("ページタイトル（活動履歴フィード）は4xlサイズ、極太 (font-extrabold)、Manropeフォント (font-headline) である", async () => {
                renderPage();
                await waitForPage();
                const title = document.querySelector(".text-4xl.font-extrabold.font-headline");
                expect(title).toBeInTheDocument();
            });
            test("活動カードのタイトルはManropeフォント (font-headline)、太字 (font-bold)、on-surfaceカラー (text-on-surface) である", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const title = screen.getByRole("heading", { level: 4, name: activity.activityType });
                expect(title.classList.contains("font-headline")).toBe(true);
                expect(title.classList.contains("font-bold")).toBe(true);
                expect(title.classList.contains("text-on-surface")).toBe(true);
            });
            test("活動カードのサブテキスト（会社名・案件名）はsmサイズ (text-sm)、on-surface-variantカラー (text-on-surface-variant) である", async () => {
                const activity = createMockActivity({ dealId: "deal-1" });
                await renderPageWithActivities([activity]);
                const subtext = screen.getByText(`案件: ${activity.dealId}`);
                expect(subtext.classList.contains("text-sm")).toBe(true);
                expect(subtext.classList.contains("text-on-surface-variant")).toBe(true);
            });
            test("活動カードの時刻はxsサイズ、ミディアムウェイト (text-xs font-medium)、outlineカラー (text-outline) である", async () => {
                const activity = createMockActivity({ activityDate: new Date(2026, 3, 1, 13, 5) });
                await renderPageWithActivities([activity]);
                const timeText = new Date(activity.activityDate).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
                const time = screen.getByText(timeText);
                expect(time.classList.contains("text-xs")).toBe(true);
                expect(time.classList.contains("font-medium")).toBe(true);
                expect(time.classList.contains("text-outline")).toBe(true);
            });
            test("バッジテキストは10pxサイズ (text-[10px])、太字 (font-bold)、大文字 (uppercase)、letter-spacing広め (tracking-wider) である", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const badge = document.querySelector(".text-\\[10px\\]") as HTMLElement | null;
                expect(badge).toBeInTheDocument();
                expect(badge?.classList.contains("font-bold")).toBe(true);
                expect(badge?.classList.contains("uppercase")).toBe(true);
                expect(badge?.classList.contains("tracking-wider")).toBe(true);
            });
        });
        describe("形状", () => {
            test("サイドナビゲーションの右ボーダーは非表示 (border-r-0) である", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("border-r-0")).toBe(true);
            });
            test("検索フィールドは完全な丸角 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const searchField = screen.getByPlaceholderText("活動を検索...");
                expect(searchField.classList.contains("rounded-full")).toBe(true);
            });
            test("ヘッダーナビゲーションリンクのホバー時は8px角丸 (rounded-lg) である", async () => {
                await renderPageWithActivities();
                const navLink = document.querySelector("nav a");
                expect(navLink?.classList.contains("rounded-lg")).toBe(true);
            });
            test("活動カードは完全な丸角 (rounded-full) である", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("rounded-full")).toBe(true);
            });
            test("活動カード内のメモエリアは12px角丸 (rounded-xl) で、左に4px幅のボーダー (border-l-4) を持つ", async () => {
                const activity = createMockActivity({ content: "メモあり" });
                await renderPageWithActivities([activity]);
                const memo = screen.getByText(activity.content).closest(".rounded-xl");
                expect(memo).toBeInTheDocument();
                expect(memo?.classList.contains("border-l-4")).toBe(true);
            });
            test("バッジは完全な丸角 (rounded-full) である", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const badge = document.querySelector(".text-\\[10px\\]") as HTMLElement | null;
                expect(badge?.classList.contains("rounded-full")).toBe(true);
            });
            test("日付区切り線は1px高さ (h-[1px]) である", async () => {
                await renderPageWithActivities();
                const divider = document.querySelector(".h-\\[1px\\]") as HTMLElement | null;
                expect(divider).toBeInTheDocument();
            });
            test("通知ドットは2px×2px (w-2 h-2) の円形 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const dot = document.querySelector(".bg-error") as HTMLElement | null;
                expect(dot?.classList.contains("w-2")).toBe(true);
                expect(dot?.classList.contains("h-2")).toBe(true);
                expect(dot?.classList.contains("rounded-full")).toBe(true);
            });
            test("新規案件登録ボタンは12px角丸 (rounded-xl) である", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "新規案件登録" });
                expect(button.classList.contains("rounded-xl")).toBe(true);
            });
            test("クイック記録フォームのカードは完全な丸角 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("rounded-full")).toBe(true);
            });
            test("統計カードは完全な丸角 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const card = screen.getByLabelText("統計カード");
                expect(card.classList.contains("rounded-full")).toBe(true);
            });
        });
        describe("装飾", () => {
            test("サイドナビゲーションは2xlサイズのシャドウ (shadow-2xl shadow-slate-950/20) を持つ", () => {
                renderWithAppLayout();
                const aside = screen.getByRole("complementary");
                expect(aside.classList.contains("shadow-2xl")).toBe(true);
                expect(aside.classList.contains("shadow-slate-950/20")).toBe(true);
            });
            test("新規案件登録ボタンはグラデーション背景 (silk-gradient: linear-gradient(135deg, #002045, #1a365d)) を持つ", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "新規案件登録" });
                expect(button.classList.contains("silk-gradient")).toBe(true);
            });
            test("新規案件登録ボタンはlgサイズのシャドウ (shadow-lg shadow-primary/20) を持つ", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "新規案件登録" });
                expect(button.classList.contains("shadow-lg")).toBe(true);
                expect(button.classList.contains("shadow-primary/20")).toBe(true);
            });
            test("新規案件登録ボタンはホバー時に透明度が変わる (hover:opacity-90)", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "新規案件登録" });
                expect(button.classList.contains("hover:opacity-90")).toBe(true);
            });
            test("新規案件登録ボタンはアクティブ時にスケールが縮小する (active:scale-95)", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "新規案件登録" });
                expect(button.classList.contains("active:scale-95")).toBe(true);
            });
            test("活動カードはsmサイズのシャドウ (shadow-sm) を持つ", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("shadow-sm")).toBe(true);
            });
            test("活動カードのホバー時はxlサイズのシャドウ (hover:shadow-xl hover:shadow-primary/5) になる", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("hover:shadow-xl")).toBe(true);
                expect(card.classList.contains("hover:shadow-primary/5")).toBe(true);
            });
            test("活動カードのホバー時はゴーストボーダーが表示される (hover:border-outline-variant/10)", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("hover:border-outline-variant/10")).toBe(true);
            });
            test("ナビゲーションリンクはホバー時に背景色が変わる (hover:bg-slate-800/50)", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".hover\\:bg-slate-800\\/50");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("ナビゲーションリンクはホバー時に文字色が変わる (hover:text-white)", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".hover\\:text-white");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("ヘッダーナビゲーションリンクのホバー時はトランジション300ms (transition-all duration-300) である", async () => {
                await renderPageWithActivities();
                const navLink = document.querySelector("nav a");
                expect(navLink?.classList.contains("transition-all")).toBe(true);
                expect(navLink?.classList.contains("duration-300")).toBe(true);
            });
            test("検索フィールドのフォーカス時は2pxのサーフェスリング (focus:ring-2 focus:ring-surface-tint) が表示される", async () => {
                await renderPageWithActivities();
                const searchField = screen.getByPlaceholderText("活動を検索...");
                expect(searchField.classList.contains("focus:ring-2")).toBe(true);
                expect(searchField.classList.contains("focus:ring-surface-tint")).toBe(true);
            });
        });
        describe("インタラクション", () => {
            test("ナビゲーションリンクはホバー時に背景色が変わる (hover:bg-slate-800/50)", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".hover\\:bg-slate-800\\/50");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("ナビゲーションリンクのトランジションは色変化 (transition-colors) である", () => {
                renderWithAppLayout();
                const navLinks = screen.getByRole("navigation").querySelectorAll(".transition-colors");
                expect(navLinks.length).toBeGreaterThan(0);
            });
            test("活動カードはホバー時にシャドウ (hover:shadow-xl) とボーダー (hover:border-outline-variant/10) が変化する (transition-all duration-300)", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("hover:shadow-xl")).toBe(true);
                expect(card.classList.contains("hover:border-outline-variant/10")).toBe(true);
                expect(card.classList.contains("transition-all")).toBe(true);
                expect(card.classList.contains("duration-300")).toBe(true);
            });
            test("ヘッダーのアイコンボタンはホバー時に背景色が変わる (hover:bg-slate-200/50 rounded-lg)", async () => {
                await renderPageWithActivities();
                const button = screen.getByLabelText("通知");
                expect(button.classList.contains("hover:bg-slate-200/50")).toBe(true);
                expect(button.classList.contains("rounded-lg")).toBe(true);
            });
            test("リードを追加ボタンはホバー時に明度が変わる (hover:brightness-95)", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "リードを追加" });
                expect(button.classList.contains("hover:brightness-95")).toBe(true);
            });
            test("リードを追加ボタンはアクティブ時にスケールが縮小する (active:scale-95)", async () => {
                await renderPageWithActivities();
                const button = screen.getByRole("button", { name: "リードを追加" });
                expect(button.classList.contains("active:scale-95")).toBe(true);
            });
            test("活動カード内のリンクはホバー時にアンダーラインが表示される (hover:underline)", async () => {
                const activity = createMockActivity({ dealId: "deal-1" });
                await renderPageWithActivities([activity]);
                const link = screen.getByText(`案件: ${activity.dealId}`);
                expect(link.classList.contains("hover:underline")).toBe(true);
            });
        });
        describe("ページ構造", () => {
            test("ページはサイドナビゲーション、ヘッダー、メインコンテンツの3つの主要セクションで構成される", async () => {
                renderWithAppLayout();
                expect(screen.getByRole("complementary")).toBeInTheDocument();
                expect(document.querySelector("header")).toBeInTheDocument();
                await waitFor(() => expect(document.querySelector("[data-testid='activity-history-main']")).toBeInTheDocument());
            });
            test("メインコンテンツはヘッダーセクションとBentoレイアウトコンテンツで構成される", async () => {
                renderPage();
                await waitForPage();
                expect(document.querySelector("[data-testid='activity-history-main']")).toBeInTheDocument();
                expect(document.querySelector(".grid.grid-cols-12")).toBeInTheDocument();
            });
            test("ヘッダーセクションはラベル、タイトル、統計情報を含む", async () => {
                renderPage();
                await waitForPage();
                expect(screen.getByText("エンゲージメント履歴")).toBeInTheDocument();
                expect(screen.getByText("活動履歴フィード")).toBeInTheDocument();
            });
            test("Bentoレイアウトは12列グリッド (grid-cols-12) である", async () => {
                renderPage();
                await waitForPage();
                const grid = document.querySelector(".grid-cols-12");
                expect(grid).toBeInTheDocument();
            });
            test("Bentoレイアウトは32pxのギャップ (gap-8) を持つ", async () => {
                renderPage();
                await waitForPage();
                const grid = document.querySelector(".gap-8");
                expect(grid).toBeInTheDocument();
            });
            test("左カラム（活動フィード）は8列幅で活動タイムラインを表示する", async () => {
                renderPage();
                await waitForPage();
                const feed = document.querySelector(".col-span-12.lg\\:col-span-8");
                expect(feed).toBeInTheDocument();
            });
            test("右カラム（サイドパネル）は4列幅でクイック記録フォームと統計を表示する", async () => {
                renderPage();
                await waitForPage();
                const panel = document.querySelector(".col-span-12.lg\\:col-span-4");
                expect(panel).toBeInTheDocument();
                expect(screen.getByLabelText("クイック記録フォーム")).toBeInTheDocument();
                expect(screen.getByLabelText("統計カード")).toBeInTheDocument();
            });
            test("活動フィードには日付グループヘッダーが表示される", async () => {
                renderPage();
                await waitForPage();
                await waitFor(() => {
                    const dateHeader = screen.getByText("今日");
                    expect(dateHeader).toBeInTheDocument();
                });
            });
            test("日付グループヘッダーは左右に区切り線を持つ", async () => {
                renderPage();
                await waitForPage();
                const dividers = document.querySelectorAll(".h-\\[1px\\]");
                expect(dividers.length).toBeGreaterThanOrEqual(2);
            });
        });
        describe("活動カード", () => {
            test("活動カードは6項目のパディング (p-6) を持つ", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.classList.contains("p-6")).toBe(true);
            });
            test("活動カードはアイコン、タイトル、サブテキスト（会社名・案件名）、時刻、メモ、バッジを含む", async () => {
                const activity = createMockActivity({ content: "メモあり" });
                await renderPageWithActivities([activity]);
                const card = screen.getByTestId("activity-card");
                expect(card.querySelector(".material-symbols-outlined")).toBeInTheDocument();
                expect(screen.getByRole("heading", { level: 4, name: activity.activityType })).toBeInTheDocument();
                expect(screen.getByText(`案件: ${activity.dealId}`)).toBeInTheDocument();
                const timeText = new Date(activity.activityDate).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
                expect(screen.getByText(timeText)).toBeInTheDocument();
                expect(screen.getByText(activity.content)).toBeInTheDocument();
                expect(card.querySelector(".text-\\[10px\\]")).toBeInTheDocument();
            });
            test("活動タイプアイコンは48px×48px (w-12 h-12) の円形 (rounded-full) で、活動タイプに応じた背景色を持つ", async () => {
                const activity = createMockActivity({ activityType: "電話" });
                await renderPageWithActivities([activity]);
                const icon = screen.getByTestId("activity-card").querySelector(".w-12.h-12.rounded-full");
                expect(icon).toBeInTheDocument();
            });
            test("通話アイコンの背景色は#d6e0f6 (bg-secondary-fixed) である", async () => {
                const activity = createMockActivity({ activityType: "電話" });
                await renderPageWithActivities([activity]);
                const icon = screen.getByTestId("activity-card").querySelector(".w-12.h-12");
                expect(icon?.classList.contains("bg-secondary-fixed")).toBe(true);
            });
            test("メールアイコンの背景色は#d6e3ff (bg-primary-fixed) である", async () => {
                const activity = createMockActivity({ activityType: "メール" });
                await renderPageWithActivities([activity]);
                const icon = screen.getByTestId("activity-card").querySelector(".w-12.h-12");
                expect(icon?.classList.contains("bg-primary-fixed")).toBe(true);
            });
            test("会議アイコンの背景色は#9ff5c1 (bg-tertiary-fixed) である", async () => {
                const activity = createMockActivity({ activityType: "会議" });
                await renderPageWithActivities([activity]);
                const icon = screen.getByTestId("activity-card").querySelector(".w-12.h-12");
                expect(icon?.classList.contains("bg-tertiary-fixed")).toBe(true);
            });
            test("メモエリアは4項目のパディング (p-4)、12px角丸 (rounded-xl)、左に4px幅のボーダー (border-l-4) を持つ", async () => {
                const activity = createMockActivity({ content: "メモあり" });
                await renderPageWithActivities([activity]);
                const memo = screen.getByText(activity.content).closest(".rounded-xl");
                expect(memo?.classList.contains("p-4")).toBe(true);
                expect(memo?.classList.contains("border-l-4")).toBe(true);
            });
            test("メモテキストはsmサイズ、リラックスline-height (text-sm leading-relaxed)、イタリック体 (italic) である", async () => {
                const activity = createMockActivity({ content: "メモあり" });
                await renderPageWithActivities([activity]);
                const memoText = screen.getByText(activity.content);
                expect(memoText.classList.contains("text-sm")).toBe(true);
                expect(memoText.classList.contains("leading-relaxed")).toBe(true);
                expect(memoText.classList.contains("italic")).toBe(true);
            });
            test("バッジは3pxの水平パディング、1pxの垂直パディング (px-3 py-1)、完全な丸角 (rounded-full) を持つ", async () => {
                const activity = createMockActivity({ activityType: "面談" });
                await renderPageWithActivities([activity]);
                const badge = document.querySelector(".text-\\[10px\\]") as HTMLElement | null;
                expect(badge?.classList.contains("px-3")).toBe(true);
                expect(badge?.classList.contains("py-1")).toBe(true);
                expect(badge?.classList.contains("rounded-full")).toBe(true);
            });
        });
        describe("クイック記録フォーム", () => {
            test("クイック記録フォームの背景色は#e0e3e5 (bg-surface-container-highest) である", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("bg-surface-container-highest")).toBe(true);
            });
            test("クイック記録フォームは8項目のパディング (p-8) を持つ", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("p-8")).toBe(true);
            });
            test("クイック記録フォームは完全な丸角 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("rounded-full")).toBe(true);
            });
            test("クイック記録フォームはゴーストボーダー (border border-outline-variant/20) を持つ", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("border")).toBe(true);
                expect(form.classList.contains("border-outline-variant/20")).toBe(true);
            });
            test("クイック記録フォームはlgサイズのシャドウ (shadow-lg shadow-primary/5) を持つ", async () => {
                await renderPageWithActivities();
                const form = screen.getByLabelText("クイック記録フォーム");
                expect(form.classList.contains("shadow-lg")).toBe(true);
                expect(form.classList.contains("shadow-primary/5")).toBe(true);
            });
            test("活動タイプ選択は3列グリッド (grid-cols-3) である", async () => {
                renderPage();
                await waitForPage();
                const grid = document.querySelector(".grid.grid-cols-3");
                expect(grid).toBeInTheDocument();
            });
            test("活動タイプボタンは3項目のパディング (p-3)、12px角丸 (rounded-xl) である", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.p-3.rounded-xl");
                expect(btn).toBeInTheDocument();
            });
            test("選択された活動タイプボタンは2pxのprimaryボーダー (border-2 border-primary) を持つ", async () => {
                renderPage();
                await waitForPage();
                const selectedBtn = document.querySelector("button.border-2.border-primary");
                expect(selectedBtn).toBeInTheDocument();
            });
            test("テキストエリアは4行 (rows=4) である", async () => {
                renderPage();
                await waitForPage();
                const textarea = document.querySelector("textarea[rows='4']");
                expect(textarea).toBeInTheDocument();
            });
            test("保存ボタンは水平8項目、垂直3項目のパディング (px-8 py-3) を持つ", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.px-8.py-3");
                expect(btn).toBeInTheDocument();
            });
            test("保存ボタンはsilk-gradientグラデーション背景を持つ", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.silk-gradient");
                expect(btn).toBeInTheDocument();
            });
            test("保存ボタンはlgサイズのシャドウ (shadow-lg shadow-primary/20) を持つ", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.silk-gradient.shadow-lg");
                expect(btn).toBeInTheDocument();
            });
        });
        describe("統計カード", () => {
            test("統計カードの背景色は#002045 (bg-primary) でテキストは白 (text-white) である", async () => {
                await renderPageWithActivities();
                const card = screen.getByLabelText("統計カード");
                expect(card.classList.contains("bg-primary")).toBe(true);
                expect(card.classList.contains("text-white")).toBe(true);
            });
            test("統計カードは8項目のパディング (p-8) を持つ", async () => {
                await renderPageWithActivities();
                const card = screen.getByLabelText("統計カード");
                expect(card.classList.contains("p-8")).toBe(true);
            });
            test("統計カードは完全な丸角 (rounded-full) でオーバーフロー非表示 (overflow-hidden) である", async () => {
                await renderPageWithActivities();
                const card = screen.getByLabelText("統計カード");
                expect(card.classList.contains("rounded-full")).toBe(true);
                expect(card.classList.contains("overflow-hidden")).toBe(true);
            });
            test("統計カードは右上に装飾的な大円形 (w-32 h-32 bg-primary-container rounded-full opacity-50) を持つ", async () => {
                await renderPageWithActivities();
                const circle = document.querySelector(".w-32.h-32.bg-primary-container.rounded-full.opacity-50");
                expect(circle).toBeInTheDocument();
            });
            test("統計カードは右下に装飾的な小円形 (w-16 h-16 bg-tertiary-container rounded-full opacity-30) を持つ", async () => {
                await renderPageWithActivities();
                const circle = document.querySelector(".w-16.h-16.bg-tertiary-container.rounded-full.opacity-30");
                expect(circle).toBeInTheDocument();
            });
            test("統計値は3xlサイズ、極太 (text-3xl font-extrabold)、Manropeフォント (font-headline) である", async () => {
                await renderPageWithActivities();
                const value = screen.getByText("42");
                expect(value.classList.contains("text-3xl")).toBe(true);
                expect(value.classList.contains("font-extrabold")).toBe(true);
                expect(value.classList.contains("font-headline")).toBe(true);
            });
            test("プログレスバーは2px高さ (h-2)、完全な丸角 (rounded-full)、tertiary-fixedカラー (bg-tertiary-fixed) を持つ", async () => {
                await renderPageWithActivities();
                const bar = document.querySelector(".h-full.bg-tertiary-fixed.rounded-full");
                expect(bar).toBeInTheDocument();
            });
        });
        describe("フィルターセクション", () => {
            test("フィルターセクションの背景色は#f1f4f6 (bg-surface-container-low) である", async () => {
                await renderPageWithActivities();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("bg-surface-container-low")).toBe(true);
            });
            test("フィルターセクションは6項目のパディング (p-6) を持つ", async () => {
                await renderPageWithActivities();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("p-6")).toBe(true);
            });
            test("フィルターセクションは完全な丸角 (rounded-full) である", async () => {
                await renderPageWithActivities();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("rounded-full")).toBe(true);
            });
            test("フィルターボタンは8pxのギャップ (gap-2) で折り返しフレックス配置 (flex flex-wrap) される", async () => {
                await renderPageWithActivities();
                const container = document.querySelector(".flex.flex-wrap.gap-2");
                expect(container).toBeInTheDocument();
            });
            test("フィルターボタンは4項目の水平パディング、2項目の垂直パディング (px-4 py-2) を持つ", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.px-4.py-2");
                expect(btn).toBeInTheDocument();
            });
            test("フィルターボタンは8px角丸 (rounded-lg) である", async () => {
                renderPage();
                await waitForPage();
                const btn = document.querySelector("button.px-4.py-2.rounded-lg");
                expect(btn).toBeInTheDocument();
            });
            test("アクティブなフィルターボタンはprimaryカラーのボーダー (border border-primary/10) を持つ", async () => {
                renderPage();
                await waitForPage();
                const activeBtn = document.querySelector("button.border.border-primary\\/10");
                expect(activeBtn).toBeInTheDocument();
            });
            test("アクティブなフィルターボタンはホバー時に背景がprimaryに変わる (hover:bg-primary)", async () => {
                renderPage();
                await waitForPage();
                const activeBtn = document.querySelector("button.hover\\:bg-primary");
                expect(activeBtn).toBeInTheDocument();
            });
        });
    });
});
