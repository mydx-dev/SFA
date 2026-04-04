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

    updateStatus(newStatus: "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)"): Deal {
        return new Deal(
            this.id,
            this.dealName,
            this.leadId,
            newStatus,
            this.amount,
            this.expectedCloseDate,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateAmount(newAmount: number | null): Deal {
        return new Deal(
            this.id,
            this.dealName,
            this.leadId,
            this.status,
            newAmount,
            this.expectedCloseDate,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateExpectedCloseDate(newDate: Date | null): Deal {
        return new Deal(
            this.id,
            this.dealName,
            this.leadId,
            this.status,
            this.amount,
            newDate,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateDealName(newDealName: string): Deal {
        return new Deal(
            this.id,
            newDealName,
            this.leadId,
            this.status,
            this.amount,
            this.expectedCloseDate,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateAssignee(newAssigneeId: string): Deal {
        return new Deal(
            this.id,
            this.dealName,
            this.leadId,
            this.status,
            this.amount,
            this.expectedCloseDate,
            newAssigneeId,
            this.createdAt,
            new Date()
        );
    }

    isClosed(): boolean {
        return this.status === "クローズ(成功)" || this.status === "クローズ(失敗)";
    }

    isClosedWon(): boolean {
        return this.status === "クローズ(成功)";
    }

    close(isWon: boolean): Deal {
        if (this.isClosed()) {
            throw new Error("既にクローズされています");
        }
        const newStatus = isWon ? "クローズ(成功)" : "クローズ(失敗)";
        return this.updateStatus(newStatus);
    }
}
