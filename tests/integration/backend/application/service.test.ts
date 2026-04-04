import { describe, test } from "vitest";

describe("Authenticationアプリケーションサービス", () => {
    describe("入力", () => {
        test.todo("GoogleセッションのアクティブユーザーのメールアドレスをSessionから取得する");
    });
    describe("主要操作", () => {
        describe("DB操作", () => {
            test.todo("システムユーザーテーブルからメールアドレスで検索する");
        });
        describe("ドメイン操作", () => {
            test.todo("ユーザーが存在しない場合はUnauthorizedErrorを投げる");
            test.todo("ユーザーが存在する場合はSystemUser DTOを生成する");
        });
    });
    describe("出力", () => {
        test.todo("SystemUser DTOを返す");
        test.todo("未登録ユーザーの場合はUnauthorizedErrorを投げる");
    });
});
