import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { ActivityFilterSection } from "../../../../src/frontend/component/activity/ActivityFilterSection";

const renderSection = (props?: ComponentProps<typeof ActivityFilterSection>) => {
    const defaultProps: ComponentProps<typeof ActivityFilterSection> = {};
    return render(<ActivityFilterSection {...defaultProps} {...props} />);
};

describe("ActivityFilterSectionComponent", () => {
    describe("props", () => {
        test("activeFilterが'すべての活動'の場合、'すべての活動'ボタンにbg-surface-container-lowest text-primary border border-primary/10クラスが付与される", () => {
            renderSection({ activeFilter: "すべての活動" });
            const button = screen.getByRole("button", { name: "すべての活動" });
            expect(button.classList.contains("bg-surface-container-lowest")).toBe(true);
            expect(button.classList.contains("text-primary")).toBe(true);
            expect(button.classList.contains("border")).toBe(true);
            expect(button.classList.contains("border-primary/10")).toBe(true);
        });

        test("activeFilterが'マイチーム'の場合、'マイチーム'ボタンにアクティブスタイルが適用される", () => {
            renderSection({ activeFilter: "マイチーム" });
            const button = screen.getByRole("button", { name: "マイチーム" });
            expect(button.classList.contains("text-primary")).toBe(true);
            expect(button.classList.contains("border-primary/10")).toBe(true);
        });

        test("activeFilterが非選択ボタンの場合、bg-surface-container-lowest text-on-surface-variant border border-transparentクラスが付与される", () => {
            renderSection({ activeFilter: "すべての活動" });
            const button = screen.getByRole("button", { name: "マイチーム" });
            expect(button.classList.contains("bg-surface-container-lowest")).toBe(true);
            expect(button.classList.contains("text-on-surface-variant")).toBe(true);
            expect(button.classList.contains("border")).toBe(true);
            expect(button.classList.contains("border-transparent")).toBe(true);
        });

        test("onFilterChangeが渡された場合、ボタンクリックで呼ばれる", async () => {
            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderSection({ onFilterChange });
            await user.click(screen.getByRole("button", { name: "マイチーム" }));
            expect(onFilterChange).toHaveBeenCalledWith("マイチーム");
        });
    });

    describe("描画", () => {
        test("セクション要素にaria-label='フィルターセクション'が設定されている", () => {
            renderSection();
            expect(screen.getByLabelText("フィルターセクション")).toBeInTheDocument();
        });

        test("「すべての活動」「マイチーム」「結果のみ」「期限切れ」の4つのフィルターボタンが表示される", () => {
            renderSection();
            expect(screen.getByRole("button", { name: "すべての活動" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "マイチーム" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "結果のみ" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "期限切れ" })).toBeInTheDocument();
        });

        test("各ボタンはtype='button'である", () => {
            renderSection();
            const buttons = screen.getAllByRole("button");
            buttons.forEach((button) => expect(button).toHaveAttribute("type", "button"));
        });

        test("ボタンコンテナはflex flex-wrap gap-2 (8px間隔) のフレックスレイアウトである", () => {
            renderSection();
            const container = document.querySelector(".flex.flex-wrap.gap-2");
            expect(container).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("初期activeFilterは'すべての活動'である", () => {
            renderSection();
            const button = screen.getByRole("button", { name: "すべての活動" });
            expect(button.classList.contains("text-primary")).toBe(true);
        });

        test("フィルターボタンをクリックするとactiveFilterが変更される", async () => {
            const user = userEvent.setup();
            renderSection();
            await user.click(screen.getByRole("button", { name: "マイチーム" }));
            const button = screen.getByRole("button", { name: "マイチーム" });
            expect(button.classList.contains("text-primary")).toBe(true);
        });

        test("クリックしたボタンにアクティブスタイル (text-primary border-primary/10) が適用される", async () => {
            const user = userEvent.setup();
            renderSection();
            await user.click(screen.getByRole("button", { name: "結果のみ" }));
            const button = screen.getByRole("button", { name: "結果のみ" });
            expect(button.classList.contains("text-primary")).toBe(true);
            expect(button.classList.contains("border-primary/10")).toBe(true);
        });

        test("クリックしなかったボタンには非アクティブスタイル (text-on-surface-variant border-transparent) が適用される", async () => {
            const user = userEvent.setup();
            renderSection();
            await user.click(screen.getByRole("button", { name: "結果のみ" }));
            const button = screen.getByRole("button", { name: "期限切れ" });
            expect(button.classList.contains("text-on-surface-variant")).toBe(true);
            expect(button.classList.contains("border-transparent")).toBe(true);
        });
    });

    describe("インタラクション", () => {
        test("フィルターボタンをクリックするとsetActiveFilterが呼ばれ、activeFilterが更新される", async () => {
            const user = userEvent.setup();
            renderSection();
            await user.click(screen.getByRole("button", { name: "期限切れ" }));
            const button = screen.getByRole("button", { name: "期限切れ" });
            expect(button.classList.contains("text-primary")).toBe(true);
        });

        test("アクティブボタンはhover時にhover:bg-primary hover:text-whiteに変化する", () => {
            renderSection({ activeFilter: "すべての活動" });
            const button = screen.getByRole("button", { name: "すべての活動" });
            expect(button.classList.contains("hover:bg-primary")).toBe(true);
            expect(button.classList.contains("hover:text-white")).toBe(true);
        });

        test("非アクティブボタンはhover時にhover:border-outline-variantに変化する", () => {
            renderSection({ activeFilter: "すべての活動" });
            const button = screen.getByRole("button", { name: "マイチーム" });
            expect(button.classList.contains("hover:border-outline-variant")).toBe(true);
        });
    });

    describe("副作用", () => {
        test("ActivityFilterSectionコンポーネントはマウント・アンマウント時に副作用を持たない", () => {
            const consoleSpy = vi.spyOn(console, "log");
            renderSection();
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test("セクションコンテナはp-6 bg-surface-container-low rounded-fullクラスが付与されている", () => {
                renderSection();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("p-6")).toBe(true);
                expect(section.classList.contains("bg-surface-container-low")).toBe(true);
                expect(section.classList.contains("rounded-full")).toBe(true);
            });

            test("ボタンコンテナはflex flex-wrap gap-2 (8px) で折り返し可能な横並びレイアウトである", () => {
                renderSection();
                expect(document.querySelector(".flex.flex-wrap.gap-2")).toBeInTheDocument();
            });
        });

        describe("サイズ", () => {
            test("セクションのパディングはp-6 (24px) である", () => {
                renderSection();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("p-6")).toBe(true);
            });

            test("各ボタンのパディングはpx-4 py-2 (16px左右・8px上下) である", () => {
                renderSection();
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("px-4")).toBe(true);
                expect(button.classList.contains("py-2")).toBe(true);
            });
        });

        describe("色", () => {
            test("セクション背景色はbg-surface-container-low (#f1f4f6相当) である", () => {
                renderSection();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("bg-surface-container-low")).toBe(true);
            });

            test("アクティブボタンの背景色はbg-surface-container-lowestである", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("bg-surface-container-lowest")).toBe(true);
            });

            test("アクティブボタンのテキスト色はtext-primary (#002045) である", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("text-primary")).toBe(true);
            });

            test("アクティブボタンのボーダーはborder border-primary/10 (rgba(0,32,69,0.1)) である", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("border")).toBe(true);
                expect(button.classList.contains("border-primary/10")).toBe(true);
            });

            test("アクティブボタンのhover背景色はhover:bg-primary (#002045) である", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("hover:bg-primary")).toBe(true);
            });

            test("アクティブボタンのhoverテキスト色はhover:text-white (#ffffff) である", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("hover:text-white")).toBe(true);
            });

            test("非アクティブボタンの背景色はbg-surface-container-lowestである", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "マイチーム" });
                expect(button.classList.contains("bg-surface-container-lowest")).toBe(true);
            });

            test("非アクティブボタンのテキスト色はtext-on-surface-variantである", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "マイチーム" });
                expect(button.classList.contains("text-on-surface-variant")).toBe(true);
            });

            test("非アクティブボタンのボーダーはborder border-transparent (透明) である", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "マイチーム" });
                expect(button.classList.contains("border")).toBe(true);
                expect(button.classList.contains("border-transparent")).toBe(true);
            });

            test("非アクティブボタンのhoverボーダーはhover:border-outline-variantである", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "マイチーム" });
                expect(button.classList.contains("hover:border-outline-variant")).toBe(true);
            });
        });

        describe("タイポグラフィ", () => {
            test("ボタンテキストはtext-xs (12px) font-bold (700) である", () => {
                renderSection();
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("text-xs")).toBe(true);
                expect(button.classList.contains("font-bold")).toBe(true);
            });
        });

        describe("形状", () => {
            test("セクションコンテナはrounded-full (9999px) の角丸である", () => {
                renderSection();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("rounded-full")).toBe(true);
            });

            test("各ボタンはrounded-lg (8px) の角丸である", () => {
                renderSection();
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("rounded-lg")).toBe(true);
            });
        });

        describe("装飾", () => {
            test("セクションにボーダーやシャドウは付与されていない", () => {
                renderSection();
                const section = screen.getByLabelText("フィルターセクション");
                expect(section.classList.contains("border")).toBe(false);
                expect(section.classList.contains("shadow")).toBe(false);
            });

            test("各ボタンはborder-2ではなくborderクラス (1px) のボーダーを持つ", () => {
                renderSection();
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("border-2")).toBe(false);
                expect(button.classList.contains("border")).toBe(true);
            });
        });

        describe("インタラクション", () => {
            test("各ボタンのトランジションはtransition-allが適用されている", () => {
                renderSection();
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("transition-all")).toBe(true);
            });

            test("アクティブボタンのhover時はbg-primaryに背景変化し文字がwhiteになる", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "すべての活動" });
                expect(button.classList.contains("hover:bg-primary")).toBe(true);
                expect(button.classList.contains("hover:text-white")).toBe(true);
            });

            test("非アクティブボタンのhover時はborder-outline-variantにボーダーが表示される", () => {
                renderSection({ activeFilter: "すべての活動" });
                const button = screen.getByRole("button", { name: "マイチーム" });
                expect(button.classList.contains("hover:border-outline-variant")).toBe(true);
            });
        });
    });
});
