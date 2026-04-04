import { createLocalDB, DexieQL } from "@mydx-dev/gas-boost-react-apps-script";
import { ALL_TABLES } from "../../backend/infrastructure/SheetORM/tables";

const scriptId = String(
    (document.getElementById("script-id") as HTMLInputElement)?.value || "",
);
export const dexie = createLocalDB(scriptId, ALL_TABLES);
export const db = new DexieQL(ALL_TABLES, dexie);
