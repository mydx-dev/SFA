import { describe, test, expect } from "vitest";
import { LeadStatus } from "../../../../src/backend/domain/valueObject/LeadStatus";
import { DealStatus } from "../../../../src/backend/domain/valueObject/DealStatus";
import { ActivityType } from "../../../../src/backend/domain/valueObject/ActivityType";
import { Amount } from "../../../../src/backend/domain/valueObject/Amount";

describe("リードステータス", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test("'未対応'の場合、リードステータスが生成される", () => {
                const status = new LeadStatus("未対応");
                expect(status.value).toBe("未対応");
            });
            test("'対応中'の場合、リードステータスが生成される", () => {
                const status = new LeadStatus("対応中");
                expect(status.value).toBe("対応中");
            });
            test("'商談化'の場合、リードステータスが生成される", () => {
                const status = new LeadStatus("商談化");
                expect(status.value).toBe("商談化");
            });
            test("'失注'の場合、リードステータスが生成される", () => {
                const status = new LeadStatus("失注");
                expect(status.value).toBe("失注");
            });
            test("'顧客化'の場合、リードステータスが生成される", () => {
                const status = new LeadStatus("顧客化");
                expect(status.value).toBe("顧客化");
            });
        });
        describe("無効な値", () => {
            test("空文字の場合、エラーになる", () => {
                expect(() => new LeadStatus("")).toThrow(
                    "リードステータスは空文字にできません",
                );
            });
            test("上記以外の文字列の場合、エラーになる", () => {
                expect(() => new LeadStatus("無効な値")).toThrow(
                    "無効なリードステータスです: 無効な値",
                );
            });
        });
    });

    describe("不変条件", () => {
        test("valueを再代入できない", () => {
            const status = new LeadStatus("未対応");
            expect(() => {
                (status as any).value = "対応中";
            }).toThrow();
        });
    });
});

describe("案件ステータス", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test("'提案'の場合、案件ステータスが生成される", () => {
                const status = new DealStatus("提案");
                expect(status.value).toBe("提案");
            });
            test("'交渉'の場合、案件ステータスが生成される", () => {
                const status = new DealStatus("交渉");
                expect(status.value).toBe("交渉");
            });
            test("'クローズ(成功)'の場合、案件ステータスが生成される", () => {
                const status = new DealStatus("クローズ(成功)");
                expect(status.value).toBe("クローズ(成功)");
            });
            test("'クローズ(失敗)'の場合、案件ステータスが生成される", () => {
                const status = new DealStatus("クローズ(失敗)");
                expect(status.value).toBe("クローズ(失敗)");
            });
        });
        describe("無効な値", () => {
            test("空文字の場合、エラーになる", () => {
                expect(() => new DealStatus("")).toThrow(
                    "案件ステータスは空文字にできません",
                );
            });
            test("上記以外の文字列の場合、エラーになる", () => {
                expect(() => new DealStatus("無効な値")).toThrow(
                    "無効な案件ステータスです: 無効な値",
                );
            });
        });
    });

    describe("不変条件", () => {
        test("valueを再代入できない", () => {
            const status = new DealStatus("提案");
            expect(() => {
                (status as any).value = "交渉";
            }).toThrow();
        });
    });
});

describe("活動種別", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test("'面談'の場合、活動種別が生成される", () => {
                const activityType = new ActivityType("面談");
                expect(activityType.value).toBe("面談");
            });
            test("'電話'の場合、活動種別が生成される", () => {
                const activityType = new ActivityType("電話");
                expect(activityType.value).toBe("電話");
            });
            test("'メール'の場合、活動種別が生成される", () => {
                const activityType = new ActivityType("メール");
                expect(activityType.value).toBe("メール");
            });
            test("'その他'の場合、活動種別が生成される", () => {
                const activityType = new ActivityType("その他");
                expect(activityType.value).toBe("その他");
            });
        });
        describe("無効な値", () => {
            test("空文字の場合、エラーになる", () => {
                expect(() => new ActivityType("")).toThrow(
                    "活動種別は空文字にできません",
                );
            });
            test("上記以外の文字列の場合、エラーになる", () => {
                expect(() => new ActivityType("無効な値")).toThrow(
                    "無効な活動種別です: 無効な値",
                );
            });
        });
    });

    describe("不変条件", () => {
        test("valueを再代入できない", () => {
            const activityType = new ActivityType("面談");
            expect(() => {
                (activityType as any).value = "電話";
            }).toThrow();
        });
    });
});

describe("金額", () => {
    describe("生成", () => {
        describe("有効な値", () => {
            test("正の整数の場合、金額が生成される", () => {
                const amount = new Amount(1000);
                expect(amount.value).toBe(1000);
            });
            test("1の場合、金額が生成される", () => {
                const amount = new Amount(1);
                expect(amount.value).toBe(1);
            });
        });
        describe("無効な値", () => {
            test("0の場合、エラーになる", () => {
                expect(() => new Amount(0)).toThrow(
                    "金額は正の数である必要があります",
                );
            });
            test("負の数の場合、エラーになる", () => {
                expect(() => new Amount(-100)).toThrow(
                    "金額は正の数である必要があります",
                );
            });
            test("小数点を含む場合、エラーになる", () => {
                expect(() => new Amount(100.5)).toThrow(
                    "金額は整数である必要があります",
                );
            });
        });
    });

    describe("不変条件", () => {
        test("valueを再代入できない", () => {
            const amount = new Amount(1000);
            expect(() => {
                (amount as any).value = 2000;
            }).toThrow();
        });
    });
});
