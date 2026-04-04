import type { AppsScriptResponse } from "../../../shared/AppsScriptResponse.ts";
import type { Deal } from "../../domain/entity/Deal.ts";

export interface GoogleScriptRun {
    getDeals(leadId?: string): AppsScriptResponse<Deal[]>;
}

export async function getDealsAPI(
    googleScriptRun: GoogleScriptRun,
    leadId?: string
): Promise<AppsScriptResponse<Deal[]>> {
    return googleScriptRun.getDeals(leadId);
}
