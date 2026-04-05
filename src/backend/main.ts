import { migrate, protect, seed } from "./infrastructure/SheetORM/setup";
import { sync } from "./presentation/controller/sync";
import { createLead, getLeads, updateLead, deleteLead } from "./presentation/controller/lead";
import { createDeal, getDeals, updateDeal, closeDeal, deleteDeal } from "./presentation/controller/deal";
import { createActivity, getActivities, updateActivity, deleteActivity } from "./presentation/controller/activity";

const ServerFunctions = {
    migrate,
    seed,
    protect,
    sync,
    createLead,
    getLeads,
    updateLead,
    deleteLead,
    createDeal,
    getDeals,
    updateDeal,
    closeDeal,
    deleteDeal,
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity,
};

Object.entries(ServerFunctions).forEach(([name, fn]) => {
    (globalThis as any)[name] = fn;
});
