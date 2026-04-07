import Dexie from "dexie";
import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";

const TABLE_NAME_MAP: Record<string, string> = {
    "リード": "leads",
    "案件": "deals",
    "営業活動": "activities",
    "システムユーザー": "systemUsers",
};

export async function sync() {
    // ① remote
    const response = await client.sync();
    const remote = parseAppsScriptResponse(response);
    console.log("remote", remote);

    // ② local
    if (!remote) return;

    for (const tableSync of remote) {
        const table = tableSync.table;
        const localTableName = TABLE_NAME_MAP[table.name] ?? table.name;
        // Try English alias first, then fall back to Japanese table name
        const localTable = ((dexie as any)[localTableName] ?? (dexie as any)[table.name]) as Dexie.Table<any, any>;

        // primary key 名を柔軟に解決する（大文字小文字の両方を試みる）
        const primaryKeyName =
            typeof table.primaryKey === "string" ? table.primaryKey : "id";
        const getRecordId = (record: any) =>
            record[primaryKeyName] ?? record[primaryKeyName.toLowerCase()];

        const localRecords = await localTable.toArray();
        const localRecordIds = localRecords.map(getRecordId);

        const remoteRecordIds = tableSync.records.map(getRecordId);

        const recordsToDelete = localRecordIds.filter(
            (id) => !remoteRecordIds.includes(id),
        );

        // トランザクションを await して確実にコミットさせる
        await dexie.transaction("rw", localTable, async () => {
            if (tableSync.records.length) {
                await localTable.bulkPut(tableSync.records as any);
            }
            if (recordsToDelete.length) {
                await localTable.bulkDelete(recordsToDelete as any);
            }
        });
    }
}

export async function performSync(): Promise<void> {
    await sync();
}
