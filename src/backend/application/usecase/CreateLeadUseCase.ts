import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES, LeadTable } from "../../infrastructure/SheetORM/tables";
import { Lead } from "../../domain/entity/Lead";

interface CreateLeadInput {
    name: string;
    companyName: string | null;
    email: string | null;
    phoneNumber: string | null;
    assigneeId: string | null;
    status?: "未対応" | "対応中" | "商談化" | "失注" | "顧客化";
}

export class CreateLeadUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}

    execute(input: CreateLeadInput): Lead {
        // バリデーション
        if (!input.name || input.name.trim() === "") {
            throw new Error("氏名は必須です");
        }

        if (input.status && !["未対応", "対応中", "商談化", "失注", "顧客化"].includes(input.status)) {
            throw new Error("無効なステータスです");
        }

        // リードエンティティを生成
        const now = new Date();
        const lead = new Lead(
            this.generateId(),
            input.name,
            input.companyName,
            input.email,
            input.phoneNumber,
            input.status || "未対応", // 初期ステータスは'未対応'
            input.assigneeId,
            now,
            now
        );

        // リードテーブルに保存
        const record = LeadTable.serialize(lead);
        this.db.table("リード").create([record]);

        return lead;
    }

    private generateId(): string {
        return `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
