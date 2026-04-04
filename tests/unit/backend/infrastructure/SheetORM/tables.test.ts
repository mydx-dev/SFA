import { describe, test } from "vitest";

describe("システムユーザーテーブル", () => {
    describe("スキーマ", () => {
        describe("IDカラム", () => {
            test.todo("カラム名は'ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムである");
        });
        describe("メールアドレスカラム", () => {
            test.todo("カラム名は'メールアドレス'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
    });

    describe("メタデータ", () => {
        test.todo("シート名は'システムユーザー'");
        test.todo("PKは'ID'");
        test.todo("自動採番しない");
    });

    describe("リレーション", () => {
        describe.todo("リードテーブル", () => {
            test.todo("IDを外部キーにする");
            test.todo("担当者IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
        describe.todo("案件テーブル", () => {
            test.todo("IDを外部キーにする");
            test.todo("担当者IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
        describe.todo("営業活動テーブル", () => {
            test.todo("IDを外部キーにする");
            test.todo("担当者IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
    });
});

describe("リードテーブル", () => {
    describe("スキーマ", () => {
        describe("IDカラム", () => {
            test.todo("カラム名は'ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムである");
        });
        describe("氏名カラム", () => {
            test.todo("カラム名は'氏名'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("会社名カラム", () => {
            test.todo("カラム名は'会社名'");
            test.todo("型はstring");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("メールアドレスカラム", () => {
            test.todo("カラム名は'メールアドレス'");
            test.todo("型はstring");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("電話番号カラム", () => {
            test.todo("カラム名は'電話番号'");
            test.todo("型はstring");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("ステータスカラム", () => {
            test.todo("カラム名は'ステータス'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            describe.todo("バリデーション", () => {
                test.todo("'未対応'を許容する");
                test.todo("'対応中'を許容する");
                test.todo("'商談化'を許容する");
                test.todo("'失注'を許容する");
                test.todo("'顧客化'を許容する");
                test.todo("上記以外の値を許容しない");
            });
            test.todo("ユニークなカラムではない");
        });
        describe("担当者IDカラム", () => {
            test.todo("カラム名は'担当者ID'");
            test.todo("型はstring");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("作成日時カラム", () => {
            test.todo("カラム名は'作成日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("更新日時カラム", () => {
            test.todo("カラム名は'更新日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
    });

    describe("メタデータ", () => {
        test.todo("シート名は'リード'");
        test.todo("PKは'ID'");
        test.todo("自動採番しない");
    });

    describe("リレーション", () => {
        describe.todo("システムユーザーテーブル", () => {
            test.todo("担当者IDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
        describe.todo("案件テーブル", () => {
            test.todo("リードIDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("リードが削除された場合、関連する案件も削除する");
        });
    });
});

describe("案件テーブル", () => {
    describe("スキーマ", () => {
        describe("IDカラム", () => {
            test.todo("カラム名は'ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムである");
        });
        describe("案件名カラム", () => {
            test.todo("カラム名は'案件名'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("リードIDカラム", () => {
            test.todo("カラム名は'リードID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("ステータスカラム", () => {
            test.todo("カラム名は'ステータス'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            describe.todo("バリデーション", () => {
                test.todo("'提案'を許容する");
                test.todo("'交渉'を許容する");
                test.todo("'クローズ(成功)'を許容する");
                test.todo("'クローズ(失敗)'を許容する");
                test.todo("上記以外の値を許容しない");
            });
            test.todo("ユニークなカラムではない");
        });
        describe("金額カラム", () => {
            test.todo("カラム名は'金額'");
            test.todo("型はnumber");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("予定クローズ日カラム", () => {
            test.todo("カラム名は'予定クローズ日'");
            test.todo("型はdate");
            test.todo("nullを許容する");
            test.todo("ユニークなカラムではない");
        });
        describe("担当者IDカラム", () => {
            test.todo("カラム名は'担当者ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("作成日時カラム", () => {
            test.todo("カラム名は'作成日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("更新日時カラム", () => {
            test.todo("カラム名は'更新日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
    });

    describe("メタデータ", () => {
        test.todo("シート名は'案件'");
        test.todo("PKは'ID'");
        test.todo("自動採番しない");
    });

    describe("リレーション", () => {
        describe.todo("リードテーブル", () => {
            test.todo("リードIDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("リードが削除された場合、関連する案件も削除する");
        });
        describe.todo("システムユーザーテーブル", () => {
            test.todo("担当者IDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
        describe.todo("営業活動テーブル", () => {
            test.todo("案件IDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("案件が削除された場合、関連する営業活動も削除する");
        });
    });
});

describe("営業活動テーブル", () => {
    describe("スキーマ", () => {
        describe("IDカラム", () => {
            test.todo("カラム名は'ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムである");
        });
        describe("案件IDカラム", () => {
            test.todo("カラム名は'案件ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("活動種別カラム", () => {
            test.todo("カラム名は'活動種別'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            describe.todo("バリデーション", () => {
                test.todo("'面談'を許容する");
                test.todo("'電話'を許容する");
                test.todo("'メール'を許容する");
                test.todo("'その他'を許容する");
                test.todo("上記以外の値を許容しない");
            });
            test.todo("ユニークなカラムではない");
        });
        describe("活動日カラム", () => {
            test.todo("カラム名は'活動日'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("内容カラム", () => {
            test.todo("カラム名は'内容'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("担当者IDカラム", () => {
            test.todo("カラム名は'担当者ID'");
            test.todo("型はstring");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("作成日時カラム", () => {
            test.todo("カラム名は'作成日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
        describe("更新日時カラム", () => {
            test.todo("カラム名は'更新日時'");
            test.todo("型はdate");
            test.todo("nullを許容しない");
            test.todo("ユニークなカラムではない");
        });
    });

    describe("メタデータ", () => {
        test.todo("シート名は'営業活動'");
        test.todo("PKは'ID'");
        test.todo("自動採番しない");
    });

    describe("リレーション", () => {
        describe.todo("案件テーブル", () => {
            test.todo("案件IDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("案件が削除された場合、関連する営業活動も削除する");
        });
        describe.todo("システムユーザーテーブル", () => {
            test.todo("担当者IDを外部キーにする");
            test.todo("IDを参照する");
            test.todo("SystemUserTableが削除された場合、担当者IDをnullにする");
        });
    });
});
