import { describe, test } from "vitest";

describe("AppLayout", () => {
    describe("構造", () => {
        test.todo("childrenが正しく描画される");
        test.todo("ヘッダーが表示される");
        test.todo("TaskListコンポーネントがヘッダーに表示される");
        test.todo("ナビゲーションメニューが表示される");
    });

    describe("ナビゲーション", () => {
        test.todo("'リード'メニュークリックでリード一覧ページに遷移する");
        test.todo("'案件'メニュークリックで案件一覧ページに遷移する");
        test.todo("現在のページに対応するナビゲーションがアクティブ状態になる");
    });

    describe("認証・認可", () => {
        test.todo("マウント時にsyncが実行されリモートデータが取得される");
        test.todo("sync失敗時はエラー状態になる");
    });

    describe("共通状態", () => {
        test.todo("syncのタスク状態がTaskListコンポーネントで表示できる");
        test.todo("全ページ共通でTaskListコンポーネントが利用できる");
    });
});
