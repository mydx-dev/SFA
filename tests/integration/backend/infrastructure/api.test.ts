import { describe, test } from "vitest";

describe("syncAPI", () => {
    describe("入力", () => {
        test.todo("認証済みユーザーのセッションが必要");
        test.todo("未認証の場合はUnauthorizedErrorが返る");
    });
    describe("主要操作", () => {
        test.todo("Google Apps ScriptのrunメソッドでsyncAPIを呼び出す");
        test.todo("SyncOutputの形式でレスポンスが返る");
    });
    describe("出力", () => {
        test.todo("AppsScriptResponseでSyncOutputが返る");
        test.todo("SyncOutputにはシステムユーザーテーブルのデータが含まれる");
        test.todo("SyncOutputにはリードテーブルのデータが含まれる");
        test.todo("SyncOutputには案件テーブルのデータが含まれる");
        test.todo("SyncOutputには営業活動テーブルのデータが含まれる");
    });
});

describe("リード取得API", () => {
    describe("入力", () => {
        test.todo("認証済みユーザーのセッションが必要");
        test.todo("担当者IDでフィルタリングできる");
    });
    describe("主要操作", () => {
        test.todo("Google Apps ScriptのrunメソッドでリードAPIを呼び出す");
    });
    describe("出力", () => {
        test.todo("リード一覧がAppsScriptResponseで返る");
        test.todo("取得失敗時はエラーレスポンスが返る");
    });
});

describe("案件取得API", () => {
    describe("入力", () => {
        test.todo("認証済みユーザーのセッションが必要");
        test.todo("リードIDでフィルタリングできる");
    });
    describe("主要操作", () => {
        test.todo("Google Apps ScriptのrunメソッドでリードAPIを呼び出す");
    });
    describe("出力", () => {
        test.todo("案件一覧がAppsScriptResponseで返る");
        test.todo("取得失敗時はエラーレスポンスが返る");
    });
});

describe("営業活動取得API", () => {
    describe("入力", () => {
        test.todo("認証済みユーザーのセッションが必要");
        test.todo("案件IDでフィルタリングできる");
    });
    describe("主要操作", () => {
        test.todo("Google Apps ScriptのrunメソッドでリードAPIを呼び出す");
    });
    describe("出力", () => {
        test.todo("営業活動一覧がAppsScriptResponseで返る");
        test.todo("取得失敗時はエラーレスポンスが返る");
    });
});
