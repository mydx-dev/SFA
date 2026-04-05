import { describe, test, expect, beforeEach } from "vitest";
import {
    SheetDB,
    InMemoryDataStore,
    InMemoryGateway,
    InMemoryCacheService,
    InMemoryUtilities,
} from "@mydx-dev/gas-boost-runtime";
import { SyncDataBaseUseCase } from "../../../../src/backend/application/usecase/SyncDataBaseUseCase";
import { ALL_TABLES, SystemUserTable, LeadTable, DealTable, ActivityTable } from "../../../../src/backend/infrastructure/SheetORM/tables";
import { SystemUser as SystemUserEntity } from "../../../../src/backend/domain/entity/SystemUser";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";
import { Activity } from "../../../../src/backend/domain/entity/Activity";

describe("SyncDataBaseユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let useCase: SyncDataBaseUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
        // Initialize empty tables (key format: dbId:tableName, where dbId is empty string "")
        datastore.set(`:システムユーザー`, [
            ["ID", "メールアドレス"]
        ]);
        datastore.set(`:リード`, [
            ["ID", "氏名", "会社名", "メールアドレス", "電話番号", "ステータス", "担当者ID", "作成日時", "更新日時"]
        ]);
        datastore.set(`:案件`, [
            ["ID", "案件名", "リードID", "ステータス", "金額", "予定クローズ日", "担当者ID", "作成日時", "更新日時"]
        ]);
        datastore.set(`:営業活動`, [
            ["ID", "案件ID", "活動種別", "活動日", "内容", "担当者ID", "作成日時", "更新日時"]
        ]);
        
        const gateway = new InMemoryGateway(datastore);
        db = new SheetDB(ALL_TABLES, gateway, new InMemoryCacheService(), new InMemoryUtilities());
        useCase = new SyncDataBaseUseCase(db);
    });

    describe("バリデーション", () => {
        test("ユーザーが存在しない場合エラーになる", () => {
            const user = { id: "user-1", email: "nonexistent@example.com" };
            
            expect(() => useCase.execute(user)).toThrow("ユーザーが存在しません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("システムユーザーテーブルからメールアドレスで絞り込んで検索する", () => {
                db.table("システムユーザー").create([{
                    ID: "user-1",
                    メールアドレス: "test@example.com"
                }]);

                const user = { id: "user-1", email: "test@example.com" };
                const result = useCase.execute(user);

                const usersTable = result.find(r => r.table === SystemUserTable);
                expect(usersTable).toBeDefined();
                expect(usersTable!.records).toHaveLength(1);
                expect(usersTable!.records[0]).toMatchObject({
                    ID: "user-1",
                    メールアドレス: "test@example.com"
                });
            });

            test("リードテーブルから担当者IDで絞り込んで検索する", () => {
                db.table("システムユーザー").create([{
                    ID: "user-1",
                    メールアドレス: "test@example.com"
                }]);

                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "未対応",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "lead-2",
                        氏名: "佐藤花子",
                        会社名: "株式会社B",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "未対応",
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const user = { id: "user-1", email: "test@example.com" };
                const result = useCase.execute(user);

                const leadsTable = result.find(r => r.table === LeadTable);
                expect(leadsTable).toBeDefined();
                expect(leadsTable!.records).toHaveLength(1);
                expect(leadsTable!.records[0]).toMatchObject({
                    ID: "lead-1",
                    担当者ID: "user-1"
                });
            });

            test("案件テーブルから担当者IDで絞り込んで検索する", () => {
                db.table("システムユーザー").create([{
                    ID: "user-1",
                    メールアドレス: "test@example.com"
                }]);

                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: null,
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "商談化",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: null,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: null,
                        予定クローズ日: null,
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const user = { id: "user-1", email: "test@example.com" };
                const result = useCase.execute(user);

                const dealsTable = result.find(r => r.table === DealTable);
                expect(dealsTable).toBeDefined();
                expect(dealsTable!.records).toHaveLength(1);
                expect(dealsTable!.records[0]).toMatchObject({
                    ID: "deal-1",
                    担当者ID: "user-1"
                });
            });

            test("営業活動テーブルから担当者IDで絞り込んで検索する", () => {
                db.table("システムユーザー").create([{
                    ID: "user-1",
                    メールアドレス: "test@example.com"
                }]);

                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: null,
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "商談化",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: null,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date(),
                        内容: "打ち合わせ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-1",
                        活動種別: "電話",
                        活動日: new Date(),
                        内容: "電話対応",
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const user = { id: "user-1", email: "test@example.com" };
                const result = useCase.execute(user);

                const activitiesTable = result.find(r => r.table === ActivityTable);
                expect(activitiesTable).toBeDefined();
                expect(activitiesTable!.records).toHaveLength(1);
                expect(activitiesTable!.records[0]).toMatchObject({
                    ID: "activity-1",
                    担当者ID: "user-1"
                });
            });
        });
    });

    describe("出力", () => {
        test("SyncOutput形式で全テーブルのデータを返す", () => {
            db.table("システムユーザー").create([{
                ID: "user-1",
                メールアドレス: "test@example.com"
            }]);

            const user = { id: "user-1", email: "test@example.com" };
            const result = useCase.execute(user);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(4);
            expect(result.map(r => r.table)).toEqual([
                SystemUserTable,
                LeadTable,
                DealTable,
                ActivityTable
            ]);
        });

        test("各テーブルのレコードはシリアライズされた形式で返る", () => {
            db.table("システムユーザー").create([{
                ID: "user-1",
                メールアドレス: "test@example.com"
            }]);

            db.table("リード").create([{
                ID: "lead-1",
                氏名: "田中太郎",
                会社名: null,
                メールアドレス: null,
                電話番号: null,
                ステータス: "未対応",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const user = { id: "user-1", email: "test@example.com" };
            const result = useCase.execute(user);

            const usersTable = result.find(r => r.table === SystemUserTable);
            expect(usersTable!.records[0]).toHaveProperty("ID");
            expect(usersTable!.records[0]).toHaveProperty("メールアドレス");

            const leadsTable = result.find(r => r.table === LeadTable);
            expect(leadsTable!.records[0]).toHaveProperty("ID");
            expect(leadsTable!.records[0]).toHaveProperty("氏名");
            expect(leadsTable!.records[0]).toHaveProperty("ステータス");
        });
    });
});

describe("リード作成ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("氏名が空の場合エラーになる");
        test.todo("ステータスが無効な値の場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("ドメイン操作", () => {
            test.todo("リードエンティティを生成する");
            test.todo("初期ステータスは'未対応'になる");
        });
        describe("DB操作", () => {
            test.todo("リードテーブルにリードを保存する");
        });
    });

    describe("出力", () => {
        test.todo("作成されたリードエンティティを返す");
    });
});

describe("リード一覧取得ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("バリデーションなし");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("リードテーブルから全件取得する");
            test.todo("担当者IDが指定された場合は絞り込む");
            test.todo("ステータスが指定された場合は絞り込む");
        });
    });

    describe("出力", () => {
        test.todo("リードエンティティの一覧を返す");
        test.todo("リードが存在しない場合は空配列を返す");
    });
});

describe("リード更新ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("IDが存在しない場合エラーになる");
        test.todo("ステータスが無効な値の場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("リードテーブルからIDでリードを取得する");
            test.todo("リードテーブルに更新後のリードを保存する");
        });
        describe("ドメイン操作", () => {
            test.todo("リードエンティティの状態を更新する");
        });
    });

    describe("出力", () => {
        test.todo("更新されたリードエンティティを返す");
    });
});

describe("リード削除ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("IDが存在しない場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("リードに紐づく営業活動を全て削除する");
            test.todo("リードに紐づく案件を全て削除する");
            test.todo("リードテーブルからリードを削除する");
        });
    });

    describe("出力", () => {
        test.todo("削除成功を返す");
    });
});

describe("案件作成ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("案件名が空の場合エラーになる");
        test.todo("リードIDが指定されていない場合エラーになる");
        test.todo("リードIDに該当するリードが存在しない場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("リードテーブルからリードIDでリードを取得する");
            test.todo("案件テーブルに案件を保存する");
            test.todo("リードテーブルのステータスを更新する");
        });
        describe("ドメイン操作", () => {
            test.todo("案件エンティティを生成する");
            test.todo("初期ステータスは'提案'になる");
            test.todo("リードエンティティのステータスを'商談化'に変更する");
        });
    });

    describe("出力", () => {
        test.todo("作成された案件エンティティを返す");
    });
});

describe("案件一覧取得ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("バリデーションなし");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("案件テーブルから全件取得する");
            test.todo("リードIDが指定された場合は絞り込む");
            test.todo("担当者IDが指定された場合は絞り込む");
            test.todo("ステータスが指定された場合は絞り込む");
        });
    });

    describe("出力", () => {
        test.todo("案件エンティティの一覧を返す");
        test.todo("案件が存在しない場合は空配列を返す");
    });
});

describe("案件更新ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("IDが存在しない場合エラーになる");
        test.todo("ステータスが無効な値の場合エラーになる");
        test.todo("クローズ済みの案件を更新しようとした場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("案件テーブルからIDで案件を取得する");
            test.todo("案件テーブルに更新後の案件を保存する");
        });
        describe("ドメイン操作", () => {
            test.todo("案件エンティティの状態を更新する");
        });
    });

    describe("出力", () => {
        test.todo("更新された案件エンティティを返す");
    });
});

describe("案件クローズユースケース", () => {
    describe("バリデーション", () => {
        test.todo("IDが存在しない場合エラーになる");
        test.todo("既にクローズ済みの場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("案件テーブルからIDで案件を取得する");
            test.todo("案件テーブルにクローズ後の案件を保存する");
            test.todo("成功クローズの場合、リードのステータスを'顧客化'に更新する");
            test.todo("失敗クローズの場合、リードのステータスを'失注'に更新する");
        });
        describe("ドメイン操作", () => {
            test.todo("案件エンティティをクローズする");
            test.todo("リードエンティティのステータスを更新する");
        });
    });

    describe("出力", () => {
        test.todo("クローズされた案件エンティティを返す");
    });
});

describe("営業活動作成ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("案件IDが指定されていない場合エラーになる");
        test.todo("案件IDに該当する案件が存在しない場合エラーになる");
        test.todo("活動種別が無効な値の場合エラーになる");
        test.todo("活動日が指定されていない場合エラーになる");
        test.todo("内容が空の場合エラーになる");
        test.todo("クローズ済みの案件に営業活動を追加しようとした場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("案件テーブルから案件IDで案件を取得する");
            test.todo("営業活動テーブルに営業活動を保存する");
        });
        describe("ドメイン操作", () => {
            test.todo("営業活動エンティティを生成する");
        });
    });

    describe("出力", () => {
        test.todo("作成された営業活動エンティティを返す");
    });
});

describe("営業活動一覧取得ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("バリデーションなし");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("営業活動テーブルから全件取得する");
            test.todo("案件IDが指定された場合は絞り込む");
            test.todo("活動日の降順で取得する");
        });
    });

    describe("出力", () => {
        test.todo("営業活動エンティティの一覧を返す");
        test.todo("営業活動が存在しない場合は空配列を返す");
    });
});

describe("営業活動更新ユースケース", () => {
    describe("バリデーション", () => {
        test.todo("IDが存在しない場合エラーになる");
        test.todo("活動種別が無効な値の場合エラーになる");
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test.todo("営業活動テーブルからIDで営業活動を取得する");
            test.todo("営業活動テーブルに更新後の営業活動を保存する");
        });
        describe("ドメイン操作", () => {
            test.todo("営業活動エンティティの状態を更新する");
        });
    });

    describe("出力", () => {
        test.todo("更新された営業活動エンティティを返す");
    });
});
