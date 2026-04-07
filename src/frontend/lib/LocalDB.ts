import { createLocalDB, DexieQL } from "@mydx-dev/gas-boost-react-apps-script";
import { ALL_TABLES } from "../../backend/infrastructure/SheetORM/tables";

const scriptId = String(
    (document.getElementById("script-id") as HTMLInputElement)?.value || "",
);
const _dexie = createLocalDB(scriptId, ALL_TABLES);
export const dexie = Object.assign(_dexie, {
    leads: _dexie["リード"],
    deals: _dexie["案件"],
    activities: _dexie["営業活動"],
    systemUsers: _dexie["システムユーザー"],
});
export const db = new DexieQL(ALL_TABLES, dexie);
