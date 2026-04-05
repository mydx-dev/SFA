import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";

interface DeleteActivityInput {
    id: string;
}

export class DeleteActivityUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: DeleteActivityInput): { success: boolean } {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        // 営業活動が存在するか確認
        const activities = this.db.table("営業活動").find(
            this.db.query("営業活動").and("ID", "=", [input.id])
        );

        if (activities.length === 0) {
            throw new Error("営業活動が見つかりません");
        }

        // 営業活動を削除
        this.db.table("営業活動").delete([input.id]);

        return { success: true };
    }
}
