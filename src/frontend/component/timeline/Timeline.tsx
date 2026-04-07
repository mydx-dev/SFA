import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Chip, Collapse, IconButton, Typography } from "@mui/material";
import { useState } from "react";

type EventType = "面談" | "電話" | "メール" | "その他";

export interface TimelineEvent {
    id: string;
    type: EventType;
    datetime: Date;
    content: string;
    details?: string;
}

type GroupBy = "date" | "type";

interface TimelineProps {
    events: TimelineEvent[];
    groupBy?: GroupBy;
}

const eventIcons: Record<EventType, React.ReactNode> = {
    面談: <GroupsIcon fontSize="small" />,
    電話: <CallIcon fontSize="small" />,
    メール: <EmailIcon fontSize="small" />,
    その他: <MoreHorizIcon fontSize="small" />,
};

const eventColors: Record<EventType, string> = {
    面談: "#d6e3ff",
    電話: "#d6e0f6",
    メール: "#9ff5c1",
    その他: "#e0e3e5",
};

const formatDate = (date: Date): string =>
    date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const formatDatetime = (date: Date): string =>
    date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

interface EventItemProps {
    event: TimelineEvent;
}

const EventItem = ({ event }: EventItemProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                cursor: event.details ? "pointer" : "default",
            }}
            onClick={() => event.details && setExpanded(!expanded)}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: eventColors[event.type],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.5,
                }}
            >
                {eventIcons[event.type]}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Chip
                        label={event.type}
                        size="small"
                        sx={{ backgroundColor: eventColors[event.type], height: 20, fontSize: "0.7rem" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formatDatetime(event.datetime)}
                    </Typography>
                    {event.details && (
                        <IconButton size="small" sx={{ ml: "auto", p: 0.25 }}>
                            {expanded ? (
                                <ExpandLessIcon fontSize="small" />
                            ) : (
                                <ExpandMoreIcon fontSize="small" />
                            )}
                        </IconButton>
                    )}
                </Box>
                <Typography variant="body2">{event.content}</Typography>
                {event.details && (
                    <Collapse in={expanded}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {event.details}
                        </Typography>
                    </Collapse>
                )}
            </Box>
        </Box>
    );
};

interface GroupSectionProps {
    label: string;
    events: TimelineEvent[];
}

const GroupSection = ({ label, events }: GroupSectionProps) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box mb={2}>
            {/* Group header */}
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                sx={{ cursor: "pointer" }}
                onClick={() => setCollapsed(!collapsed)}
            >
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                    {label}
                </Typography>
                <Chip
                    label={events.length}
                    size="small"
                    sx={{ height: 18, fontSize: "0.65rem" }}
                />
                <IconButton size="small" sx={{ p: 0.25, ml: "auto" }}>
                    {collapsed ? (
                        <ExpandMoreIcon fontSize="small" />
                    ) : (
                        <ExpandLessIcon fontSize="small" />
                    )}
                </IconButton>
            </Box>

            <Collapse in={!collapsed}>
                {/* Vertical timeline line */}
                <Box sx={{ position: "relative", pl: 2 }}>
                    <Box
                        sx={{
                            position: "absolute",
                            left: 26,
                            top: 0,
                            bottom: 0,
                            width: 2,
                            backgroundColor: "#e0e3e5",
                            zIndex: 0,
                        }}
                    />
                    {events.map((event) => (
                        <EventItem key={event.id} event={event} />
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
};

export const Timeline = ({ events, groupBy = "date" }: TimelineProps) => {
    const sortedEvents = [...events].sort(
        (a, b) => b.datetime.getTime() - a.datetime.getTime()
    );

    if (sortedEvents.length === 0) {
        return (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                イベントがありません
            </Typography>
        );
    }

    if (groupBy === "date") {
        const groups: Record<string, TimelineEvent[]> = {};
        sortedEvents.forEach((event) => {
            const key = formatDate(event.datetime);
            if (!groups[key]) groups[key] = [];
            groups[key].push(event);
        });

        return (
            <Box>
                {Object.entries(groups).map(([date, groupEvents]) => (
                    <GroupSection key={date} label={date} events={groupEvents} />
                ))}
            </Box>
        );
    }

    // groupBy === "type"
    const groups: Record<string, TimelineEvent[]> = {};
    sortedEvents.forEach((event) => {
        if (!groups[event.type]) groups[event.type] = [];
        groups[event.type].push(event);
    });

    return (
        <Box>
            {Object.entries(groups).map(([type, groupEvents]) => (
                <GroupSection key={type} label={type} events={groupEvents} />
            ))}
        </Box>
    );
};
