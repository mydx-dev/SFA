import Dexie from "dexie";
import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";

export async function sync() {
    // ① remote
    const response = await client.sync();
    const remote = parseAppsScriptResponse(response);
    console.log("remote", remote);

    // ② local
    if (!remote) return;

    for (const tableSync of remote) {
        const table = tableSync.table;
        const localTable = dexie[table.name] as Dexie.Table<any, any>;

        // primary key 名を柔軟に解決する
        const primaryKeyName =
            typeof table.primaryKey === "string" ? table.primaryKey : "id";

        const localRecords = await localTable.toArray();
        const localRecordIds = localRecords.map(
            (record) => (record as any)[primaryKeyName],
        );

        const remoteRecordIds = tableSync.records.map(
            (record) => (record as any)[primaryKeyName],
        );

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
