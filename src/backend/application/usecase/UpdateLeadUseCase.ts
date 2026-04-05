import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { Lead } from "../../domain/entity/Lead";

interface UpdateLeadInput {
    id: string;
    name?: string;
    companyName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    status?: "未対応" | "対応中" | "商談化" | "失注" | "顧客化";
    assigneeId?: string | null;
}

export class UpdateLeadUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: UpdateLeadInput): Lead {
        // バリデーション
        if (!input.id) {
            throw new Error("IDは必須です");
        }

        if (input.status && !["未対応", "対応中", "商談化", "失注", "顧客化"].includes(input.status)) {
            throw new Error("無効なステータスです");
        }

        // リードを取得
        const leads = this.db.table("リード").find(
            this.db.query("リード").and("ID", "=", [input.id])
        );

        if (leads.length === 0) {
            throw new Error("リードが見つかりません");
        }

        let lead = leads[0];

        // リードを更新
        if (input.name !== undefined) {
            lead = lead.updateName(input.name);
        }
        if (input.companyName !== undefined) {
            lead = lead.updateCompanyName(input.companyName);
        }
        if (input.email !== undefined) {
            lead = lead.updateEmail(input.email);
        }
        if (input.phoneNumber !== undefined) {
            lead = lead.updatePhoneNumber(input.phoneNumber);
        }
        if (input.status !== undefined) {
            lead = lead.updateStatus(input.status);
        }
        if (input.assigneeId !== undefined) {
            lead = lead.updateAssignee(input.assigneeId);
        }

        // 保存
        this.db.table("リード").update([lead]);

        return lead;
    }
}
