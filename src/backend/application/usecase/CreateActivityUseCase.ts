import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES, ActivityTable } from "../../infrastructure/SheetORM/tables";
import { Activity } from "../../domain/entity/Activity";

interface CreateActivityInput {
    dealId: string;
    activityType: "面談" | "電話" | "メール" | "その他";
    activityDate: Date;
    content: string;
    assigneeId: string;
}

export class CreateActivityUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: CreateActivityInput): Activity {
        // バリデーション
        if (!input.dealId) {
            throw new Error("案件IDは必須です");
        }

        if (!input.activityType) {
            throw new Error("活動種別は必須です");
        }

        if (!["面談", "電話", "メール", "その他"].includes(input.activityType)) {
            throw new Error("無効な活動種別です");
        }

        if (!input.activityDate) {
            throw new Error("活動日は必須です");
        }

        if (!input.content || input.content.trim() === "") {
            throw new Error("内容は必須です");
        }

        // 案件が存在するか確認
        const deals = this.db.table("案件").find(
            this.db.query("案件").and("ID", "=", [input.dealId])
        );

        if (deals.length === 0) {
            throw new Error("案件が見つかりません");
        }

        const deal = deals[0];

        // クローズ済みの案件には営業活動を追加できない
        if (deal.isClosed()) {
            throw new Error("クローズ済みの案件には営業活動を追加できません");
        }

        // 営業活動エンティティを生成
        const now = new Date();
        const activity = new Activity(
            this.generateId(),
            input.dealId,
            input.activityType,
            input.activityDate,
            input.content,
            input.assigneeId,
            now,
            now
        );

        // 営業活動テーブルに保存
        const record = ActivityTable.serialize(activity);
        this.db.table("営業活動").create([record]);

        return activity;
    }

    private generateId(): string {
        return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
