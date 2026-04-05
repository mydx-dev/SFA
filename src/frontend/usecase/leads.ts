import { parseAppsScriptResponse } from "../../shared/AppsScriptResponse";
import { client } from "../lib/AppsScriptClient";
import { dexie } from "../lib/LocalDB";
import type { Lead } from "../../backend/domain/entity/Lead";

export async function fetchLeads(assigneeId?: string): Promise<Lead[]> {
    const response = await client.getLeads(assigneeId);
    const leads = parseAppsScriptResponse(response);
    
    if (!leads) {
        throw new Error("Failed to fetch leads");
    }
    
    await dexie["リード"].bulkPut(leads as never);
    return leads;
}

export async function createLead(
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "pkValue">
): Promise<Lead> {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempLead = {
        ...lead,
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
        pkValue: tempId
    };
    await dexie["リード"].add(tempLead as never);
    
    try {
        // Call API
        const response = await client.createLead(lead);
        const createdLead = parseAppsScriptResponse(response);
        
        if (!createdLead) {
            throw new Error("Failed to create lead");
        }
        
        // Replace temp with real data
        await dexie["リード"].delete(tempId);
        await dexie["リード"].put(createdLead as never);
        
        return createdLead;
    } catch (error) {
        // Rollback on failure
        await dexie["リード"].delete(tempId);
        throw error;
    }
}

export async function updateLead(
    id: string,
    updates: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt" | "pkValue">>
): Promise<Lead> {
    // Get original for rollback
    const original = await dexie["リード"].get(id);
    if (!original) {
        throw new Error("Lead not found");
    }
    
    // Optimistic update
    await dexie["リード"].update(id, updates as never);
    
    try {
        // Call API
        const response = await client.updateLead(id, updates);
        const updatedLead = parseAppsScriptResponse(response);
        
        if (!updatedLead) {
            throw new Error("Failed to update lead");
        }
        
        // Update with server data
        await dexie["リード"].put(updatedLead as never);
        
        return updatedLead;
    } catch (error) {
        // Rollback on failure
        await dexie["リード"].put(original);
        throw error;
    }
}
