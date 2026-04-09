import { describe, test, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { Activity } from "../../../../src/backend/domain/entity/Activity";
import { ActivityHistory } from "../../../../src/frontend/component/activity/ActivityHistory";

const createMockActivity = (overrides?: Partial<Activity>): Activity => {
    return new Activity(
        overrides?.id ?? "activity-1",
        overrides?.dealId ?? "deal-1",
        overrides?.activityType ?? "面談",
        overrides?.activityDate ?? new Date(2026, 3, 1, 9, 0),
        overrides?.content ?? "テスト活動",
        overrides?.assigneeId ?? "user-1",
        overrides?.createdAt ?? new Date(),
        overrides?.updatedAt ?? new Date()
    );
};

const activityA = createMockActivity({
    id: "activity-1",
    activityType: "電話",
    activityDate: new Date(2026, 3, 2, 10, 0),
    content: "電話フォロー",
    dealId: "deal-1",
    assigneeId: "user-1",
});

const activityB = createMockActivity({
    id: "activity-2",
    activityType: "メール",
    activityDate: new Date(2026, 3, 1, 9, 0),
    content: "メール送信",
    dealId: "deal-2",
    assigneeId: "user-2",
});

const renderComponent = (props?: Partial<ComponentProps<typeof ActivityHistory>>) => {
    const defaultProps: ComponentProps<typeof ActivityHistory> = {
        activities: [activityA, activityB],
    };
    render(<ActivityHistory {...defaultProps} {...props} />);
};

const getBodyRows = () => screen.getAllByRole("row").slice(1);

describe("ActivityHistoryComponent", () => {
    describe("props", () => {
        test("activitiesが渡された場合、活動履歴がテーブル形式で表示される", () => {
            renderComponent({ activities: [activityA, activityB] });
            expect(screen.getByText("電話フォロー")).toBeInTheDocument();
            expect(screen.getByText("メール送信")).toBeInTheDocument();
        });

        test("filterOptions.keywordが渡された場合、検索フィールドの初期値としてセットされる", () => {
            renderComponent({ filterOptions: { keyword: "電話" } });
            const input = screen.getByPlaceholderText("活動を検索...") as HTMLInputElement;
            expect(input.value).toBe("電話");
        });

        test("filterOptions.activityTypesが渡された場合、活動種別セレクトの初期値としてセットされる", () => {
            renderComponent({ activities: [], filterOptions: { activityTypes: ["電話", "メール"] } });
            const chips = document.querySelectorAll(".MuiChip-root");
            expect(chips.length).toBe(2);
            expect(chips[0]).toHaveTextContent("電話");
            expect(chips[1]).toHaveTextContent("メール");
        });

        test("onActivityClickが渡された場合、活動行クリックでonActivityClick(activity.id)が呼ばれる", async () => {
            const onActivityClick = vi.fn();
            const user = userEvent.setup();
            renderComponent({ onActivityClick });
            await user.click(screen.getByText("電話フォロー"));
            expect(onActivityClick).toHaveBeenCalledWith("activity-1");
        });

        test("onActivityClickが未指定の場合、行のcursorはdefaultになる", () => {
            renderComponent();
            const row = getBodyRows()[0];
            expect(row).toHaveStyle({ cursor: "default" });
        });

        test("pageInfoが渡された場合でtotalPages > 1のとき、Paginationコンポーネントが表示される", () => {
            renderComponent({ pageInfo: { page: 1, totalPages: 2, totalCount: 2 } });
            expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
        });

        test("pageInfoのtotalPagesが1以下の場合、Paginationコンポーネントは表示されない", () => {
            renderComponent({ pageInfo: { page: 1, totalPages: 1, totalCount: 1 } });
            expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
        });

        test("onPageChangeが渡された場合、ページ切り替え時にonPageChange(page)が呼ばれる", async () => {
            const onPageChange = vi.fn();
            const user = userEvent.setup();
            renderComponent({ onPageChange, pageInfo: { page: 1, totalPages: 2, totalCount: 2 } });
            await user.click(screen.getByLabelText("Go to page 2"));
            expect(onPageChange).toHaveBeenCalledWith(2);
        });

        test("onFilterChangeが渡された場合、フィルター変更時にonFilterChange({keyword, activityTypes})が呼ばれる", async () => {
            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderComponent({ activities: [], onFilterChange });
            await user.type(screen.getByPlaceholderText("活動を検索..."), "電話");
            expect(onFilterChange).toHaveBeenLastCalledWith({ keyword: "電話", activityTypes: [] });
        });
    });

    describe("描画", () => {
        test("テーブルヘッダーに「活動日時」「活動種別」「案件」「内容」「担当者」の5列が表示される", () => {
            renderComponent();
            expect(screen.getByRole("columnheader", { name: "活動日時" })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: "活動種別" })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: "案件" })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: "内容" })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: "担当者" })).toBeInTheDocument();
        });

        test("「活動日時」列にTableSortLabelが表示され、デフォルトでアクティブ状態 (active=true, direction='desc') である", () => {
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "活動日時" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root");
            expect(sortLabel).toBeInTheDocument();
            const rows = getBodyRows();
            const latestDate = new Date(activityA.activityDate).toLocaleDateString("ja-JP");
            expect(within(rows[0]).getByText(latestDate)).toBeInTheDocument();
        });

        test("「活動種別」列にTableSortLabelが表示される", () => {
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "活動種別" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root");
            expect(sortLabel).toBeInTheDocument();
        });

        test("「内容」列にTableSortLabelが表示される", () => {
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "内容" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root");
            expect(sortLabel).toBeInTheDocument();
        });

        test("「案件」列と「担当者」列にはTableSortLabelが表示されない", () => {
            renderComponent();
            const dealHeader = screen.getByRole("columnheader", { name: "案件" });
            const assigneeHeader = screen.getByRole("columnheader", { name: "担当者" });
            expect(dealHeader?.querySelector(".MuiTableSortLabel-root")).toBeNull();
            expect(assigneeHeader?.querySelector(".MuiTableSortLabel-root")).toBeNull();
        });

        test("活動種別セルにはChipコンポーネントが表示され、活動タイプに応じたアイコンと背景色が設定される", () => {
            renderComponent({ activities: [createMockActivity({ activityType: "面談" })] });
            const chip = document.querySelector(".MuiChip-root");
            expect(chip).toBeInTheDocument();
            expect(chip?.querySelector("svg")).toBeInTheDocument();
            expect(getComputedStyle(chip as Element).backgroundColor).toBe("rgb(214, 227, 255)");
        });

        test("面談のChip背景色は#d6e3ffである", () => {
            renderComponent({ activities: [createMockActivity({ activityType: "面談" })] });
            const chip = document.querySelector(".MuiChip-root");
            expect(getComputedStyle(chip as Element).backgroundColor).toBe("rgb(214, 227, 255)");
        });

        test("電話のChip背景色は#d6e0f6である", () => {
            renderComponent({ activities: [createMockActivity({ activityType: "電話" })] });
            const chip = document.querySelector(".MuiChip-root");
            expect(getComputedStyle(chip as Element).backgroundColor).toBe("rgb(214, 224, 246)");
        });

        test("メールのChip背景色は#9ff5c1である", () => {
            renderComponent({ activities: [createMockActivity({ activityType: "メール" })] });
            const chip = document.querySelector(".MuiChip-root");
            expect(getComputedStyle(chip as Element).backgroundColor).toBe("rgb(159, 245, 193)");
        });

        test("その他のChip背景色は#e0e3e5である", () => {
            renderComponent({ activities: [createMockActivity({ activityType: "その他" })] });
            const chip = document.querySelector(".MuiChip-root");
            expect(getComputedStyle(chip as Element).backgroundColor).toBe("rgb(224, 227, 229)");
        });

        test("activitiesが空の場合、colSpan=5の中央寄せセルに「活動履歴がありません」が表示される", () => {
            renderComponent({ activities: [] });
            const cell = screen.getByText("活動履歴がありません").closest("td");
            expect(cell).toBeInTheDocument();
            expect(cell).toHaveAttribute("colspan", "5");
        });

        test("フィルターパネルに検索フィールドと活動種別セレクトが表示される", () => {
            renderComponent();
            expect(screen.getByPlaceholderText("活動を検索...")).toBeInTheDocument();
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        test("検索フィールドにSearchIconがstartAdornmentとして表示される", () => {
            renderComponent();
            expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
        });

        test("活動種別セレクトのlabelは「活動種別」である", () => {
            renderComponent();
            expect(screen.getByText("活動種別", { selector: "label" })).toBeInTheDocument();
        });

        test("活動種別セレクトは複数選択 (multiple) である", async () => {
            const user = userEvent.setup();
            renderComponent();
            await user.click(screen.getByRole("combobox"));
            const listbox = screen.getByRole("listbox");
            expect(listbox).toHaveAttribute("aria-multiselectable", "true");
        });

        test("複数の活動種別が選択された場合、Chipとしてセレクト内に表示される (renderValue)", () => {
            renderComponent({ activities: [], filterOptions: { activityTypes: ["電話", "メール"] } });
            const chips = document.querySelectorAll(".MuiChip-root");
            expect(chips.length).toBe(2);
            expect(chips[0]).toHaveTextContent("電話");
            expect(chips[1]).toHaveTextContent("メール");
        });
    });

    describe("状態管理", () => {
        test("初期状態のsortFieldは'activityDate'、sortOrderは'desc'である", () => {
            renderComponent();
            const rows = getBodyRows();
            const latestDate = new Date(activityA.activityDate).toLocaleDateString("ja-JP");
            expect(within(rows[0]).getByText(latestDate)).toBeInTheDocument();
        });

        test("同じ列ヘッダーを再クリックするとsortOrderがasc/descで交互に切り替わる", async () => {
            const user = userEvent.setup();
            renderComponent();
            const dateHeader = screen.getByRole("columnheader", { name: "活動日時" });
            const dateSortLabel = dateHeader.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(dateSortLabel);
            const rows = getBodyRows();
            const oldestDate = new Date(activityB.activityDate).toLocaleDateString("ja-JP");
            expect(within(rows[0]).getByText(oldestDate)).toBeInTheDocument();
        });

        test("別の列ヘッダーをクリックするとsortFieldが変わりsortOrderは'asc'にリセットされる", async () => {
            const user = userEvent.setup();
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "内容" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(sortLabel);
            const rows = getBodyRows();
            expect(within(rows[0]).getByText("メール送信")).toBeInTheDocument();
        });

        test("keywordを入力するとfilteredActivitiesがactivity.contentまたはactivityTypeで絞り込まれる", async () => {
            const user = userEvent.setup();
            renderComponent();
            await user.type(screen.getByPlaceholderText("活動を検索..."), "電話");
            const rows = getBodyRows();
            expect(rows.length).toBe(1);
            expect(within(rows[0]).getByText("電話フォロー")).toBeInTheDocument();
        });

        test("活動種別を選択するとfilteredActivitiesが選択種別のみに絞り込まれる", async () => {
            const user = userEvent.setup();
            renderComponent();
            await user.click(screen.getByRole("combobox"));
            await user.click(screen.getByRole("option", { name: "メール" }));
            await user.keyboard("{Escape}");
            const rows = getBodyRows();
            expect(rows.length).toBe(1);
            expect(within(rows[0]).getByText("メール送信")).toBeInTheDocument();
        });

        test("活動種別が未選択(空配列)の場合、全件が表示される", () => {
            renderComponent();
            const rows = getBodyRows();
            expect(rows.length).toBe(2);
        });
    });

    describe("インタラクション", () => {
        test("検索フィールドに文字を入力するとhandleKeywordChangeが呼ばれonFilterChangeに{keyword, activityTypes}が渡される", async () => {
            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderComponent({ activities: [], onFilterChange });
            await user.type(screen.getByPlaceholderText("活動を検索..."), "メール");
            expect(onFilterChange).toHaveBeenLastCalledWith({ keyword: "メール", activityTypes: [] });
        });

        test("活動種別セレクトで種別を選択するとhandleTypeChangeが呼ばれonFilterChangeに{keyword, activityTypes}が渡される", async () => {
            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderComponent({ activities: [], filterOptions: { keyword: "初期" }, onFilterChange });
            await user.click(screen.getByRole("combobox"));
            await user.click(screen.getByRole("option", { name: "電話" }));
            await user.keyboard("{Escape}");
            expect(onFilterChange).toHaveBeenLastCalledWith({ keyword: "初期", activityTypes: ["電話"] });
        });

        test("「活動日時」ヘッダーをクリックするとsortFieldが'activityDate'になる", async () => {
            const user = userEvent.setup();
            renderComponent();
            const typeHeader = screen.getByRole("columnheader", { name: "活動種別" });
            const typeSortLabel = typeHeader.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(typeSortLabel);
            const dateHeader = screen.getByRole("columnheader", { name: "活動日時" });
            const dateSortLabel = dateHeader.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(dateSortLabel);
            const rows = getBodyRows();
            const oldestDate = new Date(activityB.activityDate).toLocaleDateString("ja-JP");
            expect(within(rows[0]).getByText(oldestDate)).toBeInTheDocument();
        });

        test("「活動種別」ヘッダーをクリックするとsortFieldが'activityType'になる", async () => {
            const user = userEvent.setup();
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "活動種別" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(sortLabel);
            const rows = getBodyRows();
            expect(within(rows[0]).getByText("メール送信")).toBeInTheDocument();
        });

        test("「内容」ヘッダーをクリックするとsortFieldが'content'になる", async () => {
            const user = userEvent.setup();
            renderComponent();
            const header = screen.getByRole("columnheader", { name: "内容" });
            const sortLabel = header.querySelector(".MuiTableSortLabel-root") as HTMLElement;
            await user.click(sortLabel);
            const rows = getBodyRows();
            expect(within(rows[0]).getByText("メール送信")).toBeInTheDocument();
        });

        test("活動行クリックでonActivityClick(activity.id)が発火する", async () => {
            const onActivityClick = vi.fn();
            const user = userEvent.setup();
            renderComponent({ onActivityClick });
            await user.click(screen.getByText("電話フォロー"));
            expect(onActivityClick).toHaveBeenCalledWith("activity-1");
        });

        test("Paginationのページ番号をクリックするとonPageChange(page)が発火する", async () => {
            const onPageChange = vi.fn();
            const user = userEvent.setup();
            renderComponent({ onPageChange, pageInfo: { page: 1, totalPages: 2, totalCount: 2 } });
            await user.click(screen.getByLabelText("Go to page 2"));
            expect(onPageChange).toHaveBeenCalledWith(2);
        });
    });

    describe("副作用", () => {
        test("マウント時に追加のAPI呼び出しは行われない (データはpropsから受け取る)", () => {
            const onFilterChange = vi.fn();
            const onPageChange = vi.fn();
            renderComponent({
                onFilterChange,
                onPageChange,
                pageInfo: { page: 1, totalPages: 2, totalCount: 2 },
            });
            expect(onFilterChange).not.toHaveBeenCalled();
            expect(onPageChange).not.toHaveBeenCalled();
        });
    });

    describe("レイアウト", () => {
        describe("フィルターパネル", () => {
            test("フィルターパネルのbackgroundColorは'white'、borderRadiusは'0.75rem'(12px)である", () => {
                renderComponent();
                const panel = screen.getByTestId("activity-filter-panel");
                const style = getComputedStyle(panel);
                expect(style.backgroundColor).toBe("rgb(255, 255, 255)");
                expect(style.borderRadius).toBe("0.75rem");
            });

            test("フィルターパネルのパディングはMUIのp:2 (16px) である", () => {
                renderComponent();
                const panel = screen.getByTestId("activity-filter-panel");
                const style = getComputedStyle(panel);
                expect(style.paddingTop).toBe("16px");
                expect(style.paddingRight).toBe("16px");
                expect(style.paddingBottom).toBe("16px");
                expect(style.paddingLeft).toBe("16px");
            });

            test("フィルターパネルのマージン下はMUIのmb:2 (16px) である", () => {
                renderComponent();
                const panel = screen.getByTestId("activity-filter-panel");
                expect(getComputedStyle(panel).marginBottom).toBe("16px");
            });

            test("フィルターパネルのdisplayはflexで、gapはMUI gap:2 (16px)、flexWrapはwrap、alignItemsはcenterである", () => {
                renderComponent();
                const panel = screen.getByTestId("activity-filter-panel");
                const style = getComputedStyle(panel);
                expect(style.display).toBe("flex");
                expect(style.gap).toBe("16px");
                expect(style.flexWrap).toBe("wrap");
                expect(style.alignItems).toBe("center");
            });

            test("検索フィールドのminWidthは200pxである", () => {
                renderComponent();
                const input = screen.getByPlaceholderText("活動を検索...");
                const root = input.closest(".MuiFormControl-root") as HTMLElement | null;
                expect(root).not.toBeNull();
                expect(getComputedStyle(root as Element).minWidth).toBe("200px");
            });

            test("検索フィールドのsizeは'small'である", () => {
                renderComponent();
                const input = screen.getByPlaceholderText("活動を検索...");
                const root = input.closest(".MuiInputBase-root");
                expect(root?.classList.contains("MuiInputBase-sizeSmall")).toBe(true);
            });

            test("活動種別セレクトのminWidthは160pxである", () => {
                renderComponent();
                const select = screen.getByRole("combobox");
                const root = select.closest(".MuiFormControl-root") as HTMLElement | null;
                expect(root).not.toBeNull();
                expect(getComputedStyle(root as Element).minWidth).toBe("160px");
            });

            test("活動種別セレクトのsizeは'small'である", () => {
                renderComponent();
                const select = screen.getByRole("combobox");
                const root = select.closest(".MuiInputBase-root");
                expect(root?.classList.contains("MuiInputBase-sizeSmall")).toBe(true);
            });
        });

        describe("テーブル", () => {
            test("TableContainerはelevation=0 (boxShadowなし) で表示される", () => {
                renderComponent();
                const table = screen.getByRole("table");
                const container = table.closest(".MuiPaper-elevation0");
                expect(container).toBeInTheDocument();
            });

            test("TableContainerのborderRadiusは'0.75rem'(12px)である", () => {
                renderComponent();
                const table = screen.getByRole("table");
                const container = table.closest(".MuiPaper-root");
                expect(getComputedStyle(container as Element).borderRadius).toBe("0.75rem");
            });

            test("テーブルヘッダー行の背景色は#f1f4f6である", () => {
                renderComponent();
                const headerRow = screen.getByText("活動日時").closest("tr");
                expect(getComputedStyle(headerRow as Element).backgroundColor).toBe("rgb(241, 244, 246)");
            });

            test("テーブルボディ行はhoverプロパティが有効で、ホバー時に背景色が変化する", () => {
                renderComponent();
                const row = getBodyRows()[0];
                expect(row.classList.contains("MuiTableRow-hover")).toBe(true);
            });

            test("内容セルのmaxWidthは300pxでnoWrapが適用されている", () => {
                renderComponent();
                const contentCell = screen.getByText("電話フォロー");
                expect(contentCell).toHaveStyle({ maxWidth: "300px" });
                expect(contentCell.classList.contains("MuiTypography-noWrap")).toBe(true);
            });

            test("活動日時セルはJP形式 (toLocaleDateString('ja-JP')) で日付が表示される", () => {
                renderComponent();
                const expected = new Date(activityA.activityDate).toLocaleDateString("ja-JP");
                expect(screen.getByText(expected)).toBeInTheDocument();
            });

            test("活動種別Chipのsizeはsmallである", () => {
                renderComponent();
                const chip = document.querySelector(".MuiChip-root");
                expect(chip?.classList.contains("MuiChip-sizeSmall")).toBe(true);
            });
        });

        describe("ページネーション", () => {
            test("PaginationコンポーネントはdisplayがflexでjustifyContentはcenter、mt:3 (24px) である", () => {
                renderComponent({ pageInfo: { page: 1, totalPages: 2, totalCount: 2 } });
                const nav = screen.getByRole("navigation");
                const wrapper = nav.parentElement as HTMLElement;
                const style = getComputedStyle(wrapper);
                expect(style.display).toBe("flex");
                expect(style.justifyContent).toBe("center");
                expect(style.marginTop).toBe("24px");
            });

            test("Paginationのcolorは'primary' (#002045) である", () => {
                renderComponent({ pageInfo: { page: 1, totalPages: 2, totalCount: 2 } });
                const nav = screen.getByRole("navigation");
                expect(getComputedStyle(nav).color).toBe("rgb(0, 32, 69)");
            });

            test("PaginationのcountはpageInfo.totalPages、pageはpageInfo.pageである", () => {
                renderComponent({ pageInfo: { page: 1, totalPages: 3, totalCount: 3 } });
                expect(screen.getByLabelText("Go to page 3")).toBeInTheDocument();
                const active = screen.getByLabelText("page 1");
                expect(active).toHaveAttribute("aria-current", "page");
            });
        });
    });
});
