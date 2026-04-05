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
    describe("props", () => {
        test.todo("dealIdが渡された場合、案件IDが設定される");
        test.todo("initialValuesが渡された場合、フォームに初期値が設定される");
        test.todo("onSubmitが渡された場合、フォーム送信で呼ばれる");
        test.todo("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("活動種別・活動日・内容のフォームが表示される");
        test.todo("活動種別は選択肢から選べる");
    });

    describe("状態管理", () => {
        test.todo("活動種別変更で状態が更新される");
        test.todo("活動日変更で状態が更新される");
    });

    describe("インタラクション", () => {
        test.todo("送信ボタンクリックでonSubmitが呼ばれる");
        test.todo("キャンセルボタンクリックでonCancelが呼ばれる");
        test.todo("内容が空の場合、バリデーションエラーが表示される");
        test.todo("活動日が未入力の場合、バリデーションエラーが表示される");
    });

    describe("副作用", () => {
        test.todo("マウント時に特別な処理はなし");
    });
});
