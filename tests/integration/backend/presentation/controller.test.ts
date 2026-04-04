import { describe, test } from "vitest";

describe("syncコントローラー", () => {
    describe("入力", () => {
        test.todo("入力値なし（セッションから自動取得）");
    });
    describe("主要操作", () => {
        describe("Authenticationアプリケーションサービス", () => {
            test.todo("Authenticationアプリケーションサービスを実行してSystemUserを取得する");
            test.todo("UnauthorizedErrorが発生した場合はエラーレスポンスを返す");
        });
        describe("SyncDataBaseユースケース", () => {
            test.todo("SystemUserを引数にSyncDataBaseユースケースを実行する");
        });
    });
    describe("出力", () => {
        test.todo("AppsScriptResponseでSyncOutputを返す");
        test.todo("未認証の場合はUnauthorizedErrorをそのまま投げる");
    });
});

describe("リードコントローラー", () => {
    describe("入力", () => {
        describe.todo("バリデーション（CREATE）", () => {
            test.todo("氏名が空の場合はバリデーションエラーを返す");
            test.todo("ステータスが無効な値の場合はバリデーションエラーを返す");
        });
        describe.todo("バリデーション（UPDATE）", () => {
            test.todo("IDが未指定の場合はバリデーションエラーを返す");
        });
        describe.todo("バリデーション（DELETE）", () => {
            test.todo("IDが未指定の場合はバリデーションエラーを返す");
        });
    });
    describe("主要操作", () => {
        describe("リード作成ユースケース", () => {
            test.todo("リード作成ユースケースを呼び出す");
        });
        describe("リード一覧取得ユースケース", () => {
            test.todo("リード一覧取得ユースケースを呼び出す");
        });
        describe("リード更新ユースケース", () => {
            test.todo("リード更新ユースケースを呼び出す");
        });
        describe("リード削除ユースケース", () => {
            test.todo("リード削除ユースケースを呼び出す");
        });
    });
    describe("出力", () => {
        test.todo("CREATE: 作成されたリードをAppsScriptResponseで返す");
        test.todo("READ: リード一覧をAppsScriptResponseで返す");
        test.todo("UPDATE: 更新されたリードをAppsScriptResponseで返す");
        test.todo("DELETE: 削除成功をAppsScriptResponseで返す");
    });
});

describe("案件コントローラー", () => {
    describe("入力", () => {
        describe.todo("バリデーション（CREATE）", () => {
            test.todo("案件名が空の場合はバリデーションエラーを返す");
            test.todo("リードIDが未指定の場合はバリデーションエラーを返す");
        });
        describe.todo("バリデーション（UPDATE）", () => {
            test.todo("IDが未指定の場合はバリデーションエラーを返す");
        });
    });
    describe("主要操作", () => {
        describe("案件作成ユースケース", () => {
            test.todo("案件作成ユースケースを呼び出す");
        });
        describe("案件一覧取得ユースケース", () => {
            test.todo("案件一覧取得ユースケースを呼び出す");
        });
        describe("案件更新ユースケース", () => {
            test.todo("案件更新ユースケースを呼び出す");
        });
        describe("案件クローズユースケース", () => {
            test.todo("案件クローズユースケースを呼び出す");
        });
    });
    describe("出力", () => {
        test.todo("CREATE: 作成された案件をAppsScriptResponseで返す");
        test.todo("READ: 案件一覧をAppsScriptResponseで返す");
        test.todo("UPDATE: 更新された案件をAppsScriptResponseで返す");
        test.todo("CLOSE: クローズされた案件をAppsScriptResponseで返す");
    });
});

describe("営業活動コントローラー", () => {
    describe("入力", () => {
        describe.todo("バリデーション（CREATE）", () => {
            test.todo("案件IDが未指定の場合はバリデーションエラーを返す");
            test.todo("活動種別が無効な値の場合はバリデーションエラーを返す");
            test.todo("活動日が未指定の場合はバリデーションエラーを返す");
            test.todo("内容が空の場合はバリデーションエラーを返す");
        });
        describe.todo("バリデーション（UPDATE）", () => {
            test.todo("IDが未指定の場合はバリデーションエラーを返す");
        });
    });
    describe("主要操作", () => {
        describe("営業活動作成ユースケース", () => {
            test.todo("営業活動作成ユースケースを呼び出す");
        });
        describe("営業活動一覧取得ユースケース", () => {
            test.todo("営業活動一覧取得ユースケースを呼び出す");
        });
        describe("営業活動更新ユースケース", () => {
            test.todo("営業活動更新ユースケースを呼び出す");
        });
    });
    describe("出力", () => {
        test.todo("CREATE: 作成された営業活動をAppsScriptResponseで返す");
        test.todo("READ: 営業活動一覧をAppsScriptResponseで返す");
        test.todo("UPDATE: 更新された営業活動をAppsScriptResponseで返す");
    });
});
