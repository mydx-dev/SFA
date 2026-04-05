import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Deal } from "../../domain/entity/Deal";

interface ListDealsInput {
    leadId?: string;
    assigneeId?: string;
    status?: "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)";
}

export class ListDealsUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input?: ListDealsInput): Deal[] {
        let query = this.db.query("案件");

        if (input?.leadId) {
            query = query.and("リードID", "=", [input.leadId]);
        }

        if (input?.assigneeId) {
            query = query.and("担当者ID", "=", [input.assigneeId]);
        }

        if (input?.status) {
            query = query.and("ステータス", "=", [input.status]);
        }

        return this.db.table("案件").find(query);
    }
}
