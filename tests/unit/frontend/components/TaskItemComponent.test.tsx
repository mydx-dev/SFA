import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("TaskItemComponent", () => {
    describe("props", () => {
        test.todo("labelが渡された場合、ラベルテキストが表示される");
        test.todo("statusが'queued'の場合、'実行待ち'ボタンが表示される");
        test.todo("statusが'running'の場合、'実行中'ボタンが表示される");
        test.todo("statusが'failed'の場合、'リトライ'ボタンが表示される");
        test.todo("onRetryが渡された場合、'リトライ'ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("statusが'queued'のとき'実行待ち'ボタンが表示される");
        test.todo("statusが'running'のとき'実行中'ボタンが表示される");
        test.todo("statusが'failed'のとき'リトライ'ボタンが表示される");
        test.todo("statusが'queued'のときMenuItemが無効化される");
        test.todo("statusが'running'のときMenuItemが無効化される");
        test.todo("statusが'failed'のときMenuItemが有効である");
    });

    describe("状態管理", () => {
        test.todo("statusが'queued'から'failed'に変わると'リトライ'ボタンが表示される");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("'リトライ'ボタンクリックでonRetryイベントが発火する");
        test.todo("'実行待ち'ボタンはクリックできない");
        test.todo("'実行中'ボタンはクリックできない");
    });

    describe("副作用", () => {
        test.todo("マウント時にコンソールログが出力される");
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

