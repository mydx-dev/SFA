import { Box } from "@mui/material";

interface DateGroupHeaderProps {
    date: string;
}

export const DateGroupHeader = ({ date }: DateGroupHeaderProps) => {
    return (
        <Box className="flex items-center space-x-4 mb-8">
            <Box className="h-[1px] flex-1 bg-outline-variant/30" />
            <span className="text-xs font-bold uppercase tracking-widest">{date}</span>
            <Box className="h-[1px] flex-1 bg-outline-variant/30" />
        </Box>
    );
};
