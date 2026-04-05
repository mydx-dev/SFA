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
    await dexie["案件"].add(tempDeal as never);
    
    try {
        // Call API
        const response = await client.createDeal(deal);
        const createdDeal = parseAppsScriptResponse(response);
        
        if (!createdDeal) {
            throw new Error("Failed to create deal");
        }
        
        // Replace temp with real data
        await dexie["案件"].delete(tempId);
        await dexie["案件"].put(createdDeal as never);
        
        return createdDeal;
    } catch (error) {
        // Rollback on failure
        await dexie["案件"].delete(tempId);
        throw error;
    }
}
