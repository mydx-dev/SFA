import { describe, test } from "vitest";

describe("syncユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的更新なし（syncは全件置き換え）");
    });
    describe("call api", () => {
        test.todo("syncAPIを呼び出す");
        test.todo("レスポンスをパースしてSyncOutputを取得する");
        test.todo("各テーブルのレコードをIndexedDBにbulkPutで保存する");
        test.todo("リモートに存在しないレコードをローカルから削除する");
        test.todo("APIがnullを返した場合は何もしない");
    });
});

describe("リード一覧取得フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的更新なし");
    });
    describe("call api", () => {
        test.todo("リード取得APIを呼び出す");
        test.todo("取得したリードデータをIndexedDBに保存する");
        test.todo("取得失敗時はエラーをスローする");
    });
});

describe("リード作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的にローカルにリードを追加する");
        test.todo("失敗時に追加したリードをロールバックする");
    });
    describe("call api", () => {
        test.todo("リード作成APIを呼び出す");
        test.todo("成功時にローカルのリードを確定（サーバー返却値で更新）する");
        test.todo("失敗時にローカルの楽観的更新をロールバックする");
    });
});

describe("リード更新フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的にローカルのリードを更新する");
        test.todo("失敗時に更新前の状態にロールバックする");
    });
    describe("call api", () => {
        test.todo("リード更新APIを呼び出す");
        test.todo("成功時にローカルのリードをサーバー返却値で更新する");
        test.todo("失敗時にロールバックする");
    });
});

describe("案件作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的にローカルに案件を追加する");
        test.todo("失敗時に追加した案件をロールバックする");
    });
    describe("call api", () => {
        test.todo("案件作成APIを呼び出す");
        test.todo("成功時にローカルの案件を確定する");
        test.todo("失敗時にロールバックする");
    });
});

describe("営業活動作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test.todo("楽観的にローカルに営業活動を追加する");
        test.todo("失敗時に追加した営業活動をロールバックする");
    });
    describe("call api", () => {
        test.todo("営業活動作成APIを呼び出す");
        test.todo("成功時にローカルの営業活動を確定する");
        test.todo("失敗時にロールバックする");
    });
});
