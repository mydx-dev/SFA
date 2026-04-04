import { describe, test } from "vitest";

describe("TaskItemComponent", () => {
    describe("props", () => {
        test.todo("labelが渡された場合、ラベルテキストが表示される");
        test.todo("statusが'queued'の場合、'実行待ち'ボタンが表示される");
        test.todo("statusが'running'の場合、'実行中'ボタンが表示される");
        test.todo("statusが'failed'の場合、'リトライ'ボタンが表示される");
        test.todo("onRetryが渡された場合、'リトライ'ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("statusが'queued'のとき'実行待ち'ボタンが表示される");
        test.todo("statusが'running'のとき'実行中'ボタンが表示される");
        test.todo("statusが'failed'のとき'リトライ'ボタンが表示される");
        test.todo("statusが'queued'のときMenuItemが無効化される");
        test.todo("statusが'running'のときMenuItemが無効化される");
        test.todo("statusが'failed'のときMenuItemが有効である");
    });

    describe("状態管理", () => {
        test.todo("statusが'queued'から'failed'に変わると'リトライ'ボタンが表示される");
    });

    describe("インタラクション", () => {
        test.todo("'リトライ'ボタンクリックでonRetryイベントが発火する");
        test.todo("'実行待ち'ボタンはクリックできない");
        test.todo("'実行中'ボタンはクリックできない");
    });

    describe("副作用", () => {
        test.todo("マウント時にコンソールログが出力される");
    });
});

describe("TaskListComponent", () => {
    describe("props", () => {
        test.todo("taskSchedulerのタスク一覧を使用する");
    });

    describe("描画", () => {
        test.todo("タスクが存在しない場合はIconButtonが表示されない");
        test.todo("タスクが存在する場合はIconButtonが表示される");
        test.todo("タスクが存在する場合はバッジにタスク数が表示される");
        test.todo("メニューが閉じている状態では各タスクは表示されない");
    });

    describe("状態管理", () => {
        test.todo("IconButtonクリックでMenuが開く");
        test.todo("Menu外クリックでMenuが閉じる");
        test.todo("タスクが追加されるとバッジのカウントが増える");
    });

    describe("インタラクション", () => {
        test.todo("IconButtonクリックでMenuが表示される");
        test.todo("TaskItemの'リトライ'クリックでtaskScheduler.retryが呼ばれる");
        test.todo("taskScheduler.retryに対象タスクのIDが渡される");
    });

    describe("副作用", () => {
        test.todo("マウント時にtaskSchedulerのタスク一覧を取得する");
    });
});

describe("LeadListComponent", () => {
    describe("props", () => {
        test.todo("leads配列が渡された場合、リード一覧が表示される");
        test.todo("leadsが空配列の場合、'リードがありません'が表示される");
        test.todo("onLeadClickが渡された場合、リードクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("初期状態ではリード一覧が表示される");
        test.todo("leadsが空の場合、空状態メッセージが表示される");
        test.todo("各リードの氏名・会社名・ステータスが表示される");
    });

    describe("状態管理", () => {
        test.todo("ステータスフィルター変更でリスト表示が変化する");
    });

    describe("インタラクション", () => {
        test.todo("リードクリックでonLeadClickイベントが発火する");
        test.todo("クリックされたリードのIDがonLeadClickに渡される");
    });

    describe("副作用", () => {
        test.todo("マウント時に特別な処理はなし");
    });
});

describe("LeadFormComponent", () => {
    describe("props", () => {
        test.todo("initialValuesが渡された場合、フォームに初期値が設定される");
        test.todo("initialValuesが未指定の場合、フォームは空になる");
        test.todo("onSubmitが渡された場合、フォーム送信で呼ばれる");
        test.todo("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("初期状態では氏名・会社名・メールアドレス・電話番号のフォームが表示される");
        test.todo("ステータス選択肢が表示される");
    });

    describe("状態管理", () => {
        test.todo("氏名入力で状態が更新される");
        test.todo("ステータス変更で状態が更新される");
    });

    describe("インタラクション", () => {
        test.todo("送信ボタンクリックでonSubmitが呼ばれる");
        test.todo("onSubmitにフォームの入力値が渡される");
        test.todo("キャンセルボタンクリックでonCancelが呼ばれる");
        test.todo("氏名が空の場合、バリデーションエラーが表示される");
    });

    describe("副作用", () => {
        test.todo("マウント時に特別な処理はなし");
    });
});

describe("DealListComponent", () => {
    describe("props", () => {
        test.todo("deals配列が渡された場合、案件一覧が表示される");
        test.todo("dealsが空配列の場合、'案件がありません'が表示される");
        test.todo("onDealClickが渡された場合、案件クリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("初期状態では案件一覧が表示される");
        test.todo("各案件の案件名・ステータス・金額が表示される");
        test.todo("dealsが空の場合、空状態メッセージが表示される");
    });

    describe("状態管理", () => {
        test.todo("ステータスフィルター変更でリスト表示が変化する");
    });

    describe("インタラクション", () => {
        test.todo("案件クリックでonDealClickイベントが発火する");
    });

    describe("副作用", () => {
        test.todo("マウント時に特別な処理はなし");
    });
});

describe("ActivityFormComponent", () => {
    describe("props", () => {
        test.todo("dealIdが渡された場合、案件IDが設定される");
        test.todo("initialValuesが渡された場合、フォームに初期値が設定される");
        test.todo("onSubmitが渡された場合、フォーム送信で呼ばれる");
        test.todo("onCancelが渡された場合、キャンセルボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("活動種別・活動日・内容のフォームが表示される");
        test.todo("活動種別は選択肢から選べる");
    });

    describe("状態管理", () => {
        test.todo("活動種別変更で状態が更新される");
        test.todo("活動日変更で状態が更新される");
    });

    describe("インタラクション", () => {
        test.todo("送信ボタンクリックでonSubmitが呼ばれる");
        test.todo("キャンセルボタンクリックでonCancelが呼ばれる");
        test.todo("内容が空の場合、バリデーションエラーが表示される");
        test.todo("活動日が未入力の場合、バリデーションエラーが表示される");
    });

    describe("副作用", () => {
        test.todo("マウント時に特別な処理はなし");
    });
});
