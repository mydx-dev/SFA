import { describe, test } from "vitest";

describe("xxxテーブル", () => {
    describe("スキーマ", () => {
        describe("xxxカラム", () => {
            test.todo("カラム名は'xxx'");
            test.todo("型はxxx");
            test.todo("nullを許容する or しない");
            describe.todo("バリデーション", () => {
                test.todo("something rule");
            });
            test.todo("ユニークなカラムではない or である");
        });
    });

    describe("メタデータ", () => {
        test.todo("シート名は'xxx'");
        test.todo("PKはxx");
        test.todo("自動採番する or しない");
    });

    describe("リレーション", () => {
        describe.todo("xxxテーブル", () => {
            test.todo("xxxを外部キーにする");
            test.todo("xxxを参照する");
            test.todo(
                "XxxTableが削除された場合、外部キーをnullにする or 削除する or 削除しない",
            );
        });
    });
});
