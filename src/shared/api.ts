import type { AppsScriptResponse } from "./AppsScriptResponse";
import type { SyncOutput } from "./types/sync";

export type API = {
    sync: () => AppsScriptResponse<SyncOutput>;
};
