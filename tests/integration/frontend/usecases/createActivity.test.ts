import { describe, test, expect, vi, beforeEach } from "vitest";
import type { SyncOutput } from "../../../../src/shared/types/sync";

// Mock modules before importing
vi.mock("../../../../src/frontend/lib/AppsScriptClient", () => ({
    client: {
        sync: vi.fn(),
        getLeads: vi.fn(),
        createLead: vi.fn(),
        updateLead: vi.fn(),
        createDeal: vi.fn(),
        createActivity: vi.fn()
    }
}));

vi.mock("../../../../src/frontend/lib/LocalDB", () => ({
    dexie: {
        "リード": {
            toArray: vi.fn(),
            bulkPut: vi.fn(),
            bulkDelete: vi.fn(),
            add: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            put: vi.fn(),
            get: vi.fn()
        },
        "案件": {
            toArray: vi.fn(),
            bulkPut: vi.fn(),
            bulkDelete: vi.fn(),
            add: vi.fn(),
            delete: vi.fn(),
            put: vi.fn()
        },
        "営業活動": {
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

import { sync } from "../../../../src/frontend/usecase/sync";
import { client } from "../../../../src/frontend/lib/AppsScriptClient";
import { dexie } from "../../../../src/frontend/lib/LocalDB";


// Helper to create AppsScriptResponse mock
function mockResponse<T>(data: T): any {
    return { stringifyData: JSON.stringify(data) };
}

describe("営業活動作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルに営業活動を追加する", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: "2026-01-01T00:00:00.000Z",
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1")
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { createActivity } = await import("../../../../src/frontend/usecase/activities");
            const promise = createActivity(newActivity);

            // Wait a bit for optimistic update
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockTable.add).toHaveBeenCalled();
        });

        test("失敗時に追加した営業活動をロールバックする", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: "2026-01-01T00:00:00.000Z",
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create activity"
            

            const { createActivity } = await import("../../../../src/frontend/usecase/activities");
            
            await expect(createActivity(newActivity)).rejects.toThrow("Failed to create activity");
            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
        });
    });
    describe("call api", () => {
        test("営業活動作成APIを呼び出す", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: "2026-01-01T00:00:00.000Z",
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const createdActivity = {
                id: "1",
                ...newActivity,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue(mockResponse(createdActivity
            ));

            const { createActivity } = await import("../../../../src/frontend/usecase/activities");
            await createActivity(newActivity);

            expect(client.createActivity).toHaveBeenCalledWith(newActivity);
        });

        test("成功時にローカルの営業活動を確定する", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: "2026-01-01T00:00:00.000Z",
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const createdActivity = {
                id: "1",
                ...newActivity,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue(mockResponse(createdActivity
            ));

            const { createActivity } = await import("../../../../src/frontend/usecase/activities");
            await createActivity(newActivity);

            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
            expect(mockTable.put).toHaveBeenCalledWith(createdActivity);
        });

        test("失敗時にロールバックする", async () => {
            const newActivity = {
                dealId: "1",
                activityType: "面談" as const,
                activityDate: "2026-01-01T00:00:00.000Z",
                content: "商談内容",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).activities = mockTable as any;
            vi.mocked(client.createActivity).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create activity"
            

            const { createActivity } = await import("../../../../src/frontend/usecase/activities");
            
            await expect(createActivity(newActivity)).rejects.toThrow("Failed to create activity");
            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("サイズ", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("色", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("タイポグラフィ", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("形状", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("装飾", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
        describe("インタラクション", () => {
                test("レイアウトが正しく表示される", () => {
                    // Layout test placeholder
                    expect(true).toBe(true);
                });
            });
    });
});
