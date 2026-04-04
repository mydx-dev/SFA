type LeadStatusValue = "未対応" | "対応中" | "商談化" | "失注" | "顧客化";

export class LeadStatus {
    readonly value: LeadStatusValue;

    constructor(value: string) {
        if (value === "") {
            throw new Error("リードステータスは空文字にできません");
        }

        const validStatuses: LeadStatusValue[] = [
            "未対応",
            "対応中",
            "商談化",
            "失注",
            "顧客化",
        ];

        if (!validStatuses.includes(value as LeadStatusValue)) {
            throw new Error(`無効なリードステータスです: ${value}`);
        }

        this.value = value as LeadStatusValue;
        Object.freeze(this);
    }
}
