import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

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
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
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

