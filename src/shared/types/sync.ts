import { ALL_TABLES } from "../../backend/infrastructure/SheetORM/tables";

export type SyncOutput = Array<{
    table: (typeof ALL_TABLES)[number];
    records: unknown[];
}>;
