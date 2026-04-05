import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";
import type { Deal } from "../../backend/domain/entity/Deal";

export async function fetchDeals(leadId?: string): Promise<Deal[]> {
    const response = await client.getDeals(leadId);
    const deals = parseAppsScriptResponse(response);
    
    if (!deals) {
        throw new Error("Failed to fetch deals");
    }
    
    await dexie["案件"].bulkPut(deals as never);
    return deals;
}

export async function getDealById(id: string): Promise<Deal | undefined> {
    const deal = await dexie["案件"].get(id);
    return deal as Deal | undefined;
}

export async function getDealsFromLocal(leadId?: string): Promise<Deal[]> {
    let deals = await dexie["案件"].toArray() as Deal[];
    if (leadId) {
        deals = deals.filter(deal => deal.leadId === leadId);
    }
    return deals;
}

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

export async function updateDeal(
    id: string,
    updates: Partial<Omit<Deal, "id" | "createdAt" | "updatedAt" | "pkValue">>
): Promise<Deal> {
    // Get original for rollback
    const original = await dexie["案件"].get(id);
    if (!original) {
        throw new Error("Deal not found");
    }
    
    // Optimistic update
    await dexie["案件"].update(id, updates as never);
    
    try {
        // Call API
        const response = await client.updateDeal(id, updates);
        const updatedDeal = parseAppsScriptResponse(response);
        
        if (!updatedDeal) {
            throw new Error("Failed to update deal");
        }
        
        // Update with server data
        await dexie["案件"].put(updatedDeal as never);
        
        return updatedDeal;
    } catch (error) {
        // Rollback on failure
        await dexie["案件"].put(original);
        throw error;
    }
}
