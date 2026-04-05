import { describe, test, expect, beforeEach, vi } from "vitest";
import {
    SheetDB,
    InMemoryDataStore,
    InMemoryGateway,
    InMemoryCacheService,
    InMemoryUtilities,
} from "@mydx-dev/gas-boost-runtime";
import { sync } from "../../../../src/backend/presentation/controller/sync";
import { createLead, getLeads, updateLead, deleteLead } from "../../../../src/backend/presentation/controller/lead";
import { createDeal, getDeals, updateDeal, closeDeal, deleteDeal } from "../../../../src/backend/presentation/controller/deal";
import { createActivity, getActivities, updateActivity, deleteActivity } from "../../../../src/backend/presentation/controller/activity";
import { ALL_TABLES } from "../../../../src/backend/infrastructure/SheetORM/tables";
import { AppsScriptResponse } from "../../../../src/shared/AppsScriptResponse";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";
import { Activity } from "../../../../src/backend/domain/entity/Activity";

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
    let db: SheetDB<typeof ALL_TABLES>;

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
    });

    describe("入力", () => {
        describe("バリデーション（CREATE）", () => {
            test("氏名が空の場合はバリデーションエラーを返す", () => {
                expect(() => createLead({
                    name: "",
                    companyName: "株式会社A",
                    email: null,
                    phoneNumber: null,
                    status: "未対応",
                    assigneeId: "user-1"
                })).toThrow("氏名は必須です");
            });
        });
        
        describe("バリデーション（UPDATE）", () => {
            test("IDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => updateLead("", {
                    name: "更新後の氏名"
                })).toThrow("IDは必須です");
            });
        });
        
        describe("バリデーション（DELETE）", () => {
            test("IDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => deleteLead("")).toThrow("IDは必須です");
            });
        });
    });

    describe("主要操作", () => {
        describe("リード作成ユースケース", () => {
            test("リード作成ユースケースを呼び出す", () => {
                const result = createLead({
                    name: "田中太郎",
                    companyName: "株式会社A",
                    email: null,
                    phoneNumber: null,
                    status: "未対応",
                    assigneeId: "user-1"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const lead = result.getContent();
                expect(lead).toBeInstanceOf(Lead);
                expect(lead.name).toBe("田中太郎");
            });
        });
        
        describe("リード一覧取得ユースケース", () => {
            test("リード一覧取得ユースケースを呼び出す", () => {
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
                    }
                ]);

                const result = getLeads();
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const leads = result.getContent();
                expect(Array.isArray(leads)).toBe(true);
                expect(leads.length).toBe(1);
                expect(leads[0]).toBeInstanceOf(Lead);
            });
        });
        
        describe("リード更新ユースケース", () => {
            test("リード更新ユースケースを呼び出す", () => {
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
                    }
                ]);

                const result = updateLead("lead-1", {
                    name: "田中次郎"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const lead = result.getContent();
                expect(lead).toBeInstanceOf(Lead);
                expect(lead.name).toBe("田中次郎");
            });
        });
        
        describe("リード削除ユースケース", () => {
            test("リード削除ユースケースを呼び出す", () => {
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
                    }
                ]);

                const result = deleteLead("lead-1");
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const response = result.getContent();
                expect(response).toEqual({ success: true });
            });
        });
    });

    describe("出力", () => {
        test("CREATE: 作成されたリードをAppsScriptResponseで返す", () => {
            const result = createLead({
                name: "田中太郎",
                companyName: "株式会社A",
                email: null,
                phoneNumber: null,
                status: "未対応",
                assigneeId: "user-1"
            });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Lead);
        });
        
        test("READ: リード一覧をAppsScriptResponseで返す", () => {
            const result = getLeads();
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(Array.isArray(result.getContent())).toBe(true);
        });
        
        test("UPDATE: 更新されたリードをAppsScriptResponseで返す", () => {
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
                }
            ]);

            const result = updateLead("lead-1", { name: "田中次郎" });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Lead);
        });
        
        test("DELETE: 削除成功をAppsScriptResponseで返す", () => {
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
                }
            ]);

            const result = deleteLead("lead-1");
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toEqual({ success: true });
        });
    });
});

describe("案件コントローラー", () => {
    let db: SheetDB<typeof ALL_TABLES>;

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
    });

    describe("入力", () => {
        describe("バリデーション（CREATE）", () => {
            test("案件名が空の場合はバリデーションエラーを返す", () => {
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
                    }
                ]);

                expect(() => createDeal({
                    dealName: "",
                    leadId: "lead-1",
                    status: "提案",
                    amount: null,
                    expectedCloseDate: null,
                    assigneeId: "user-1"
                })).toThrow("案件名は必須です");
            });
            
            test("リードIDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => createDeal({
                    dealName: "案件A",
                    leadId: "",
                    status: "提案",
                    amount: null,
                    expectedCloseDate: null,
                    assigneeId: "user-1"
                })).toThrow("リードIDは必須です");
            });
        });
        
        describe("バリデーション（UPDATE）", () => {
            test("IDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => updateDeal("", {
                    dealName: "更新後の案件名"
                })).toThrow("IDは必須です");
            });
        });
    });

    describe("主要操作", () => {
        describe("案件作成ユースケース", () => {
            test("案件作成ユースケースを呼び出す", () => {
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
                    }
                ]);

                const result = createDeal({
                    dealName: "案件A",
                    leadId: "lead-1",
                    status: "提案",
                    amount: null,
                    expectedCloseDate: null,
                    assigneeId: "user-1"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const deal = result.getContent();
                expect(deal).toBeInstanceOf(Deal);
                expect(deal.dealName).toBe("案件A");
            });
        });
        
        describe("案件一覧取得ユースケース", () => {
            test("案件一覧取得ユースケースを呼び出す", () => {
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

                const result = getDeals();
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const deals = result.getContent();
                expect(Array.isArray(deals)).toBe(true);
                expect(deals.length).toBe(1);
                expect(deals[0]).toBeInstanceOf(Deal);
            });
        });
        
        describe("案件更新ユースケース", () => {
            test("案件更新ユースケースを呼び出す", () => {
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

                const result = updateDeal("deal-1", {
                    dealName: "案件A-更新"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const deal = result.getContent();
                expect(deal).toBeInstanceOf(Deal);
                expect(deal.dealName).toBe("案件A-更新");
            });
        });
        
        describe("案件クローズユースケース", () => {
            test("案件クローズユースケースを呼び出す", () => {
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

                const result = closeDeal("deal-1", true);
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const deal = result.getContent();
                expect(deal).toBeInstanceOf(Deal);
                expect(deal.status).toBe("クローズ(成功)");
            });
        });
    });

    describe("出力", () => {
        test("CREATE: 作成された案件をAppsScriptResponseで返す", () => {
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
                }
            ]);

            const result = createDeal({
                dealName: "案件A",
                leadId: "lead-1",
                status: "提案",
                amount: null,
                expectedCloseDate: null,
                assigneeId: "user-1"
            });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Deal);
        });
        
        test("READ: 案件一覧をAppsScriptResponseで返す", () => {
            const result = getDeals();
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(Array.isArray(result.getContent())).toBe(true);
        });
        
        test("UPDATE: 更新された案件をAppsScriptResponseで返す", () => {
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

            const result = updateDeal("deal-1", { dealName: "案件A-更新" });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Deal);
        });
        
        test("CLOSE: クローズされた案件をAppsScriptResponseで返す", () => {
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

            const result = closeDeal("deal-1", true);
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Deal);
        });
    });
});

describe("営業活動コントローラー", () => {
    let db: SheetDB<typeof ALL_TABLES>;

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
    });

    describe("入力", () => {
        describe("バリデーション（CREATE）", () => {
            test("案件IDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => createActivity({
                    dealId: "",
                    activityType: "面談",
                    activityDate: new Date(),
                    content: "初回面談",
                    assigneeId: "user-1"
                })).toThrow("案件IDは必須です");
            });
            
            test("活動日が未指定の場合はバリデーションエラーを返す", () => {
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

                expect(() => createActivity({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: null as any,
                    content: "初回面談",
                    assigneeId: "user-1"
                })).toThrow("活動日は必須です");
            });
            
            test("内容が空の場合はバリデーションエラーを返す", () => {
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

                expect(() => createActivity({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: new Date(),
                    content: "",
                    assigneeId: "user-1"
                })).toThrow("内容は必須です");
            });
        });
        
        describe("バリデーション（UPDATE）", () => {
            test("IDが未指定の場合はバリデーションエラーを返す", () => {
                expect(() => updateActivity("", {
                    content: "更新された内容"
                })).toThrow("IDは必須です");
            });
        });
    });

    describe("主要操作", () => {
        describe("営業活動作成ユースケース", () => {
            test("営業活動作成ユースケースを呼び出す", () => {
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

                const result = createActivity({
                    dealId: "deal-1",
                    activityType: "面談",
                    activityDate: new Date(),
                    content: "初回面談",
                    assigneeId: "user-1"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const activity = result.getContent();
                expect(activity).toBeInstanceOf(Activity);
                expect(activity.content).toBe("初回面談");
            });
        });
        
        describe("営業活動一覧取得ユースケース", () => {
            test("営業活動一覧取得ユースケースを呼び出す", () => {
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

                const result = getActivities();
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const activities = result.getContent();
                expect(Array.isArray(activities)).toBe(true);
                expect(activities.length).toBe(1);
                expect(activities[0]).toBeInstanceOf(Activity);
            });
        });
        
        describe("営業活動更新ユースケース", () => {
            test("営業活動更新ユースケースを呼び出す", () => {
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

                const result = updateActivity("activity-1", {
                    content: "更新された内容"
                });
                
                expect(result).toBeInstanceOf(AppsScriptResponse);
                const activity = result.getContent();
                expect(activity).toBeInstanceOf(Activity);
                expect(activity.content).toBe("更新された内容");
            });
        });
    });

    describe("出力", () => {
        test("CREATE: 作成された営業活動をAppsScriptResponseで返す", () => {
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

            const result = createActivity({
                dealId: "deal-1",
                activityType: "面談",
                activityDate: new Date(),
                content: "初回面談",
                assigneeId: "user-1"
            });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Activity);
        });
        
        test("READ: 営業活動一覧をAppsScriptResponseで返す", () => {
            const result = getActivities();
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(Array.isArray(result.getContent())).toBe(true);
        });
        
        test("UPDATE: 更新された営業活動をAppsScriptResponseで返す", () => {
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

            const result = updateActivity("activity-1", { content: "更新された内容" });
            
            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toBeInstanceOf(Activity);
        });
    });
});
