import type { AppsScriptResponse } from "../../../shared/AppsScriptResponse.ts";
import type { Activity } from "../../domain/entity/Activity.ts";

export interface GoogleScriptRun {
    getActivities(dealId?: string): AppsScriptResponse<Activity[]>;
}

export async function getActivitiesAPI(
    googleScriptRun: GoogleScriptRun,
    dealId?: string
): Promise<AppsScriptResponse<Activity[]>> {
    return googleScriptRun.getActivities(dealId);
}
