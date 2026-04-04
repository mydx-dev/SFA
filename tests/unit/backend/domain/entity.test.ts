import { describe, test } from "vitest";

describe("SystemUserエンティティ", () => {
    describe("状態の参照", () => {
        test.todo("idはコンストラクタで渡した値になる");
        test.todo("emailはコンストラクタで渡した値になる");
    });
});

describe("リードエンティティ", () => {
    describe("状態の参照", () => {
        test.todo("idはコンストラクタで渡した値になる");
        test.todo("氏名はコンストラクタで渡した値になる");
        test.todo("ステータスはコンストラクタで渡した値になる");
        test.todo("担当者IDはコンストラクタで渡した値になる");
        test.todo("会社名はコンストラクタで渡した値になる（nullableの場合はnull）");
    });

    describe("状態の更新", () => {
        test.todo("ステータスを新しい値に変える");
        test.todo("担当者IDを別のユーザーIDに変える");
        test.todo("氏名を新しい名前に変える");
        test.todo("会社名を新しい値に変える");
        test.todo("メールアドレスを新しい値に変える");
        test.todo("電話番号を新しい値に変える");
    });

    describe("状態の判定", () => {
        describe("商談化済み判定", () => {
            test.todo("ステータスが'商談化'の場合はtrue");
            test.todo("ステータスが'未対応'の場合はfalse");
            test.todo("ステータスが'対応中'の場合はfalse");
            test.todo("ステータスが'失注'の場合はfalse");
            test.todo("ステータスが'顧客化'の場合はfalse");
        });
        describe("対応完了判定", () => {
            test.todo("ステータスが'顧客化'の場合はtrue");
            test.todo("ステータスが'失注'の場合はtrue");
            test.todo("ステータスが'未対応'の場合はfalse");
            test.todo("ステータスが'対応中'の場合はfalse");
            test.todo("ステータスが'商談化'の場合はfalse");
        });
    });

    describe("ドメインロジック", () => {
        describe("商談化", () => {
            test.todo("ステータスを'商談化'に変更できる");
            test.todo("既に'商談化'の場合はエラーになる");
            test.todo("'失注'または'顧客化'の場合はエラーになる");
        });
    });
});

describe("案件エンティティ", () => {
    describe("状態の参照", () => {
        test.todo("idはコンストラクタで渡した値になる");
        test.todo("案件名はコンストラクタで渡した値になる");
        test.todo("ステータスはコンストラクタで渡した値になる");
        test.todo("金額はコンストラクタで渡した値になる（nullableの場合はnull）");
        test.todo("予定クローズ日はコンストラクタで渡した値になる（nullableの場合はnull）");
        test.todo("リードIDはコンストラクタで渡した値になる");
        test.todo("担当者IDはコンストラクタで渡した値になる");
    });

    describe("状態の更新", () => {
        test.todo("ステータスを新しい値に変える");
        test.todo("金額を新しい値に変える");
        test.todo("予定クローズ日を設定できる");
        test.todo("案件名を新しい値に変える");
        test.todo("担当者IDを変更できる");
    });

    describe("状態の判定", () => {
        describe("クローズ済み判定", () => {
            test.todo("ステータスが'クローズ(成功)'の場合はtrue");
            test.todo("ステータスが'クローズ(失敗)'の場合はtrue");
            test.todo("ステータスが'提案'の場合はfalse");
            test.todo("ステータスが'交渉'の場合はfalse");
        });
        describe("成功クローズ判定", () => {
            test.todo("ステータスが'クローズ(成功)'の場合はtrue");
            test.todo("ステータスが'クローズ(失敗)'の場合はfalse");
            test.todo("ステータスが'提案'の場合はfalse");
        });
    });

    describe("ドメインロジック", () => {
        describe("クローズ", () => {
            test.todo("成功でクローズするとステータスが'クローズ(成功)'になる");
            test.todo("失敗でクローズするとステータスが'クローズ(失敗)'になる");
            test.todo("既にクローズ済みの場合はエラーになる");
        });
    });
});

describe("営業活動エンティティ", () => {
    describe("状態の参照", () => {
        test.todo("idはコンストラクタで渡した値になる");
        test.todo("案件IDはコンストラクタで渡した値になる");
        test.todo("活動種別はコンストラクタで渡した値になる");
        test.todo("活動日はコンストラクタで渡した値になる");
        test.todo("内容はコンストラクタで渡した値になる");
        test.todo("担当者IDはコンストラクタで渡した値になる");
    });

    describe("状態の更新", () => {
        test.todo("内容を新しい値に変える");
        test.todo("活動日を新しい日付に変える");
        test.todo("活動種別を変更できる");
    });

    describe("状態の判定", () => {
        describe("当日活動判定", () => {
            test.todo("活動日が今日の場合はtrue");
            test.todo("活動日が昨日の場合はfalse");
            test.todo("活動日が明日の場合はfalse");
        });
    });
});
