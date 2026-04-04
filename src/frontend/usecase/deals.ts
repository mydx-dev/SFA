import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";
import type { Deal } from "../../backend/domain/entity/Deal";

export async function createDeal(
    deal: Omit<Deal, "id" | "createdAt" | "updatedAt" | "pkValue">
): Promise<Deal> {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempDeal = {
        ...deal,
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
        pkValue: tempId
    };
    await dexie.deals.add(tempDeal as any);
    
    try {
        // Call API
        const response = await client.createDeal(deal);
        const createdDeal = parseAppsScriptResponse(response);
        
        if (!createdDeal) {
            throw new Error("Failed to create deal");
        }
        
        // Replace temp with real data
        await dexie.deals.delete(tempId);
        await dexie.deals.put(createdDeal as any);
        
        return createdDeal;
    } catch (error) {
        // Rollback on failure
        await dexie.deals.delete(tempId);
        throw error;
    }
}
