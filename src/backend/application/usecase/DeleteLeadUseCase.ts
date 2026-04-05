import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";

interface DeleteLeadInput {
    id: string;
}

export class DeleteLeadUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: DeleteLeadInput): { success: boolean } {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        // リードが存在するか確認
        const leads = this.db.table("リード").find(
            this.db.query("リード").and("ID", "=", [input.id])
        );

        if (leads.length === 0) {
            throw new Error("リードが見つかりません");
        }

        // リードに紐づく案件を取得
        const deals = this.db.table("案件").find(
            this.db.query("案件").and("リードID", "=", [input.id])
        );

        // 案件に紐づく営業活動を削除
        for (const deal of deals) {
            const activities = this.db.table("営業活動").find(
                this.db.query("営業活動").and("案件ID", "=", [deal.id])
            );
            if (activities.length > 0) {
                this.db.table("営業活動").delete(activities.map(a => a.id));
            }
        }

        // リードに紐づく案件を削除
        if (deals.length > 0) {
            this.db.table("案件").delete(deals.map(d => d.id));
        }

        // リードを削除
        this.db.table("リード").delete([input.id]);

        return { success: true };
    }
}
