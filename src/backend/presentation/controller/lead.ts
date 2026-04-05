import { AppsScriptResponse } from "../../../shared/AppsScriptResponse";
import type { API } from "../../../shared/api";
import {
    createLeadUseCase,
    listLeadsUseCase,
    updateLeadUseCase,
    deleteLeadUseCase,
} from "../../di";

export const createLead: API["createLead"] = function (lead) {
    const createdLead = createLeadUseCase.execute({
        name: lead.name,
        companyName: lead.companyName,
        email: lead.email,
        phoneNumber: lead.phoneNumber,
        status: lead.status,
        assigneeId: lead.assigneeId,
    });
    return new AppsScriptResponse(createdLead);
};

export const getLeads: API["getLeads"] = function (assigneeId) {
    const leads = listLeadsUseCase.execute({ assigneeId });
    return new AppsScriptResponse(leads);
};

export const updateLead: API["updateLead"] = function (id, lead) {
    const updatedLead = updateLeadUseCase.execute({
        id,
        name: lead.name,
        companyName: lead.companyName,
        email: lead.email,
        phoneNumber: lead.phoneNumber,
        status: lead.status,
        assigneeId: lead.assigneeId,
    });
    return new AppsScriptResponse(updatedLead);
};

export const deleteLead = function (id: string) {
    const result = deleteLeadUseCase.execute({ id });
    return new AppsScriptResponse(result);
};
