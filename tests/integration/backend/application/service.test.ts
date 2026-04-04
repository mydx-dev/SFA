import { describe, test, expect, vi, beforeEach } from "vitest";
import { Authentication } from "../../../../src/backend/application/service/Authentication";
import { SheetDB, UnauthorizedError } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../../../src/backend/infrastructure/SheetORM/tables";

describe("Authenticationアプリケーションサービス", () => {
    let mockSession: GoogleAppsScript.Base.Session;
    let mockDb: SheetDB<typeof ALL_TABLES>;
    let mockActiveUser: GoogleAppsScript.Base.User;
    
    beforeEach(() => {
        // Mock Session
        mockActiveUser = {
            getEmail: vi.fn(),
        } as any;
        
        mockSession = {
            getActiveUser: vi.fn(() => mockActiveUser),
        } as any;
        
        // Mock SheetDB
        mockDb = {
            table: vi.fn(),
            query: vi.fn(),
        } as any;
    });

    describe("入力", () => {
        test("GoogleセッションのアクティブユーザーのメールアドレスをSessionから取得する", () => {
            const testEmail = "test@example.com";
            vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
            
            const mockTable = {
                find: vi.fn().mockReturnValue([]),
            };
            vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
            vi.mocked(mockDb.query).mockReturnValue({
                and: vi.fn().mockReturnValue({}),
            } as any);
            
            const service = new Authentication(mockSession, mockDb);
            
            try {
                service.execute();
            } catch (e) {
                // UnauthorizedErrorが投げられることを期待
            }
            
            // SessionからgetActiveUser().getEmail()が呼ばれたことを確認
            expect(mockSession.getActiveUser).toHaveBeenCalled();
            expect(mockActiveUser.getEmail).toHaveBeenCalled();
        });
    });
    
    describe("主要操作", () => {
        describe("DB操作", () => {
            test("システムユーザーテーブルからメールアドレスで検索する", () => {
                const testEmail = "test@example.com";
                vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
                
                const mockQuery = {
                    and: vi.fn().mockReturnValue({}),
                };
                const mockTable = {
                    find: vi.fn().mockReturnValue([]),
                };
                
                vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
                vi.mocked(mockDb.query).mockReturnValue(mockQuery as any);
                
                const service = new Authentication(mockSession, mockDb);
                
                try {
                    service.execute();
                } catch (e) {
                    // UnauthorizedErrorが投げられることを期待
                }
                
                // システムユーザーテーブルにアクセスしたことを確認
                expect(mockDb.table).toHaveBeenCalledWith("システムユーザー");
                expect(mockDb.query).toHaveBeenCalledWith("システムユーザー");
                expect(mockQuery.and).toHaveBeenCalledWith("メールアドレス", "=", [testEmail]);
                expect(mockTable.find).toHaveBeenCalled();
            });
        });
        
        describe("ドメイン操作", () => {
            test("ユーザーが存在しない場合はUnauthorizedErrorを投げる", () => {
                const testEmail = "notfound@example.com";
                vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
                
                const mockTable = {
                    find: vi.fn().mockReturnValue([]), // 空配列 = ユーザーが見つからない
                };
                
                vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
                vi.mocked(mockDb.query).mockReturnValue({
                    and: vi.fn().mockReturnValue({}),
                } as any);
                
                const service = new Authentication(mockSession, mockDb);
                
                // UnauthorizedErrorが投げられることを確認
                expect(() => service.execute()).toThrow(UnauthorizedError);
            });
            
            test("ユーザーが存在する場合はSystemUser DTOを生成する", () => {
                const testEmail = "valid@example.com";
                const testId = "user-123";
                
                vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
                
                const mockUserEntity = {
                    id: testId,
                    email: testEmail,
                };
                
                const mockTable = {
                    find: vi.fn().mockReturnValue([mockUserEntity]),
                };
                
                vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
                vi.mocked(mockDb.query).mockReturnValue({
                    and: vi.fn().mockReturnValue({}),
                } as any);
                
                const service = new Authentication(mockSession, mockDb);
                const result = service.execute();
                
                // SystemUser DTOが生成されることを確認
                expect(result).toBeDefined();
                expect(result.id).toBe(testId);
                expect(result.email).toBe(testEmail);
            });
        });
    });
    
    describe("出力", () => {
        test("SystemUser DTOを返す", () => {
            const testEmail = "valid@example.com";
            const testId = "user-456";
            
            vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
            
            const mockUserEntity = {
                id: testId,
                email: testEmail,
            };
            
            const mockTable = {
                find: vi.fn().mockReturnValue([mockUserEntity]),
            };
            
            vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
            vi.mocked(mockDb.query).mockReturnValue({
                and: vi.fn().mockReturnValue({}),
            } as any);
            
            const service = new Authentication(mockSession, mockDb);
            const result = service.execute();
            
            // SystemUser DTOの構造を確認
            expect(result).toEqual({
                id: testId,
                email: testEmail,
            });
        });
        
        test("未登録ユーザーの場合はUnauthorizedErrorを投げる", () => {
            const testEmail = "unregistered@example.com";
            vi.mocked(mockActiveUser.getEmail).mockReturnValue(testEmail);
            
            const mockTable = {
                find: vi.fn().mockReturnValue([]), // ユーザーが見つからない
            };
            
            vi.mocked(mockDb.table).mockReturnValue(mockTable as any);
            vi.mocked(mockDb.query).mockReturnValue({
                and: vi.fn().mockReturnValue({}),
            } as any);
            
            const service = new Authentication(mockSession, mockDb);
            
            // UnauthorizedErrorが投げられることを確認
            expect(() => service.execute()).toThrow(UnauthorizedError);
        });
    });
});
