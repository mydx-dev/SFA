import MoreVert from "@mui/icons-material/MoreVert";
import { Badge, IconButton, Menu } from "@mui/material";
import { useScheduler } from "@mydx-dev/gas-boost-react-apps-script";
import { useState } from "react";
import { taskScheduler } from "../../lib/TaskScheduler";
import { TaskItem } from "./TaskItem";

const ITEM_HEIGHT = 48;
export const TaskList = () => {
    const scheduler = useScheduler(taskScheduler);
    const tasks = scheduler.tasks;
    const hasTasks = tasks.length > 0;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl) && hasTasks;
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {hasTasks && (
                <IconButton
                    onClick={handleClick}
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                >
                    <Badge
                        color="primary"
                        badgeContent={scheduler.tasks.length}
                    >
                        <MoreVert />
                    </Badge>
                </IconButton>
            )}
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "auto",
                        },
                    },
                    list: {
                        "aria-labelledby": "long-button",
                    },
                }}
            >
                {tasks.map((task) => (
                    <TaskItem
                        key={task.command.id}
                        label={task.command.label}
                        status={task.status}
                        onRetry={() => taskScheduler.retry(task.command.id)}
                    />
                ))}
            </Menu>
        </>
    );
};
