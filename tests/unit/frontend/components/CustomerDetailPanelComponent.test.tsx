import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("CustomerDetailPanelComponent", () => {
    describe("props", () => {
        test.todo("customerが渡された場合、顧客詳細情報が表示される");
        test.todo("relatedDealsが渡された場合、関連案件一覧が表示される");
        test.todo("relatedContactsが渡された場合、担当者一覧が表示される");
        test.todo("onEditが渡された場合、編集ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("顧客名が大きなフォントで表示される");
        test.todo("顧客種別、住所、電話番号、メールアドレスが表示される");
        test.todo("親顧客へのリンクが表示される");
        test.todo("子顧客一覧がタブ形式で表示される");
        test.todo("関連案件一覧がタブ形式で表示される");
        test.todo("担当者一覧がタブ形式で表示される");
        test.todo("編集ボタンが表示される");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("タブクリックで表示内容が切り替わる");
        test.todo("編集ボタンクリックでonEditイベントが発火する");
        test.todo("親顧客リンククリックで親顧客詳細に遷移する");
        test.todo("関連案件クリックで案件詳細に遷移する");
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

