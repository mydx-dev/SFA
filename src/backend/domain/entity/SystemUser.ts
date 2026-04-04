import { SheetEntity } from "@mydx-dev/gas-boost-runtime";

export class SystemUser extends SheetEntity {
    constructor(
        public readonly id: string,
        public readonly email: string,
    ) {
        super();
    }
    pkValue: any;
}
