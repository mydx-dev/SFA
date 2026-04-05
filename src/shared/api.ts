import type { AppsScriptResponse } from "./AppsScriptResponse";
import type { SyncOutput } from "./types/sync";
import type { Lead } from "../backend/domain/entity/Lead";
import type { Deal } from "../backend/domain/entity/Deal";
import type { Activity } from "../backend/domain/entity/Activity";

export type API = {
    sync: () => AppsScriptResponse<SyncOutput>;
    getLeads: (assigneeId?: string) => AppsScriptResponse<Lead[]>;
    createLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "pkValue">) => AppsScriptResponse<Lead>;
    updateLead: (id: string, lead: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt" | "pkValue">>) => AppsScriptResponse<Lead>;
    deleteLead: (id: string) => AppsScriptResponse<{ success: boolean }>;
    getDeals: (leadId?: string) => AppsScriptResponse<Deal[]>;
    createDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt" | "pkValue">) => AppsScriptResponse<Deal>;
    updateDeal: (id: string, deal: Partial<Omit<Deal, "id" | "createdAt" | "updatedAt" | "pkValue">>) => AppsScriptResponse<Deal>;
    closeDeal: (id: string, isWon: boolean) => AppsScriptResponse<Deal>;
    deleteDeal: (id: string) => AppsScriptResponse<{ success: boolean }>;
    getActivities: (dealId?: string) => AppsScriptResponse<Activity[]>;
    createActivity: (activity: Omit<Activity, "id" | "createdAt" | "updatedAt" | "pkValue">) => AppsScriptResponse<Activity>;
    updateActivity: (id: string, activity: Partial<Omit<Activity, "id" | "createdAt" | "updatedAt" | "pkValue">>) => AppsScriptResponse<Activity>;
    deleteActivity: (id: string) => AppsScriptResponse<{ success: boolean }>;
};
