import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("ActivityHistoryComponent", () => {
    describe("props", () => {
        test.todo("activitiesが渡された場合、活動履歴がテーブル形式で表示される");
        test.todo("filterOptions.keywordが渡された場合、検索フィールドの初期値としてセットされる");
        test.todo("filterOptions.activityTypesが渡された場合、活動種別セレクトの初期値としてセットされる");
        test.todo("onActivityClickが渡された場合、活動行クリックでonActivityClick(activity.id)が呼ばれる");
        test.todo("onActivityClickが未指定の場合、行のcursorはdefaultになる");
        test.todo("pageInfoが渡された場合でtotalPages > 1のとき、Paginationコンポーネントが表示される");
        test.todo("pageInfoのtotalPagesが1以下の場合、Paginationコンポーネントは表示されない");
        test.todo("onPageChangeが渡された場合、ページ切り替え時にonPageChange(page)が呼ばれる");
        test.todo("onFilterChangeが渡された場合、フィルター変更時にonFilterChange({keyword, activityTypes})が呼ばれる");
    });

    describe("描画", () => {
        test.todo("テーブルヘッダーに「活動日時」「活動種別」「案件」「内容」「担当者」の5列が表示される");
        test.todo("「活動日時」列にTableSortLabelが表示され、デフォルトでアクティブ状態 (active=true, direction='desc') である");
        test.todo("「活動種別」列にTableSortLabelが表示される");
        test.todo("「内容」列にTableSortLabelが表示される");
        test.todo("「案件」列と「担当者」列にはTableSortLabelが表示されない");
        test.todo("活動種別セルにはChipコンポーネントが表示され、活動タイプに応じたアイコンと背景色が設定される");
        test.todo("面談のChip背景色は#d6e3ffである");
        test.todo("電話のChip背景色は#d6e0f6である");
        test.todo("メールのChip背景色は#9ff5c1である");
        test.todo("その他のChip背景色は#e0e3e5である");
        test.todo("activitiesが空の場合、colSpan=5の中央寄せセルに「活動履歴がありません」が表示される");
        test.todo("フィルターパネルに検索フィールドと活動種別セレクトが表示される");
        test.todo("検索フィールドにSearchIconがstartAdornmentとして表示される");
        test.todo("活動種別セレクトのlabelは「活動種別」である");
        test.todo("活動種別セレクトは複数選択 (multiple) である");
        test.todo("複数の活動種別が選択された場合、Chipとしてセレクト内に表示される (renderValue)");
    });

    describe("状態管理", () => {
        test.todo("初期状態のsortFieldは'activityDate'、sortOrderは'desc'である");
        test.todo("同じ列ヘッダーを再クリックするとsortOrderがasc/descで交互に切り替わる");
        test.todo("別の列ヘッダーをクリックするとsortFieldが変わりsortOrderは'asc'にリセットされる");
        test.todo("keywordを入力するとfilteredActivitiesがactivity.contentまたはactivityTypeで絞り込まれる");
        test.todo("活動種別を選択するとfilteredActivitiesが選択種別のみに絞り込まれる");
        test.todo("活動種別が未選択(空配列)の場合、全件が表示される");
    });

    describe("インタラクション", () => {
        test.todo("検索フィールドに文字を入力するとhandleKeywordChangeが呼ばれonFilterChangeに{keyword, activityTypes}が渡される");
        test.todo("活動種別セレクトで種別を選択するとhandleTypeChangeが呼ばれonFilterChangeに{keyword, activityTypes}が渡される");
        test.todo("「活動日時」ヘッダーをクリックするとsortFieldが'activityDate'になる");
        test.todo("「活動種別」ヘッダーをクリックするとsortFieldが'activityType'になる");
        test.todo("「内容」ヘッダーをクリックするとsortFieldが'content'になる");
        test.todo("活動行クリックでonActivityClick(activity.id)が発火する");
        test.todo("Paginationのページ番号をクリックするとonPageChange(page)が発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時に追加のAPI呼び出しは行われない (データはpropsから受け取る)");
    });

    describe("レイアウト", () => {
        describe("フィルターパネル", () => {
            test.todo("フィルターパネルのbackgroundColorは'white'、borderRadiusは'0.75rem'(12px)である");
            test.todo("フィルターパネルのパディングはMUIのp:2 (16px) である");
            test.todo("フィルターパネルのマージン下はMUIのmb:2 (16px) である");
            test.todo("フィルターパネルのdisplayはflexで、gapはMUI gap:2 (16px)、flexWrapはwrap、alignItemsはcenterである");
            test.todo("検索フィールドのminWidthは200pxである");
            test.todo("検索フィールドのsizeは'small'である");
            test.todo("活動種別セレクトのminWidthは160pxである");
            test.todo("活動種別セレクトのsizeは'small'である");
        });

        describe("テーブル", () => {
            test.todo("TableContainerはelevation=0 (boxShadowなし) で表示される");
            test.todo("TableContainerのborderRadiusは'0.75rem'(12px)である");
            test.todo("テーブルヘッダー行の背景色は#f1f4f6である");
            test.todo("テーブルボディ行はhoverプロパティが有効で、ホバー時に背景色が変化する");
            test.todo("内容セルのmaxWidthは300pxでnoWrapが適用されている");
            test.todo("活動日時セルはJP形式 (toLocaleDateString('ja-JP')) で日付が表示される");
            test.todo("活動種別Chipのsizeはsmallである");
        });

        describe("ページネーション", () => {
            test.todo("PaginationコンポーネントはdisplayがflexでjustifyContentはcenter、mt:3 (24px) である");
            test.todo("Paginationのcolorは'primary' (#002045) である");
            test.todo("PaginationのcountはpageInfo.totalPages、pageはpageInfo.pageである");
        });
    });
});

