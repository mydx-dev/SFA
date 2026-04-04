import type { AppsScriptResponse } from "../../../shared/AppsScriptResponse.ts";
import type { SyncOutput } from "../../../shared/types/sync.ts";

export interface GoogleScriptRun {
    sync(): AppsScriptResponse<SyncOutput>;
}

export async function syncAPI(
    googleScriptRun: GoogleScriptRun
): Promise<AppsScriptResponse<SyncOutput>> {
    return googleScriptRun.sync();
}
