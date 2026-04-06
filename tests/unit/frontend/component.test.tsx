import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../src/backend/domain/entity/Deal";

describe("TaskItemComponent", () => {
    describe("props", () => {
        test.todo("labelが渡された場合、ラベルテキストが表示される");
        test.todo("statusが'queued'の場合、'実行待ち'ボタンが表示される");
        test.todo("statusが'running'の場合、'実行中'ボタンが表示される");
        test.todo("statusが'failed'の場合、'リトライ'ボタンが表示される");
        test.todo("onRetryが渡された場合、'リトライ'ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("statusが'queued'のとき'実行待ち'ボタンが表示される");
        test.todo("statusが'running'のとき'実行中'ボタンが表示される");
        test.todo("statusが'failed'のとき'リトライ'ボタンが表示される");
        test.todo("statusが'queued'のときMenuItemが無効化される");
        test.todo("statusが'running'のときMenuItemが無効化される");
        test.todo("statusが'failed'のときMenuItemが有効である");
    });

    describe("状態管理", () => {
        test.todo("statusが'queued'から'failed'に変わると'リトライ'ボタンが表示される");
    });

    describe("インタラクション", () => {
        test.todo("'リトライ'ボタンクリックでonRetryイベントが発火する");
        test.todo("'実行待ち'ボタンはクリックできない");
        test.todo("'実行中'ボタンはクリックできない");
    });

    describe("副作用", () => {
        test.todo("マウント時にコンソールログが出力される");
    });
});

describe("TaskListComponent", () => {
    describe("props", () => {
        test.todo("taskSchedulerのタスク一覧を使用する");
    });

    describe("描画", () => {
        test.todo("タスクが存在しない場合はIconButtonが表示されない");
        test.todo("タスクが存在する場合はIconButtonが表示される");
        test.todo("タスクが存在する場合はバッジにタスク数が表示される");
        test.todo("メニューが閉じている状態では各タスクは表示されない");
    });

    describe("状態管理", () => {
        test.todo("IconButtonクリックでMenuが開く");
        test.todo("Menu外クリックでMenuが閉じる");
        test.todo("タスクが追加されるとバッジのカウントが増える");
    });

    describe("インタラクション", () => {
        test.todo("IconButtonクリックでMenuが表示される");
        test.todo("TaskItemの'リトライ'クリックでtaskScheduler.retryが呼ばれる");
        test.todo("taskScheduler.retryに対象タスクのIDが渡される");
    });

    describe("副作用", () => {
        test.todo("マウント時にtaskSchedulerのタスク一覧を取得する");
    });
});

describe("LeadListComponent", () => {
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

    describe("props", () => {
        test("leads配列が渡された場合、リード一覧が表示される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const leads = [
                createMockLead({ id: "1", name: "田中一郎" }),
                createMockLead({ id: "2", name: "佐藤花子" }),
            ];
            render(<LeadList leads={leads} onLeadClick={() => {}} />);
            
            expect(screen.getByText("田中一郎")).toBeInTheDocument();
            expect(screen.getByText("佐藤花子")).toBeInTheDocument();
        });

        test("leadsが空配列の場合、'リードがありません'が表示される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            render(<LeadList leads={[]} onLeadClick={() => {}} />);
            
            expect(screen.getByText("リードがありません")).toBeInTheDocument();
        });

        test("onLeadClickが渡された場合、リードクリックで呼ばれる", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const onLeadClick = vi.fn();
            const leads = [createMockLead({ id: "1", name: "田中一郎" })];
            render(<LeadList leads={leads} onLeadClick={onLeadClick} />);
            
            const leadItem = screen.getByText("田中一郎");
            await userEvent.click(leadItem);
            
            expect(onLeadClick).toHaveBeenCalledWith("1");
        });
    });

    describe("描画", () => {
        test("初期状態ではリード一覧が表示される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const leads = [createMockLead({ name: "山田太郎" })];
            render(<LeadList leads={leads} onLeadClick={() => {}} />);
            
            expect(screen.getByText("山田太郎")).toBeInTheDocument();
        });

        test("leadsが空の場合、空状態メッセージが表示される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            render(<LeadList leads={[]} onLeadClick={() => {}} />);
            
            expect(screen.getByText("リードがありません")).toBeInTheDocument();
        });

        test("各リードの氏名・会社名・ステータスが表示される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const leads = [
                createMockLead({
                    name: "田中一郎",
                    companyName: "テスト株式会社",
                    status: "対応中"
                })
            ];
            render(<LeadList leads={leads} onLeadClick={() => {}} />);
            
            expect(screen.getByText("田中一郎")).toBeInTheDocument();
            expect(screen.getByText("テスト株式会社")).toBeInTheDocument();
            expect(screen.getByText(/対応中/)).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test.todo("ステータスフィルター変更でリスト表示が変化する");
    });

    describe("インタラクション", () => {
        test("リードクリックでonLeadClickイベントが発火する", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const onLeadClick = vi.fn();
            const leads = [createMockLead({ id: "lead-123", name: "山田太郎" })];
            render(<LeadList leads={leads} onLeadClick={onLeadClick} />);
            
            await userEvent.click(screen.getByText("山田太郎"));
            
            expect(onLeadClick).toHaveBeenCalled();
        });

        test("クリックされたリードのIDがonLeadClickに渡される", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const onLeadClick = vi.fn();
            const leads = [createMockLead({ id: "lead-456", name: "佐藤花子" })];
            render(<LeadList leads={leads} onLeadClick={onLeadClick} />);
            
            await userEvent.click(screen.getByText("佐藤花子"));
            
            expect(onLeadClick).toHaveBeenCalledWith("lead-456");
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { LeadList } = await import("../../../src/frontend/component/lead/LeadList");
            const consoleSpy = vi.spyOn(console, "log");
            render(<LeadList leads={[]} onLeadClick={() => {}} />);
            
            // No special side effects expected on mount
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

describe("LeadFormComponent", () => {
    interface LeadFormValues {
        name: string;
        companyName: string;
        email: string;
        phoneNumber: string;
        status: "未対応" | "対応中" | "商談化" | "失注" | "顧客化";
    }

    describe("props", () => {
        test("initialValuesが渡された場合、フォームに初期値が設定される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const initialValues: LeadFormValues = {
                name: "山田太郎",
                companyName: "テスト株式会社",
                email: "yamada@test.com",
                phoneNumber: "03-1234-5678",
                status: "対応中"
            };
            render(<LeadForm initialValues={initialValues} onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByDisplayValue("山田太郎")).toBeInTheDocument();
            expect(screen.getByDisplayValue("テスト株式会社")).toBeInTheDocument();
            expect(screen.getByDisplayValue("yamada@test.com")).toBeInTheDocument();
            expect(screen.getByDisplayValue("03-1234-5678")).toBeInTheDocument();
        });

        test("initialValuesが未指定の場合、フォームは空になる", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const nameInput = screen.getByLabelText(/氏名/);
            expect(nameInput).toHaveValue("");
        });

        test("onSubmitが渡された場合、フォーム送信で呼ばれる", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const onSubmit = vi.fn();
            render(<LeadForm onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/氏名/), "田中一郎");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const onCancel = vi.fn();
            render(<LeadForm onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("描画", () => {
        test("初期状態では氏名・会社名・メールアドレス・電話番号のフォームが表示される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
            expect(screen.getByLabelText(/会社名/)).toBeInTheDocument();
            expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
            expect(screen.getByLabelText(/電話番号/)).toBeInTheDocument();
        });

        test("ステータス選択肢が表示される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/ステータス/)).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("氏名入力で状態が更新される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const nameInput = screen.getByLabelText(/氏名/);
            await userEvent.type(nameInput, "佐藤花子");
            
            expect(nameInput).toHaveValue("佐藤花子");
        });

        test("ステータス変更で状態が更新される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const statusSelect = screen.getByLabelText(/ステータス/);
            await userEvent.click(statusSelect);
            await userEvent.click(screen.getByRole("option", { name: "対応中" }));
            
            expect(statusSelect).toHaveTextContent("対応中");
        });
    });

    describe("インタラクション", () => {
        test("送信ボタンクリックでonSubmitが呼ばれる", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const onSubmit = vi.fn();
            render(<LeadForm onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/氏名/), "山田太郎");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onSubmitにフォームの入力値が渡される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const onSubmit = vi.fn();
            render(<LeadForm onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/氏名/), "田中一郎");
            await userEvent.type(screen.getByLabelText(/会社名/), "テスト株式会社");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "田中一郎",
                    companyName: "テスト株式会社"
                })
            );
        });

        test("キャンセルボタンクリックでonCancelが呼ばれる", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const onCancel = vi.fn();
            render(<LeadForm onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });

        test("氏名が空の場合、バリデーションエラーが表示される", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/氏名は必須です/)).toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { LeadForm } = await import("../../../src/frontend/component/lead/LeadForm");
            const consoleSpy = vi.spyOn(console, "log");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

describe("DealListComponent", () => {
    const createMockDeal = (overrides?: Partial<Deal>): Deal => {
        return new Deal(
            overrides?.id ?? "deal-1",
            overrides?.dealName ?? "テスト案件",
            overrides?.leadId ?? "lead-1",
            overrides?.status ?? "提案",
            overrides?.amount ?? 1000000,
            overrides?.expectedCloseDate ?? new Date(),
            overrides?.assigneeId ?? "user-1",
            overrides?.createdAt ?? new Date(),
            overrides?.updatedAt ?? new Date()
        );
    };

    describe("props", () => {
        test("deals配列が渡された場合、案件一覧が表示される", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const deals = [
                createMockDeal({ id: "1", dealName: "案件A" }),
                createMockDeal({ id: "2", dealName: "案件B" }),
            ];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件A")).toBeInTheDocument();
            expect(screen.getByText("案件B")).toBeInTheDocument();
        });

        test("dealsが空配列の場合、'案件がありません'が表示される", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });

        test("onDealClickが渡された場合、案件クリックで呼ばれる", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "1", dealName: "案件A" })];
            render(<DealList deals={deals} onDealClick={onDealClick} />);
            
            await userEvent.click(screen.getByText("案件A"));
            
            expect(onDealClick).toHaveBeenCalledWith("1");
        });
    });

    describe("描画", () => {
        test("初期状態では案件一覧が表示される", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const deals = [createMockDeal({ dealName: "テスト案件" })];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("テスト案件")).toBeInTheDocument();
        });

        test("各案件の案件名・ステータス・金額が表示される", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const deals = [
                createMockDeal({
                    dealName: "重要案件",
                    status: "交渉",
                    amount: 5000000
                })
            ];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("重要案件")).toBeInTheDocument();
            expect(screen.getByText(/交渉/)).toBeInTheDocument();
            expect(screen.getByText(/¥5,000,000/)).toBeInTheDocument();
        });

        test("dealsが空の場合、空状態メッセージが表示される", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test.todo("ステータスフィルター変更でリスト表示が変化する");
    });

    describe("インタラクション", () => {
        test("案件クリックでonDealClickイベントが発火する", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-123", dealName: "テスト案件" })];
            render(<DealList deals={deals} onDealClick={onDealClick} />);
            
            await userEvent.click(screen.getByText("テスト案件"));
            
            expect(onDealClick).toHaveBeenCalledWith("deal-123");
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { DealList } = await import("../../../src/frontend/component/deal/DealList");
            const consoleSpy = vi.spyOn(console, "log");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

describe("ActivityFormComponent", () => {
    interface ActivityFormValues {
        dealId: string;
        activityType: "面談" | "電話" | "メール" | "その他";
        activityDate: string;
        content: string;
    }

    describe("props", () => {
        test("dealIdが渡された場合、案件IDが設定される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const onSubmit = vi.fn();
            render(<ActivityForm dealId="deal-123" onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/内容/), "テスト内容");
            await userEvent.type(screen.getByLabelText(/活動日/), "2026-04-15");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    dealId: "deal-123"
                })
            );
        });

        test("initialValuesが渡された場合、フォームに初期値が設定される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const initialValues: Partial<ActivityFormValues> = {
                activityType: "面談",
                activityDate: "2026-04-01",
                content: "初回打ち合わせ"
            };
            render(
                <ActivityForm
                    dealId="deal-1"
                    initialValues={initialValues}
                    onSubmit={() => {}}
                    onCancel={() => {}}
                />
            );
            
            expect(screen.getByDisplayValue("初回打ち合わせ")).toBeInTheDocument();
        });

        test("onSubmitが渡された場合、フォーム送信で呼ばれる", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const onSubmit = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/内容/), "テスト活動");
            await userEvent.type(screen.getByLabelText(/活動日/), "2026-04-15");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const onCancel = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("描画", () => {
        test("活動種別・活動日・内容のフォームが表示される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/活動種別/)).toBeInTheDocument();
            expect(screen.getByLabelText(/活動日/)).toBeInTheDocument();
            expect(screen.getByLabelText(/内容/)).toBeInTheDocument();
        });

        test("活動種別は選択肢から選べる", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            const activityTypeSelect = screen.getByLabelText(/活動種別/);
            await userEvent.click(activityTypeSelect);
            
            expect(screen.getByRole("option", { name: "面談" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "電話" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "メール" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "その他" })).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("活動種別変更で状態が更新される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            const activityTypeSelect = screen.getByLabelText(/活動種別/);
            await userEvent.click(activityTypeSelect);
            await userEvent.click(screen.getByRole("option", { name: "電話" }));
            
            expect(activityTypeSelect).toHaveTextContent("電話");
        });

        test("活動日変更で状態が更新される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            const dateInput = screen.getByLabelText(/活動日/);
            await userEvent.type(dateInput, "2026-04-15");
            
            expect(dateInput).toHaveValue("2026-04-15");
        });
    });

    describe("インタラクション", () => {
        test("送信ボタンクリックでonSubmitが呼ばれる", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const onSubmit = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/内容/), "打ち合わせ");
            await userEvent.type(screen.getByLabelText(/活動日/), "2026-04-15");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("キャンセルボタンクリックでonCancelが呼ばれる", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const onCancel = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });

        test("内容が空の場合、バリデーションエラーが表示される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/内容は必須です/)).toBeInTheDocument();
        });

        test("活動日が未入力の場合、バリデーションエラーが表示される", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/活動日は必須です/)).toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { ActivityForm } = await import("../../../src/frontend/component/activity/ActivityForm");
            const consoleSpy = vi.spyOn(console, "log");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

describe("DealListTableComponent", () => {
    const createMockDeal = (overrides?: Partial<Deal>): Deal => {
        return new Deal(
            overrides?.id ?? "deal-1",
            overrides?.dealName ?? "テスト案件",
            overrides?.leadId ?? "lead-1",
            overrides?.status ?? "提案",
            overrides && "amount" in overrides ? (overrides.amount as number | null) : 1000000,
            overrides && "expectedCloseDate" in overrides
                ? (overrides.expectedCloseDate as Date | null)
                : new Date("2026-12-31"),
            overrides?.assigneeId ?? "user-1",
            overrides?.createdAt ?? new Date(),
            overrides?.updatedAt ?? new Date()
        );
    };

    describe("props", () => {
        test("deals配列が渡された場合、案件一覧が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const deals = [
                createMockDeal({ id: "1", dealName: "案件A" }),
                createMockDeal({ id: "2", dealName: "案件B" }),
            ];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("案件A")).toBeInTheDocument();
            expect(screen.getByText("案件B")).toBeInTheDocument();
        });

        test("dealsが空配列の場合、'案件がありません'が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });

        test("onDealClickが渡された場合、案件クリックで呼ばれる", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "1", dealName: "案件A" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("案件A"));

            expect(onDealClick).toHaveBeenCalledWith("1");
        });
    });

    describe("描画", () => {
        test("テーブルヘッダーに案件名・ステータス・金額・予定クローズ日が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

            expect(screen.getByText("案件名")).toBeInTheDocument();
            expect(screen.getByText("ステータス")).toBeInTheDocument();
            expect(screen.getByText("金額")).toBeInTheDocument();
            expect(screen.getByText("予定クローズ日")).toBeInTheDocument();
        });

        test("各案件の案件名・ステータス・金額が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const deals = [
                createMockDeal({
                    dealName: "重要案件",
                    status: "交渉",
                    amount: 5000000,
                }),
            ];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("重要案件")).toBeInTheDocument();
            expect(screen.getByText("交渉")).toBeInTheDocument();
            expect(screen.getByText("¥5,000,000")).toBeInTheDocument();
        });

        test("amountがnullの場合、'未設定'が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ amount: null })];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getAllByText("未設定").length).toBeGreaterThan(0);
        });

        test("expectedCloseDateがnullの場合、'未設定'が表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ expectedCloseDate: null })];            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getAllByText("未設定").length).toBeGreaterThan(0);
        });

        test("予定クローズ日がyyyy/MM/dd形式で表示される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ expectedCloseDate: new Date("2026-12-31") })];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("2026/12/31")).toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("案件クリックでonDealClickイベントが発火する", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-123", dealName: "テスト案件" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("テスト案件"));

            expect(onDealClick).toHaveBeenCalled();
        });

        test("クリックされた案件のIDがonDealClickに渡される", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-456", dealName: "特定案件" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("特定案件"));

            expect(onDealClick).toHaveBeenCalledWith("deal-456");
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { DealListTable } = await import("../../../src/frontend/component/deal/DealListTable");
            const consoleSpy = vi.spyOn(console, "log");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});

// ========================================
// Stitch画面から設計されたコンポーネント
// ========================================

describe("DashboardComponent", () => {
    describe("props", () => {
        test.todo("metricsが渡された場合、KPI指標が表示される");
        test.todo("recentActivitiesが渡された場合、最近の活動が表示される");
        test.todo("upcomingTasksが渡された場合、今後のタスクが表示される");
        test.todo("salesChartDataが渡された場合、売上推移グラフが表示される");
        test.todo("pipelineDataが渡された場合、パイプライン状況が表示される");
    });

    describe("描画", () => {
        test.todo("初期状態では4つのKPIカード（総売上、案件数、リード数、成約率）が表示される");
        test.todo("売上推移グラフが月次で表示される");
        test.todo("パイプライン状況がステージ別に表示される");
        test.todo("最近の活動一覧が時系列で表示される");
        test.todo("今後のタスク一覧が期限順で表示される");
        test.todo("データがない場合、各セクションに'データがありません'が表示される");
    });

    describe("状態管理", () => {
        test.todo("期間フィルター変更でグラフデータが更新される");
        test.todo("KPIカードクリックで詳細ビューに遷移する");
    });

    describe("インタラクション", () => {
        test.todo("期間選択ドロップダウンで期間を変更できる");
        test.todo("活動アイテムクリックで活動詳細モーダルが開く");
        test.todo("タスクアイテムクリックでタスク詳細モーダルが開く");
        test.todo("'すべて表示'ボタンクリックで各セクションの一覧ページに遷移する");
    });

    describe("副作用", () => {
        test.todo("マウント時にダッシュボードデータを取得する");
        test.todo("期間変更時にグラフデータを再取得する");
    });
});

describe("KPICardComponent", () => {
    describe("props", () => {
        test.todo("titleが渡された場合、タイトルが表示される");
        test.todo("valueが渡された場合、値が表示される");
        test.todo("iconが渡された場合、アイコンが表示される");
        test.todo("trendが'up'の場合、上昇トレンドアイコンが表示される");
        test.todo("trendが'down'の場合、下降トレンドアイコンが表示される");
        test.todo("changePercentageが渡された場合、変化率が表示される");
        test.todo("onClickが渡された場合、カードクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("カードに背景色gradient効果が適用される");
        test.todo("値が大きな文字サイズで表示される");
        test.todo("変化率がパーセント表示される");
        test.todo("トレンドアイコンの色がトレンドに応じて変わる");
    });

    describe("インタラクション", () => {
        test.todo("カードクリックでonClickイベントが発火する");
        test.todo("ホバー時にカードが持ち上がるアニメーションが発生する");
    });
});

describe("SalesChartComponent", () => {
    describe("props", () => {
        test.todo("dataが渡された場合、チャートが表示される");
        test.todo("periodが'monthly'の場合、月次データが表示される");
        test.todo("periodが'quarterly'の場合、四半期データが表示される");
        test.todo("periodが'yearly'の場合、年次データが表示される");
        test.todo("chartTypeが'line'の場合、折れ線グラフが表示される");
        test.todo("chartTypeが'bar'の場合、棒グラフが表示される");
    });

    describe("描画", () => {
        test.todo("X軸に期間、Y軸に売上金額が表示される");
        test.todo("グラフにグリッドラインが表示される");
        test.todo("データポイントにツールチップが表示される");
        test.todo("凡例が表示される");
    });

    describe("インタラクション", () => {
        test.todo("データポイントホバーで詳細情報がツールチップに表示される");
        test.todo("期間変更ボタンクリックでチャートが更新される");
    });
});

describe("PipelineViewComponent", () => {
    describe("props", () => {
        test.todo("stagesが渡された場合、各ステージが表示される");
        test.todo("dealsが渡された場合、ステージ別に案件が表示される");
        test.todo("onDealMoveが渡された場合、案件移動時に呼ばれる");
    });

    describe("描画", () => {
        test.todo("各ステージがカラムとして水平に並ぶ");
        test.todo("各ステージのヘッダーにステージ名と案件数が表示される");
        test.todo("各ステージ内の案件がカード形式で縦に並ぶ");
        test.todo("案件カードに案件名、金額、担当者が表示される");
        test.todo("空のステージには'案件がありません'が表示される");
    });

    describe("状態管理", () => {
        test.todo("案件をドラッグ中の状態が管理される");
        test.todo("ドロップ可能なステージがハイライトされる");
    });

    describe("インタラクション", () => {
        test.todo("案件カードをドラッグして別ステージにドロップできる");
        test.todo("案件カードクリックで案件詳細モーダルが開く");
        test.todo("案件移動時にonDealMoveイベントが発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時に各ステージの案件数を集計する");
    });
});

describe("ActivityHistoryComponent", () => {
    describe("props", () => {
        test.todo("activitiesが渡された場合、活動履歴一覧が表示される");
        test.todo("filterOptionsが渡された場合、フィルター選択肢が表示される");
        test.todo("onActivityClickが渡された場合、活動クリックで呼ばれる");
        test.todo("pageInfoが渡された場合、ページネーションが表示される");
    });

    describe("描画", () => {
        test.todo("活動履歴がテーブル形式で表示される");
        test.todo("各行に活動日時、活動種別、案件名、内容、担当者が表示される");
        test.todo("活動種別ごとにアイコンと色が異なる");
        test.todo("テーブルヘッダーでソート可能な列にソートアイコンが表示される");
        test.todo("フィルターパネルが表示される");
    });

    describe("状態管理", () => {
        test.todo("フィルター条件変更で活動履歴が絞り込まれる");
        test.todo("ソート条件変更で活動履歴が並び替えられる");
        test.todo("ページ番号変更で表示される活動が切り替わる");
    });

    describe("インタラクション", () => {
        test.todo("活動種別フィルター選択で該当活動のみ表示される");
        test.todo("期間フィルター選択で期間内の活動のみ表示される");
        test.todo("検索ボックスに入力して活動を検索できる");
        test.todo("ヘッダークリックでソート順が切り替わる");
        test.todo("活動行クリックでonActivityClickイベントが発火する");
        test.todo("ページネーションボタンクリックでページが切り替わる");
    });

    describe("副作用", () => {
        test.todo("フィルター変更時に活動履歴を再取得する");
    });
});

describe("CustomerHierarchyTreeComponent", () => {
    describe("props", () => {
        test.todo("customersが渡された場合、顧客階層ツリーが表示される");
        test.todo("onCustomerSelectが渡された場合、顧客選択時に呼ばれる");
        test.todo("selectedCustomerIdが渡された場合、該当顧客がハイライトされる");
        test.todo("expandedIdsが渡された場合、指定された顧客ノードが展開される");
    });

    describe("描画", () => {
        test.todo("顧客が階層構造のツリー形式で表示される");
        test.todo("各ノードに顧客名と顧客種別が表示される");
        test.todo("子顧客を持つノードに展開/折りたたみアイコンが表示される");
        test.todo("選択中の顧客が背景色でハイライトされる");
        test.todo("展開されたノードの子要素がインデントして表示される");
    });

    describe("状態管理", () => {
        test.todo("ノード展開/折りたたみ状態が管理される");
        test.todo("選択中の顧客IDが管理される");
    });

    describe("インタラクション", () => {
        test.todo("展開アイコンクリックで子ノードが展開/折りたたまれる");
        test.todo("顧客ノードクリックでonCustomerSelectイベントが発火する");
        test.todo("顧客ノードホバーで背景色が変わる");
    });

    describe("副作用", () => {
        test.todo("マウント時に初期展開状態を設定する");
    });
});

describe("CustomerDetailPanelComponent", () => {
    describe("props", () => {
        test.todo("customerが渡された場合、顧客詳細情報が表示される");
        test.todo("relatedDealsが渡された場合、関連案件一覧が表示される");
        test.todo("relatedContactsが渡された場合、担当者一覧が表示される");
        test.todo("onEditが渡された場合、編集ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("顧客名が大きなフォントで表示される");
        test.todo("顧客種別、住所、電話番号、メールアドレスが表示される");
        test.todo("親顧客へのリンクが表示される");
        test.todo("子顧客一覧がタブ形式で表示される");
        test.todo("関連案件一覧がタブ形式で表示される");
        test.todo("担当者一覧がタブ形式で表示される");
        test.todo("編集ボタンが表示される");
    });

    describe("インタラクション", () => {
        test.todo("タブクリックで表示内容が切り替わる");
        test.todo("編集ボタンクリックでonEditイベントが発火する");
        test.todo("親顧客リンククリックで親顧客詳細に遷移する");
        test.todo("関連案件クリックで案件詳細に遷移する");
    });
});

describe("DealKanbanBoardComponent", () => {
    describe("props", () => {
        test.todo("columnsが渡された場合、カンバンカラムが表示される");
        test.todo("dealsが渡された場合、各カラムに案件カードが表示される");
        test.todo("onDealMoveが渡された場合、案件移動時に呼ばれる");
        test.todo("onDealClickが渡された場合、案件クリック時に呼ばれる");
        test.todo("filterOptionsが渡された場合、フィルター機能が有効になる");
    });

    describe("描画", () => {
        test.todo("カラムが水平に並んで表示される");
        test.todo("各カラムにステータス名と案件数が表示される");
        test.todo("各カラム内に案件カードが縦に並ぶ");
        test.todo("案件カードに案件名、金額、担当者、期限が表示される");
        test.todo("検索バーが上部に表示される");
        test.todo("フィルターボタンが表示される");
    });

    describe("状態管理", () => {
        test.todo("ドラッグ中の案件カードが管理される");
        test.todo("フィルター条件が管理される");
        test.todo("検索キーワードが管理される");
    });

    describe("インタラクション", () => {
        test.todo("案件カードをドラッグして別カラムにドロップできる");
        test.todo("案件移動時にonDealMoveが案件IDと移動先ステータスとともに呼ばれる");
        test.todo("案件カードクリックでonDealClickイベントが発火する");
        test.todo("検索ボックスに入力して案件を絞り込める");
        test.todo("フィルターボタンクリックでフィルターパネルが表示される");
        test.todo("フィルター適用で表示案件が絞り込まれる");
    });

    describe("副作用", () => {
        test.todo("マウント時に各カラムの案件数を集計する");
        test.todo("フィルター変更時に表示案件を再計算する");
    });
});

describe("DealKanbanCardComponent", () => {
    describe("props", () => {
        test.todo("dealが渡された場合、案件情報が表示される");
        test.todo("isDraggingがtrueの場合、ドラッグ中のスタイルが適用される");
        test.todo("onClickが渡された場合、カードクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("案件名が太字で表示される");
        test.todo("金額が通貨フォーマットで表示される");
        test.todo("担当者名が表示される");
        test.todo("期限日が表示される");
        test.todo("期限超過の案件は赤色で強調表示される");
        test.todo("優先度が高い案件にはバッジが表示される");
    });

    describe("インタラクション", () => {
        test.todo("カードクリックでonClickイベントが発火する");
        test.todo("カードホバーで影が強調される");
        test.todo("ドラッグ開始時にカードの透明度が変わる");
    });
});

describe("SearchFilterPanelComponent", () => {
    describe("props", () => {
        test.todo("filterOptionsが渡された場合、フィルター項目が表示される");
        test.todo("onFilterChangeが渡された場合、フィルター変更時に呼ばれる");
        test.todo("initialFiltersが渡された場合、初期フィルター値が設定される");
    });

    describe("描画", () => {
        test.todo("検索ボックスが表示される");
        test.todo("ステータスフィルターがチェックボックスで表示される");
        test.todo("担当者フィルターがドロップダウンで表示される");
        test.todo("期間フィルターが日付ピッカーで表示される");
        test.todo("金額範囲フィルターがスライダーで表示される");
        test.todo("フィルタークリアボタンが表示される");
    });

    describe("状態管理", () => {
        test.todo("各フィルター項目の値が管理される");
        test.todo("フィルター適用状態が管理される");
    });

    describe("インタラクション", () => {
        test.todo("検索ボックス入力でonFilterChangeが呼ばれる");
        test.todo("ステータスチェックボックス変更でonFilterChangeが呼ばれる");
        test.todo("担当者選択でonFilterChangeが呼ばれる");
        test.todo("期間選択でonFilterChangeが呼ばれる");
        test.todo("金額範囲変更でonFilterChangeが呼ばれる");
        test.todo("クリアボタンクリックで全フィルターがリセットされる");
    });
});

describe("MobileDealListComponent", () => {
    describe("props", () => {
        test.todo("dealsが渡された場合、案件一覧が表示される");
        test.todo("onDealClickが渡された場合、案件タップで呼ばれる");
        test.todo("hasMoreが渡された場合、もっと見るボタンが表示される");
        test.todo("onLoadMoreが渡された場合、もっと見るボタンタップで呼ばれる");
    });

    describe("描画", () => {
        test.todo("案件がカード形式でリスト表示される");
        test.todo("各カードに案件名、ステータスバッジ、金額、期限が表示される");
        test.todo("ステータスバッジの色がステータスに応じて変わる");
        test.todo("スワイプアクション用のアイコンがカード右端に表示される");
        test.todo("もっと見るボタンが下部に表示される");
    });

    describe("状態管理", () => {
        test.todo("スワイプ中のカードIDが管理される");
        test.todo("ローディング状態が管理される");
    });

    describe("インタラクション", () => {
        test.todo("カードタップでonDealClickイベントが発火する");
        test.todo("カードを左スワイプで削除ボタンが表示される");
        test.todo("カードを右スワイプで編集ボタンが表示される");
        test.todo("もっと見るボタンタップでonLoadMoreイベントが発火する");
        test.todo("Pull to Refreshで一覧が更新される");
    });

    describe("副作用", () => {
        test.todo("スクロール位置が下部に達したら自動で追加読み込みする");
    });
});

describe("MobileSearchBarComponent", () => {
    describe("props", () => {
        test.todo("placeholderが渡された場合、プレースホルダーテキストが表示される");
        test.todo("onSearchが渡された場合、検索実行時に呼ばれる");
        test.todo("onFilterClickが渡された場合、フィルターボタンクリックで呼ばれる");
        test.todo("filterCountが渡された場合、フィルター適用数バッジが表示される");
    });

    describe("描画", () => {
        test.todo("検索アイコンが左端に表示される");
        test.todo("検索入力フィールドが中央に表示される");
        test.todo("フィルターボタンが右端に表示される");
        test.todo("フィルター適用中はバッジに適用数が表示される");
    });

    describe("インタラクション", () => {
        test.todo("入力フィールドフォーカスでキーボードが表示される");
        test.todo("検索ボタンタップでonSearchイベントが発火する");
        test.todo("フィルターボタンタップでonFilterClickイベントが発火する");
        test.todo("クリアボタンタップで入力値がクリアされる");
    });
});

describe("PhaseManagementComponent", () => {
    describe("props", () => {
        test.todo("phasesが渡された場合、フェーズ一覧が表示される");
        test.todo("onPhaseAddが渡された場合、フェーズ追加時に呼ばれる");
        test.todo("onPhaseEditが渡された場合、フェーズ編集時に呼ばれる");
        test.todo("onPhaseDeleteが渡された場合、フェーズ削除時に呼ばれる");
        test.todo("onPhaseReorderが渡された場合、フェーズ並び替え時に呼ばれる");
    });

    describe("描画", () => {
        test.todo("フェーズがテーブル形式で表示される");
        test.todo("各行にフェーズ名、順序、成約確率、アクションボタンが表示される");
        test.todo("フェーズ追加ボタンが上部に表示される");
        test.todo("各行にドラッグハンドルアイコンが表示される");
        test.todo("編集・削除ボタンが各行に表示される");
    });

    describe("状態管理", () => {
        test.todo("ドラッグ中のフェーズが管理される");
        test.todo("編集中のフェーズIDが管理される");
        test.todo("削除確認ダイアログの表示状態が管理される");
    });

    describe("インタラクション", () => {
        test.todo("追加ボタンクリックでフェーズ追加フォームが表示される");
        test.todo("フォーム送信でonPhaseAddイベントが発火する");
        test.todo("編集ボタンクリックでフェーズ編集フォームが表示される");
        test.todo("編集フォーム送信でonPhaseEditイベントが発火する");
        test.todo("削除ボタンクリックで削除確認ダイアログが表示される");
        test.todo("削除確認後にonPhaseDeleteイベントが発火する");
        test.todo("フェーズをドラッグして並び替えできる");
        test.todo("並び替え完了時にonPhaseReorderイベントが発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時にフェーズを順序順にソートする");
    });
});

describe("PhaseFormComponent", () => {
    describe("props", () => {
        test.todo("initialPhaseが渡された場合、初期値がフォームに設定される");
        test.todo("onSubmitが渡された場合、フォーム送信時に呼ばれる");
        test.todo("onCancelが渡された場合、キャンセル時に呼ばれる");
        test.todo("modeが'create'の場合、'追加'ボタンが表示される");
        test.todo("modeが'edit'の場合、'更新'ボタンが表示される");
    });

    describe("描画", () => {
        test.todo("フェーズ名入力フィールドが表示される");
        test.todo("成約確率入力フィールドが表示される");
        test.todo("説明入力フィールドが表示される");
        test.todo("送信ボタンとキャンセルボタンが表示される");
    });

    describe("状態管理", () => {
        test.todo("各入力値が管理される");
        test.todo("バリデーションエラー状態が管理される");
    });

    describe("インタラクション", () => {
        test.todo("フェーズ名が未入力の場合、バリデーションエラーが表示される");
        test.todo("成約確率が0-100の範囲外の場合、バリデーションエラーが表示される");
        test.todo("送信ボタンクリックでonSubmitイベントが発火する");
        test.todo("キャンセルボタンクリックでonCancelイベントが発火する");
    });
});

describe("TimelineComponent", () => {
    describe("props", () => {
        test.todo("eventsが渡された場合、イベントタイムラインが表示される");
        test.todo("groupByが'date'の場合、日付ごとにグループ化される");
        test.todo("groupByが'type'の場合、種別ごとにグループ化される");
    });

    describe("描画", () => {
        test.todo("イベントが時系列順に表示される");
        test.todo("各イベントにアイコン、日時、内容が表示される");
        test.todo("イベントタイプごとにアイコンと色が異なる");
        test.todo("グループヘッダーが表示される");
        test.todo("タイムライン上に縦線が表示される");
    });

    describe("インタラクション", () => {
        test.todo("イベントアイテムクリックで詳細が展開される");
        test.todo("グループヘッダークリックでグループが折りたたまれる");
    });
});
