import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES, DealTable } from "../../infrastructure/SheetORM/tables";
import { Deal } from "../../domain/entity/Deal";

interface CreateDealInput {
    dealName: string;
    leadId: string;
    amount?: number | null;
    expectedCloseDate?: Date | null;
    assigneeId: string;
}

export class CreateDealUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: CreateDealInput): Deal {
        // バリデーション
        if (!input.dealName || input.dealName.trim() === "") {
            throw new Error("案件名は必須です");
        }

        if (!input.leadId) {
            throw new Error("リードIDは必須です");
        }

        // リードが存在するか確認
        const leads = this.db.table("リード").find(
            this.db.query("リード").and("ID", "=", [input.leadId])
        );

        if (leads.length === 0) {
            throw new Error("リードが見つかりません");
        }

        const lead = leads[0];

        // 案件エンティティを生成
        const now = new Date();
        const deal = new Deal(
            this.generateId(),
            input.dealName,
            input.leadId,
            "提案", // 初期ステータスは'提案'
            input.amount || null,
            input.expectedCloseDate || null,
            input.assigneeId,
            now,
            now
        );

        // 案件テーブルに保存
        const dealRecord = DealTable.serialize(deal);
        this.db.table("案件").create([dealRecord]);

        // リードのステータスを'商談化'に更新
        const updatedLead = lead.convertToDeal();
        this.db.table("リード").update([updatedLead]);

        return deal;
    }

    private generateId(): string {
        return `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
