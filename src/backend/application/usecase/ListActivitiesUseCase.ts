import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Activity } from "../../domain/entity/Activity";

interface ListActivitiesInput {
    dealId?: string;
}

export class ListActivitiesUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input?: ListActivitiesInput): Activity[] {
        let query = this.db.query("営業活動");

        if (input?.dealId) {
            query = query.and("案件ID", "=", [input.dealId]);
        }

        const activities = this.db.table("営業活動").find(query);

        // 活動日の降順でソート
        return activities.sort((a, b) => {
            return b.activityDate.getTime() - a.activityDate.getTime();
        });
    }
}
