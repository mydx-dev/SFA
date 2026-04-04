import { SheetTable } from "@mydx-dev/gas-boost-runtime";
import { z } from "zod";
import { SystemUser } from "../../domain/entity/SystemUser";
export const SystemUserTable = new SheetTable(
    "",
    "システムユーザー",
    z.object({
        ID: z.string().meta({ unique: true }),
        メールアドレス: z.string(),
    }),
    "ID",
    false,
    (record) => new SystemUser(record.ID, record.メールアドレス),
    (entity) => ({ ID: entity.id, メールアドレス: entity.email }),
);

export const ALL_TABLES = [SystemUserTable] as const;
