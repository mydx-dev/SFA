import { describe, test, expect, beforeEach } from "vitest";
import {
    SheetDB,
    InMemoryDataStore,
    InMemoryGateway,
    InMemoryCacheService,
    InMemoryUtilities,
} from "@mydx-dev/gas-boost-runtime";
import { SyncDataBaseUseCase } from "../../../../src/backend/application/usecase/SyncDataBaseUseCase";
import { CreateLeadUseCase } from "../../../../src/backend/application/usecase/CreateLeadUseCase";
import { ListLeadsUseCase } from "../../../../src/backend/application/usecase/ListLeadsUseCase";
import { UpdateLeadUseCase } from "../../../../src/backend/application/usecase/UpdateLeadUseCase";
import { DeleteLeadUseCase } from "../../../../src/backend/application/usecase/DeleteLeadUseCase";
import { CreateDealUseCase } from "../../../../src/backend/application/usecase/CreateDealUseCase";
import { ListDealsUseCase } from "../../../../src/backend/application/usecase/ListDealsUseCase";
import { UpdateDealUseCase } from "../../../../src/backend/application/usecase/UpdateDealUseCase";
import { CloseDealUseCase } from "../../../../src/backend/application/usecase/CloseDealUseCase";
import { CreateActivityUseCase } from "../../../../src/backend/application/usecase/CreateActivityUseCase";
import { ListActivitiesUseCase } from "../../../../src/backend/application/usecase/ListActivitiesUseCase";
import { UpdateActivityUseCase } from "../../../../src/backend/application/usecase/UpdateActivityUseCase";
import { DeleteDealUseCase } from "../../../../src/backend/application/usecase/DeleteDealUseCase";
import { DeleteActivityUseCase } from "../../../../src/backend/application/usecase/DeleteActivityUseCase";
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
    let db: SheetDB<typeof ALL_TABLES>;
    let createLeadUseCase: CreateLeadUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        createLeadUseCase = new CreateLeadUseCase(db);
    });

    describe("バリデーション", () => {
        test("氏名が空の場合エラーになる", () => {
            expect(() => createLeadUseCase.execute({
                name: "",
                companyName: "株式会社A",
                email: null,
                phoneNumber: null,
                assigneeId: "user-1"
            })).toThrow("氏名は必須です");
        });

        test("ステータスが無効な値の場合エラーになる", () => {
            expect(() => createLeadUseCase.execute({
                name: "田中太郎",
                companyName: "株式会社A",
                email: null,
                phoneNumber: null,
                assigneeId: "user-1",
                status: "無効なステータス" as any
            })).toThrow();
        });
    });

    describe("シーケンス制御", () => {
        describe("ドメイン操作", () => {
            test("リードエンティティを生成する", () => {
                const result = createLeadUseCase.execute({
                    name: "田中太郎",
                    companyName: "株式会社A",
                    email: "tanaka@example.com",
                    phoneNumber: "03-1234-5678",
                    assigneeId: "user-1"
                });

                expect(result).toBeInstanceOf(Lead);
                expect(result.name).toBe("田中太郎");
                expect(result.companyName).toBe("株式会社A");
                expect(result.email).toBe("tanaka@example.com");
                expect(result.phoneNumber).toBe("03-1234-5678");
                expect(result.assigneeId).toBe("user-1");
            });

            test("初期ステータスは'未対応'になる", () => {
                const result = createLeadUseCase.execute({
                    name: "田中太郎",
                    companyName: "株式会社A",
                    email: null,
                    phoneNumber: null,
                    assigneeId: "user-1"
                });

                expect(result.status).toBe("未対応");
            });
        });

        describe("DB操作", () => {
            test("リードテーブルにリードを保存する", () => {
                createLeadUseCase.execute({
                    name: "田中太郎",
                    companyName: "株式会社A",
                    email: null,
                    phoneNumber: null,
                    assigneeId: "user-1"
                });

                const leads = db.table("リード").find(db.query("リード").and("氏名", "=", ["田中太郎"]));
                
                expect(leads.length).toBe(1);
                expect(leads[0].name).toBe("田中太郎");
            });
        });
    });

    describe("出力", () => {
        test("作成されたリードエンティティを返す", () => {
            const result = createLeadUseCase.execute({
                name: "田中太郎",
                companyName: "株式会社A",
                email: "tanaka@example.com",
                phoneNumber: "03-1234-5678",
                assigneeId: "user-1"
            });

            expect(result).toBeInstanceOf(Lead);
            expect(result.id).toBeDefined();
            expect(result.name).toBe("田中太郎");
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });
});

describe("リード一覧取得ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let listLeadsUseCase: ListLeadsUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        listLeadsUseCase = new ListLeadsUseCase(db);
    });

    describe("バリデーション", () => {
        test("バリデーションなし", () => {
            // バリデーションがないことを確認
            expect(() => listLeadsUseCase.execute()).not.toThrow();
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("リードテーブルから全件取得する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: null,
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
                        会社名: null,
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "対応中",
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listLeadsUseCase.execute();

                expect(result).toHaveLength(2);
            });

            test("担当者IDが指定された場合は絞り込む", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: null,
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
                        会社名: null,
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "対応中",
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listLeadsUseCase.execute({ assigneeId: "user-1" });

                expect(result).toHaveLength(1);
                expect(result[0].assigneeId).toBe("user-1");
            });

            test("ステータスが指定された場合は絞り込む", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: null,
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
                        会社名: null,
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "対応中",
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listLeadsUseCase.execute({ status: "未対応" });

                expect(result).toHaveLength(1);
                expect(result[0].status).toBe("未対応");
            });
        });
    });

    describe("出力", () => {
        test("リードエンティティの一覧を返す", () => {
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

            const result = listLeadsUseCase.execute();

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Lead);
        });

        test("リードが存在しない場合は空配列を返す", () => {
            const result = listLeadsUseCase.execute();

            expect(result).toEqual([]);
        });
    });
});

describe("リード更新ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let updateLeadUseCase: UpdateLeadUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        updateLeadUseCase = new UpdateLeadUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが存在しない場合エラーになる", () => {
            expect(() => updateLeadUseCase.execute({
                id: "nonexistent-id",
                name: "新しい名前"
            })).toThrow("リードが見つかりません");
        });

        test("ステータスが無効な値の場合エラーになる", () => {
            db.table("リード").create([{
                ID: "lead-1",
                氏名: "田中太郎",
                会社名: "株式会社A",
                メールアドレス: null,
                電話番号: null,
                ステータス: "未対応",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => updateLeadUseCase.execute({
                id: "lead-1",
                status: "無効なステータス" as any
            })).toThrow("無効なステータスです");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("リードテーブルからIDでリードを取得する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "未対応",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = updateLeadUseCase.execute({
                    id: "lead-1",
                    name: "田中次郎"
                });

                expect(result.id).toBe("lead-1");
                expect(result.name).toBe("田中次郎");
            });

            test("リードテーブルに更新後のリードを保存する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "未対応",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                updateLeadUseCase.execute({
                    id: "lead-1",
                    name: "田中次郎",
                    status: "対応中"
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads.length).toBe(1);
                expect(leads[0].name).toBe("田中次郎");
                expect(leads[0].status).toBe("対応中");
            });
        });
        describe("ドメイン操作", () => {
            test("リードエンティティの状態を更新する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: "old@example.com",
                    電話番号: "03-0000-0000",
                    ステータス: "未対応",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = updateLeadUseCase.execute({
                    id: "lead-1",
                    name: "田中次郎",
                    companyName: "株式会社B",
                    email: "new@example.com",
                    phoneNumber: "03-1111-1111",
                    status: "対応中"
                });

                expect(result.name).toBe("田中次郎");
                expect(result.companyName).toBe("株式会社B");
                expect(result.email).toBe("new@example.com");
                expect(result.phoneNumber).toBe("03-1111-1111");
                expect(result.status).toBe("対応中");
            });
        });
    });

    describe("出力", () => {
        test("更新されたリードエンティティを返す", () => {
            db.table("リード").create([{
                ID: "lead-1",
                氏名: "田中太郎",
                会社名: "株式会社A",
                メールアドレス: null,
                電話番号: null,
                ステータス: "未対応",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = updateLeadUseCase.execute({
                id: "lead-1",
                name: "田中次郎"
            });

            expect(result).toBeInstanceOf(Lead);
            expect(result.id).toBe("lead-1");
            expect(result.name).toBe("田中次郎");
        });
    });
});

describe("リード削除ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let deleteLeadUseCase: DeleteLeadUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        deleteLeadUseCase = new DeleteLeadUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが存在しない場合エラーになる", () => {
            expect(() => deleteLeadUseCase.execute({
                id: "nonexistent-id"
            })).toThrow("リードが見つかりません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("リードに紐づく営業活動を全て削除する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "商談化",
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
                        ステータス: "商談化",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-2",
                        ステータス: "提案",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date(),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-2",
                        活動種別: "電話",
                        活動日: new Date(),
                        内容: "フォローアップ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteLeadUseCase.execute({ id: "lead-1" });

                const activities = db.table("営業活動").find(db.query("営業活動").and("案件ID", "=", ["deal-1"]));
                expect(activities.length).toBe(0);
            });

            test("リードに紐づく案件を全て削除する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "商談化",
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
                        ステータス: "商談化",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-1",
                        ステータス: "交渉",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-3",
                        案件名: "案件C",
                        リードID: "lead-2",
                        ステータス: "提案",
                        金額: 3000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteLeadUseCase.execute({ id: "lead-1" });

                const deals = db.table("案件").find(db.query("案件").and("リードID", "=", ["lead-1"]));
                expect(deals.length).toBe(0);
            });

            test("リードテーブルからリードを削除する", () => {
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
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteLeadUseCase.execute({ id: "lead-1" });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads.length).toBe(0);
            });
        });
    });

    describe("出力", () => {
        test("削除成功を返す", () => {
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
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            const result = deleteLeadUseCase.execute({ id: "lead-1" });

            expect(result).toEqual({ success: true });
        });
    });
});

describe("案件作成ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let createDealUseCase: CreateDealUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        createDealUseCase = new CreateDealUseCase(db);
    });

    describe("バリデーション", () => {
        test("案件名が空の場合エラーになる", () => {
            expect(() => createDealUseCase.execute({
                dealName: "",
                leadId: "lead-1",
                assigneeId: "user-1"
            })).toThrow("案件名は必須です");
        });

        test("リードIDが指定されていない場合エラーになる", () => {
            expect(() => createDealUseCase.execute({
                dealName: "案件A",
                leadId: "",
                assigneeId: "user-1"
            })).toThrow("リードIDは必須です");
        });

        test("リードIDに該当するリードが存在しない場合エラーになる", () => {
            expect(() => createDealUseCase.execute({
                dealName: "案件A",
                leadId: "nonexistent-lead",
                assigneeId: "user-1"
            })).toThrow("リードが見つかりません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("リードテーブルからリードIDでリードを取得する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    assigneeId: "user-1"
                });

                expect(result).toBeInstanceOf(Deal);
                expect(result.leadId).toBe("lead-1");
            });

            test("案件テーブルに案件を保存する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    amount: 1000000,
                    expectedCloseDate: new Date("2024-12-31"),
                    assigneeId: "user-1"
                });

                const deals = db.table("案件").find(db.query("案件").and("案件名", "=", ["案件A"]));
                expect(deals.length).toBe(1);
                expect(deals[0].dealName).toBe("案件A");
                expect(deals[0].amount).toBe(1000000);
            });

            test("リードテーブルのステータスを更新する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    assigneeId: "user-1"
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads[0].status).toBe("商談化");
            });
        });
        describe("ドメイン操作", () => {
            test("案件エンティティを生成する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    assigneeId: "user-1"
                });

                expect(result).toBeInstanceOf(Deal);
                expect(result.dealName).toBe("案件A");
                expect(result.leadId).toBe("lead-1");
                expect(result.assigneeId).toBe("user-1");
            });

            test("初期ステータスは'提案'になる", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    assigneeId: "user-1"
                });

                expect(result.status).toBe("提案");
            });

            test("リードエンティティのステータスを'商談化'に変更する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "対応中",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                createDealUseCase.execute({
                    dealName: "案件A",
                    leadId: "lead-1",
                    assigneeId: "user-1"
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads[0].status).toBe("商談化");
            });
        });
    });

    describe("出力", () => {
        test("作成された案件エンティティを返す", () => {
            db.table("リード").create([{
                ID: "lead-1",
                氏名: "田中太郎",
                会社名: "株式会社A",
                メールアドレス: null,
                電話番号: null,
                ステータス: "対応中",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = createDealUseCase.execute({
                dealName: "案件A",
                leadId: "lead-1",
                assigneeId: "user-1"
            });

            expect(result).toBeInstanceOf(Deal);
            expect(result.id).toBeDefined();
            expect(result.dealName).toBe("案件A");
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });
});

describe("案件一覧取得ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let listDealsUseCase: ListDealsUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        listDealsUseCase = new ListDealsUseCase(db);
    });

    describe("バリデーション", () => {
        test("バリデーションなし", () => {
            expect(() => listDealsUseCase.execute()).not.toThrow();
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("案件テーブルから全件取得する", () => {
                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-2",
                        ステータス: "交渉",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listDealsUseCase.execute();

                expect(result.length).toBe(2);
            });

            test("リードIDが指定された場合は絞り込む", () => {
                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-2",
                        ステータス: "交渉",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listDealsUseCase.execute({ leadId: "lead-1" });

                expect(result.length).toBe(1);
                expect(result[0].leadId).toBe("lead-1");
            });

            test("担当者IDが指定された場合は絞り込む", () => {
                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-2",
                        ステータス: "交渉",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-2",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listDealsUseCase.execute({ assigneeId: "user-1" });

                expect(result.length).toBe(1);
                expect(result[0].assigneeId).toBe("user-1");
            });

            test("ステータスが指定された場合は絞り込む", () => {
                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "deal-2",
                        案件名: "案件B",
                        リードID: "lead-2",
                        ステータス: "交渉",
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listDealsUseCase.execute({ status: "提案" });

                expect(result.length).toBe(1);
                expect(result[0].status).toBe("提案");
            });
        });
    });

    describe("出力", () => {
        test("案件エンティティの一覧を返す", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = listDealsUseCase.execute();

            expect(result.length).toBe(1);
            expect(result[0]).toBeInstanceOf(Deal);
        });

        test("案件が存在しない場合は空配列を返す", () => {
            const result = listDealsUseCase.execute();

            expect(result).toEqual([]);
        });
    });
});

describe("案件更新ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let updateDealUseCase: UpdateDealUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        updateDealUseCase = new UpdateDealUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが存在しない場合エラーになる", () => {
            expect(() => updateDealUseCase.execute({
                id: "nonexistent-id",
                dealName: "新しい名前"
            })).toThrow("案件が見つかりません");
        });

        test("ステータスが無効な値の場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => updateDealUseCase.execute({
                id: "deal-1",
                status: "無効なステータス" as any
            })).toThrow("無効なステータスです");
        });

        test("クローズ済みの案件を更新しようとした場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "クローズ(成功)",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => updateDealUseCase.execute({
                id: "deal-1",
                dealName: "新しい名前"
            })).toThrow("クローズ済みの案件は更新できません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("案件テーブルからIDで案件を取得する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = updateDealUseCase.execute({
                    id: "deal-1",
                    dealName: "案件B"
                });

                expect(result.id).toBe("deal-1");
                expect(result.dealName).toBe("案件B");
            });

            test("案件テーブルに更新後の案件を保存する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                updateDealUseCase.execute({
                    id: "deal-1",
                    dealName: "案件B",
                    amount: 2000000,
                    status: "交渉"
                });

                const deals = db.table("案件").find(db.query("案件").and("ID", "=", ["deal-1"]));
                expect(deals.length).toBe(1);
                expect(deals[0].dealName).toBe("案件B");
                expect(deals[0].amount).toBe(2000000);
                expect(deals[0].status).toBe("交渉");
            });
        });
        describe("ドメイン操作", () => {
            test("案件エンティティの状態を更新する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = updateDealUseCase.execute({
                    id: "deal-1",
                    dealName: "案件B",
                    amount: 2000000,
                    expectedCloseDate: new Date("2024-12-31"),
                    status: "交渉"
                });

                expect(result.dealName).toBe("案件B");
                expect(result.amount).toBe(2000000);
                expect(result.expectedCloseDate).toEqual(new Date("2024-12-31"));
                expect(result.status).toBe("交渉");
            });
        });
    });

    describe("出力", () => {
        test("更新された案件エンティティを返す", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = updateDealUseCase.execute({
                id: "deal-1",
                dealName: "案件B"
            });

            expect(result).toBeInstanceOf(Deal);
            expect(result.id).toBe("deal-1");
            expect(result.dealName).toBe("案件B");
        });
    });
});

describe("案件クローズユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let closeDealUseCase: CloseDealUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        closeDealUseCase = new CloseDealUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが存在しない場合エラーになる", () => {
            expect(() => closeDealUseCase.execute({
                id: "nonexistent-id",
                isWon: true
            })).toThrow("案件が見つかりません");
        });

        test("既にクローズ済みの場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "クローズ(成功)",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => closeDealUseCase.execute({
                id: "deal-1",
                isWon: true
            })).toThrow("既にクローズ済みです");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("案件テーブルからIDで案件を取得する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: true
                });

                expect(result.id).toBe("deal-1");
                expect(result.isClosed()).toBe(true);
            });

            test("案件テーブルにクローズ後の案件を保存する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: true
                });

                const deals = db.table("案件").find(db.query("案件").and("ID", "=", ["deal-1"]));
                expect(deals.length).toBe(1);
                expect(deals[0].status).toBe("クローズ(成功)");
            });

            test("成功クローズの場合、リードのステータスを'顧客化'に更新する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: true
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads[0].status).toBe("顧客化");
            });

            test("失敗クローズの場合、リードのステータスを'失注'に更新する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: false
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads[0].status).toBe("失注");
            });
        });
        describe("ドメイン操作", () => {
            test("案件エンティティをクローズする", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: true
                });

                expect(result.isClosed()).toBe(true);
                expect(result.status).toBe("クローズ(成功)");
            });

            test("リードエンティティのステータスを更新する", () => {
                db.table("リード").create([{
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
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
                    ステータス: "交渉",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                closeDealUseCase.execute({
                    id: "deal-1",
                    isWon: true
                });

                const leads = db.table("リード").find(db.query("リード").and("ID", "=", ["lead-1"]));
                expect(leads[0].status).toBe("顧客化");
            });
        });
    });

    describe("出力", () => {
        test("クローズされた案件エンティティを返す", () => {
            db.table("リード").create([{
                ID: "lead-1",
                氏名: "田中太郎",
                会社名: "株式会社A",
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
                ステータス: "交渉",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = closeDealUseCase.execute({
                id: "deal-1",
                isWon: true
            });

            expect(result).toBeInstanceOf(Deal);
            expect(result.isClosed()).toBe(true);
            expect(result.status).toBe("クローズ(成功)");
        });
    });
});

describe("営業活動作成ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let createActivityUseCase: CreateActivityUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        createActivityUseCase = new CreateActivityUseCase(db);
    });

    describe("バリデーション", () => {
        test("案件IDが指定されていない場合エラーになる", () => {
            expect(() => createActivityUseCase.execute({
                dealId: "",
                activityType: "面談",
                activityDate: new Date(),
                content: "初回面談",
                assigneeId: "user-1"
            })).toThrow("案件IDは必須です");
        });

        test("案件IDに該当する案件が存在しない場合エラーになる", () => {
            expect(() => createActivityUseCase.execute({
                dealId: "nonexistent-deal",
                activityType: "面談",
                activityDate: new Date(),
                content: "初回面談",
                assigneeId: "user-1"
            })).toThrow("案件が見つかりません");
        });

        test("活動種別が無効な値の場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => createActivityUseCase.execute({
                dealId: "deal-1",
                activityType: "無効な種別" as any,
                activityDate: new Date(),
                content: "初回面談",
                assigneeId: "user-1"
            })).toThrow("無効な活動種別です");
        });

        test("活動日が指定されていない場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => createActivityUseCase.execute({
                dealId: "deal-1",
                activityType: "面談",
                activityDate: null as any,
                content: "初回面談",
                assigneeId: "user-1"
            })).toThrow("活動日は必須です");
        });

        test("内容が空の場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => createActivityUseCase.execute({
                dealId: "deal-1",
                activityType: "面談",
                activityDate: new Date(),
                content: "",
                assigneeId: "user-1"
            })).toThrow("内容は必須です");
        });

        test("クローズ済みの案件に営業活動を追加しようとした場合エラーになる", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "クローズ(成功)",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => createActivityUseCase.execute({
                dealId: "deal-1",
                activityType: "面談",
                activityDate: new Date(),
                content: "面談",
                assigneeId: "user-1"
            })).toThrow("クローズ済みの案件には営業活動を追加できません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("案件テーブルから案件IDで案件を取得する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = createActivityUseCase.execute({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: new Date(),
                    content: "初回面談",
                    assigneeId: "user-1"
                });

                expect(result).toBeInstanceOf(Activity);
                expect(result.dealId).toBe("deal-1");
            });

            test("営業活動テーブルに営業活動を保存する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const activityDate = new Date();
                createActivityUseCase.execute({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: activityDate,
                    content: "初回面談",
                    assigneeId: "user-1"
                });

                const activities = db.table("営業活動").find(db.query("営業活動").and("案件ID", "=", ["deal-1"]));
                expect(activities.length).toBe(1);
                expect(activities[0].activityType).toBe("面談");
                expect(activities[0].content).toBe("初回面談");
            });
        });
        describe("ドメイン操作", () => {
            test("営業活動エンティティを生成する", () => {
                db.table("案件").create([{
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const activityDate = new Date();
                const result = createActivityUseCase.execute({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: activityDate,
                    content: "初回面談",
                    assigneeId: "user-1"
                });

                expect(result).toBeInstanceOf(Activity);
                expect(result.dealId).toBe("deal-1");
                expect(result.activityType).toBe("面談");
                expect(result.content).toBe("初回面談");
                expect(result.assigneeId).toBe("user-1");
            });
        });
    });

    describe("出力", () => {
        test("作成された営業活動エンティティを返す", () => {
            db.table("案件").create([{
                ID: "deal-1",
                案件名: "案件A",
                リードID: "lead-1",
                ステータス: "提案",
                金額: 1000000,
                予定クローズ日: null,
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const activityDate = new Date();
            const result = createActivityUseCase.execute({
                dealId: "deal-1",
                activityType: "面談",
                activityDate: activityDate,
                content: "初回面談",
                assigneeId: "user-1"
            });

            expect(result).toBeInstanceOf(Activity);
            expect(result.id).toBeDefined();
            expect(result.dealId).toBe("deal-1");
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });
});

describe("営業活動一覧取得ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let listActivitiesUseCase: ListActivitiesUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        listActivitiesUseCase = new ListActivitiesUseCase(db);
    });

    describe("バリデーション", () => {
        test("バリデーションなし", () => {
            expect(() => listActivitiesUseCase.execute()).not.toThrow();
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("営業活動テーブルから全件取得する", () => {
                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date("2024-01-01"),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-2",
                        活動種別: "電話",
                        活動日: new Date("2024-01-02"),
                        内容: "フォローアップ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listActivitiesUseCase.execute();

                expect(result.length).toBe(2);
            });

            test("案件IDが指定された場合は絞り込む", () => {
                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date("2024-01-01"),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-2",
                        活動種別: "電話",
                        活動日: new Date("2024-01-02"),
                        内容: "フォローアップ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listActivitiesUseCase.execute({ dealId: "deal-1" });

                expect(result.length).toBe(1);
                expect(result[0].dealId).toBe("deal-1");
            });

            test("活動日の降順で取得する", () => {
                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date("2024-01-01"),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-1",
                        活動種別: "電話",
                        活動日: new Date("2024-01-03"),
                        内容: "フォローアップ2",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-3",
                        案件ID: "deal-1",
                        活動種別: "メール",
                        活動日: new Date("2024-01-02"),
                        内容: "フォローアップ1",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                const result = listActivitiesUseCase.execute({ dealId: "deal-1" });

                expect(result.length).toBe(3);
                expect(result[0].activityDate).toEqual(new Date("2024-01-03"));
                expect(result[1].activityDate).toEqual(new Date("2024-01-02"));
                expect(result[2].activityDate).toEqual(new Date("2024-01-01"));
            });
        });
    });

    describe("出力", () => {
        test("営業活動エンティティの一覧を返す", () => {
            db.table("営業活動").create([{
                ID: "activity-1",
                案件ID: "deal-1",
                活動種別: "面談",
                活動日: new Date(),
                内容: "初回面談",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = listActivitiesUseCase.execute();

            expect(result.length).toBe(1);
            expect(result[0]).toBeInstanceOf(Activity);
        });

        test("営業活動が存在しない場合は空配列を返す", () => {
            const result = listActivitiesUseCase.execute();

            expect(result).toEqual([]);
        });
    });
});

describe("営業活動更新ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let updateActivityUseCase: UpdateActivityUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        updateActivityUseCase = new UpdateActivityUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが存在しない場合エラーになる", () => {
            expect(() => updateActivityUseCase.execute({
                id: "nonexistent-id",
                content: "新しい内容"
            })).toThrow("営業活動が見つかりません");
        });

        test("活動種別が無効な値の場合エラーになる", () => {
            db.table("営業活動").create([{
                ID: "activity-1",
                案件ID: "deal-1",
                活動種別: "面談",
                活動日: new Date(),
                内容: "初回面談",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            expect(() => updateActivityUseCase.execute({
                id: "activity-1",
                activityType: "無効な種別" as any
            })).toThrow("無効な活動種別です");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("営業活動テーブルからIDで営業活動を取得する", () => {
                db.table("営業活動").create([{
                    ID: "activity-1",
                    案件ID: "deal-1",
                    活動種別: "面談",
                    活動日: new Date(),
                    内容: "初回面談",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const result = updateActivityUseCase.execute({
                    id: "activity-1",
                    content: "更新された内容"
                });

                expect(result.id).toBe("activity-1");
                expect(result.content).toBe("更新された内容");
            });

            test("営業活動テーブルに更新後の営業活動を保存する", () => {
                db.table("営業活動").create([{
                    ID: "activity-1",
                    案件ID: "deal-1",
                    活動種別: "面談",
                    活動日: new Date("2024-01-01"),
                    内容: "初回面談",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const newDate = new Date("2024-01-02");
                updateActivityUseCase.execute({
                    id: "activity-1",
                    activityType: "電話",
                    activityDate: newDate,
                    content: "更新された内容"
                });

                const activities = db.table("営業活動").find(db.query("営業活動").and("ID", "=", ["activity-1"]));
                expect(activities.length).toBe(1);
                expect(activities[0].activityType).toBe("電話");
                expect(activities[0].activityDate).toEqual(newDate);
                expect(activities[0].content).toBe("更新された内容");
            });
        });
        describe("ドメイン操作", () => {
            test("営業活動エンティティの状態を更新する", () => {
                db.table("営業活動").create([{
                    ID: "activity-1",
                    案件ID: "deal-1",
                    活動種別: "面談",
                    活動日: new Date("2024-01-01"),
                    内容: "初回面談",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }]);

                const newDate = new Date("2024-01-02");
                const result = updateActivityUseCase.execute({
                    id: "activity-1",
                    activityType: "電話",
                    activityDate: newDate,
                    content: "更新された内容"
                });

                expect(result.activityType).toBe("電話");
                expect(result.activityDate).toEqual(newDate);
                expect(result.content).toBe("更新された内容");
            });
        });
    });

    describe("出力", () => {
        test("更新された営業活動エンティティを返す", () => {
            db.table("営業活動").create([{
                ID: "activity-1",
                案件ID: "deal-1",
                活動種別: "面談",
                活動日: new Date(),
                内容: "初回面談",
                担当者ID: "user-1",
                作成日時: new Date(),
                更新日時: new Date()
            }]);

            const result = updateActivityUseCase.execute({
                id: "activity-1",
                content: "更新された内容"
            });

            expect(result).toBeInstanceOf(Activity);
            expect(result.id).toBe("activity-1");
            expect(result.content).toBe("更新された内容");
        });
    });
});

describe("案件削除ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let deleteDealUseCase: DeleteDealUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        deleteDealUseCase = new DeleteDealUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが指定されていない場合エラーになる", () => {
            expect(() => deleteDealUseCase.execute({
                id: ""
            })).toThrow("IDは必須です");
        });

        test("IDが存在しない場合エラーになる", () => {
            expect(() => deleteDealUseCase.execute({
                id: "nonexistent-id"
            })).toThrow("案件が見つかりません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("案件に紐づく営業活動を全て削除する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "商談化",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
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
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date(),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-1",
                        活動種別: "電話",
                        活動日: new Date(),
                        内容: "フォローアップ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-3",
                        案件ID: "deal-2",
                        活動種別: "メール",
                        活動日: new Date(),
                        内容: "提案書送付",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteDealUseCase.execute({ id: "deal-1" });

                // deal-1の営業活動が削除されている
                const deal1Activities = db.table("営業活動").find(db.query("営業活動").and("案件ID", "=", ["deal-1"]));
                expect(deal1Activities.length).toBe(0);

                // deal-2の営業活動は残っている
                const deal2Activities = db.table("営業活動").find(db.query("営業活動").and("案件ID", "=", ["deal-2"]));
                expect(deal2Activities.length).toBe(1);
            });

            test("案件を削除する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "商談化",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
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
                        金額: 2000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteDealUseCase.execute({ id: "deal-1" });

                // deal-1が削除されている
                const deal1 = db.table("案件").find(db.query("案件").and("ID", "=", ["deal-1"]));
                expect(deal1.length).toBe(0);

                // deal-2は残っている
                const deal2 = db.table("案件").find(db.query("案件").and("ID", "=", ["deal-2"]));
                expect(deal2.length).toBe(1);
            });
        });
    });

    describe("出力", () => {
        test("削除成功をbooleanで返す", () => {
            db.table("リード").create([
                {
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "商談化",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            db.table("案件").create([
                {
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            const result = deleteDealUseCase.execute({ id: "deal-1" });

            expect(result).toEqual({ success: true });
        });
    });
});

describe("営業活動削除ユースケース", () => {
    let db: SheetDB<typeof ALL_TABLES>;
    let deleteActivityUseCase: DeleteActivityUseCase;

    beforeEach(() => {
        const datastore = new InMemoryDataStore();
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
        deleteActivityUseCase = new DeleteActivityUseCase(db);
    });

    describe("バリデーション", () => {
        test("IDが指定されていない場合エラーになる", () => {
            expect(() => deleteActivityUseCase.execute({
                id: ""
            })).toThrow("IDは必須です");
        });

        test("IDが存在しない場合エラーになる", () => {
            expect(() => deleteActivityUseCase.execute({
                id: "nonexistent-id"
            })).toThrow("営業活動が見つかりません");
        });
    });

    describe("シーケンス制御", () => {
        describe("DB操作", () => {
            test("営業活動を削除する", () => {
                db.table("リード").create([
                    {
                        ID: "lead-1",
                        氏名: "田中太郎",
                        会社名: "株式会社A",
                        メールアドレス: null,
                        電話番号: null,
                        ステータス: "商談化",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("案件").create([
                    {
                        ID: "deal-1",
                        案件名: "案件A",
                        リードID: "lead-1",
                        ステータス: "提案",
                        金額: 1000000,
                        予定クローズ日: null,
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                db.table("営業活動").create([
                    {
                        ID: "activity-1",
                        案件ID: "deal-1",
                        活動種別: "面談",
                        活動日: new Date(),
                        内容: "初回面談",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    },
                    {
                        ID: "activity-2",
                        案件ID: "deal-1",
                        活動種別: "電話",
                        活動日: new Date(),
                        内容: "フォローアップ",
                        担当者ID: "user-1",
                        作成日時: new Date(),
                        更新日時: new Date()
                    }
                ]);

                deleteActivityUseCase.execute({ id: "activity-1" });

                // activity-1が削除されている
                const activity1 = db.table("営業活動").find(db.query("営業活動").and("ID", "=", ["activity-1"]));
                expect(activity1.length).toBe(0);

                // activity-2は残っている
                const activity2 = db.table("営業活動").find(db.query("営業活動").and("ID", "=", ["activity-2"]));
                expect(activity2.length).toBe(1);
            });
        });
    });

    describe("出力", () => {
        test("削除成功をbooleanで返す", () => {
            db.table("リード").create([
                {
                    ID: "lead-1",
                    氏名: "田中太郎",
                    会社名: "株式会社A",
                    メールアドレス: null,
                    電話番号: null,
                    ステータス: "商談化",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            db.table("案件").create([
                {
                    ID: "deal-1",
                    案件名: "案件A",
                    リードID: "lead-1",
                    ステータス: "提案",
                    金額: 1000000,
                    予定クローズ日: null,
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            db.table("営業活動").create([
                {
                    ID: "activity-1",
                    案件ID: "deal-1",
                    活動種別: "面談",
                    活動日: new Date(),
                    内容: "初回面談",
                    担当者ID: "user-1",
                    作成日時: new Date(),
                    更新日時: new Date()
                }
            ]);

            const result = deleteActivityUseCase.execute({ id: "activity-1" });

            expect(result).toEqual({ success: true });
        });
    });
});
