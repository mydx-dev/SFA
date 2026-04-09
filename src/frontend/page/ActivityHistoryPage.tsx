import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity } from "../../backend/domain/entity/Activity";
import { getActivitiesFromLocal } from "../usecase/activities";

const Spinner = () => (
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="読み込み中" />
);

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
            <div className="flex min-h-[400px] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <h3 className="font-headline text-2xl font-bold text-error">エラーが発生しました</h3>
            </div>
        );
    }

    const grouped = groupActivitiesByDate(activities || []);

    return (
        <div className="ml-64 min-h-screen bg-surface p-12" data-testid="activity-history-main">
            <div className="mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                            エンゲージメント履歴
                        </span>
                        <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
                            活動履歴フィード
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <nav className="flex items-center gap-2">
                            {["概要", "インサイト", "タイムライン"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-slate-200/50 transition-all duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                                search
                            </span>
                            <input
                                aria-label="活動検索"
                                className="w-64 bg-surface-container-high rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-surface-tint"
                                placeholder="活動を検索..."
                            />
                        </div>
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
                        <h1 className="sr-only">活動履歴</h1>
                    </div>
                </div>

                {/* Bento Layout Content */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Activity Feed */}
                    <div className="col-span-12 space-y-6 lg:col-span-8">
                        {Object.entries(grouped).length === 0 ? (
                            <>
                                {/* Empty state date header */}
                                <div className="mb-8 flex items-center space-x-4">
                                    <div className="h-[1px] flex-1 bg-outline-variant/30" />
                                    <span className="text-xs font-bold uppercase tracking-widest">今日</span>
                                    <div className="h-[1px] flex-1 bg-outline-variant/30" />
                                </div>
                            </>
                        ) : (
                            Object.entries(grouped).map(([date, dateActivities]) => (
                                <div key={date}>
                                    {/* Date Group Header */}
                                    <div className="mb-8 flex items-center space-x-4">
                                        <div className="h-[1px] flex-1 bg-outline-variant/30" />
                                        <span className="text-xs font-bold uppercase tracking-widest">{date}</span>
                                        <div className="h-[1px] flex-1 bg-outline-variant/30" />
                                    </div>
                                    {/* Activity Cards */}
                                    <div className="space-y-6">
                                        {dateActivities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                data-testid="activity-card"
                                                className="group relative bg-surface-container-lowest p-6 rounded-full shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-outline-variant/10"
                                            >
                                                <div className="flex items-start space-x-6">
                                                    {/* Icon */}
                                                    <div
                                                        className={`w-12 h-12 rounded-full ${activityTypeIconBg[activity.activityType] || "bg-surface-container-high"} flex items-center justify-center flex-shrink-0`}
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            {activityTypeIconEl[activity.activityType] || "more_horiz"}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="font-headline font-bold text-on-surface">
                                                                {activity.activityType}
                                                            </h4>
                                                            <span className="text-xs font-medium text-outline">
                                                                {new Date(activity.activityDate).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href="#"
                                                            className="text-sm text-on-surface-variant hover:underline"
                                                        >
                                                            案件: {activity.dealId}
                                                        </a>
                                                        {activity.content && (
                                                            <div className="mt-4 rounded-xl border-l-4 border-tertiary-fixed bg-surface-container-low p-4">
                                                                <p className="text-sm leading-relaxed italic">
                                                                    {activity.content}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {/* Badge */}
                                                        <div className="mt-4 flex items-center space-x-4">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed/20">
                                                                {activity.activityType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Column: Side Panel */}
                    <div className="col-span-12 space-y-8 lg:col-span-4">
                        {/* Quick Record Form */}
                        <section
                            className="rounded-full border border-outline-variant/20 bg-surface-container-highest p-8 shadow-lg shadow-primary/5"
                            aria-label="クイック記録フォーム"
                        >
                            <div className="mb-8 flex items-center space-x-3">
                                <h3 className="font-headline text-xl font-bold text-primary">
                                    活動を記録
                                </h3>
                            </div>
                            <form>
                                {/* Activity Type Grid */}
                                <div className="grid grid-cols-3 gap-2">
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
                                </div>
                                {/* Textarea */}
                                <textarea
                                    rows={4}
                                    className="w-full bg-surface-container-lowest rounded-xl text-sm py-3 px-4 mt-4 resize-none"
                                    placeholder="何が起きましたか？"
                                />
                                {/* Save Button */}
                                <div className="mt-2 flex justify-end">
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
                                </div>
                            </form>
                        </section>

                        {/* Contextual Stats Card */}
                        <section className="relative overflow-hidden rounded-full bg-primary p-8 text-white" aria-label="統計カード">
                            <div className="relative z-10">
                                <p className="font-headline text-3xl font-extrabold">42</p>
                                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-primary-container">
                                    <div className="h-full w-3/4 rounded-full bg-tertiary-fixed" />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 h-32 w-32 rounded-full bg-primary-container opacity-50" />
                            <div className="absolute bottom-4 right-6 h-16 w-16 rounded-full bg-tertiary-container opacity-30" />
                        </section>

                        {/* Filter Section */}
                        <section className="rounded-full bg-surface-container-low p-6" aria-label="フィルターセクション">
                            <div className="flex flex-wrap gap-2">
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
                            </div>
                        </section>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-3 flex justify-center">
                    <span className="text-xs text-on-surface-variant">ページ {page}</span>
                </div>
            </div>
        </div>
    );
};
