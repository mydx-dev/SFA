import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";
import type { Activity } from "../../backend/domain/entity/Activity";

export async function createActivity(
    activity: Omit<Activity, "id" | "createdAt" | "updatedAt" | "pkValue">
): Promise<Activity> {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempActivity = {
        ...activity,
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
        pkValue: tempId
    };
    await dexie.activities.add(tempActivity);
    
    try {
        // Call API
        const response = await client.createActivity(activity);
        const createdActivity = parseAppsScriptResponse(response);
        
        if (!createdActivity) {
            throw new Error("Failed to create activity");
        }
        
        // Replace temp with real data
        await dexie.activities.delete(tempId);
        await dexie.activities.put(createdActivity);
        
        return createdActivity;
    } catch (error) {
        // Rollback on failure
        await dexie.activities.delete(tempId);
        throw error;
    }
}
