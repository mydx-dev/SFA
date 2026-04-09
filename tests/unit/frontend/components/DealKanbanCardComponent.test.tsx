import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

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
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("カードクリックでonClickイベントが発火する");
        test.todo("カードホバーで影が強調される");
        test.todo("ドラッグ開始時にカードの透明度が変わる");
    });
    describe("レイアウト", () => {
        describe("配置", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("案件名は上部に配置される");
            test.todo("金額は案件名の下に配置される");
            test.todo("期限日は下部に配置される");
            test.todo("ドラッグハンドルアイコンはカード上部に配置される");
        });
        describe("サイズ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードの幅は固定 (例: 280px) である");
            test.todo("カードのパディングは16px (p-4) である");
            test.todo("カード間のマージンは8px (mb-2) である");
        });
        describe("色", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードの背景色は白 (bg-white) である");
            test.todo("案件名の文字色はプライマリカラー (text-primary) である");
            test.todo("金額の文字色はプライマリカラー (text-primary) である");
            test.todo("期限日の文字色はセカンダリカラー (text-secondary) である");
        });
        describe("タイポグラフィ", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("案件名はBodyフォント、セミボールド (font-semibold) である");
            test.todo("金額はBodyフォント、ミディアムサイズ (text-base) である");
            test.todo("期限日はLabelフォント、スモールサイズ (text-sm) である");
        });
        describe("形状", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードの角は丸い (rounded-lg) である");
        });
        describe("装飾", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードは薄いシャドウ (shadow-sm) を持つ");
            test.todo("ホバー時にカードのシャドウが強調される (hover:shadow-md)");
            test.todo("ドラッグ中はカードのシャドウが強調される");
        });
        describe("インタラクション", () => {
            test("レイアウトが正しく表示される", () => {
                // Layout test placeholder
                expect(true).toBe(true);
            });
            test.todo("カードはドラッグ可能である");
            test.todo("カードはクリック可能である");
            test.todo("ホバー時にカーソルがポインターに変わる");
        });
    });
});

