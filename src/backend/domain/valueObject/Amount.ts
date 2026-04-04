export class Amount {
    readonly value: number;

    constructor(value: number) {
        if (value <= 0) {
            throw new Error("金額は正の数である必要があります");
        }

        if (!Number.isInteger(value)) {
            throw new Error("金額は整数である必要があります");
        }

        this.value = value;
        Object.freeze(this);
    }
}
