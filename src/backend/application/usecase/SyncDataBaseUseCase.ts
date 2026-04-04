import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { SyncOutput } from "../../../shared/types/sync";
import { SystemUser } from "../../application/dto/SystemUser";
import {
    ALL_TABLES,
    SystemUserTable,
} from "../../infrastructure/SheetORM/tables";

export class SyncDataBaseUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}
    execute(user: SystemUser): SyncOutput {
        const users = this.db
            .table("システムユーザー")
            .find(
                this.db
                    .query("システムユーザー")
                    .and("メールアドレス", "=", [user.email]),
            );

        return [
            {
                table: SystemUserTable,
                records: users.map((user) => SystemUserTable.serialize(user)),
            },
        ];
    }
}
