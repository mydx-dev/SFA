import { AppsScriptResponse } from "../../../shared/AppsScriptResponse";
import type { API } from "../../../shared/api";
import { authentication, syncDataBaseUseCase } from "../../di";

export const sync: API["sync"] = function () {
    const systemUser = authentication.execute();
    const allSyncData = syncDataBaseUseCase.execute(systemUser);
    return new AppsScriptResponse(allSyncData);
};
