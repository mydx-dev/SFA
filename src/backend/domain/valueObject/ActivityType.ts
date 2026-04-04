type ActivityTypeValue = "面談" | "電話" | "メール" | "その他";

export class ActivityType {
    readonly value: ActivityTypeValue;

    constructor(value: string) {
        if (value === "") {
            throw new Error("活動種別は空文字にできません");
        }

        const validTypes: ActivityTypeValue[] = [
            "面談",
            "電話",
            "メール",
            "その他",
        ];

        if (!validTypes.includes(value as ActivityTypeValue)) {
            throw new Error(`無効な活動種別です: ${value}`);
        }

        this.value = value as ActivityTypeValue;
        Object.freeze(this);
    }
}
