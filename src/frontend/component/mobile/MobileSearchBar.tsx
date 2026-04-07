import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Badge, Box, IconButton, InputBase } from "@mui/material";
import { useState } from "react";

interface MobileSearchBarProps {
    placeholder?: string;
    onSearch?: (keyword: string) => void;
    onFilterClick?: () => void;
    filterCount?: number;
}

export const MobileSearchBar = ({
    placeholder = "検索...",
    onSearch,
    onFilterClick,
    filterCount = 0,
}: MobileSearchBarProps) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch?.(value);
        }
    };

    const handleClear = () => {
        setValue("");
        onSearch?.("");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "2rem",
                px: 2,
                py: 0.5,
                boxShadow: "0 4px 12px rgba(0, 32, 69, 0.08)",
                gap: 1,
            }}
        >
            {/* Search icon */}
            <SearchIcon sx={{ color: "#74777f", fontSize: 20, flexShrink: 0 }} />

            {/* Input */}
            <InputBase
                fullWidth
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                inputProps={{ "aria-label": "検索" }}
                sx={{ fontSize: "0.875rem" }}
            />

            {/* Clear button */}
            {value && (
                <IconButton size="small" onClick={handleClear} sx={{ p: 0.25 }}>
                    <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
            )}

            {/* Filter button */}
            <IconButton
                size="small"
                onClick={onFilterClick}
                sx={{ p: 0.5, flexShrink: 0 }}
                aria-label="フィルター"
            >
                <Badge badgeContent={filterCount > 0 ? filterCount : null} color="primary">
                    <FilterListIcon sx={{ fontSize: 20, color: "#74777f" }} />
                </Badge>
            </IconButton>
        </Box>
    );
};
