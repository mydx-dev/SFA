import { SheetEntity } from "@mydx-dev/gas-boost-runtime";

export class Activity extends SheetEntity {
    constructor(
        public readonly id: string,
        public readonly dealId: string,
        public readonly activityType: "面談" | "電話" | "メール" | "その他" | "会議",
        public readonly activityDate: Date,
        public readonly content: string,
        public readonly assigneeId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        super();
    }
    pkValue: any;

    updateContent(newContent: string): Activity {
        return new Activity(
            this.id,
            this.dealId,
            this.activityType,
            this.activityDate,
            newContent,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateActivityDate(newDate: Date): Activity {
        return new Activity(
            this.id,
            this.dealId,
            this.activityType,
            newDate,
            this.content,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    updateActivityType(newType: "面談" | "電話" | "メール" | "その他" | "会議"): Activity {
        return new Activity(
            this.id,
            this.dealId,
            newType,
            this.activityDate,
            this.content,
            this.assigneeId,
            this.createdAt,
            new Date()
        );
    }

    isToday(): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const activityDate = new Date(this.activityDate);
        activityDate.setHours(0, 0, 0, 0);
        
        return activityDate.getTime() === today.getTime();
    }
}
