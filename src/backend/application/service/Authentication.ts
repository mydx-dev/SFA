import { SheetDB, UnauthorizedError } from "@mydx-dev/gas-boost-runtime";
import { ALL_TABLES } from "../../infrastructure/SheetORM/tables";
import { SystemUser } from "../dto/SystemUser";

export class Authentication {
    constructor(
        private session: GoogleAppsScript.Base.Session,
        private db: SheetDB<typeof ALL_TABLES>,
    ) {}
    execute(): SystemUser {
        const email = this.session.getActiveUser().getEmail();
        const users = this.db
            .table("システムユーザー")
            .find(
                this.db
                    .query("システムユーザー")
                    .and("メールアドレス", "=", [email]),
            );
        if (users.length === 0) {
            throw new UnauthorizedError();
        }
        const user = users[0];
        return {
            id: user.id,
            email: user.email,
        };
    }
}
