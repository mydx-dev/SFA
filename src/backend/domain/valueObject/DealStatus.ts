type DealStatusValue = "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)";

export class DealStatus {
    readonly value: DealStatusValue;

    constructor(value: string) {
        if (value === "") {
            throw new Error("案件ステータスは空文字にできません");
        }

        const validStatuses: DealStatusValue[] = [
            "提案",
            "交渉",
            "クローズ(成功)",
            "クローズ(失敗)",
        ];

        if (!validStatuses.includes(value as DealStatusValue)) {
            throw new Error(`無効な案件ステータスです: ${value}`);
        }

        this.value = value as DealStatusValue;
        Object.freeze(this);
    }
}
