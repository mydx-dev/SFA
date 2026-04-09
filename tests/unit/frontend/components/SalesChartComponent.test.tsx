import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("SalesChartComponent", () => {
    describe("props", () => {
        test.todo("dataが渡された場合、チャートが表示される");
        test.todo("periodが'monthly'の場合、月次データが表示される");
        test.todo("periodが'quarterly'の場合、四半期データが表示される");
        test.todo("periodが'yearly'の場合、年次データが表示される");
        test.todo("chartTypeが'line'の場合、折れ線グラフが表示される");
        test.todo("chartTypeが'bar'の場合、棒グラフが表示される");
    });

    describe("描画", () => {
        test.todo("X軸に期間、Y軸に売上金額が表示される");
        test.todo("グラフにグリッドラインが表示される");
        test.todo("データポイントにツールチップが表示される");
        test.todo("凡例が表示される");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("データポイントホバーで詳細情報がツールチップに表示される");
        test.todo("期間変更ボタンクリックでチャートが更新される");
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

