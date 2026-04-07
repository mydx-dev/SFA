import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";
import type { Activity } from "../../backend/domain/entity/Activity";

export async function fetchActivities(dealId?: string): Promise<Activity[]> {
    const response = await client.getActivities(dealId);
    const activities = parseAppsScriptResponse(response);
    
    if (!activities) {
        throw new Error("Failed to fetch activities");
    }
    
    await dexie.activities.bulkPut(activities as never);
    return activities;
}

export async function getActivitiesFromLocal(dealId?: string): Promise<Activity[]> {
    let activities = await dexie.activities.toArray() as Activity[];
    if (dealId) {
        activities = activities.filter(activity => activity.dealId === dealId);
    }
    return activities;
}

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
    await dexie.activities.add(tempActivity as never);
    
    try {
        // Call API
        const response = await client.createActivity(activity);
        const createdActivity = parseAppsScriptResponse(response);
        
        if (!createdActivity) {
            throw new Error("Failed to create activity");
        }
        
        // Replace temp with real data
        await dexie.activities.delete(tempId);
        await dexie.activities.put(createdActivity as never);
        
        return createdActivity;
    } catch (error) {
        // Rollback on failure
        await dexie.activities.delete(tempId);
        throw error;
    }
}
