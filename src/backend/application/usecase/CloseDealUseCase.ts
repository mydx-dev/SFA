import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Deal } from "../../domain/entity/Deal";

interface CloseDealInput {
    id: string;
    isWon: boolean;
}

export class CloseDealUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: CloseDealInput): Deal {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        // 案件を取得
        const deals = this.db.table("案件").find(
            this.db.query("案件").and("ID", "=", [input.id])
        );

        if (deals.length === 0) {
            throw new Error("案件が見つかりません");
        }

        const deal = deals[0];

        // 既にクローズ済みの場合エラー
        if (deal.isClosed()) {
            throw new Error("既にクローズ済みです");
        }

        // 案件をクローズ
        const closedDeal = deal.close(input.isWon);

        // 案件を保存
        this.db.table("案件").update([closedDeal]);

        // リードのステータスを更新
        const leads = this.db.table("リード").find(
            this.db.query("リード").and("ID", "=", [deal.leadId])
        );

        if (leads.length > 0) {
            const lead = leads[0];
            const newStatus = input.isWon ? "顧客化" : "失注";
            const updatedLead = lead.updateStatus(newStatus);
            this.db.table("リード").update([updatedLead]);
        }

        return closedDeal;
    }
}
