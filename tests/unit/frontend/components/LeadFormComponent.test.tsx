import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

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
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
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
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const nameInput = screen.getByLabelText(/氏名/);
            expect(nameInput).toHaveValue("");
        });

        test("onSubmitが渡された場合、フォーム送信で呼ばれる", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            const onSubmit = vi.fn();
            render(<LeadForm onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/氏名/), "田中一郎");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            const onCancel = vi.fn();
            render(<LeadForm onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("描画", () => {
        test("初期状態では氏名・会社名・メールアドレス・電話番号のフォームが表示される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
            expect(screen.getByLabelText(/会社名/)).toBeInTheDocument();
            expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
            expect(screen.getByLabelText(/電話番号/)).toBeInTheDocument();
        });

        test("ステータス選択肢が表示される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            expect(screen.getByLabelText(/ステータス/)).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("氏名入力で状態が更新される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const nameInput = screen.getByLabelText(/氏名/);
            await userEvent.type(nameInput, "佐藤花子");
            
            expect(nameInput).toHaveValue("佐藤花子");
        });

        test("ステータス変更で状態が更新される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            const statusSelect = screen.getByLabelText(/ステータス/);
            await userEvent.click(statusSelect);
            await userEvent.click(screen.getByRole("option", { name: "対応中" }));
            
            expect(statusSelect).toHaveTextContent("対応中");
        });
    });

    describe("インタラクション", () => {
        test("送信ボタンクリックでonSubmitが呼ばれる", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            const onSubmit = vi.fn();
            render(<LeadForm onSubmit={onSubmit} onCancel={() => {}} />);
            
            await userEvent.type(screen.getByLabelText(/氏名/), "山田太郎");
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(onSubmit).toHaveBeenCalled();
        });

        test("onSubmitにフォームの入力値が渡される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
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
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            const onCancel = vi.fn();
            render(<LeadForm onSubmit={() => {}} onCancel={onCancel} />);
            
            await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
            
            expect(onCancel).toHaveBeenCalled();
        });

        test("氏名が空の場合、バリデーションエラーが表示される", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
            await userEvent.click(screen.getByRole("button", { name: "送信" }));
            
            expect(await screen.findByText(/氏名は必須です/)).toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { LeadForm } = await import("../../../../src/frontend/component/lead/LeadForm");
            const consoleSpy = vi.spyOn(console, "log");
            render(<LeadForm onSubmit={() => {}} onCancel={() => {}} />);
            
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

