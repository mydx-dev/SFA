import { describe, test, expect } from "vitest";
import { SystemUser } from "../../../../src/backend/domain/entity/SystemUser";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";
import { Activity } from "../../../../src/backend/domain/entity/Activity";

describe("SystemUserエンティティ", () => {
    describe("状態の参照", () => {
        test("idはコンストラクタで渡した値になる", () => {
            const user = new SystemUser("user-001", "test@example.com");
            expect(user.id).toBe("user-001");
        });
        
        test("emailはコンストラクタで渡した値になる", () => {
            const user = new SystemUser("user-001", "test@example.com");
            expect(user.email).toBe("test@example.com");
        });
    });
});

describe("リードエンティティ", () => {
    describe("状態の参照", () => {
        test("idはコンストラクタで渡した値になる", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(lead.id).toBe("lead-001");
        });
        
        test("氏名はコンストラクタで渡した値になる", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(lead.name).toBe("田中太郎");
        });
        
        test("ステータスはコンストラクタで渡した値になる", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "対応中",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(lead.status).toBe("対応中");
        });
        
        test("担当者IDはコンストラクタで渡した値になる", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-002",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(lead.assigneeId).toBe("user-002");
        });
        
        test("会社名はコンストラクタで渡した値になる（nullableの場合はnull）", () => {
            const leadWithCompany = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(leadWithCompany.companyName).toBe("テスト株式会社");
            
            const leadWithoutCompany = new Lead(
                "lead-002",
                "佐藤花子",
                null,
                "sato@example.com",
                "090-9876-5432",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(leadWithoutCompany.companyName).toBe(null);
        });
    });

    describe("状態の更新", () => {
        test("ステータスを新しい値に変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updateStatus("対応中");
            expect(updatedLead.status).toBe("対応中");
        });
        
        test("担当者IDを別のユーザーIDに変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updateAssignee("user-002");
            expect(updatedLead.assigneeId).toBe("user-002");
        });
        
        test("氏名を新しい名前に変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updateName("田中次郎");
            expect(updatedLead.name).toBe("田中次郎");
        });
        
        test("会社名を新しい値に変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updateCompanyName("新会社株式会社");
            expect(updatedLead.companyName).toBe("新会社株式会社");
        });
        
        test("メールアドレスを新しい値に変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updateEmail("newemail@example.com");
            expect(updatedLead.email).toBe("newemail@example.com");
        });
        
        test("電話番号を新しい値に変える", () => {
            const lead = new Lead(
                "lead-001",
                "田中太郎",
                "テスト株式会社",
                "tanaka@example.com",
                "090-1234-5678",
                "未対応",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedLead = lead.updatePhoneNumber("080-9999-8888");
            expect(updatedLead.phoneNumber).toBe("080-9999-8888");
        });
    });

    describe("状態の判定", () => {
        describe("商談化済み判定", () => {
            test("ステータスが'商談化'の場合はtrue", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "商談化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isConvertedToDeal()).toBe(true);
            });
            
            test("ステータスが'未対応'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "未対応",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isConvertedToDeal()).toBe(false);
            });
            
            test("ステータスが'対応中'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "対応中",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isConvertedToDeal()).toBe(false);
            });
            
            test("ステータスが'失注'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "失注",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isConvertedToDeal()).toBe(false);
            });
            
            test("ステータスが'顧客化'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "顧客化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isConvertedToDeal()).toBe(false);
            });
        });
        
        describe("対応完了判定", () => {
            test("ステータスが'顧客化'の場合はtrue", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "顧客化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isCompleted()).toBe(true);
            });
            
            test("ステータスが'失注'の場合はtrue", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "失注",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isCompleted()).toBe(true);
            });
            
            test("ステータスが'未対応'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "未対応",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isCompleted()).toBe(false);
            });
            
            test("ステータスが'対応中'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "対応中",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isCompleted()).toBe(false);
            });
            
            test("ステータスが'商談化'の場合はfalse", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "商談化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(lead.isCompleted()).toBe(false);
            });
        });
    });

    describe("ドメインロジック", () => {
        describe("商談化", () => {
            test("ステータスを'商談化'に変更できる", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "対応中",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                const convertedLead = lead.convertToDeal();
                expect(convertedLead.status).toBe("商談化");
            });
            
            test("既に'商談化'の場合はエラーになる", () => {
                const lead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "商談化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(() => lead.convertToDeal()).toThrow("既に商談化されています");
            });
            
            test("'失注'または'顧客化'の場合はエラーになる", () => {
                const lostLead = new Lead(
                    "lead-001",
                    "田中太郎",
                    "テスト株式会社",
                    "tanaka@example.com",
                    "090-1234-5678",
                    "失注",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(() => lostLead.convertToDeal()).toThrow("対応が完了したリードは商談化できません");
                
                const customerLead = new Lead(
                    "lead-002",
                    "佐藤花子",
                    "テスト株式会社",
                    "sato@example.com",
                    "090-9876-5432",
                    "顧客化",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(() => customerLead.convertToDeal()).toThrow("対応が完了したリードは商談化できません");
            });
        });
    });
});

describe("案件エンティティ", () => {
    describe("状態の参照", () => {
        test("idはコンストラクタで渡した値になる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(deal.id).toBe("deal-001");
        });
        
        test("案件名はコンストラクタで渡した値になる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(deal.dealName).toBe("大型案件");
        });
        
        test("ステータスはコンストラクタで渡した値になる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "交渉",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(deal.status).toBe("交渉");
        });
        
        test("金額はコンストラクタで渡した値になる（nullableの場合はnull）", () => {
            const dealWithAmount = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                5000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(dealWithAmount.amount).toBe(5000000);
            
            const dealWithoutAmount = new Deal(
                "deal-002",
                "未定案件",
                "lead-002",
                "提案",
                null,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(dealWithoutAmount.amount).toBe(null);
        });
        
        test("予定クローズ日はコンストラクタで渡した値になる（nullableの場合はnull）", () => {
            const dealWithDate = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(dealWithDate.expectedCloseDate).toEqual(new Date("2024-12-31"));
            
            const dealWithoutDate = new Deal(
                "deal-002",
                "未定案件",
                "lead-002",
                "提案",
                1000000,
                null,
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(dealWithoutDate.expectedCloseDate).toBe(null);
        });
        
        test("リードIDはコンストラクタで渡した値になる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-123",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(deal.leadId).toBe("lead-123");
        });
        
        test("担当者IDはコンストラクタで渡した値になる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-999",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(deal.assigneeId).toBe("user-999");
        });
    });

    describe("状態の更新", () => {
        test("ステータスを新しい値に変える", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedDeal = deal.updateStatus("交渉");
            expect(updatedDeal.status).toBe("交渉");
        });
        
        test("金額を新しい値に変える", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedDeal = deal.updateAmount(2000000);
            expect(updatedDeal.amount).toBe(2000000);
        });
        
        test("予定クローズ日を設定できる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const newDate = new Date("2025-03-31");
            const updatedDeal = deal.updateExpectedCloseDate(newDate);
            expect(updatedDeal.expectedCloseDate).toEqual(newDate);
        });
        
        test("案件名を新しい値に変える", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedDeal = deal.updateDealName("超大型案件");
            expect(updatedDeal.dealName).toBe("超大型案件");
        });
        
        test("担当者IDを変更できる", () => {
            const deal = new Deal(
                "deal-001",
                "大型案件",
                "lead-001",
                "提案",
                1000000,
                new Date("2024-12-31"),
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedDeal = deal.updateAssignee("user-002");
            expect(updatedDeal.assigneeId).toBe("user-002");
        });
    });

    describe("状態の判定", () => {
        describe("クローズ済み判定", () => {
            test("ステータスが'クローズ(成功)'の場合はtrue", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "クローズ(成功)",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosed()).toBe(true);
            });
            
            test("ステータスが'クローズ(失敗)'の場合はtrue", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "クローズ(失敗)",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosed()).toBe(true);
            });
            
            test("ステータスが'提案'の場合はfalse", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "提案",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosed()).toBe(false);
            });
            
            test("ステータスが'交渉'の場合はfalse", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "交渉",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosed()).toBe(false);
            });
        });
        
        describe("成功クローズ判定", () => {
            test("ステータスが'クローズ(成功)'の場合はtrue", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "クローズ(成功)",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosedWon()).toBe(true);
            });
            
            test("ステータスが'クローズ(失敗)'の場合はfalse", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "クローズ(失敗)",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosedWon()).toBe(false);
            });
            
            test("ステータスが'提案'の場合はfalse", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "提案",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(deal.isClosedWon()).toBe(false);
            });
        });
    });

    describe("ドメインロジック", () => {
        describe("クローズ", () => {
            test("成功でクローズするとステータスが'クローズ(成功)'になる", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "交渉",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                const closedDeal = deal.close(true);
                expect(closedDeal.status).toBe("クローズ(成功)");
            });
            
            test("失敗でクローズするとステータスが'クローズ(失敗)'になる", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "交渉",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                const closedDeal = deal.close(false);
                expect(closedDeal.status).toBe("クローズ(失敗)");
            });
            
            test("既にクローズ済みの場合はエラーになる", () => {
                const deal = new Deal(
                    "deal-001",
                    "大型案件",
                    "lead-001",
                    "クローズ(成功)",
                    1000000,
                    new Date("2024-12-31"),
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(() => deal.close(true)).toThrow("既にクローズされています");
            });
        });
    });
});

describe("営業活動エンティティ", () => {
    describe("状態の参照", () => {
        test("idはコンストラクタで渡した値になる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.id).toBe("activity-001");
        });
        
        test("案件IDはコンストラクタで渡した値になる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-999",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.dealId).toBe("deal-999");
        });
        
        test("活動種別はコンストラクタで渡した値になる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "電話",
                new Date("2024-01-15"),
                "フォローアップ電話",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.activityType).toBe("電話");
        });
        
        test("活動日はコンストラクタで渡した値になる", () => {
            const activityDate = new Date("2024-02-20");
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                activityDate,
                "商談",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.activityDate).toEqual(activityDate);
        });
        
        test("内容はコンストラクタで渡した値になる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "製品デモと要件ヒアリング",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.content).toBe("製品デモと要件ヒアリング");
        });
        
        test("担当者IDはコンストラクタで渡した値になる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-555",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            expect(activity.assigneeId).toBe("user-555");
        });
    });

    describe("状態の更新", () => {
        test("内容を新しい値に変える", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedActivity = activity.updateContent("詳細な要件ヒアリング実施");
            expect(updatedActivity.content).toBe("詳細な要件ヒアリング実施");
        });
        
        test("活動日を新しい日付に変える", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const newDate = new Date("2024-02-20");
            const updatedActivity = activity.updateActivityDate(newDate);
            expect(updatedActivity.activityDate).toEqual(newDate);
        });
        
        test("活動種別を変更できる", () => {
            const activity = new Activity(
                "activity-001",
                "deal-001",
                "面談",
                new Date("2024-01-15"),
                "初回打ち合わせ",
                "user-001",
                new Date("2024-01-01"),
                new Date("2024-01-01")
            );
            const updatedActivity = activity.updateActivityType("メール");
            expect(updatedActivity.activityType).toBe("メール");
        });
    });

    describe("状態の判定", () => {
        describe("当日活動判定", () => {
            test("活動日が今日の場合はtrue", () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const activity = new Activity(
                    "activity-001",
                    "deal-001",
                    "面談",
                    today,
                    "本日の打ち合わせ",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(activity.isToday()).toBe(true);
            });
            
            test("活動日が昨日の場合はfalse", () => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                const activity = new Activity(
                    "activity-001",
                    "deal-001",
                    "面談",
                    yesterday,
                    "昨日の打ち合わせ",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(activity.isToday()).toBe(false);
            });
            
            test("活動日が明日の場合はfalse", () => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const activity = new Activity(
                    "activity-001",
                    "deal-001",
                    "面談",
                    tomorrow,
                    "明日の打ち合わせ",
                    "user-001",
                    new Date("2024-01-01"),
                    new Date("2024-01-01")
                );
                expect(activity.isToday()).toBe(false);
            });
        });
    });
});
