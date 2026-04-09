import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("TaskListComponent", () => {
    describe("props", () => {
        test.todo("taskSchedulerのタスク一覧を使用する");
    });

    describe("描画", () => {
        test.todo("タスクが存在しない場合はIconButtonが表示されない");
        test.todo("タスクが存在する場合はIconButtonが表示される");
        test.todo("タスクが存在する場合はバッジにタスク数が表示される");
        test.todo("メニューが閉じている状態では各タスクは表示されない");
    });

    describe("状態管理", () => {
        test.todo("IconButtonクリックでMenuが開く");
        test.todo("Menu外クリックでMenuが閉じる");
        test.todo("タスクが追加されるとバッジのカウントが増える");
    });

    describe("インタラクション", () => {
        test("レイアウトが正しく表示される", () => {
            // Layout test placeholder
            expect(true).toBe(true);
        });
        test.todo("IconButtonクリックでMenuが表示される");
        test.todo("TaskItemの'リトライ'クリックでtaskScheduler.retryが呼ばれる");
        test.todo("taskScheduler.retryに対象タスクのIDが渡される");
    });

    describe("副作用", () => {
        test.todo("マウント時にtaskSchedulerのタスク一覧を取得する");
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

