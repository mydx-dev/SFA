import { Box, Typography } from "@mui/material";
import { Activity } from "../../../backend/domain/entity/Activity";

interface ActivityCardProps {
    activity: Activity;
}

const activityIconBg: Record<Activity["activityType"], string> = {
    面談: "bg-tertiary-fixed",
    電話: "bg-secondary-fixed",
    メール: "bg-primary-fixed",
    その他: "bg-surface-container-high",
    会議: "bg-tertiary-fixed",
};

const activityIconName: Record<Activity["activityType"], string> = {
    面談: "groups",
    電話: "call",
    メール: "mail",
    その他: "more_horiz",
    会議: "groups",
};

export const ActivityCard = ({ activity }: ActivityCardProps) => {
    return (
        <Box className="group relative bg-surface-container-lowest p-6 rounded-full shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-outline-variant/10">
            <Box className="flex items-start space-x-6">
                <Box
                    className={`w-12 h-12 rounded-full ${activityIconBg[activity.activityType]} flex items-center justify-center flex-shrink-0`}
                >
                    <span className="material-symbols-outlined">
                        {activityIconName[activity.activityType]}
                    </span>
                </Box>
                <Box className="flex-1">
                    <Box className="flex justify-between items-start">
                        <Typography component="h4" className="font-headline font-bold text-on-surface">
                            {activity.activityType}
                        </Typography>
                        <span className="text-xs font-medium text-outline">
                            {new Date(activity.activityDate).toLocaleTimeString("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </Box>
                    {activity.content && (
                        <Box className="mt-4 p-4 bg-surface-container-low rounded-xl border-l-4 border-tertiary-fixed">
                            <Typography component="p" className="text-sm italic">
                                {activity.content}
                            </Typography>
                        </Box>
                    )}
                    <Box className="mt-4 flex items-center space-x-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed/20">
                            {activity.activityType}
                        </span>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
