import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Activity } from "../../../../src/backend/domain/entity/Activity";
import { ActivityCard } from "../../../../src/frontend/component/activity/ActivityCard";

const createMockActivity = (overrides?: Partial<Activity>): Activity => {
    return new Activity(
        overrides?.id ?? "activity-1",
        overrides?.dealId ?? "deal-1",
        overrides?.activityType ?? "面談",
        overrides?.activityDate ?? new Date(2026, 3, 1, 9, 0),
        overrides?.content ?? "テスト活動",
        overrides?.assigneeId ?? "user-1",
        overrides?.createdAt ?? new Date(),
        overrides?.updatedAt ?? new Date()
    );
};

const renderCard = (overrides?: Partial<Activity>) => {
    const activity = createMockActivity(overrides);
    render(<ActivityCard activity={activity} />);
    const card = document.querySelector(".bg-surface-container-lowest") as HTMLElement | null;
    const icon = document.querySelector(".w-12.h-12") as HTMLElement | null;
    const memo = document.querySelector(".bg-surface-container-low") as HTMLElement | null;
    const badge = document.querySelector(".text-\\[10px\\]") as HTMLElement | null;
    return { activity, card, icon, memo, badge };
};

describe("ActivityCardComponent", () => {
    describe("props", () => {
        test("activityTypeが'電話'の場合、アイコン背景クラスbg-secondary-fixedが適用される", () => {
            const { icon } = renderCard({ activityType: "電話" });
            expect(icon?.classList.contains("bg-secondary-fixed")).toBe(true);
        });

        test("activityTypeが'メール'の場合、アイコン背景クラスbg-primary-fixedが適用される", () => {
            const { icon } = renderCard({ activityType: "メール" });
            expect(icon?.classList.contains("bg-primary-fixed")).toBe(true);
        });

        test("activityTypeが'面談'の場合、アイコン背景クラスbg-tertiary-fixedが適用される", () => {
            const { icon } = renderCard({ activityType: "面談" });
            expect(icon?.classList.contains("bg-tertiary-fixed")).toBe(true);
        });

        test("activityTypeが'その他'の場合、アイコン背景クラスbg-surface-container-highが適用される", () => {
            const { icon } = renderCard({ activityType: "その他" });
            expect(icon?.classList.contains("bg-surface-container-high")).toBe(true);
        });

        test("activity.contentが存在する場合、メモエリアが表示される", () => {
            const { activity } = renderCard({ content: "メモあり" });
            expect(screen.getByText(activity.content)).toBeInTheDocument();
        });

        test("activity.contentが空の場合、メモエリアは表示されない", () => {
            renderCard({ content: "" });
            expect(document.querySelector(".border-tertiary-fixed")).not.toBeInTheDocument();
        });

        test("activity.activityDateから時刻がHH:MM形式で表示される", () => {
            const { activity } = renderCard({ activityDate: new Date(2026, 3, 1, 13, 5) });
            const expectedTime = new Date(activity.activityDate).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
            });
            expect(screen.getByText(expectedTime)).toBeInTheDocument();
        });
    });

    describe("描画", () => {
        test("カードコンテナのクラスにbg-surface-container-lowest p-6 rounded-full shadow-sm border border-transparentが付与されている", () => {
            const { card } = renderCard();
            expect(card).toBeInTheDocument();
            expect(card?.classList.contains("bg-surface-container-lowest")).toBe(true);
            expect(card?.classList.contains("p-6")).toBe(true);
            expect(card?.classList.contains("rounded-full")).toBe(true);
            expect(card?.classList.contains("shadow-sm")).toBe(true);
            expect(card?.classList.contains("border")).toBe(true);
            expect(card?.classList.contains("border-transparent")).toBe(true);
        });

        test("アイコンコンテナのクラスにw-12 h-12 rounded-full flex items-center justify-center flex-shrink-0が付与されている", () => {
            const { icon } = renderCard();
            expect(icon?.classList.contains("w-12")).toBe(true);
            expect(icon?.classList.contains("h-12")).toBe(true);
            expect(icon?.classList.contains("rounded-full")).toBe(true);
            expect(icon?.classList.contains("flex")).toBe(true);
            expect(icon?.classList.contains("items-center")).toBe(true);
            expect(icon?.classList.contains("justify-center")).toBe(true);
            expect(icon?.classList.contains("flex-shrink-0")).toBe(true);
        });

        test("カードのコンテンツエリアにactivityTypeテキストがh4として表示される", () => {
            renderCard({ activityType: "面談" });
            expect(screen.getByRole("heading", { level: 4, name: "面談" })).toBeInTheDocument();
        });

        test("時刻はtext-xs font-mediumクラスで表示される", () => {
            const { activity } = renderCard({ activityDate: new Date(2026, 3, 1, 9, 30) });
            const timeText = new Date(activity.activityDate).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const time = screen.getByText(timeText);
            expect(time.classList.contains("text-xs")).toBe(true);
            expect(time.classList.contains("font-medium")).toBe(true);
        });

        test("メモエリアにmt-4 p-4 bg-surface-container-low rounded-xl border-l-4 border-tertiary-fixedクラスが付与されている", () => {
            const { memo } = renderCard({ content: "メモあり" });
            expect(memo).toBeInTheDocument();
            expect(memo?.classList.contains("mt-4")).toBe(true);
            expect(memo?.classList.contains("p-4")).toBe(true);
            expect(memo?.classList.contains("bg-surface-container-low")).toBe(true);
            expect(memo?.classList.contains("rounded-xl")).toBe(true);
            expect(memo?.classList.contains("border-l-4")).toBe(true);
            expect(memo?.classList.contains("border-tertiary-fixed")).toBe(true);
        });

        test("メモテキストにtext-sm italicクラスが付与されている", () => {
            const { activity } = renderCard({ content: "メモあり" });
            const memoText = screen.getByText(activity.content);
            expect(memoText.classList.contains("text-sm")).toBe(true);
            expect(memoText.classList.contains("italic")).toBe(true);
        });

        test("バッジはinline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed/20クラスで表示される", () => {
            const { badge } = renderCard();
            expect(badge).toBeInTheDocument();
            expect(badge?.classList.contains("inline-flex")).toBe(true);
            expect(badge?.classList.contains("items-center")).toBe(true);
            expect(badge?.classList.contains("px-3")).toBe(true);
            expect(badge?.classList.contains("py-1")).toBe(true);
            expect(badge?.classList.contains("rounded-full")).toBe(true);
            expect(badge?.classList.contains("text-[10px]")).toBe(true);
            expect(badge?.classList.contains("font-bold")).toBe(true);
            expect(badge?.classList.contains("uppercase")).toBe(true);
            expect(badge?.classList.contains("tracking-wider")).toBe(true);
            expect(badge?.classList.contains("bg-tertiary-fixed/20")).toBe(true);
        });

        test("バッジにactivityTypeが表示される", () => {
            const { activity, badge } = renderCard({ activityType: "メール" });
            expect(badge).toHaveTextContent(activity.activityType);
        });

        test("アイコンエリアとコンテンツエリアはflex items-start space-x-6で水平配置される", () => {
            renderCard();
            expect(document.querySelector(".flex.items-start.space-x-6")).toBeInTheDocument();
        });

        test("タイトルと時刻はflex justify-between items-startで両端揃え配置される", () => {
            renderCard();
            expect(document.querySelector(".flex.justify-between.items-start")).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test("ActivityCardコンポーネントは内部状態を持たない (表示のみ)", () => {
            renderCard();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("カードがホバーされるとhover:shadow-xl hover:shadow-primary/5のシャドウが適用される", () => {
            const { card } = renderCard();
            expect(card?.classList.contains("hover:shadow-xl")).toBe(true);
            expect(card?.classList.contains("hover:shadow-primary/5")).toBe(true);
        });

        test("カードがホバーされるとhover:border-outline-variant/10のボーダーが表示される", () => {
            const { card } = renderCard();
            expect(card?.classList.contains("hover:border-outline-variant/10")).toBe(true);
        });

        test("カードのトランジションはtransition-all duration-300 (300ms) である", () => {
            const { card } = renderCard();
            expect(card?.classList.contains("transition-all")).toBe(true);
            expect(card?.classList.contains("duration-300")).toBe(true);
        });
    });

    describe("副作用", () => {
        test("ActivityCardコンポーネントはマウント・アンマウント時に副作用を持たない", () => {
            const consoleSpy = vi.spyOn(console, "log");
            renderCard();
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test("アイコンとコンテンツエリアはspace-x-6 (24px) の水平ギャップで配置される", () => {
                renderCard();
                expect(document.querySelector(".space-x-6")).toBeInTheDocument();
            });

            test("バッジエリアはmt-4 flex items-center space-x-4で配置される", () => {
                renderCard();
                expect(document.querySelector(".mt-4.flex.items-center.space-x-4")).toBeInTheDocument();
            });

            test("メモエリアはコンテンツエリア内でmt-4のマージンを持つ", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("mt-4")).toBe(true);
            });
        });

        describe("サイズ", () => {
            test("カードのパディングはp-6 (24px) である", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("p-6")).toBe(true);
            });

            test("アイコンコンテナはw-12 h-12 (48px×48px) の正方形である", () => {
                const { icon } = renderCard();
                expect(icon?.classList.contains("w-12")).toBe(true);
                expect(icon?.classList.contains("h-12")).toBe(true);
            });

            test("メモエリアのパディングはp-4 (16px) である", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("p-4")).toBe(true);
            });

            test("バッジのパディングはpx-3 py-1 (12px左右・4px上下) である", () => {
                const { badge } = renderCard();
                expect(badge?.classList.contains("px-3")).toBe(true);
                expect(badge?.classList.contains("py-1")).toBe(true);
            });
        });

        describe("色", () => {
            test("カード背景色はbg-surface-container-lowest (#ffffff相当) である", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("bg-surface-container-lowest")).toBe(true);
            });

            test("電話アイコン背景はbg-secondary-fixed (#d6e0f6相当) である", () => {
                const { icon } = renderCard({ activityType: "電話" });
                expect(icon?.classList.contains("bg-secondary-fixed")).toBe(true);
            });

            test("メールアイコン背景はbg-primary-fixed (#d6e3ff相当) である", () => {
                const { icon } = renderCard({ activityType: "メール" });
                expect(icon?.classList.contains("bg-primary-fixed")).toBe(true);
            });

            test("面談アイコン背景はbg-tertiary-fixed (#9ff5c1相当) である", () => {
                const { icon } = renderCard({ activityType: "面談" });
                expect(icon?.classList.contains("bg-tertiary-fixed")).toBe(true);
            });

            test("その他アイコン背景はbg-surface-container-high (#e0e3e5相当) である", () => {
                const { icon } = renderCard({ activityType: "その他" });
                expect(icon?.classList.contains("bg-surface-container-high")).toBe(true);
            });

            test("メモエリア背景はbg-surface-container-low (#f1f4f6相当) である", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("bg-surface-container-low")).toBe(true);
            });

            test("メモエリア左ボーダー色はborder-tertiary-fixed (#9ff5c1相当) である", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("border-tertiary-fixed")).toBe(true);
            });

            test("バッジ背景はbg-tertiary-fixed/20 (rgba(159,245,193,0.2)) である", () => {
                const { badge } = renderCard();
                expect(badge?.classList.contains("bg-tertiary-fixed/20")).toBe(true);
            });
        });

        describe("タイポグラフィ", () => {
            test("活動タイトル (h4) はfont-headline (Manrope) font-boldが適用されている", () => {
                renderCard({ activityType: "面談" });
                const title = screen.getByRole("heading", { level: 4, name: "面談" });
                expect(title.classList.contains("font-headline")).toBe(true);
                expect(title.classList.contains("font-bold")).toBe(true);
            });

            test("時刻はtext-xs font-medium (12px, weight 500) である", () => {
                const { activity } = renderCard({ activityDate: new Date(2026, 3, 1, 9, 30) });
                const timeText = new Date(activity.activityDate).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const time = screen.getByText(timeText);
                expect(time.classList.contains("text-xs")).toBe(true);
                expect(time.classList.contains("font-medium")).toBe(true);
            });

            test("メモテキストはtext-sm italic (14px, イタリック体) である", () => {
                const { activity } = renderCard({ content: "メモあり" });
                const memoText = screen.getByText(activity.content);
                expect(memoText.classList.contains("text-sm")).toBe(true);
                expect(memoText.classList.contains("italic")).toBe(true);
            });

            test("バッジテキストはtext-[10px] font-bold uppercase tracking-widerである", () => {
                const { badge } = renderCard();
                expect(badge?.classList.contains("text-[10px]")).toBe(true);
                expect(badge?.classList.contains("font-bold")).toBe(true);
                expect(badge?.classList.contains("uppercase")).toBe(true);
                expect(badge?.classList.contains("tracking-wider")).toBe(true);
            });
        });

        describe("形状", () => {
            test("カードコンテナはrounded-full (9999px) の角丸である", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("rounded-full")).toBe(true);
            });

            test("アイコンコンテナはrounded-full (円形) である", () => {
                const { icon } = renderCard();
                expect(icon?.classList.contains("rounded-full")).toBe(true);
            });

            test("メモエリアはrounded-xl (12px) の角丸である", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("rounded-xl")).toBe(true);
            });

            test("メモエリアの左ボーダーはborder-l-4 (4px) である", () => {
                const { memo } = renderCard({ content: "メモあり" });
                expect(memo?.classList.contains("border-l-4")).toBe(true);
            });

            test("バッジはrounded-full (完全な丸角) である", () => {
                const { badge } = renderCard();
                expect(badge?.classList.contains("rounded-full")).toBe(true);
            });
        });

        describe("装飾", () => {
            test("カードは通常時shadow-sm (軽いボックスシャドウ) を持つ", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("shadow-sm")).toBe(true);
            });

            test("カードのホバー時はhover:shadow-xl hover:shadow-primary/5 (大きなシャドウ、primary色5%不透明度) になる", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("hover:shadow-xl")).toBe(true);
                expect(card?.classList.contains("hover:shadow-primary/5")).toBe(true);
            });

            test("カードのボーダーは通常時border-transparent、ホバー時はhover:border-outline-variant/10になる", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("border-transparent")).toBe(true);
                expect(card?.classList.contains("hover:border-outline-variant/10")).toBe(true);
            });
        });

        describe("インタラクション", () => {
            test("カードはホバー時にシャドウがshadow-smからhover:shadow-xlに変化する", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("shadow-sm")).toBe(true);
                expect(card?.classList.contains("hover:shadow-xl")).toBe(true);
            });

            test("カードはホバー時にボーダーがtransparentからoutline-variant/10に変化する", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("border-transparent")).toBe(true);
                expect(card?.classList.contains("hover:border-outline-variant/10")).toBe(true);
            });

            test("トランジションはtransition-all duration-300 (全プロパティ300ms) である", () => {
                const { card } = renderCard();
                expect(card?.classList.contains("transition-all")).toBe(true);
                expect(card?.classList.contains("duration-300")).toBe(true);
            });
        });
    });
});
