import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Activity } from "../../domain/entity/Activity";

interface UpdateActivityInput {
    id: string;
    activityType?: "面談" | "電話" | "メール" | "その他";
    activityDate?: Date;
    content?: string;
}

export class UpdateActivityUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: UpdateActivityInput): Activity {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        if (input.activityType && !["面談", "電話", "メール", "その他"].includes(input.activityType)) {
            throw new Error("無効な活動種別です");
        }

        // 営業活動を取得
        const activities = this.db.table("営業活動").find(
            this.db.query("営業活動").and("ID", "=", [input.id])
        );

        if (activities.length === 0) {
            throw new Error("営業活動が見つかりません");
        }

        let activity = activities[0];

        // 営業活動を更新
        if (input.activityType !== undefined) {
            activity = activity.updateActivityType(input.activityType);
        }
        if (input.activityDate !== undefined) {
            activity = activity.updateActivityDate(input.activityDate);
        }
        if (input.content !== undefined) {
            activity = activity.updateContent(input.content);
        }

        // 保存
        this.db.table("営業活動").update([activity]);

        return activity;
    }
}
