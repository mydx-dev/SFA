import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("PhaseFormComponent", () => {
    describe("props", () => {
        test.todo("initialPhaseが渡された場合、初期値がフォームに設定される");
        test.todo("onSubmitが渡された場合、フォーム送信時に呼ばれる");
        test.todo("onCancelが渡された場合、キャンセル時に呼ばれる");
        test.todo("modeが'create'の場合、'追加'ボタンが表示される");
        test.todo("modeが'edit'の場合、'更新'ボタンが表示される");
    });

    describe("描画", () => {
        test.todo("フェーズ名入力フィールドが表示される");
        test.todo("成約確率入力フィールドが表示される");
        test.todo("説明入力フィールドが表示される");
        test.todo("送信ボタンとキャンセルボタンが表示される");
    });

    describe("状態管理", () => {
        test.todo("各入力値が管理される");
        test.todo("バリデーションエラー状態が管理される");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("フェーズ名が未入力の場合、バリデーションエラーが表示される");
        test.todo("成約確率が0-100の範囲外の場合、バリデーションエラーが表示される");
        test.todo("送信ボタンクリックでonSubmitイベントが発火する");
        test.todo("キャンセルボタンクリックでonCancelイベントが発火する");
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

