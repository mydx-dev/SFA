import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Activity } from "../../../backend/domain/entity/Activity";

interface ActivityListProps {
    activities: Activity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
    if (activities.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                営業活動がありません
            </Typography>
        );
    }

    return (
        <List>
            {activities.map((activity) => (
                <ListItem key={activity.id}>
                    <ListItemText
                        primary={activity.activityType}
                        secondary={
                            <>
                                <Typography component="span" variant="body2" color="text.primary">
                                    {new Date(activity.activityDate).toLocaleDateString()}
                                </Typography>
                                {" — "}
                                {activity.content}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};
