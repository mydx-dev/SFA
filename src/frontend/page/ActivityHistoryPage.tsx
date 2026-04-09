import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity } from "../../backend/domain/entity/Activity";
import { getActivitiesFromLocal } from "../usecase/activities";

const activityTypeIconBg: Record<string, string> = {
    電話: "bg-secondary-fixed",
    メール: "bg-primary-fixed",
    面談: "bg-tertiary-fixed",
    その他: "bg-surface-container-high",
    会議: "bg-tertiary-fixed",
};

const activityTypeIconEl: Record<string, string> = {
    電話: "call",
    メール: "mail",
    面談: "groups",
    その他: "more_horiz",
    会議: "groups",
};

const groupActivitiesByDate = (activities: Activity[]): Record<string, Activity[]> => {
    return activities.reduce((groups: Record<string, Activity[]>, activity) => {
        const date = new Date(activity.activityDate).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(activity);
        return groups;
    }, {});
};

export const ActivityHistoryPage = () => {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [page] = useState(1);
    const [sortBy] = useState("createdAt");
    const [selectedActivityType, setSelectedActivityType] = useState<string>("電話");
    const [activeFilter, setActiveFilter] = useState<string>("すべての活動");

    const { data: activities, isLoading, error } = useQuery({
        queryKey: ["activities-history", filters, page, sortBy],
        queryFn: () => getActivitiesFromLocal(),
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error" variant="h3">エラーが発生しました</Typography>
            </Box>
        );
    }

    const grouped = groupActivitiesByDate(activities || []);

    return (
        <Box
            component="div"
            className="ml-64 p-12 min-h-screen bg-surface"
            data-testid="activity-history-main"
        >
            <Box className="max-w-6xl mx-auto">
                {/* Header Section */}
                <Box className="flex justify-between items-end mb-12">
                    <Box>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                            エンゲージメント履歴
                        </span>
                        <Typography
                            component="h2"
                            className="text-4xl font-extrabold font-headline text-primary tracking-tight"
                        >
                            活動履歴フィード
                        </Typography>
                    </Box>
                    <Box className="flex flex-wrap items-center justify-end gap-3">
                        <Box component="nav" className="flex items-center gap-2">
                            {["概要", "インサイト", "タイムライン"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-slate-200/50 transition-all duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                        </Box>
                        <Box className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                                search
                            </span>
                            <input
                                aria-label="活動検索"
                                className="w-64 bg-surface-container-high rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-surface-tint"
                                placeholder="活動を検索..."
                            />
                        </Box>
                        <button
                            type="button"
                            className="silk-gradient text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95"
                        >
                            新規案件登録
                        </button>
                        <button
                            type="button"
                            className="bg-surface-container-high text-primary px-4 py-2 rounded-xl text-sm font-bold hover:brightness-95 active:scale-95"
                        >
                            リードを追加
                        </button>
                        <button
                            type="button"
                            aria-label="通知"
                            className="relative p-2 hover:bg-slate-200/50 rounded-lg transition-all duration-300"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-error" />
                        </button>
                        <img
                            alt="プロフィール画像"
                            src="https://placehold.co/40x40"
                            className="w-10 h-10 rounded-full"
                        />
                        <Typography variant="h1" sx={{ display: "none" }}>活動履歴</Typography>
                    </Box>
                </Box>

                {/* Bento Layout Content */}
                <Box className="grid grid-cols-12 gap-8">
                    {/* Left Column: Activity Feed */}
                    <Box className="col-span-12 lg:col-span-8 space-y-6">
                        {Object.entries(grouped).length === 0 ? (
                            <>
                                {/* Empty state date header */}
                                <Box className="flex items-center space-x-4 mb-8">
                                    <Box className="h-[1px] flex-1 bg-outline-variant/30" />
                                    <span className="text-xs font-bold uppercase tracking-widest">今日</span>
                                    <Box className="h-[1px] flex-1 bg-outline-variant/30" />
                                </Box>
                            </>
                        ) : (
                            Object.entries(grouped).map(([date, dateActivities]) => (
                                <Box key={date}>
                                    {/* Date Group Header */}
                                    <Box className="flex items-center space-x-4 mb-8">
                                        <Box className="h-[1px] flex-1 bg-outline-variant/30" />
                                        <span className="text-xs font-bold uppercase tracking-widest">{date}</span>
                                        <Box className="h-[1px] flex-1 bg-outline-variant/30" />
                                    </Box>
                                    {/* Activity Cards */}
                                    <Box className="space-y-6">
                                        {dateActivities.map((activity) => (
                                            <Box
                                                key={activity.id}
                                                data-testid="activity-card"
                                                className="group relative bg-surface-container-lowest p-6 rounded-full shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-outline-variant/10"
                                            >
                                                <Box className="flex items-start space-x-6">
                                                    {/* Icon */}
                                                    <Box
                                                        className={`w-12 h-12 rounded-full ${activityTypeIconBg[activity.activityType] || "bg-surface-container-high"} flex items-center justify-center flex-shrink-0`}
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            {activityTypeIconEl[activity.activityType] || "more_horiz"}
                                                        </span>
                                                    </Box>
                                                    <Box className="flex-1">
                                                        <Box className="flex justify-between items-start">
                                                            <Typography
                                                                component="h4"
                                                                className="font-headline font-bold text-on-surface"
                                                            >
                                                                {activity.activityType}
                                                            </Typography>
                                                            <span className="text-xs font-medium text-outline">
                                                                {new Date(activity.activityDate).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                                                            </span>
                                                        </Box>
                                                        <a
                                                            href="#"
                                                            className="text-sm text-on-surface-variant hover:underline"
                                                        >
                                                            案件: {activity.dealId}
                                                        </a>
                                                        {activity.content && (
                                                            <Box className="mt-4 p-4 bg-surface-container-low rounded-xl border-l-4 border-tertiary-fixed">
                                                                <Typography
                                                                    component="p"
                                                                    className="text-sm leading-relaxed italic"
                                                                >
                                                                    {activity.content}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {/* Badge */}
                                                        <Box className="mt-4 flex items-center space-x-4">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed/20">
                                                                {activity.activityType}
                                                            </span>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Right Column: Side Panel */}
                    <Box className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Quick Record Form */}
                        <Box
                            component="section"
                            className="bg-surface-container-highest p-8 rounded-full border border-outline-variant/20 shadow-lg shadow-primary/5"
                            aria-label="クイック記録フォーム"
                        >
                            <Box className="flex items-center space-x-3 mb-8">
                                <Typography
                                    component="h3"
                                    className="font-headline font-bold text-xl text-primary"
                                >
                                    活動を記録
                                </Typography>
                            </Box>
                            <Box component="form">
                                {/* Activity Type Grid */}
                                <Box className="grid grid-cols-3 gap-2">
                                    {["電話", "メール", "会議"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setSelectedActivityType(type)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest ${selectedActivityType === type ? "border-2 border-primary" : "border-2 border-transparent"}`}
                                        >
                                            <span className="text-[10px] font-bold">{type}</span>
                                        </button>
                                    ))}
                                </Box>
                                {/* Textarea */}
                                <textarea
                                    rows={4}
                                    className="w-full bg-surface-container-lowest rounded-xl text-sm py-3 px-4 mt-4 resize-none"
                                    placeholder="何が起きましたか？"
                                />
                                {/* Save Button */}
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <button
                                        type="submit"
                                        className="silk-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFilters({});
                                        }}
                                    >
                                        活動を保存
                                    </button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Contextual Stats Card */}
                        <Box
                            component="section"
                            className="bg-primary text-white p-8 rounded-full overflow-hidden relative"
                            aria-label="統計カード"
                        >
                            <Box className="relative z-10">
                                <Typography className="text-3xl font-extrabold font-headline">
                                    42
                                </Typography>
                                <Box className="h-2 w-full bg-primary-container rounded-full overflow-hidden mt-2">
                                    <Box className="h-full bg-tertiary-fixed w-3/4 rounded-full" />
                                </Box>
                            </Box>
                            <Box className="absolute top-4 right-4 w-32 h-32 bg-primary-container rounded-full opacity-50" />
                            <Box className="absolute bottom-4 right-6 w-16 h-16 bg-tertiary-container rounded-full opacity-30" />
                        </Box>

                        {/* Filter Section */}
                        <Box
                            component="section"
                            className="p-6 bg-surface-container-low rounded-full"
                            aria-label="フィルターセクション"
                        >
                            <Box className="flex flex-wrap gap-2">
                                {["すべての活動", "マイチーム", "結果のみ", "期限切れ"].map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold ${activeFilter === filter ? "bg-surface-container-lowest text-primary border border-primary/10 hover:bg-primary hover:text-white" : "bg-surface-container-lowest text-on-surface-variant border border-transparent hover:border-outline-variant"} transition-all`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Pagination */}
                <Box display="flex" justifyContent="center" mt={3}>
                    <Typography variant="caption" color="text.secondary">
                        ページ {page}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
