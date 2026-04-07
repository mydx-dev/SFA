import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

interface AssigneeOption {
    id: string;
    name: string;
}

interface FilterValues {
    keyword?: string;
    statuses?: string[];
    assigneeId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
}

interface FilterOptionsConfig {
    statuses?: string[];
    assignees?: AssigneeOption[];
    amountRange?: { min: number; max: number };
}

interface SearchFilterPanelProps {
    filterOptions?: FilterOptionsConfig;
    onFilterChange?: (filters: FilterValues) => void;
    initialFilters?: FilterValues;
}

export const SearchFilterPanel = ({
    filterOptions,
    onFilterChange,
    initialFilters = {},
}: SearchFilterPanelProps) => {
    const [filters, setFilters] = useState<FilterValues>(initialFilters);

    const amountMin = filterOptions?.amountRange?.min ?? 0;
    const amountMax = filterOptions?.amountRange?.max ?? 10000000;

    const [amountRange, setAmountRange] = useState<[number, number]>([
        initialFilters.amountMin ?? amountMin,
        initialFilters.amountMax ?? amountMax,
    ]);

    const updateFilters = (partial: Partial<FilterValues>) => {
        const updated = { ...filters, ...partial };
        setFilters(updated);
        onFilterChange?.(updated);
    };

    const handleStatusChange = (status: string, checked: boolean) => {
        const current = filters.statuses ?? [];
        const updated = checked ? [...current, status] : current.filter((s) => s !== status);
        updateFilters({ statuses: updated });
    };

    const handleAmountChange = (_: Event, value: number | number[]) => {
        const [min, max] = value as [number, number];
        setAmountRange([min, max]);
        updateFilters({ amountMin: min, amountMax: max });
    };

    const handleClear = () => {
        const cleared: FilterValues = {};
        setFilters(cleared);
        setAmountRange([amountMin, amountMax]);
        onFilterChange?.(cleared);
    };

    const hasActiveFilters = Object.values(filters).some(
        (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : v !== "")
    );

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 12px 32px -4px rgba(0, 32, 69, 0.08)",
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                    フィルター
                </Typography>
                <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClear}
                    disabled={!hasActiveFilters}
                >
                    クリア
                </Button>
            </Box>

            {/* Keyword search */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="キーワード検索"
                    placeholder="検索..."
                    value={filters.keyword ?? ""}
                    onChange={(e) => updateFilters({ keyword: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Status filter */}
            {filterOptions?.statuses && filterOptions.statuses.length > 0 && (
                <Box mb={3}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: "0.875rem", mb: 1 }}>
                            ステータス
                        </FormLabel>
                        <FormGroup>
                            {filterOptions.statuses.map((status) => (
                                <FormControlLabel
                                    key={status}
                                    control={
                                        <Checkbox
                                            checked={(filters.statuses ?? []).includes(status)}
                                            onChange={(e) =>
                                                handleStatusChange(status, e.target.checked)
                                            }
                                            size="small"
                                        />
                                    }
                                    label={status}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Box>
            )}

            {/* Assignee filter */}
            {filterOptions?.assignees && filterOptions.assignees.length > 0 && (
                <Box mb={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>担当者</InputLabel>
                        <Select
                            label="担当者"
                            value={filters.assigneeId ?? ""}
                            onChange={(e) => updateFilters({ assigneeId: e.target.value })}
                        >
                            <MenuItem value="">すべて</MenuItem>
                            {filterOptions.assignees.map((assignee) => (
                                <MenuItem key={assignee.id} value={assignee.id}>
                                    {assignee.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Date range filter */}
            <Box mb={3} display="flex" gap={2}>
                <TextField
                    size="small"
                    type="date"
                    label="期間（開始）"
                    value={filters.dateFrom ?? ""}
                    onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    size="small"
                    type="date"
                    label="期間（終了）"
                    value={filters.dateTo ?? ""}
                    onChange={(e) => updateFilters({ dateTo: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Box>

            {/* Amount range filter */}
            {filterOptions?.amountRange && (
                <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                        金額範囲
                    </Typography>
                    <Slider
                        value={amountRange}
                        onChange={handleAmountChange}
                        min={amountMin}
                        max={amountMax}
                        step={(amountMax - amountMin) / 100}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `¥${v.toLocaleString()}`}
                    />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption">¥{amountRange[0].toLocaleString()}</Typography>
                        <Typography variant="caption">¥{amountRange[1].toLocaleString()}</Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
