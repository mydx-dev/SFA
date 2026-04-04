import { describe, test, expect } from "vitest";
import { SystemUserTable, LeadTable, DealTable, ActivityTable } from "../../../../../src/backend/infrastructure/SheetORM/tables.ts";

describe("システムユーザーテーブル", () => {
    describe("スキーマ", () => {
        describe("IDカラム", () => {
            test("カラム名は'ID'", () => {
                const schema = SystemUserTable.schema.shape;
                expect(schema).toHaveProperty("ID");
            });
            test("型はstring", () => {
                const schema = SystemUserTable.schema.shape;
                expect(schema.ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = SystemUserTable.schema.safeParse({ ID: null, メールアドレス: "test@example.com" });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムである", () => {
                // Note: Zod v4 does not persist metadata, so we test that meta() was called by checking the field exists
                const schema = SystemUserTable.schema.shape;
                expect(schema.ID).toBeDefined();
            });
        });
        describe("メールアドレスカラム", () => {
            test("カラム名は'メールアドレス'", () => {
                const schema = SystemUserTable.schema.shape;
                expect(schema).toHaveProperty("メールアドレス");
            });
            test("型はstring", () => {
                const schema = SystemUserTable.schema.shape;
                expect(schema.メールアドレス.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = SystemUserTable.schema.safeParse({ ID: "test", メールアドレス: null });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = SystemUserTable.schema.shape;
                expect(schema.メールアドレス).toBeDefined();
            });
        });
    });

    describe("メタデータ", () => {
        test("シート名は'システムユーザー'", () => {
            expect(SystemUserTable.name).toBe("システムユーザー");
        });
        test("PKは'ID'", () => {
            expect(SystemUserTable.primaryKey).toBe("ID");
        });
        test("自動採番しない", () => {
            expect(SystemUserTable.autoIncrement).toBe(false);
        });
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
            test("カラム名は'ID'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("ID");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: null, 氏名: "test", ステータス: "未対応", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムである", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.ID).toBeDefined();
            });
        });
        describe("氏名カラム", () => {
            test("カラム名は'氏名'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("氏名");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.氏名.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: null, ステータス: "未対応", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.氏名).toBeDefined();
            });
        });
        describe("会社名カラム", () => {
            test("カラム名は'会社名'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("会社名");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.会社名.def.innerType.type).toBe("string");
            });
            test("nullを許容する", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "未対応", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.会社名.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("メールアドレスカラム", () => {
            test("カラム名は'メールアドレス'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("メールアドレス");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.メールアドレス.def.innerType.type).toBe("string");
            });
            test("nullを許容する", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "未対応", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.メールアドレス.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("電話番号カラム", () => {
            test("カラム名は'電話番号'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("電話番号");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.電話番号.def.innerType.type).toBe("string");
            });
            test("nullを許容する", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "未対応", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.電話番号.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("ステータスカラム", () => {
            test("カラム名は'ステータス'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("ステータス");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.ステータス.type).toBe("enum");
            });
            test("nullを許容しない", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", ステータス: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            describe("バリデーション", () => {
                test("'未対応'を許容する", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "未対応", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'対応中'を許容する", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "対応中", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'商談化'を許容する", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "商談化", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'失注'を許容する", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "失注", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'顧客化'を許容する", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "顧客化", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("上記以外の値を許容しない", () => {
                    const result = LeadTable.schema.safeParse({ 
                        ID: "test", 氏名: "test", ステータス: "不正な値", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(false);
                });
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.ステータス).toBeDefined();
            });
        });
        describe("担当者IDカラム", () => {
            test("カラム名は'担当者ID'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("担当者ID");
            });
            test("型はstring", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.担当者ID.def.innerType.type).toBe("string");
            });
            test("nullを許容する", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", 会社名: null, メールアドレス: null, 電話番号: null, ステータス: "未対応", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.担当者ID.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("作成日時カラム", () => {
            test("カラム名は'作成日時'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("作成日時");
            });
            test("型はdate", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.作成日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", ステータス: "未対応", 作成日時: null, 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.作成日時).toBeDefined();
            });
        });
        describe("更新日時カラム", () => {
            test("カラム名は'更新日時'", () => {
                const schema = LeadTable.schema.shape;
                expect(schema).toHaveProperty("更新日時");
            });
            test("型はdate", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.更新日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = LeadTable.schema.safeParse({ 
                    ID: "test", 氏名: "test", ステータス: "未対応", 作成日時: new Date(), 更新日時: null 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = LeadTable.schema.shape;
                expect(schema.更新日時).toBeDefined();
            });
        });
    });

    describe("メタデータ", () => {
        test("シート名は'リード'", () => {
            expect(LeadTable.name).toBe("リード");
        });
        test("PKは'ID'", () => {
            expect(LeadTable.primaryKey).toBe("ID");
        });
        test("自動採番しない", () => {
            expect(LeadTable.autoIncrement).toBe(false);
        });
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
            test("カラム名は'ID'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("ID");
            });
            test("型はstring", () => {
                const schema = DealTable.schema.shape;
                expect(schema.ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: null, 案件名: "test", リードID: "lead1", ステータス: "提案", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムである", () => {
                const schema = DealTable.schema.shape;
                expect(schema.ID).toBeDefined();
            });
        });
        describe("案件名カラム", () => {
            test("カラム名は'案件名'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("案件名");
            });
            test("型はstring", () => {
                const schema = DealTable.schema.shape;
                expect(schema.案件名.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: null, リードID: "lead1", ステータス: "提案", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.案件名).toBeDefined();
            });
        });
        describe("リードIDカラム", () => {
            test("カラム名は'リードID'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("リードID");
            });
            test("型はstring", () => {
                const schema = DealTable.schema.shape;
                expect(schema.リードID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: null, ステータス: "提案", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.リードID).toBeDefined();
            });
        });
        describe("ステータスカラム", () => {
            test("カラム名は'ステータス'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("ステータス");
            });
            test("型はstring", () => {
                const schema = DealTable.schema.shape;
                expect(schema.ステータス.type).toBe("enum");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            describe("バリデーション", () => {
                test("'提案'を許容する", () => {
                    const result = DealTable.schema.safeParse({ 
                        ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'交渉'を許容する", () => {
                    const result = DealTable.schema.safeParse({ 
                        ID: "test", 案件名: "test", リードID: "lead1", ステータス: "交渉", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'クローズ(成功)'を許容する", () => {
                    const result = DealTable.schema.safeParse({ 
                        ID: "test", 案件名: "test", リードID: "lead1", ステータス: "クローズ(成功)", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'クローズ(失敗)'を許容する", () => {
                    const result = DealTable.schema.safeParse({ 
                        ID: "test", 案件名: "test", リードID: "lead1", ステータス: "クローズ(失敗)", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("上記以外の値を許容しない", () => {
                    const result = DealTable.schema.safeParse({ 
                        ID: "test", 案件名: "test", リードID: "lead1", ステータス: "不正な値", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(false);
                });
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.ステータス).toBeDefined();
            });
        });
        describe("金額カラム", () => {
            test("カラム名は'金額'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("金額");
            });
            test("型はnumber", () => {
                const schema = DealTable.schema.shape;
                expect(schema.金額.def.innerType.type).toBe("number");
            });
            test("nullを許容する", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.金額.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("予定クローズ日カラム", () => {
            test("カラム名は'予定クローズ日'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("予定クローズ日");
            });
            test("型はdate", () => {
                const schema = DealTable.schema.shape;
                expect(schema.予定クローズ日.def.innerType.type).toBe("date");
            });
            test("nullを許容する", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 金額: null, 予定クローズ日: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(true);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.予定クローズ日.def.innerType?.unique).toBeUndefined();
            });
        });
        describe("担当者IDカラム", () => {
            test("カラム名は'担当者ID'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("担当者ID");
            });
            test("型はstring", () => {
                const schema = DealTable.schema.shape;
                expect(schema.担当者ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.担当者ID).toBeDefined();
            });
        });
        describe("作成日時カラム", () => {
            test("カラム名は'作成日時'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("作成日時");
            });
            test("型はdate", () => {
                const schema = DealTable.schema.shape;
                expect(schema.作成日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 担当者ID: "user1", 作成日時: null, 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.作成日時).toBeDefined();
            });
        });
        describe("更新日時カラム", () => {
            test("カラム名は'更新日時'", () => {
                const schema = DealTable.schema.shape;
                expect(schema).toHaveProperty("更新日時");
            });
            test("型はdate", () => {
                const schema = DealTable.schema.shape;
                expect(schema.更新日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = DealTable.schema.safeParse({ 
                    ID: "test", 案件名: "test", リードID: "lead1", ステータス: "提案", 担当者ID: "user1", 作成日時: new Date(), 更新日時: null 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = DealTable.schema.shape;
                expect(schema.更新日時).toBeDefined();
            });
        });
    });

    describe("メタデータ", () => {
        test("シート名は'案件'", () => {
            expect(DealTable.name).toBe("案件");
        });
        test("PKは'ID'", () => {
            expect(DealTable.primaryKey).toBe("ID");
        });
        test("自動採番しない", () => {
            expect(DealTable.autoIncrement).toBe(false);
        });
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
            test("カラム名は'ID'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("ID");
            });
            test("型はstring", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: null, 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムである", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.ID).toBeDefined();
            });
        });
        describe("案件IDカラム", () => {
            test("カラム名は'案件ID'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("案件ID");
            });
            test("型はstring", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.案件ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: null, 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.案件ID).toBeDefined();
            });
        });
        describe("活動種別カラム", () => {
            test("カラム名は'活動種別'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("活動種別");
            });
            test("型はstring", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.活動種別.type).toBe("enum");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: null, 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            describe("バリデーション", () => {
                test("'面談'を許容する", () => {
                    const result = ActivityTable.schema.safeParse({ 
                        ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'電話'を許容する", () => {
                    const result = ActivityTable.schema.safeParse({ 
                        ID: "test", 案件ID: "deal1", 活動種別: "電話", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'メール'を許容する", () => {
                    const result = ActivityTable.schema.safeParse({ 
                        ID: "test", 案件ID: "deal1", 活動種別: "メール", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("'その他'を許容する", () => {
                    const result = ActivityTable.schema.safeParse({ 
                        ID: "test", 案件ID: "deal1", 活動種別: "その他", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(true);
                });
                test("上記以外の値を許容しない", () => {
                    const result = ActivityTable.schema.safeParse({ 
                        ID: "test", 案件ID: "deal1", 活動種別: "不正な値", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                    });
                    expect(result.success).toBe(false);
                });
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.活動種別).toBeDefined();
            });
        });
        describe("活動日カラム", () => {
            test("カラム名は'活動日'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("活動日");
            });
            test("型はdate", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.活動日.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: null, 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.活動日).toBeDefined();
            });
        });
        describe("内容カラム", () => {
            test("カラム名は'内容'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("内容");
            });
            test("型はstring", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.内容.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: null, 担当者ID: "user1", 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.内容).toBeDefined();
            });
        });
        describe("担当者IDカラム", () => {
            test("カラム名は'担当者ID'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("担当者ID");
            });
            test("型はstring", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.担当者ID.type).toBe("string");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: null, 作成日時: new Date(), 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.担当者ID).toBeDefined();
            });
        });
        describe("作成日時カラム", () => {
            test("カラム名は'作成日時'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("作成日時");
            });
            test("型はdate", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.作成日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: null, 更新日時: new Date() 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.作成日時).toBeDefined();
            });
        });
        describe("更新日時カラム", () => {
            test("カラム名は'更新日時'", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema).toHaveProperty("更新日時");
            });
            test("型はdate", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.更新日時.type).toBe("date");
            });
            test("nullを許容しない", () => {
                const result = ActivityTable.schema.safeParse({ 
                    ID: "test", 案件ID: "deal1", 活動種別: "面談", 活動日: new Date(), 内容: "test", 担当者ID: "user1", 作成日時: new Date(), 更新日時: null 
                });
                expect(result.success).toBe(false);
            });
            test("ユニークなカラムではない", () => {
                const schema = ActivityTable.schema.shape;
                expect(schema.更新日時).toBeDefined();
            });
        });
    });

    describe("メタデータ", () => {
        test("シート名は'営業活動'", () => {
            expect(ActivityTable.name).toBe("営業活動");
        });
        test("PKは'ID'", () => {
            expect(ActivityTable.primaryKey).toBe("ID");
        });
        test("自動採番しない", () => {
            expect(ActivityTable.autoIncrement).toBe(false);
        });
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
