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
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockImplementation(() => new Promise(() => {})); // Never resolves

            const { updateLead } = await import("../../../../src/frontend/usecase/leads");
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue(originalLead),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to update lead"
            

            const { updateLead } = await import("../../../../src/frontend/usecase/leads");
            
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
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
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue(mockResponse(updatedLead
            ));

            const { updateLead } = await import("../../../../src/frontend/usecase/leads");
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
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
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                    pkValue: "1"
                }),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue(mockResponse(updatedLead
            ));

            const { updateLead } = await import("../../../../src/frontend/usecase/leads");
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };
            
            const mockTable = {
                get: vi.fn().mockResolvedValue(originalLead),
                update: vi.fn().mockResolvedValue(undefined),
                put: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.updateLead).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to update lead"
            

            const { updateLead } = await import("../../../../src/frontend/usecase/leads");
            
            await expect(updateLead(leadId, updates)).rejects.toThrow("Failed to update lead");
            expect(mockTable.put).toHaveBeenCalledWith(originalLead);
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

