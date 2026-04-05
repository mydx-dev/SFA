import { describe, test } from "vitest";

describe("LeadListPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にリード一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
        test.todo("'新規作成'ボタンが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時にリード一覧APIが呼ばれる");
        test.todo("取得成功時にLeadListコンポーネントにデータが渡される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得したリード一覧がLeadListコンポーネントに渡される");
        test.todo("LeadListコンポーネントのonLeadClickイベントでリード詳細ページに遷移する");
    });

    describe("ユーザー操作", () => {
        test.todo("'新規作成'ボタンクリックでリード作成フォームが表示される");
        test.todo("リード作成フォーム送信後にリード一覧が更新される");
        test.todo("リスト項目クリックでリード詳細ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("ローディング状態のとき、LeadListコンポーネントではなくスピナーが表示される");
        test.todo("エラー状態のとき、エラーコンポーネントが表示される");
    });
});

describe("LeadDetailPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時にリード詳細情報が表示される");
        test.todo("初期表示時に関連する案件一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時にリード詳細APIが呼ばれる");
        test.todo("マウント時に案件一覧APIがリードIDで絞り込んで呼ばれる");
        test.todo("取得成功時にリード詳細情報が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得したリード情報がLeadDetailコンポーネントに渡される");
        test.todo("取得した案件一覧がDealListコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("'編集'クリックで編集モードになる");
        test.todo("編集フォーム送信後にリード詳細が更新される");
        test.todo("'案件作成'クリックで案件作成フォームが表示される");
        test.todo("案件作成フォーム送信後に案件一覧が更新される");
        test.todo("'戻る'クリックでリード一覧ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("編集モードのとき、表示モードと編集モードのコンポーネントが切り替わる");
    });
});

describe("DealListPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に案件一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件一覧APIが呼ばれる");
        test.todo("取得成功時にDealListコンポーネントにデータが渡される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件一覧がDealListコンポーネントに渡される");
        test.todo("DealListコンポーネントのonDealClickイベントで案件詳細ページに遷移する");
    });

    describe("ユーザー操作", () => {
        test.todo("案件クリックで案件詳細ページに遷移する");
        test.todo("ステータスフィルタで案件一覧を絞り込める");
    });

    describe("状態管理", () => {
        test.todo("ローディング状態のとき、スピナーが表示される");
    });
});

describe("DealDetailPage", () => {
    describe("初期表示", () => {
        test.todo("初期表示時に案件詳細情報が表示される");
        test.todo("初期表示時に営業活動一覧が表示される");
        test.todo("ローディング中はスピナーが表示される");
        test.todo("クローズ済みでない案件には'営業活動追加'ボタンが表示される");
        test.todo("クローズ済みでない案件には'クローズ'ボタンが表示される");
    });

    describe("データ取得", () => {
        test.todo("マウント時に案件詳細APIが呼ばれる");
        test.todo("マウント時に営業活動一覧APIが案件IDで絞り込んで呼ばれる");
        test.todo("取得成功時に案件詳細情報が表示される");
        test.todo("取得失敗時にエラーメッセージが表示される");
    });

    describe("データフロー", () => {
        test.todo("取得した案件情報がDealDetailコンポーネントに渡される");
        test.todo("取得した営業活動一覧がActivityListコンポーネントに渡される");
    });

    describe("ユーザー操作", () => {
        test.todo("'営業活動追加'クリックでActivityFormが表示される");
        test.todo("ActivityForm送信後に営業活動一覧が更新される");
        test.todo("'クローズ'クリックでクローズ確認ダイアログが表示される");
        test.todo("クローズ確認後に案件がクローズされる");
        test.todo("クローズ後にページが更新される");
        test.todo("'戻る'クリックで案件一覧ページに遷移する");
    });

    describe("状態管理", () => {
        test.todo("クローズ済みの案件では'営業活動追加'ボタンが非表示になる");
        test.todo("クローズ済みの案件では'クローズ'ボタンが非表示になる");
    });
});
