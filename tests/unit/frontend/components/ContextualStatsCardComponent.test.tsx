import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { ContextualStatsCard } from "../../../../src/frontend/component/activity/ContextualStatsCard";

const renderCard = (props?: ComponentProps<typeof ContextualStatsCard>) => {
    const defaultProps: ComponentProps<typeof ContextualStatsCard> = { value: 42 };
    return render(<ContextualStatsCard {...defaultProps} {...props} />);
};

describe("ContextualStatsCardComponent", () => {
    describe("props", () => {
        test("統計値 (例: 42) が渡された場合、text-3xl font-extrabold font-headlineで表示される", () => {
            renderCard({ value: 42 });
            const value = screen.getByText("42");
            expect(value.classList.contains("text-3xl")).toBe(true);
            expect(value.classList.contains("font-extrabold")).toBe(true);
            expect(value.classList.contains("font-headline")).toBe(true);
        });

        test("progressValueが渡された場合、プログレスバーの幅に反映される", () => {
            renderCard({ progressValue: 50 });
            const progress = document.querySelector(".bg-tertiary-fixed") as HTMLElement | null;
            expect(progress).toBeInTheDocument();
            expect(progress?.style.width).toBe("50%");
        });
    });

    describe("描画", () => {
        test("セクション要素にaria-label='統計カード'が設定されている", () => {
            renderCard();
            expect(screen.getByLabelText("統計カード")).toBeInTheDocument();
        });

        test("統計値「42」がTypographyとして表示される", () => {
            renderCard({ value: 42 });
            expect(screen.getByText("42")).toBeInTheDocument();
        });

        test("プログレスバー外枠がh-2 w-full bg-primary-container rounded-full overflow-hiddenで表示される", () => {
            renderCard();
            const bar = document.querySelector(".h-2.w-full.bg-primary-container.rounded-full.overflow-hidden");
            expect(bar).toBeInTheDocument();
        });

        test("プログレスバーがh-full bg-tertiary-fixed w-3/4 rounded-fullで表示される", () => {
            renderCard();
            const bar = document.querySelector(".h-full.bg-tertiary-fixed.w-3\\/4.rounded-full");
            expect(bar).toBeInTheDocument();
        });

        test("コンテンツエリアはrelative z-10クラスで前面に配置される", () => {
            renderCard();
            const content = document.querySelector(".relative.z-10");
            expect(content).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("ContextualStatsCardコンポーネントは内部状態を持たない (表示のみ)", () => {
            renderCard();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("ContextualStatsCardコンポーネントはユーザーインタラクションを持たない", () => {
            renderCard();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("ContextualStatsCardコンポーネントはマウント・アンマウント時に副作用を持たない", () => {
            const consoleSpy = vi.spyOn(console, "log");
            renderCard();
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test("セクションコンテナはbg-primary text-white p-8 rounded-full overflow-hidden relativeクラスが付与されている", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("bg-primary")).toBe(true);
                expect(section.classList.contains("text-white")).toBe(true);
                expect(section.classList.contains("p-8")).toBe(true);
                expect(section.classList.contains("rounded-full")).toBe(true);
                expect(section.classList.contains("overflow-hidden")).toBe(true);
                expect(section.classList.contains("relative")).toBe(true);
            });

            test("コンテンツエリアはrelative z-10で背景より前面に配置される", () => {
                renderCard();
                expect(document.querySelector(".relative.z-10")).toBeInTheDocument();
            });

            test("プログレスバーはmt-2 (8px上マージン) で統計値の下に配置される", () => {
                renderCard();
                const bar = document.querySelector(".h-2.w-full.bg-primary-container.rounded-full.overflow-hidden.mt-2");
                expect(bar).toBeInTheDocument();
            });
        });

        describe("サイズ", () => {
            test("セクションのパディングはp-8 (32px) である", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("p-8")).toBe(true);
            });

            test("プログレスバー外枠の高さはh-2 (8px) で幅はw-full (100%) である", () => {
                renderCard();
                const bar = document.querySelector(".h-2.w-full");
                expect(bar).toBeInTheDocument();
            });

            test("プログレスバーの初期幅はw-3/4 (75%) である", () => {
                renderCard();
                const bar = document.querySelector(".w-3\\/4");
                expect(bar).toBeInTheDocument();
            });

            test("プログレスバーの高さはh-full (親要素100%) である", () => {
                renderCard();
                const bar = document.querySelector(".h-full.bg-tertiary-fixed");
                expect(bar).toBeInTheDocument();
            });
        });

        describe("色", () => {
            test("セクション背景色はbg-primary (#002045) である", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("bg-primary")).toBe(true);
            });

            test("セクションのテキスト色はtext-white (#ffffff) である", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("text-white")).toBe(true);
            });

            test("プログレスバー外枠の背景色はbg-primary-container である", () => {
                renderCard();
                const bar = document.querySelector(".bg-primary-container");
                expect(bar).toBeInTheDocument();
            });

            test("プログレスバーの背景色はbg-tertiary-fixed (#9ff5c1相当) である", () => {
                renderCard();
                const bar = document.querySelector(".bg-tertiary-fixed");
                expect(bar).toBeInTheDocument();
            });
        });

        describe("タイポグラフィ", () => {
            test("統計値はtext-3xl (30px) font-extrabold (800) font-headline (Manrope) である", () => {
                renderCard({ value: 42 });
                const value = screen.getByText("42");
                expect(value.classList.contains("text-3xl")).toBe(true);
                expect(value.classList.contains("font-extrabold")).toBe(true);
                expect(value.classList.contains("font-headline")).toBe(true);
            });
        });

        describe("形状", () => {
            test("セクションコンテナはrounded-full (9999px) の角丸である", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("rounded-full")).toBe(true);
            });

            test("プログレスバー外枠はrounded-full (完全な丸角) でoverflow-hidden (はみ出し非表示) である", () => {
                renderCard();
                const bar = document.querySelector(".bg-primary-container.rounded-full.overflow-hidden");
                expect(bar).toBeInTheDocument();
            });

            test("プログレスバーはrounded-full (完全な丸角) である", () => {
                renderCard();
                const bar = document.querySelector(".bg-tertiary-fixed.rounded-full");
                expect(bar).toBeInTheDocument();
            });
        });

        describe("装飾", () => {
            test("セクションはoverflow-hidden (コンテンツはみ出し非表示) が適用されている", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("overflow-hidden")).toBe(true);
            });

            test("セクションにはbox-shadowや追加の装飾は付与されていない", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                expect(section.classList.contains("shadow")).toBe(false);
            });
        });

        describe("インタラクション", () => {
            test("ホバー・フォーカス・アクティブ時のスタイル変化はない", () => {
                renderCard();
                const section = screen.getByLabelText("統計カード");
                const hasHoverClass = Array.from(section.classList).some((cls) => cls.startsWith("hover:"));
                expect(hasHoverClass).toBe(false);
            });
        });
    });
});
