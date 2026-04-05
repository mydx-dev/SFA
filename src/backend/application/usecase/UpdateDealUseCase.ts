import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Deal } from "../../domain/entity/Deal";

interface UpdateDealInput {
    id: string;
    dealName?: string;
    amount?: number | null;
    expectedCloseDate?: Date | null;
    status?: "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)";
    assigneeId?: string;
}

export class UpdateDealUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: UpdateDealInput): Deal {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        if (input.status && !["提案", "交渉", "クローズ(成功)", "クローズ(失敗)"].includes(input.status)) {
            throw new Error("無効なステータスです");
        }

        // 案件を取得
        const deals = this.db.table("案件").find(
            this.db.query("案件").and("ID", "=", [input.id])
        );

        if (deals.length === 0) {
            throw new Error("案件が見つかりません");
        }

        let deal = deals[0];

        // クローズ済みの案件は更新できない
        if (deal.isClosed()) {
            throw new Error("クローズ済みの案件は更新できません");
        }

        // 案件を更新
        if (input.dealName !== undefined) {
            deal = deal.updateDealName(input.dealName);
        }
        if (input.amount !== undefined) {
            deal = deal.updateAmount(input.amount);
        }
        if (input.expectedCloseDate !== undefined) {
            deal = deal.updateExpectedCloseDate(input.expectedCloseDate);
        }
        if (input.status !== undefined) {
            deal = deal.updateStatus(input.status);
        }
        if (input.assigneeId !== undefined) {
            deal = deal.updateAssignee(input.assigneeId);
        }

        // 保存
        this.db.table("案件").update([deal]);

        return deal;
    }
}
