import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";

interface DeleteDealInput {
    id: string;
}

export class DeleteDealUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: DeleteDealInput): { success: boolean } {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        // 案件が存在するか確認
        const deals = this.db.table("案件").find(
            this.db.query("案件").and("ID", "=", [input.id])
        );

        if (deals.length === 0) {
            throw new Error("案件が見つかりません");
        }

        // 案件に紐づく営業活動を削除
        const activities = this.db.table("営業活動").find(
            this.db.query("営業活動").and("案件ID", "=", [input.id])
        );
        if (activities.length > 0) {
            this.db.table("営業活動").delete(activities.map(a => a.id));
        }

        // 案件を削除
        this.db.table("案件").delete([input.id]);

        return { success: true };
    }
}
