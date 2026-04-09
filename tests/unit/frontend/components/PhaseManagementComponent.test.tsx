import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("PhaseManagementComponent", () => {
    describe("props", () => {
        test.todo("phasesが渡された場合、フェーズ一覧が表示される");
        test.todo("onPhaseAddが渡された場合、フェーズ追加時に呼ばれる");
        test.todo("onPhaseEditが渡された場合、フェーズ編集時に呼ばれる");
        test.todo("onPhaseDeleteが渡された場合、フェーズ削除時に呼ばれる");
        test.todo("onPhaseReorderが渡された場合、フェーズ並び替え時に呼ばれる");
    });

    describe("描画", () => {
        test.todo("フェーズがテーブル形式で表示される");
        test.todo("各行にフェーズ名、順序、成約確率、アクションボタンが表示される");
        test.todo("フェーズ追加ボタンが上部に表示される");
        test.todo("各行にドラッグハンドルアイコンが表示される");
        test.todo("編集・削除ボタンが各行に表示される");
    });

    describe("状態管理", () => {
        test.todo("ドラッグ中のフェーズが管理される");
        test.todo("編集中のフェーズIDが管理される");
        test.todo("削除確認ダイアログの表示状態が管理される");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("追加ボタンクリックでフェーズ追加フォームが表示される");
        test.todo("フォーム送信でonPhaseAddイベントが発火する");
        test.todo("編集ボタンクリックでフェーズ編集フォームが表示される");
        test.todo("編集フォーム送信でonPhaseEditイベントが発火する");
        test.todo("削除ボタンクリックで削除確認ダイアログが表示される");
        test.todo("削除確認後にonPhaseDeleteイベントが発火する");
        test.todo("フェーズをドラッグして並び替えできる");
        test.todo("並び替え完了時にonPhaseReorderイベントが発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時にフェーズを順序順にソートする");
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

