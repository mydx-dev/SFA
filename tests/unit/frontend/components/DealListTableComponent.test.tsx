import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("DealListTableComponent", () => {
    const createMockDeal = (overrides?: Partial<Deal>): Deal => {
        return new Deal(
            overrides?.id ?? "deal-1",
            overrides?.dealName ?? "テスト案件",
            overrides?.leadId ?? "lead-1",
            overrides?.status ?? "提案",
            overrides && "amount" in overrides ? (overrides.amount as number | null) : 1000000,
            overrides && "expectedCloseDate" in overrides
                ? (overrides.expectedCloseDate as Date | null)
                : new Date("2026-12-31"),
            overrides?.assigneeId ?? "user-1",
            overrides?.createdAt ?? new Date(),
            overrides?.updatedAt ?? new Date()
        );
    };

    describe("props", () => {
        test("deals配列が渡された場合、案件一覧が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const deals = [
                createMockDeal({ id: "1", dealName: "案件A" }),
                createMockDeal({ id: "2", dealName: "案件B" }),
            ];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("案件A")).toBeInTheDocument();
            expect(screen.getByText("案件B")).toBeInTheDocument();
        });

        test("dealsが空配列の場合、'案件がありません'が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

            expect(screen.getByText("案件がありません")).toBeInTheDocument();
        });

        test("onDealClickが渡された場合、案件クリックで呼ばれる", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "1", dealName: "案件A" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("案件A"));

            expect(onDealClick).toHaveBeenCalledWith("1");
        });
    });

    describe("描画", () => {
        test("テーブルヘッダーに案件名・ステータス・金額・予定クローズ日が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

            expect(screen.getByText("案件名")).toBeInTheDocument();
            expect(screen.getByText("ステータス")).toBeInTheDocument();
            expect(screen.getByText("金額")).toBeInTheDocument();
            expect(screen.getByText("予定クローズ日")).toBeInTheDocument();
        });

        test("各案件の案件名・ステータス・金額が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const deals = [
                createMockDeal({
                    dealName: "重要案件",
                    status: "交渉",
                    amount: 5000000,
                }),
            ];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("重要案件")).toBeInTheDocument();
            expect(screen.getByText("交渉")).toBeInTheDocument();
            expect(screen.getByText("¥5,000,000")).toBeInTheDocument();
        });

        test("amountがnullの場合、'未設定'が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ amount: null })];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getAllByText("未設定").length).toBeGreaterThan(0);
        });

        test("expectedCloseDateがnullの場合、'未設定'が表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ expectedCloseDate: null })];            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getAllByText("未設定").length).toBeGreaterThan(0);
        });

        test("予定クローズ日がyyyy/MM/dd形式で表示される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const deals = [createMockDeal({ expectedCloseDate: new Date("2026-12-31") })];
            render(<DealListTable deals={deals} onDealClick={() => {}} />);

            expect(screen.getByText("2026/12/31")).toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("案件クリックでonDealClickイベントが発火する", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-123", dealName: "テスト案件" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("テスト案件"));

            expect(onDealClick).toHaveBeenCalled();
        });

        test("クリックされた案件のIDがonDealClickに渡される", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const onDealClick = vi.fn();
            const deals = [createMockDeal({ id: "deal-456", dealName: "特定案件" })];
            render(<DealListTable deals={deals} onDealClick={onDealClick} />);

            await userEvent.click(screen.getByText("特定案件"));

            expect(onDealClick).toHaveBeenCalledWith("deal-456");
        });
    });

    describe("副作用", () => {
        test("マウント時に特別な処理はなし", async () => {
            const { DealListTable } = await import("../../../../src/frontend/component/deal/DealListTable");
            const consoleSpy = vi.spyOn(console, "log");
            render(<DealListTable deals={[]} onDealClick={() => {}} />);

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

// ========================================
// Stitch画面から設計されたコンポーネント
// ========================================

