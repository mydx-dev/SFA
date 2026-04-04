import {
    InMemoryDataStore,
    InMemoryGateway,
    SheetDB,
    SheetGateway,
} from "@mydx-dev/gas-boost-runtime";
import { Authentication } from "./application/service/Authentication";
import { SyncDataBaseUseCase } from "./application/usecase/SyncDataBaseUseCase";
import { ALL_TABLES } from "./infrastructure/SheetORM/tables";

function getEnviromentVariables() {
    const result: {
        dbId: string;
        scriptId: string;
        gateway: InMemoryGateway | SheetGateway;
    } = {
        dbId: "",
        scriptId: "",
        gateway: new InMemoryGateway(new InMemoryDataStore()),
    };

    try {
        if (SpreadsheetApp) {
            result.dbId = SpreadsheetApp.getActiveSpreadsheet().getId();
            result.gateway = new SheetGateway(SpreadsheetApp);
        }

        if (ScriptApp) {
            result.scriptId = ScriptApp.getScriptId();
        }
    } catch (e) {
        console.warn(
            "Failed to access Google Apps Script services. Using in-memory implementations for testing.",
            e,
        );
    } finally {
        return result;
    }
}

const { dbId, scriptId, gateway } = getEnviromentVariables();

export const db = new SheetDB(
    ALL_TABLES.map((table) => {
        table.setDbId(dbId);
        return table;
    }),
    gateway,
    CacheService,
    Utilities,
);
export const syncDataBaseUseCase = new SyncDataBaseUseCase(db);
export const authentication = new Authentication(Session, db);
export { scriptId };
