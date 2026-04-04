import { describe, test } from "vitest";

describe("リードステータス", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test.todo("'未対応'の場合、リードステータスが生成される");
            test.todo("'対応中'の場合、リードステータスが生成される");
            test.todo("'商談化'の場合、リードステータスが生成される");
            test.todo("'失注'の場合、リードステータスが生成される");
            test.todo("'顧客化'の場合、リードステータスが生成される");
        });
        describe("無効な値", () => {
            test.todo("空文字の場合、エラーになる");
            test.todo("上記以外の文字列の場合、エラーになる");
        });
    });

    describe("不変条件", () => {
        test.todo("valueを再代入できない");
    });
});

describe("案件ステータス", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test.todo("'提案'の場合、案件ステータスが生成される");
            test.todo("'交渉'の場合、案件ステータスが生成される");
            test.todo("'クローズ(成功)'の場合、案件ステータスが生成される");
            test.todo("'クローズ(失敗)'の場合、案件ステータスが生成される");
        });
        describe("無効な値", () => {
            test.todo("空文字の場合、エラーになる");
            test.todo("上記以外の文字列の場合、エラーになる");
        });
    });

    describe("不変条件", () => {
        test.todo("valueを再代入できない");
    });
});

describe("活動種別", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test.todo("'面談'の場合、活動種別が生成される");
            test.todo("'電話'の場合、活動種別が生成される");
            test.todo("'メール'の場合、活動種別が生成される");
            test.todo("'その他'の場合、活動種別が生成される");
        });
        describe("無効な値", () => {
            test.todo("空文字の場合、エラーになる");
            test.todo("上記以外の文字列の場合、エラーになる");
        });
    });

    describe("不変条件", () => {
        test.todo("valueを再代入できない");
    });
});

describe("金額", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test.todo("正の整数の場合、金額が生成される");
            test.todo("1の場合、金額が生成される");
        });
        describe("無効な値", () => {
            test.todo("0の場合、エラーになる");
            test.todo("負の数の場合、エラーになる");
            test.todo("小数点を含む場合、エラーになる");
        });
    });

    describe("不変条件", () => {
        test.todo("valueを再代入できない");
    });
});
