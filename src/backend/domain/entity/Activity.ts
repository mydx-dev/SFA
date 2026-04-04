import { SheetEntity } from "@mydx-dev/gas-boost-runtime";

export class Activity extends SheetEntity {
    constructor(
        public readonly id: string,
        public readonly dealId: string,
        public readonly activityType: "面談" | "電話" | "メール" | "その他",
        public readonly activityDate: Date,
        public readonly content: string,
        public readonly assigneeId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        super();
    }
    pkValue: any;
}
