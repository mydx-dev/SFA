import { SheetEntity } from "@mydx-dev/gas-boost-runtime";

export class Lead extends SheetEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly companyName: string | null,
        public readonly email: string | null,
        public readonly phoneNumber: string | null,
        public readonly status: "未対応" | "対応中" | "商談化" | "失注" | "顧客化",
        public readonly assigneeId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        super();
    }
    pkValue: any;
}
