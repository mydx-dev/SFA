import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Lead } from "../../domain/entity/Lead";

interface ListLeadsInput {
    assigneeId?: string;
    status?: "未対応" | "対応中" | "商談化" | "失注" | "顧客化";
}

export class ListLeadsUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input?: ListLeadsInput): Lead[] {
        let query = this.db.query("リード");

        if (input?.assigneeId) {
            query = query.and("担当者ID", "=", [input.assigneeId]);
        }

        if (input?.status) {
            query = query.and("ステータス", "=", [input.status]);
        }

        return this.db.table("リード").find(query);
    }
}
