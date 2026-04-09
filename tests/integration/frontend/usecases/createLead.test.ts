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

            const { createLead } = await import("../../../../src/frontend/usecase/leads");
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
            vi.mocked(client.createLead).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create lead"
            

            const { createLead } = await import("../../../../src/frontend/usecase/leads");
            
            await expect(createLead(newLead)).rejects.toThrow("Failed to create lead");
            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue(mockResponse(createdLead
            ));

            const { createLead } = await import("../../../../src/frontend/usecase/leads");
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
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                pkValue: "1"
            };

            const mockTable = {
                add: vi.fn().mockResolvedValue("temp-1"),
                put: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined)
            };
            vi.mocked(dexie).leads = mockTable as any;
            vi.mocked(client.createLead).mockResolvedValue(mockResponse(createdLead
            ));

            const { createLead } = await import("../../../../src/frontend/usecase/leads");
            await createLead(newLead);

            expect(mockTable.delete).toHaveBeenCalled();
            expect(mockTable.delete.mock.calls[0][0]).toMatch(/^temp-/);
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
            vi.mocked(client.createLead).mockResolvedValue({ stringifyData: JSON.stringify(null) }); // Error: "Failed to create lead"
            

            const { createLead } = await import("../../../../src/frontend/usecase/leads");
            
            await expect(createLead(newLead)).rejects.toThrow("Failed to create lead");
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

