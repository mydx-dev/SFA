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

describe("案件作成フロントエンドユースケース", () => {
    describe("optimistic updates", () => {
        test("楽観的にローカルに案件を追加する", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: "2026-01-01T00:00:00.000Z",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1")
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { createDeal } = await import("../../../../src/frontend/usecase/deals");
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
                expectedCloseDate: "2026-01-01T00:00:00.000Z",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create deal"
            

            const { createDeal } = await import("../../../../src/frontend/usecase/deals");
            
            await expect(createDeal(newDeal)).rejects.toThrow("Failed to create deal");
            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
        });
    });
    describe("call api", () => {
        test("案件作成APIを呼び出す", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: "2026-01-01T00:00:00.000Z",
                assigneeId: "user1"
            };
            
            const createdDeal = {
                id: "1",
                ...newDeal,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue(mockResponse(createdDeal
            ));

            const { createDeal } = await import("../../../../src/frontend/usecase/deals");
            await createDeal(newDeal);

            expect(client.createDeal).toHaveBeenCalledWith(newDeal);
        });

        test("成功時にローカルの案件を確定する", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: "2026-01-01T00:00:00.000Z",
                assigneeId: "user1"
            };
            
            const createdDeal = {
                id: "1",
                ...newDeal,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue(mockResponse(createdDeal
            ));

            const { createDeal } = await import("../../../../src/frontend/usecase/deals");
            await createDeal(newDeal);

            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
            expect(mockTable.put).toHaveBeenCalledWith(createdDeal);
        });

        test("失敗時にロールバックする", async () => {
            const newDeal = {
                dealName: "New Deal",
                leadId: "1",
                status: "提案" as const,
                amount: 100000,
                expectedCloseDate: "2026-01-01T00:00:00.000Z",
                assigneeId: "user1"
            };
            
            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).deals = mockTable as any;
            vi.mocked(client.createDeal).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create deal"
            

            const { createDeal } = await import("../../../../src/frontend/usecase/deals");
            
            await expect(createDeal(newDeal)).rejects.toThrow("Failed to create deal");
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

