import {
    InMemoryDataStore,
    InMemoryGateway,
    SheetDB,
    SheetGateway,
} from "@mydx-dev/gas-boost-runtime";
import { Authentication } from "./application/service/Authentication";
import { SyncDataBaseUseCase } from "./application/usecase/SyncDataBaseUseCase";
import { CreateLeadUseCase } from "./application/usecase/CreateLeadUseCase";
import { ListLeadsUseCase } from "./application/usecase/ListLeadsUseCase";
import { UpdateLeadUseCase } from "./application/usecase/UpdateLeadUseCase";
import { DeleteLeadUseCase } from "./application/usecase/DeleteLeadUseCase";
import { CreateDealUseCase } from "./application/usecase/CreateDealUseCase";
import { ListDealsUseCase } from "./application/usecase/ListDealsUseCase";
import { UpdateDealUseCase } from "./application/usecase/UpdateDealUseCase";
import { CloseDealUseCase } from "./application/usecase/CloseDealUseCase";
import { DeleteDealUseCase } from "./application/usecase/DeleteDealUseCase";
import { CreateActivityUseCase } from "./application/usecase/CreateActivityUseCase";
import { ListActivitiesUseCase } from "./application/usecase/ListActivitiesUseCase";
import { UpdateActivityUseCase } from "./application/usecase/UpdateActivityUseCase";
import { DeleteActivityUseCase } from "./application/usecase/DeleteActivityUseCase";
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

// Services
export const authentication = new Authentication(Session, db);

// Use Cases
export const syncDataBaseUseCase = new SyncDataBaseUseCase(db);
export const createLeadUseCase = new CreateLeadUseCase(db);
export const listLeadsUseCase = new ListLeadsUseCase(db);
export const updateLeadUseCase = new UpdateLeadUseCase(db);
export const deleteLeadUseCase = new DeleteLeadUseCase(db);
export const createDealUseCase = new CreateDealUseCase(db);
export const listDealsUseCase = new ListDealsUseCase(db);
export const updateDealUseCase = new UpdateDealUseCase(db);
export const closeDealUseCase = new CloseDealUseCase(db);
export const deleteDealUseCase = new DeleteDealUseCase(db);
export const createActivityUseCase = new CreateActivityUseCase(db);
export const listActivitiesUseCase = new ListActivitiesUseCase(db);
export const updateActivityUseCase = new UpdateActivityUseCase(db);
export const deleteActivityUseCase = new DeleteActivityUseCase(db);

export { scriptId };
