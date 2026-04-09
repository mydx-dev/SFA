import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateGroupHeader } from "../../../../src/frontend/component/activity/DateGroupHeader";

const renderHeader = (date = "2026年4月1日") => render(<DateGroupHeader date={date} />);

describe("DateGroupHeaderComponent", () => {
    describe("props", () => {
        test("dateが渡された場合、その日付文字列がヘッダーに表示される", () => {
            renderHeader("2026年4月1日");
            expect(screen.getByText("2026年4月1日")).toBeInTheDocument();
        });

        test("dateが'今日'の場合、'今日'が表示される", () => {
            renderHeader("今日");
            expect(screen.getByText("今日")).toBeInTheDocument();
        });
    });

    describe("描画", () => {
        test("コンテナのクラスにflex items-center space-x-4 mb-8が付与されている", () => {
            renderHeader();
            expect(document.querySelector(".flex.items-center.space-x-4.mb-8")).toBeInTheDocument();
        });

        test("左側の区切り線にh-[1px] flex-1 bg-outline-variant/30クラスが付与されている", () => {
            renderHeader();
            const dividers = document.querySelectorAll(".h-\\[1px\\].flex-1.bg-outline-variant\\/30");
            expect(dividers.length).toBeGreaterThan(0);
        });

        test("右側の区切り線にh-[1px] flex-1 bg-outline-variant/30クラスが付与されている", () => {
            renderHeader();
            const dividers = document.querySelectorAll(".h-\\[1px\\].flex-1.bg-outline-variant\\/30");
            expect(dividers.length).toBeGreaterThan(1);
        });

        test("日付テキストにtext-xs font-bold uppercase tracking-widestクラスが付与されている", () => {
            renderHeader();
            const text = screen.getByText("2026年4月1日");
            expect(text.classList.contains("text-xs")).toBe(true);
            expect(text.classList.contains("font-bold")).toBe(true);
            expect(text.classList.contains("uppercase")).toBe(true);
            expect(text.classList.contains("tracking-widest")).toBe(true);
        });

        test("区切り線は左右両方に1本ずつ配置され、日付テキストを中央で挟む構造になっている", () => {
            renderHeader();
            const container = document.querySelector(".flex.items-center.space-x-4.mb-8");
            const dividers = container?.querySelectorAll(".h-\\[1px\\].flex-1.bg-outline-variant\\/30") ?? [];
            expect(dividers.length).toBe(2);
        });
    });

    describe("状態管理", () => {
        test("DateGroupHeaderコンポーネントは内部状態を持たない (表示のみ)", () => {
            renderHeader();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("DateGroupHeaderコンポーネントはインタラクションを持たない", () => {
            renderHeader();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("副作用", () => {
        test("DateGroupHeaderコンポーネントはマウント・アンマウント時に副作用を持たない", () => {
            const consoleSpy = vi.spyOn(console, "log");
            renderHeader();
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test("コンテナはflex items-centerで水平中央揃えのフレックスレイアウトである", () => {
                renderHeader();
                expect(document.querySelector(".flex.items-center")).toBeInTheDocument();
            });

            test("区切り線はflex-1でコンテナの残余幅を均等に占有する", () => {
                renderHeader();
                const divider = document.querySelector(".flex-1");
                expect(divider).toBeInTheDocument();
            });

            test("日付テキストは2本の区切り線の間に配置される", () => {
                renderHeader();
                const container = document.querySelector(".flex.items-center.space-x-4.mb-8");
                const text = screen.getByText("2026年4月1日");
                const dividers = container?.querySelectorAll(".h-\\[1px\\].flex-1.bg-outline-variant\\/30") ?? [];
                expect(dividers.length).toBe(2);
                expect(container?.contains(text)).toBe(true);
            });

            test("各要素のギャップはspace-x-4 (16px) である", () => {
                renderHeader();
                expect(document.querySelector(".space-x-4")).toBeInTheDocument();
            });
        });

        describe("サイズ", () => {
            test("区切り線の高さはh-[1px] (1px) である", () => {
                renderHeader();
                const divider = document.querySelector(".h-\\[1px\\]");
                expect(divider).toBeInTheDocument();
            });

            test("コンテナの下マージンはmb-8 (32px) である", () => {
                renderHeader();
                expect(document.querySelector(".mb-8")).toBeInTheDocument();
            });
        });

        describe("色", () => {
            test("区切り線の背景色はbg-outline-variant/30 (rgba(85,95,113,0.3)) である", () => {
                renderHeader();
                const divider = document.querySelector(".bg-outline-variant\\/30");
                expect(divider).toBeInTheDocument();
            });
        });

        describe("タイポグラフィ", () => {
            test("日付テキストはtext-xs (12px) である", () => {
                renderHeader();
                const text = screen.getByText("2026年4月1日");
                expect(text.classList.contains("text-xs")).toBe(true);
            });

            test("日付テキストはfont-bold (太字) である", () => {
                renderHeader();
                const text = screen.getByText("2026年4月1日");
                expect(text.classList.contains("font-bold")).toBe(true);
            });

            test("日付テキストはuppercase (大文字変換) が適用されている", () => {
                renderHeader();
                const text = screen.getByText("2026年4月1日");
                expect(text.classList.contains("uppercase")).toBe(true);
            });

            test("日付テキストはtracking-widest (最大字間) が適用されている", () => {
                renderHeader();
                const text = screen.getByText("2026年4月1日");
                expect(text.classList.contains("tracking-widest")).toBe(true);
            });
        });

        describe("形状", () => {
            test("区切り線は矩形のフラットな線である (角丸なし)", () => {
                renderHeader();
                const divider = document.querySelector(".h-\\[1px\\]");
                expect(divider?.classList.contains("rounded")).toBe(false);
            });
        });

        describe("装飾", () => {
            test("区切り線にシャドウや装飾は付与されていない", () => {
                renderHeader();
                const divider = document.querySelector(".h-\\[1px\\]");
                expect(divider?.classList.contains("shadow")).toBe(false);
            });
        });

        describe("インタラクション", () => {
            test("ホバー・フォーカス・アクティブ時のスタイル変化はない", () => {
                renderHeader();
                const container = document.querySelector(".flex.items-center.space-x-4.mb-8") as HTMLElement | null;
                const hasHoverClass = Array.from(container?.classList ?? []).some((cls) => cls.startsWith("hover:"));
                expect(hasHoverClass).toBe(false);
            });
        });
    });
});
