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

    updateStatus(newStatus: "未対応" | "対応中" | "商談化" | "失注" | "顧客化"): Lead {
        return new Lead(
            this.id,
            this.name,
            this.companyName,
            this.email,
            this.phoneNumber,
            newStatus,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateAssignee(newAssigneeId: string | null): Lead {
        return new Lead(
            this.id,
            this.name,
            this.companyName,
            this.email,
            this.phoneNumber,
            this.status,
            newAssigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateName(newName: string): Lead {
        return new Lead(
            this.id,
            newName,
            this.companyName,
            this.email,
            this.phoneNumber,
            this.status,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateCompanyName(newCompanyName: string | null): Lead {
        return new Lead(
            this.id,
            this.name,
            newCompanyName,
            this.email,
            this.phoneNumber,
            this.status,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateEmail(newEmail: string | null): Lead {
        return new Lead(
            this.id,
            this.name,
            this.companyName,
            newEmail,
            this.phoneNumber,
            this.status,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updatePhoneNumber(newPhoneNumber: string | null): Lead {
        return new Lead(
            this.id,
            this.name,
            this.companyName,
            this.email,
            newPhoneNumber,
            this.status,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    isConvertedToDeal(): boolean {
        return this.status === "商談化";
    }

    isCompleted(): boolean {
        return this.status === "顧客化" || this.status === "失注";
    }

    convertToDeal(): Lead {
        if (this.status === "商談化") {
            throw new Error("既に商談化されています");
        }
        if (this.isCompleted()) {
            throw new Error("対応が完了したリードは商談化できません");
        }
        return this.updateStatus("商談化");
    }
}
