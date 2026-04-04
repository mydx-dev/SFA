import { describe, test } from "vitest";

describe("オブジェクト名", () => {
    describe("生成", () => {
        describe("xxx", () => {
            test.todo("xxxの場合、xxxがxxxになる");
        });
    });

    describe("不変条件", () => {
        test.todo("xxxを再代入できない");
    });
});
