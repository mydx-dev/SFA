import type { AppsScriptResponse } from "../../../shared/AppsScriptResponse.ts";
import type { Lead } from "../../domain/entity/Lead.ts";

export interface GoogleScriptRun {
    getLeads(assigneeId?: string): AppsScriptResponse<Lead[]>;
}

export async function getLeadsAPI(
    googleScriptRun: GoogleScriptRun,
    assigneeId?: string
): Promise<AppsScriptResponse<Lead[]>> {
    return googleScriptRun.getLeads(assigneeId);
}
