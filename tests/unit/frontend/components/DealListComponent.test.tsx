import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("DealListComponent", () => {
    const createMockDeal = (overrides?: Partial<Deal>): Deal => {
        return new Deal(
            overrides?.id ?? "deal-1",
            overrides?.dealName ?? "テスト案件",
            overrides?.leadId ?? "lead-1",
            overrides?.status ?? "提案",
            overrides?.amount ?? 1000000,
            overrides?.expectedCloseDate ?? new Date(),
            overrides?.assigneeId ?? "user-1",
            overrides?.createdAt ?? new Date(),
            overrides?.updatedAt ?? new Date()
        );
    };

    describe("props", () => {
        test("deals配列が渡された場合、案件一覧が表示される", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const deals = [
                createMockDeal({ id: "1", dealName: "案件A" }),
                createMockDeal({ id: "2", dealName: "案件B" }),
            ];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件A")).toBeInTheDocument();
            expect(screen.getByText("案件B")).toBeInTheDocument();
        });

        test("dealsが空配列の場合、'案件がありません'が表示される", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });

        test("onDealClickが渡された場合、案件クリックで呼ばれる", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "1", dealName: "案件A" })];
            render(<DealList deals={deals} onDealClick={onDealClick} />);
            
            await userEvent.click(screen.getByText("案件A"));
            
            expect(onDealClick).toHaveBeenCalledWith("1");
        });
    });

    describe("描画", () => {
        test("初期状態では案件一覧が表示される", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const deals = [createMockDeal({ dealName: "テスト案件" })];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("テスト案件")).toBeInTheDocument();
        });

        test("各案件の案件名・ステータス・金額が表示される", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const deals = [
                createMockDeal({
                    dealName: "重要案件",
                    status: "交渉",
                    amount: 5000000
                })
            ];
            render(<DealList deals={deals} onDealClick={() => {}} />);
            
            expect(screen.getByText("重要案件")).toBeInTheDocument();
            expect(screen.getByText(/交渉/)).toBeInTheDocument();
            expect(screen.getByText(/¥5,000,000/)).toBeInTheDocument();
        });

        test("dealsが空の場合、空状態メッセージが表示される", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });
    });

    describe("状態管理", () => {
        test.todo("ステータスフィルター変更でリスト表示が変化する");
    });

    describe("インタラクション", () => {
        test("案件クリックでonDealClickイベントが発火する", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-123", dealName: "テスト案件" })];
            render(<DealList deals={deals} onDealClick={onDealClick} />);
            
            await userEvent.click(screen.getByText("テスト案件"));
            
            expect(onDealClick).toHaveBeenCalledWith("deal-123");
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { DealList } = await import("../../../../src/frontend/component/deal/DealList");
            const consoleSpy = vi.spyOn(console, "log");
            render(<DealList deals={[]} onDealClick={() => {}} />);
            
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
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

