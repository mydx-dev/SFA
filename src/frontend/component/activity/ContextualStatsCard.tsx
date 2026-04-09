import { Box, Typography } from "@mui/material";

interface ContextualStatsCardProps {
    value: number | string;
    progressValue?: number;
}

export const ContextualStatsCard = ({ value, progressValue }: ContextualStatsCardProps) => {
    const progressStyle = progressValue !== undefined ? { width: `${progressValue}%` } : undefined;
    const progressClass = progressValue !== undefined ? "" : "w-3/4";

    return (
        <Box
            component="section"
            className="bg-primary text-white p-8 rounded-full overflow-hidden relative"
            aria-label="統計カード"
        >
            <Box className="relative z-10">
                <Typography className="text-3xl font-extrabold font-headline">
                    {value}
                </Typography>
                <Box className="h-2 w-full bg-primary-container rounded-full overflow-hidden mt-2">
                    <Box
                        className={`h-full bg-tertiary-fixed rounded-full ${progressClass}`}
                        style={progressStyle}
                    />
                </Box>
            </Box>
        </Box>
    );
};
