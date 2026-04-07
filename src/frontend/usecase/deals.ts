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
    
    await dexie.deals.bulkPut(deals as never);
    return deals;
}

export async function getDealById(id: string): Promise<Deal | undefined> {
    const deal = await dexie.deals.get(id);
    return deal as Deal | undefined;
}

export async function getDealsFromLocal(leadId?: string): Promise<Deal[]> {
    let deals = await dexie.deals.toArray() as Deal[];
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
    await dexie.deals.add(tempDeal as never);
    
    try {
        // Call API
        const response = await client.createDeal(deal);
        const createdDeal = parseAppsScriptResponse(response);
        
        if (!createdDeal) {
            throw new Error("Failed to create deal");
        }
        
        // Replace temp with real data
        await dexie.deals.delete(tempId);
        await dexie.deals.put(createdDeal as never);
        
        return createdDeal;
    } catch (error) {
        // Rollback on failure
        await dexie.deals.delete(tempId);
        throw error;
    }
}

export async function updateDeal(
    id: string,
    updates: Partial<Omit<Deal, "id" | "createdAt" | "updatedAt" | "pkValue">>
): Promise<Deal> {
    // Get original for rollback
    const original = await dexie.deals.get(id);
    if (!original) {
        throw new Error("Deal not found");
    }
    
    // Optimistic update
    await dexie.deals.update(id, updates as never);
    
    try {
        // Call API
        const response = await client.updateDeal(id, updates);
        const updatedDeal = parseAppsScriptResponse(response);
        
        if (!updatedDeal) {
            throw new Error("Failed to update deal");
        }
        
        // Update with server data
        await dexie.deals.put(updatedDeal as never);
        
        return updatedDeal;
    } catch (error) {
        // Rollback on failure
        await dexie.deals.put(original);
        throw error;
    }
}

export async function closeDeal(id: string, isWon: boolean): Promise<Deal> {
    const original = await dexie.deals.get(id);
    if (!original) {
        throw new Error("Deal not found");
    }

    const newStatus = isWon ? "クローズ(成功)" : "クローズ(失敗)";
    await dexie.deals.update(id, { status: newStatus } as never);

    try {
        const response = await client.closeDeal(id, isWon);
        const closedDeal = parseAppsScriptResponse(response);

        if (!closedDeal) {
            throw new Error("Failed to close deal");
        }

        await dexie.deals.put(closedDeal as never);
        return closedDeal;
    } catch (error) {
        await dexie.deals.put(original);
        throw error;
    }
}
