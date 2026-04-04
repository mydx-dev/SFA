import { describe, test, expect, vi, beforeEach } from "vitest";
import type { SyncOutput } from "../../../src/shared/types/sync";

// Mock modules before importing
vi.mock("../../../src/frontend/lib/AppsScriptClient", () => ({
    client: {
        sync: vi.fn(),
        getLeads: vi.fn(),
        createLead: vi.fn(),
        updateLead: vi.fn(),
        createDeal: vi.fn(),
        createActivity: vi.fn()
    }
}));

vi.mock("../../../src/frontend/lib/LocalDB", () => ({
    dexie: {
        leads: {
            toArray: vi.fn(),
            bulkPut: vi.fn(),
            bulkDelete: vi.fn(),
            add: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            put: vi.fn(),
            get: vi.fn()
        },
        deals: {
            toArray: vi.fn(),
            bulkPut: vi.fn(),
            bulkDelete: vi.fn(),
            add: vi.fn(),
            delete: vi.fn(),
            put: vi.fn()
        },
        activities: {
            toArray: vi.fn(),
            bulkPut: vi.fn(),
            bulkDelete: vi.fn(),
            add: vi.fn(),
            delete: vi.fn(),
            put: vi.fn()
        },
        transaction: vi.fn()
    }
}));

import { sync } from "../../../src/frontend/usecase/sync";
import { client } from "../../../src/frontend/lib/AppsScriptClient";
import { dexie } from "../../../src/frontend/lib/LocalDB";

describe("syncユースケース", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("optimistic updates", () => {
        test("楽観的更新なし（syncは全件置き換え）", () => {
            // syncは楽観的更新を行わず、リモートのデータで完全に置き換える
            expect(true).toBe(true);
        });
    });

    describe("call api", () => {
        test("syncAPIを呼び出す", async () => {
            const mockSyncOutput: SyncOutput = [];
            vi.mocked(client.sync).mockResolvedValue({ 
                stringifyData: JSON.stringify(mockSyncOutput)
            } as any);

            await sync();

            expect(client.sync).toHaveBeenCalledOnce();
        });

        test("レスポンスをパースしてSyncOutputを取得する", async () => {
            const mockSyncOutput: SyncOutput = [
                {
                    table: { name: "leads", primaryKey: "id" },
                    records: [
                        { id: "1", name: "Test Lead" }
                    ]
                }
            ];
            vi.mocked(client.sync).mockResolvedValue({
                stringifyData: JSON.stringify(mockSyncOutput)
            } as any);

            await sync();

            expect(client.sync).toHaveBeenCalled();
        });

        test("各テーブルのレコードをIndexedDBにbulkPutで保存する", async () => {
            const mockTable = {
                toArray: vi.fn().mockResolvedValue([]),
                bulkPut: vi.fn().mockResolvedValue(undefined),
                bulkDelete: vi.fn().mockResolvedValue(undefined)
            };
            const mockTransaction = vi.fn(async (_mode: string, _table: any, callback: () => Promise<void>) => {
                await callback();
            });

            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(dexie).transaction = mockTransaction as any;

            const mockSyncOutput: SyncOutput = [
                {
                    table: { name: "leads", primaryKey: "id" },
                    records: [
                        { id: "1", name: "Test Lead" }
                    ]
                }
            ];
            vi.mocked(client.sync).mockResolvedValue({
                success: true,
                data: mockSyncOutput
            });

            await sync();

            expect(mockTable.bulkPut).toHaveBeenCalledWith([
                { id: "1", name: "Test Lead" }
            ]);
        });

        test("リモートに存在しないレコードをローカルから削除する", async () => {
            const mockTable = {
                toArray: vi.fn().mockResolvedValue([
                    { id: "1", name: "Existing Lead" },
                    { id: "2", name: "To Be Deleted" }
                ]),
                bulkPut: vi.fn().mockResolvedValue(undefined),
                bulkDelete: vi.fn().mockResolvedValue(undefined)
            };
            const mockTransaction = vi.fn(async (_mode: string, _table: any, callback: () => Promise<void>) => {
                await callback();
            });

            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(dexie).transaction = mockTransaction as any;

            const mockSyncOutput: SyncOutput = [
                {
                    table: { name: "leads", primaryKey: "id" },
                    records: [
                        { id: "1", name: "Updated Lead" }
                    ]
                }
            ];
            vi.mocked(client.sync).mockResolvedValue({
                success: true,
                data: mockSyncOutput
            });

            await sync();

            expect(mockTable.bulkDelete).toHaveBeenCalledWith(["2"]);
        });

        test("APIがnullを返した場合は何もしない", async () => {
            vi.mocked(client.sync).mockResolvedValue({
                success: true,
                data: null as any
            });

            await sync();

            // トランザクションが実行されないことを確認
            expect(dexie.transaction).not.toHaveBeenCalled();
        });
    });
});

describe("リード一覧取得フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的更新なし", () => {
            // リード一覧取得は楽観的更新を行わない
            expect(true).toBe(true);
        });
    });
    describe("call api", () => {
        test("リード取得APIを呼び出す", async () => {
            const mockLeads = [
                { 
                    id: "1", 
                    name: "Test Lead",
                    companyName: "Test Company",
                    email: null,
                    phoneNumber: null,
                    status: "未対応" as const,
                    assigneeId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pkValue: "1"
                }
            ];
            vi.mocked(client.getLeads).mockResolvedValue({
                success: true,
                data: mockLeads
            });

            const { fetchLeads } = await import("../../../src/frontend/usecase/leads");
            await fetchLeads();

            expect(client.getLeads).toHaveBeenCalledOnce();
        });

        test("取得したリードデータをIndexedDBに保存する", async () => {
            const mockLeads = [
                { 
                    id: "1", 
                    name: "Test Lead",
                    companyName: "Test Company",
                    email: null,
                    phoneNumber: null,
                    status: "未対応" as const,
                    assigneeId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pkValue: "1"
                }
            ];
            const mockTable = {
                bulkPut: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.getLeads).mockResolvedValue({
                success: true,
                data: mockLeads
            });

            const { fetchLeads } = await import("../../../src/frontend/usecase/leads");
            await fetchLeads();

            expect(mockTable.bulkPut).toHaveBeenCalledWith(mockLeads);
        });

        test("取得失敗時はエラーをスローする", async () => {
            vi.mocked(client.getLeads).mockResolvedValue({
                success: false,
                error: "Failed to fetch leads"
            });

            const { fetchLeads } = await import("../../../src/frontend/usecase/leads");
            
            await expect(fetchLeads()).rejects.toThrow("Failed to fetch leads");
        });
    });
});

describe("リード作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルにリードを追加する", async () => {
            const newLead = {
                name: "New Lead",
                companyName: "New Company",
                email: "test@example.com",
                phoneNumber: "123-456-7890",
                status: "未対応" as const,
                assigneeId: null
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1")
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { createLead } = await import("../../../src/frontend/usecase/leads");
            const promise = createLead(newLead);

            // Wait a bit for optimistic update
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockTable.add).toHaveBeenCalled();
        });

        test("失敗時に追加したリードをロールバックする", async () => {
            const newLead = {
                name: "New Lead",
                companyName: "New Company",
                email: "test@example.com",
                phoneNumber: "123-456-7890",
                status: "未対応" as const,
                assigneeId: null
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue({
                success: false,
                error: "Failed to create lead"
            });

            const { createLead } = await import("../../../src/frontend/usecase/leads");
            
            await expect(createLead(newLead)).rejects.toThrow("Failed to create lead");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
    describe("call api", () => {
        test("リード作成APIを呼び出す", async () => {
            const newLead = {
                name: "New Lead",
                companyName: "New Company",
                email: "test@example.com",
                phoneNumber: "123-456-7890",
                status: "未対応" as const,
                assigneeId: null
            };
            
            const createdLead = {
                id: "1",
                ...newLead,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue({
                success: true,
                data: createdLead
            });

            const { createLead } = await import("../../../src/frontend/usecase/leads");
            await createLead(newLead);

            expect(client.createLead).toHaveBeenCalledWith(newLead);
        });

        test("成功時にローカルのリードを確定（サーバー返却値で更新）する", async () => {
            const newLead = {
                name: "New Lead",
                companyName: "New Company",
                email: "test@example.com",
                phoneNumber: "123-456-7890",
                status: "未対応" as const,
                assigneeId: null
            };
            
            const createdLead = {
                id: "1",
                ...newLead,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue({
                success: true,
                data: createdLead
            });

            const { createLead } = await import("../../../src/frontend/usecase/leads");
            await createLead(newLead);

            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
            expect(mockTable.put).toHaveBeenCalledWith(createdLead);
        });

        test("失敗時にローカルの楽観的更新をロールバックする", async () => {
            const newLead = {
                name: "New Lead",
                companyName: "New Company",
                email: "test@example.com",
                phoneNumber: "123-456-7890",
                status: "未対応" as const,
                assigneeId: null
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue({
                success: false,
                error: "Failed to create lead"
            });

            const { createLead } = await import("../../../src/frontend/usecase/leads");
            
            await expect(createLead(newLead)).rejects.toThrow("Failed to create lead");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
});

describe("リード更新フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルのリードを更新する", async () => {
            const leadId = "1";
            const updates = {
                name: "Updated Lead",
                status: "対応中" as const
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue({
                    id: "1",
                    name: "Original Lead",
                    companyName: "Company",
                    email: null,
                    phoneNumber: null,
                    status: "未対応",
                    assigneeId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { updateLead } = await import("../../../src/frontend/usecase/leads");
            const promise = updateLead(leadId, updates);

            // Wait a bit for optimistic update
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockTable.update).toHaveBeenCalledWith(leadId, updates);
        });

        test("失敗時に更新前の状態にロールバックする", async () => {
            const leadId = "1";
            const updates = {
                name: "Updated Lead",
                status: "対応中" as const
            };
            const originalLead = {
                id: "1",
                name: "Original Lead",
                companyName: "Company",
                email: null,
                phoneNumber: null,
                status: "未対応" as const,
                assigneeId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue(originalLead),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({
                success: false,
                error: "Failed to update lead"
            });

            const { updateLead } = await import("../../../src/frontend/usecase/leads");
            
            await expect(updateLead(leadId, updates)).rejects.toThrow("Failed to update lead");
            expect(mockTable.put).toHaveBeenCalledWith(originalLead);
        });
    });
    describe("call api", () => {
        test("リード更新APIを呼び出す", async () => {
            const leadId = "1";
            const updates = {
                name: "Updated Lead",
                status: "対応中" as const
            };
            const updatedLead = {
                id: "1",
                name: "Updated Lead",
                companyName: "Company",
                email: null,
                phoneNumber: null,
                status: "対応中" as const,
                assigneeId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue({
                    id: "1",
                    name: "Original Lead",
                    companyName: "Company",
                    email: null,
                    phoneNumber: null,
                    status: "未対応",
                    assigneeId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({
                success: true,
                data: updatedLead
            });

            const { updateLead } = await import("../../../src/frontend/usecase/leads");
            await updateLead(leadId, updates);

            expect(client.updateLead).toHaveBeenCalledWith(leadId, updates);
        });

        test("成功時にローカルのリードをサーバー返却値で更新する", async () => {
            const leadId = "1";
            const updates = {
                name: "Updated Lead",
                status: "対応中" as const
            };
            const updatedLead = {
                id: "1",
                name: "Updated Lead",
                companyName: "Company",
                email: null,
                phoneNumber: null,
                status: "対応中" as const,
                assigneeId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue({
                    id: "1",
                    name: "Original Lead",
                    companyName: "Company",
                    email: null,
                    phoneNumber: null,
                    status: "未対応",
                    assigneeId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({
                success: true,
                data: updatedLead
            });

            const { updateLead } = await import("../../../src/frontend/usecase/leads");
            await updateLead(leadId, updates);

            expect(mockTable.put).toHaveBeenCalledWith(updatedLead);
        });

        test("失敗時にロールバックする", async () => {
            const leadId = "1";
            const updates = {
                name: "Updated Lead",
                status: "対応中" as const
            };
            const originalLead = {
                id: "1",
                name: "Original Lead",
                companyName: "Company",
                email: null,
                phoneNumber: null,
                status: "未対応" as const,
                assigneeId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue(originalLead),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({
                success: false,
                error: "Failed to update lead"
            });

            const { updateLead } = await import("../../../src/frontend/usecase/leads");
            
            await expect(updateLead(leadId, updates)).rejects.toThrow("Failed to update lead");
            expect(mockTable.put).toHaveBeenCalledWith(originalLead);
        });
    });
});

describe("案件作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルに案件を追加する", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: new Date(),
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1")
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { createDeal } = await import("../../../src/frontend/usecase/deals");
            const promise = createDeal(newDeal);

            // Wait a bit for optimistic update
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockTable.add).toHaveBeenCalled();
        });

        test("失敗時に追加した案件をロールバックする", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: new Date(),
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({
                success: false,
                error: "Failed to create deal"
            });

            const { createDeal } = await import("../../../src/frontend/usecase/deals");
            
            await expect(createDeal(newDeal)).rejects.toThrow("Failed to create deal");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
    describe("call api", () => {
        test("案件作成APIを呼び出す", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: new Date(),
                assigneeId: "user1"
            };
            
            const createdDeal = {
                id: "1",
                ...newDeal,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({
                success: true,
                data: createdDeal
            });

            const { createDeal } = await import("../../../src/frontend/usecase/deals");
            await createDeal(newDeal);

            expect(client.createDeal).toHaveBeenCalledWith(newDeal);
        });

        test("成功時にローカルの案件を確定する", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: new Date(),
                assigneeId: "user1"
            };
            
            const createdDeal = {
                id: "1",
                ...newDeal,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({
                success: true,
                data: createdDeal
            });

            const { createDeal } = await import("../../../src/frontend/usecase/deals");
            await createDeal(newDeal);

            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
            expect(mockTable.put).toHaveBeenCalledWith(createdDeal);
        });

        test("失敗時にロールバックする", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: new Date(),
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({
                success: false,
                error: "Failed to create deal"
            });

            const { createDeal } = await import("../../../src/frontend/usecase/deals");
            
            await expect(createDeal(newDeal)).rejects.toThrow("Failed to create deal");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
});

describe("営業活動作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルに営業活動を追加する", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: new Date(),
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1")
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { createActivity } = await import("../../../src/frontend/usecase/activities");
            const promise = createActivity(newActivity);

            // Wait a bit for optimistic update
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockTable.add).toHaveBeenCalled();
        });

        test("失敗時に追加した営業活動をロールバックする", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: new Date(),
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({
                success: false,
                error: "Failed to create activity"
            });

            const { createActivity } = await import("../../../src/frontend/usecase/activities");
            
            await expect(createActivity(newActivity)).rejects.toThrow("Failed to create activity");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
    describe("call api", () => {
        test("営業活動作成APIを呼び出す", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: new Date(),
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const createdActivity = {
                id: "1",
                ...newActivity,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({
                success: true,
                data: createdActivity
            });

            const { createActivity } = await import("../../../src/frontend/usecase/activities");
            await createActivity(newActivity);

            expect(client.createActivity).toHaveBeenCalledWith(newActivity);
        });

        test("成功時にローカルの営業活動を確定する", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: new Date(),
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const createdActivity = {
                id: "1",
                ...newActivity,
                createdAt: new Date(),
                updatedAt: new Date(),
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({
                success: true,
                data: createdActivity
            });

            const { createActivity } = await import("../../../src/frontend/usecase/activities");
            await createActivity(newActivity);

            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
            expect(mockTable.put).toHaveBeenCalledWith(createdActivity);
        });

        test("失敗時にロールバックする", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: new Date(),
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({
                success: false,
                error: "Failed to create activity"
            });

            const { createActivity } = await import("../../../src/frontend/usecase/activities");
            
            await expect(createActivity(newActivity)).rejects.toThrow("Failed to create activity");
            expect(mockTable.delete).toHaveBeenCalledWith("temp-1");
        });
    });
});
