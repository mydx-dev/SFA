import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Chip,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Activity } from "../../../backend/domain/entity/Activity";

type ActivityType = Activity["activityType"];
type SortField = "activityDate" | "activityType" | "content";
type SortOrder = "asc" | "desc";

interface PageInfo {
    page: number;
    totalPages: number;
    totalCount: number;
}

interface FilterOptions {
    activityTypes?: ActivityType[];
    dateFrom?: string;
    dateTo?: string;
    keyword?: string;
}

interface ActivityHistoryProps {
    activities: Activity[];
    filterOptions?: FilterOptions;
    onActivityClick?: (activityId: string) => void;
    pageInfo?: PageInfo;
    onPageChange?: (page: number) => void;
    onFilterChange?: (filters: FilterOptions) => void;
}

const activityTypeIcons: Record<ActivityType, React.ReactNode> = {
    面談: <GroupsIcon fontSize="small" sx={{ color: "#002045" }} />,
    電話: <CallIcon fontSize="small" sx={{ color: "#555f71" }} />,
    メール: <EmailIcon fontSize="small" sx={{ color: "#003f25" }} />,
    その他: <MoreHorizIcon fontSize="small" sx={{ color: "#74777f" }} />,
};

const activityTypeColors: Record<ActivityType, string> = {
    面談: "#d6e3ff",
    電話: "#d6e0f6",
    メール: "#9ff5c1",
    その他: "#e0e3e5",
};

export const ActivityHistory = ({
    activities,
    filterOptions,
    onActivityClick,
    pageInfo,
    onPageChange,
    onFilterChange,
}: ActivityHistoryProps) => {
    const [sortField, setSortField] = useState<SortField>("activityDate");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [keyword, setKeyword] = useState(filterOptions?.keyword ?? "");
    const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>(
        filterOptions?.activityTypes ?? []
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleKeywordChange = (value: string) => {
        setKeyword(value);
        onFilterChange?.({ ...filterOptions, keyword: value, activityTypes: selectedTypes });
    };

    const handleTypeChange = (types: ActivityType[]) => {
        setSelectedTypes(types);
        onFilterChange?.({ ...filterOptions, keyword, activityTypes: types });
    };

    const sortedActivities = [...activities].sort((a, b) => {
        let comparison = 0;
        if (sortField === "activityDate") {
            comparison =
                new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime();
        } else if (sortField === "activityType") {
            comparison = a.activityType.localeCompare(b.activityType);
        } else if (sortField === "content") {
            comparison = a.content.localeCompare(b.content);
        }
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const filteredActivities = sortedActivities.filter((a) => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(a.activityType)) return false;
        if (keyword && !a.content.includes(keyword) && !a.activityType.includes(keyword))
            return false;
        return true;
    });

    return (
        <Box>
            {/* Filter panel */}
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <TextField
                    size="small"
                    placeholder="活動を検索..."
                    value={keyword}
                    onChange={(e) => handleKeywordChange(e.target.value)}
                    autoFocus
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ 
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: "#ffffff",
                            borderRadius: "6px",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "14px",
                            '& fieldset': {
                                borderColor: "rgba(85, 95, 113, 0.2)",
                            },
                            '&:hover fieldset': {
                                borderColor: "rgba(85, 95, 113, 0.4)",
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: "#002045",
                            },
                        }
                    }}
                />
                <FormControl 
                    size="small" 
                    sx={{ 
                        minWidth: 160,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: "#ffffff",
                            borderRadius: "6px",
                            '& fieldset': {
                                borderColor: "rgba(85, 95, 113, 0.2)",
                            },
                        }
                    }}
                >
                    <InputLabel>活動種別</InputLabel>
                    <Select
                        multiple
                        label="活動種別"
                        value={selectedTypes}
                        onChange={(e) => handleTypeChange(e.target.value as ActivityType[])}
                        renderValue={(selected) => (
                            <Box display="flex" gap={0.5} flexWrap="wrap">
                                {(selected as ActivityType[]).map((v) => (
                                    <Chip key={v} label={v} size="small" />
                                ))}
                            </Box>
                        )}
                    >
                        {(["面談", "電話", "メール", "その他"] as ActivityType[]).map((type) => (
                            <MenuItem key={type} value={type}>
                                {activityTypeIcons[type]} {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Table */}
            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(85, 95, 113, 0.15)",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f1f4f6" }}>
                            <TableCell sx={{ 
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "16px",
                            }}>
                                <TableSortLabel
                                    active={sortField === "activityDate"}
                                    direction={sortField === "activityDate" ? sortOrder : "asc"}
                                    onClick={() => handleSort("activityDate")}
                                >
                                    活動日時
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ 
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "16px",
                            }}>
                                <TableSortLabel
                                    active={sortField === "activityType"}
                                    direction={sortField === "activityType" ? sortOrder : "asc"}
                                    onClick={() => handleSort("activityType")}
                                >
                                    活動種別
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ 
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "16px",
                            }}>案件</TableCell>
                            <TableCell sx={{ 
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "16px",
                            }}>
                                <TableSortLabel
                                    active={sortField === "content"}
                                    direction={sortField === "content" ? sortOrder : "asc"}
                                    onClick={() => handleSort("content")}
                                >
                                    内容
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ 
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "16px",
                            }}>担当者</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActivities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary" sx={{ py: 2 }}>
                                        活動履歴がありません
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredActivities.map((activity) => (
                                <TableRow
                                    key={activity.id}
                                    hover
                                    onClick={() => onActivityClick?.(activity.id)}
                                    sx={{ 
                                        cursor: onActivityClick ? "pointer" : "default",
                                        '&:hover': {
                                            backgroundColor: "rgba(0, 32, 69, 0.04)",
                                        },
                                        borderBottom: "1px solid rgba(85, 95, 113, 0.15)",
                                    }}
                                >
                                    <TableCell sx={{ padding: "16px" }}>
                                        <Typography variant="body2" sx={{ 
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                        }}>
                                            {new Date(activity.activityDate).toLocaleDateString(
                                                "ja-JP", { year: 'numeric', month: 'long', day: 'numeric' }
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: "16px" }}>
                                        <Chip
                                            icon={
                                                activityTypeIcons[activity.activityType] as React.ReactElement
                                            }
                                            label={activity.activityType}
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                    activityTypeColors[activity.activityType],
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ padding: "16px" }}>
                                        <Typography variant="body2" sx={{ 
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                        }}>{activity.dealId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: "16px" }}>
                                        <Typography variant="body2" noWrap sx={{ 
                                            maxWidth: 300,
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                        }}>
                                            {activity.content}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: "16px" }}>
                                        <Typography variant="body2" sx={{ 
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                        }}>
                                            {activity.assigneeId}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={pageInfo.totalPages}
                        page={pageInfo.page}
                        onChange={(_, page) => onPageChange?.(page)}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                height: '32px',
                                fontFamily: "'Inter', sans-serif",
                                '&.Mui-selected': {
                                    backgroundColor: '#002045',
                                    color: '#ffffff',
                                },
                                '&:not(.Mui-selected)': {
                                    color: '#555f71',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 32, 69, 0.08)',
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};
