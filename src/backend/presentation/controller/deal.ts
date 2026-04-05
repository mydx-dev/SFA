import { AppsScriptResponse } from "../../../shared/AppsScriptResponse";
import type { API } from "../../../shared/api";
import {
    createDealUseCase,
    listDealsUseCase,
    updateDealUseCase,
    closeDealUseCase,
    deleteDealUseCase,
} from "../../di";

export const createDeal: API["createDeal"] = function (deal) {
    const createdDeal = createDealUseCase.execute({
        dealName: deal.dealName,
        leadId: deal.leadId,
        amount: deal.amount,
        expectedCloseDate: deal.expectedCloseDate,
        assigneeId: deal.assigneeId,
    });
    return new AppsScriptResponse(createdDeal);
};

export const getDeals: API["getDeals"] = function (leadId) {
    const deals = listDealsUseCase.execute({ leadId });
    return new AppsScriptResponse(deals);
};

export const updateDeal: API["updateDeal"] = function (id, deal) {
    const updatedDeal = updateDealUseCase.execute({
        id,
        dealName: deal.dealName,
        status: deal.status,
        amount: deal.amount,
        expectedCloseDate: deal.expectedCloseDate,
        assigneeId: deal.assigneeId,
    });
    return new AppsScriptResponse(updatedDeal);
};

export const closeDeal: API["closeDeal"] = function (id, isWon) {
    const closedDeal = closeDealUseCase.execute({ id, isWon });
    return new AppsScriptResponse(closedDeal);
};

export const deleteDeal: API["deleteDeal"] = function (id) {
    const result = deleteDealUseCase.execute({ id });
    return new AppsScriptResponse(result);
};
