import { SheetEntity } from "@mydx-dev/gas-boost-runtime";

export class Deal extends SheetEntity {
    constructor(
        public readonly id: string,
        public readonly dealName: string,
        public readonly leadId: string,
        public readonly status: "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)",
        public readonly amount: number | null,
        public readonly expectedCloseDate: Date | null,
        public readonly assigneeId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        super();
    }
    pkValue: any;
}
