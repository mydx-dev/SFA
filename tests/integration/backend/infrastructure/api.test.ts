import { describe, test, expect, vi, beforeEach } from "vitest";
import { syncAPI } from "../../../../src/backend/infrastructure/api/SyncAPI";
import { getLeadsAPI } from "../../../../src/backend/infrastructure/api/GetLeadsAPI";
import { getDealsAPI } from "../../../../src/backend/infrastructure/api/GetDealsAPI";
import { getActivitiesAPI } from "../../../../src/backend/infrastructure/api/GetActivitiesAPI";
import { AppsScriptResponse } from "../../../../src/shared/AppsScriptResponse";
import type { SyncOutput } from "../../../../src/shared/types/sync";
import { UnauthorizedError } from "@mydx-dev/gas-boost-runtime";

describe("syncAPI", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("入力", () => {
        test("認証済みユーザーのセッションが必要", async () => {
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(
                    new AppsScriptResponse<SyncOutput>([
                        { table: "システムユーザー" as any, records: [] },
                    ])
                ),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.sync).toHaveBeenCalled();
            expect(result).toBeInstanceOf(AppsScriptResponse);
        });

        test("未認証の場合はUnauthorizedErrorが返る", async () => {
            const mockGoogleScriptRun = {
                sync: vi.fn().mockImplementation(() => {
                    throw new UnauthorizedError();
                }),
            };

            await expect(syncAPI(mockGoogleScriptRun as any)).rejects.toThrow(
                UnauthorizedError
            );
        });
    });

    describe("主要操作", () => {
        test("Google Apps ScriptのrunメソッドでsyncAPIを呼び出す", async () => {
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(
                    new AppsScriptResponse<SyncOutput>([])
                ),
            };

            await syncAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.sync).toHaveBeenCalledTimes(1);
        });

        test("SyncOutputの形式でレスポンスが返る", async () => {
            const expectedData: SyncOutput = [
                { table: "システムユーザー" as any, records: [] },
                { table: "リード" as any, records: [] },
            ];
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(new AppsScriptResponse(expectedData)),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);
            const content = result.getContent();

            expect(Array.isArray(content)).toBe(true);
            expect(content).toHaveLength(2);
            expect(content[0]).toHaveProperty("table");
            expect(content[0]).toHaveProperty("records");
        });
    });

    describe("出力", () => {
        test("AppsScriptResponseでSyncOutputが返る", async () => {
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(
                    new AppsScriptResponse<SyncOutput>([])
                ),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);

            expect(result).toBeInstanceOf(AppsScriptResponse);
        });

        test("SyncOutputにはシステムユーザーテーブルのデータが含まれる", async () => {
            const expectedData: SyncOutput = [
                { table: "システムユーザー" as any, records: [{ ID: "1", メールアドレス: "test@example.com" }] },
            ];
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(new AppsScriptResponse(expectedData)),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);
            const content = result.getContent();

            const systemUserTable = content.find((item) => item.table === "システムユーザー");
            expect(systemUserTable).toBeDefined();
        });

        test("SyncOutputにはリードテーブルのデータが含まれる", async () => {
            const expectedData: SyncOutput = [
                { table: "リード" as any, records: [] },
            ];
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(new AppsScriptResponse(expectedData)),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);
            const content = result.getContent();

            const leadTable = content.find((item) => item.table === "リード");
            expect(leadTable).toBeDefined();
        });

        test("SyncOutputには案件テーブルのデータが含まれる", async () => {
            const expectedData: SyncOutput = [
                { table: "案件" as any, records: [] },
            ];
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(new AppsScriptResponse(expectedData)),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);
            const content = result.getContent();

            const dealTable = content.find((item) => item.table === "案件");
            expect(dealTable).toBeDefined();
        });

        test("SyncOutputには営業活動テーブルのデータが含まれる", async () => {
            const expectedData: SyncOutput = [
                { table: "営業活動" as any, records: [] },
            ];
            const mockGoogleScriptRun = {
                sync: vi.fn().mockReturnValue(new AppsScriptResponse(expectedData)),
            };

            const result = await syncAPI(mockGoogleScriptRun as any);
            const content = result.getContent();

            const activityTable = content.find((item) => item.table === "営業活動");
            expect(activityTable).toBeDefined();
        });
    });
});

describe("リード取得API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("入力", () => {
        test("認証済みユーザーのセッションが必要", async () => {
            const mockGoogleScriptRun = {
                getLeads: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            const result = await getLeadsAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getLeads).toHaveBeenCalled();
            expect(result).toBeInstanceOf(AppsScriptResponse);
        });

        test("担当者IDでフィルタリングできる", async () => {
            const mockGoogleScriptRun = {
                getLeads: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getLeadsAPI(mockGoogleScriptRun as any, "assignee-123");

            expect(mockGoogleScriptRun.getLeads).toHaveBeenCalledWith("assignee-123");
        });
    });

    describe("主要操作", () => {
        test("Google Apps ScriptのrunメソッドでリードAPIを呼び出す", async () => {
            const mockGoogleScriptRun = {
                getLeads: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getLeadsAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getLeads).toHaveBeenCalledTimes(1);
        });
    });

    describe("出力", () => {
        test("リード一覧がAppsScriptResponseで返る", async () => {
            const expectedLeads = [
                { id: "1", name: "Lead 1" },
                { id: "2", name: "Lead 2" },
            ];
            const mockGoogleScriptRun = {
                getLeads: vi.fn().mockReturnValue(new AppsScriptResponse(expectedLeads)),
            };

            const result = await getLeadsAPI(mockGoogleScriptRun as any);

            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toEqual(expectedLeads);
        });

        test("取得失敗時はエラーレスポンスが返る", async () => {
            const mockGoogleScriptRun = {
                getLeads: vi.fn().mockImplementation(() => {
                    throw new Error("Failed to fetch leads");
                }),
            };

            await expect(getLeadsAPI(mockGoogleScriptRun as any)).rejects.toThrow(
                "Failed to fetch leads"
            );
        });
    });
});

describe("案件取得API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("入力", () => {
        test("認証済みユーザーのセッションが必要", async () => {
            const mockGoogleScriptRun = {
                getDeals: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            const result = await getDealsAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getDeals).toHaveBeenCalled();
            expect(result).toBeInstanceOf(AppsScriptResponse);
        });

        test("リードIDでフィルタリングできる", async () => {
            const mockGoogleScriptRun = {
                getDeals: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getDealsAPI(mockGoogleScriptRun as any, "lead-123");

            expect(mockGoogleScriptRun.getDeals).toHaveBeenCalledWith("lead-123");
        });
    });

    describe("主要操作", () => {
        test("Google Apps ScriptのrunメソッドでリードAPIを呼び出す", async () => {
            const mockGoogleScriptRun = {
                getDeals: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getDealsAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getDeals).toHaveBeenCalledTimes(1);
        });
    });

    describe("出力", () => {
        test("案件一覧がAppsScriptResponseで返る", async () => {
            const expectedDeals = [
                { id: "1", dealName: "Deal 1" },
                { id: "2", dealName: "Deal 2" },
            ];
            const mockGoogleScriptRun = {
                getDeals: vi.fn().mockReturnValue(new AppsScriptResponse(expectedDeals)),
            };

            const result = await getDealsAPI(mockGoogleScriptRun as any);

            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toEqual(expectedDeals);
        });

        test("取得失敗時はエラーレスポンスが返る", async () => {
            const mockGoogleScriptRun = {
                getDeals: vi.fn().mockImplementation(() => {
                    throw new Error("Failed to fetch deals");
                }),
            };

            await expect(getDealsAPI(mockGoogleScriptRun as any)).rejects.toThrow(
                "Failed to fetch deals"
            );
        });
    });
});

describe("営業活動取得API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("入力", () => {
        test("認証済みユーザーのセッションが必要", async () => {
            const mockGoogleScriptRun = {
                getActivities: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            const result = await getActivitiesAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getActivities).toHaveBeenCalled();
            expect(result).toBeInstanceOf(AppsScriptResponse);
        });

        test("案件IDでフィルタリングできる", async () => {
            const mockGoogleScriptRun = {
                getActivities: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getActivitiesAPI(mockGoogleScriptRun as any, "deal-123");

            expect(mockGoogleScriptRun.getActivities).toHaveBeenCalledWith("deal-123");
        });
    });

    describe("主要操作", () => {
        test("Google Apps ScriptのrunメソッドでリードAPIを呼び出す", async () => {
            const mockGoogleScriptRun = {
                getActivities: vi.fn().mockReturnValue(new AppsScriptResponse([])),
            };

            await getActivitiesAPI(mockGoogleScriptRun as any);

            expect(mockGoogleScriptRun.getActivities).toHaveBeenCalledTimes(1);
        });
    });

    describe("出力", () => {
        test("営業活動一覧がAppsScriptResponseで返る", async () => {
            const expectedActivities = [
                { id: "1", content: "Activity 1" },
                { id: "2", content: "Activity 2" },
            ];
            const mockGoogleScriptRun = {
                getActivities: vi.fn().mockReturnValue(new AppsScriptResponse(expectedActivities)),
            };

            const result = await getActivitiesAPI(mockGoogleScriptRun as any);

            expect(result).toBeInstanceOf(AppsScriptResponse);
            expect(result.getContent()).toEqual(expectedActivities);
        });

        test("取得失敗時はエラーレスポンスが返る", async () => {
            const mockGoogleScriptRun = {
                getActivities: vi.fn().mockImplementation(() => {
                    throw new Error("Failed to fetch activities");
                }),
            };

            await expect(getActivitiesAPI(mockGoogleScriptRun as any)).rejects.toThrow(
                "Failed to fetch activities"
            );
        });
    });
});
