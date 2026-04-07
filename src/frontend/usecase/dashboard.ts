import { dexie } from "../lib/LocalDB";
import type { Activity } from "../../backend/domain/entity/Activity";
import type { Deal } from "../../backend/domain/entity/Deal";

export interface DashboardMetrics {
    totalRevenue: number;
    dealsCount: number;
    leadsCount: number;
    conversionRate: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const deals = await dexie.deals.toArray() as unknown as Deal[];
    const leads = await dexie.leads.toArray();
    const closedWon = deals.filter(d => d.status === "クローズ(成功)");
    const totalRevenue = closedWon.reduce((sum, d) => sum + (d.amount || 0), 0);
    const conversionRate = deals.length > 0 ? closedWon.length / deals.length : 0;
    return {
        totalRevenue,
        dealsCount: deals.length,
        leadsCount: leads.length,
        conversionRate,
    };
}

export async function getRecentActivities(): Promise<Activity[]> {
    const activities = await dexie.activities.toArray() as unknown as Activity[];
    return activities
        .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
        .slice(0, 10);
}

export interface UpcomingTask {
    id: string;
    title: string;
    dueDate: Date;
}

export async function getUpcomingTasks(): Promise<UpcomingTask[]> {
    return [];
}

export interface SalesTrendPoint {
    month: string;
    amount: number;
}

export async function getSalesTrend(): Promise<SalesTrendPoint[]> {
    return [];
}

export interface PipelineDataPoint {
    stage: string;
    count: number;
    amount: number;
}

export async function getPipelineData(): Promise<PipelineDataPoint[]> {
    const deals = await dexie.deals.toArray() as unknown as Deal[];
    const map = new Map<string, { count: number; amount: number }>();
    for (const deal of deals) {
        const existing = map.get(deal.status) ?? { count: 0, amount: 0 };
        map.set(deal.status, {
            count: existing.count + 1,
            amount: existing.amount + (deal.amount || 0),
        });
    }
    return Array.from(map.entries()).map(([stage, data]) => ({ stage, ...data }));
}
