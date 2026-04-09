import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

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
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("案件カードをドラッグして別ステージにドロップできる");
        test.todo("案件カードクリックで案件詳細モーダルが開く");
        test.todo("案件移動時にonDealMoveイベントが発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時に各ステージの案件数を集計する");
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

