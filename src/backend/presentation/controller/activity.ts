import { AppsScriptResponse } from "../../../shared/AppsScriptResponse";
import type { API } from "../../../shared/api";
import {
    createActivityUseCase,
    listActivitiesUseCase,
    updateActivityUseCase,
    deleteActivityUseCase,
} from "../../di";

export const createActivity: API["createActivity"] = function (activity) {
    const createdActivity = createActivityUseCase.execute({
        dealId: activity.dealId,
        activityType: activity.activityType,
        activityDate: activity.activityDate,
        content: activity.content,
        assigneeId: activity.assigneeId,
    });
    return new AppsScriptResponse(createdActivity);
};

export const getActivities: API["getActivities"] = function (dealId) {
    const activities = listActivitiesUseCase.execute({ dealId });
    return new AppsScriptResponse(activities);
};

export const updateActivity = function (
    id: string,
    activity: {
        content?: string;
        activityDate?: Date;
        activityType?: "面談" | "電話" | "メール" | "その他";
    }
) {
    const updatedActivity = updateActivityUseCase.execute({
        id,
        content: activity.content,
        activityDate: activity.activityDate,
        activityType: activity.activityType,
    });
    return new AppsScriptResponse(updatedActivity);
};

export const deleteActivity = function (id: string) {
    const result = deleteActivityUseCase.execute({ id });
    return new AppsScriptResponse(result);
};
