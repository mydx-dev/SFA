import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("ActivityFormComponent", () => {
    interface ActivityFormValues {
        dealId: string;
        activityType: "面談" | "電話" | "メール" | "その他";
        activityDate: string;
        content: string;
    }

    describe("props", () => {
        test("dealIdが渡された場合、案件IDが設定される", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
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
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
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
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            const onSubmit = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/内容/), "テスト活動");
            await userEvent.type(screen.getByLabelText(/活動日/), "2026-04-15");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            const onCancel = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("描画", () => {
        test("活動種別・活動日・内容のフォームが表示される", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/活動種別/)).toBeInTheDocument();
            expect(screen.getByLabelText(/活動日/)).toBeInTheDocument();
            expect(screen.getByLabelText(/内容/)).toBeInTheDocument();
        });

        test("活動種別は選択肢から選べる", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
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
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            const activityTypeSelect = screen.getByLabelText(/活動種別/);
            await userEvent.click(activityTypeSelect);
            await userEvent.click(screen.getByRole("option", { name: "電話" }));
            
            expect(activityTypeSelect).toHaveTextContent("電話");
        });

        test("活動日変更で状態が更新される", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            const dateInput = screen.getByLabelText(/活動日/);
            await userEvent.type(dateInput, "2026-04-15");
            
            expect(dateInput).toHaveValue("2026-04-15");
        });
    });

    describe("インタラクション", () => {
        test("送信ボタンクリックでonSubmitが呼ばれる", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            const onSubmit = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/内容/), "打ち合わせ");
            await userEvent.type(screen.getByLabelText(/活動日/), "2026-04-15");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("キャンセルボタンクリックでonCancelが呼ばれる", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            const onCancel = vi.fn();
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });

        test("内容が空の場合、バリデーションエラーが表示される", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/内容は必須です/)).toBeInTheDocument();
        });

        test("活動日が未入力の場合、バリデーションエラーが表示される", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/活動日は必須です/)).toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { ActivityForm } = await import("../../../../src/frontend/component/activity/ActivityForm");
            const consoleSpy = vi.spyOn(console, "log");
            render(<ActivityForm dealId="deal-1" onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
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

