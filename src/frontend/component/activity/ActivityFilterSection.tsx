import { Box } from "@mui/material";
import { useEffect, useState } from "react";

interface ActivityFilterSectionProps {
    activeFilter?: string;
    onFilterChange?: (filter: string) => void;
}

const filters = ["すべての活動", "マイチーム", "結果のみ", "期限切れ"] as const;

export const ActivityFilterSection = ({
    activeFilter,
    onFilterChange,
}: ActivityFilterSectionProps) => {
    const [currentFilter, setCurrentFilter] = useState(activeFilter ?? "すべての活動");

    useEffect(() => {
        if (activeFilter) {
            setCurrentFilter(activeFilter);
        }
    }, [activeFilter]);

    const handleClick = (filter: string) => {
        setCurrentFilter(filter);
        onFilterChange?.(filter);
    };

    return (
        <Box component="section" className="p-6 bg-surface-container-low rounded-full" aria-label="フィルターセクション">
            <Box className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                    const isActive = currentFilter === filter;
                    return (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => handleClick(filter)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                isActive
                                    ? "bg-surface-container-lowest text-primary border border-primary/10 hover:bg-primary hover:text-white"
                                    : "bg-surface-container-lowest text-on-surface-variant border border-transparent hover:border-outline-variant"
                            }`}
                        >
                            {filter}
                        </button>
                    );
                })}
            </Box>
        </Box>
    );
};
