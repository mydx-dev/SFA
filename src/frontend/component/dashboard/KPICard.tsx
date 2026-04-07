import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ReactNode } from "react";

interface KPICardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: "up" | "down";
    changePercentage?: number;
    onClick?: () => void;
}

export const KPICard = ({ title, value, icon, trend, changePercentage, onClick }: KPICardProps) => {
    const content = (
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography
                    variant="subtitle2"
                    sx={{ opacity: 0.8, letterSpacing: "0.05em", textTransform: "uppercase" }}
                >
                    {title}
                </Typography>
                {icon && <Box sx={{ opacity: 0.7 }}>{icon}</Box>}
            </Box>
            <Typography
                variant="h4"
                sx={{ fontWeight: "bold", my: 1, fontFamily: "Manrope, sans-serif" }}
            >
                {value}
            </Typography>
            {(trend !== undefined || changePercentage !== undefined) && (
                <Box display="flex" alignItems="center" gap={0.5}>
                    {trend === "up" && (
                        <TrendingUpIcon fontSize="small" sx={{ color: "#9ff5c1" }} />
                    )}
                    {trend === "down" && (
                        <TrendingDownIcon fontSize="small" sx={{ color: "#ff8a80" }} />
                    )}
                    {changePercentage !== undefined && (
                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    trend === "up"
                                        ? "#9ff5c1"
                                        : trend === "down"
                                          ? "#ff8a80"
                                          : "inherit",
                            }}
                        >
                            {changePercentage}%
                        </Typography>
                    )}
                </Box>
            )}
        </CardContent>
    );

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #002045 0%, #1a365d 100%)",
                color: "white",
                boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
                borderRadius: "0.75rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": onClick
                    ? {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px -8px rgba(0, 32, 69, 0.15)",
                      }
                    : {},
            }}
        >
            {onClick ? (
                <CardActionArea onClick={onClick} sx={{ color: "inherit" }}>
                    {content}
                </CardActionArea>
            ) : (
                content
            )}
        </Card>
    );
};
