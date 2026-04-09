import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("ActivityFilterSectionComponent", () => {
    describe("props", () => {
        test.todo("activeFilterが'すべての活動'の場合、'すべての活動'ボタンにbg-surface-container-lowest text-primary border border-primary/10クラスが付与される");
        test.todo("activeFilterが'マイチーム'の場合、'マイチーム'ボタンにアクティブスタイルが適用される");
        test.todo("activeFilterが非選択ボタンの場合、bg-surface-container-lowest text-on-surface-variant border border-transparentクラスが付与される");
        test.todo("onFilterChangeが渡された場合、ボタンクリックで呼ばれる");
    });

    describe("描画", () => {
        test.todo("セクション要素にaria-label='フィルターセクション'が設定されている");
        test.todo("「すべての活動」「マイチーム」「結果のみ」「期限切れ」の4つのフィルターボタンが表示される");
        test.todo("各ボタンはtype='button'である");
        test.todo("ボタンコンテナはflex flex-wrap gap-2 (8px間隔) のフレックスレイアウトである");
    });

    describe("状態管理", () => {
        test.todo("初期activeFilterは'すべての活動'である");
        test.todo("フィルターボタンをクリックするとactiveFilterが変更される");
        test.todo("クリックしたボタンにアクティブスタイル (text-primary border-primary/10) が適用される");
        test.todo("クリックしなかったボタンには非アクティブスタイル (text-on-surface-variant border-transparent) が適用される");
    });

    describe("インタラクション", () => {
        test.todo("フィルターボタンをクリックするとsetActiveFilterが呼ばれ、activeFilterが更新される");
        test.todo("アクティブボタンはhover時にhover:bg-primary hover:text-whiteに変化する");
        test.todo("非アクティブボタンはhover時にhover:border-outline-variantに変化する");
    });

    describe("副作用", () => {
        test.todo("ActivityFilterSectionコンポーネントはマウント・アンマウント時に副作用を持たない");
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test.todo("セクションコンテナはp-6 bg-surface-container-low rounded-fullクラスが付与されている");
            test.todo("ボタンコンテナはflex flex-wrap gap-2 (8px) で折り返し可能な横並びレイアウトである");
        });

        describe("サイズ", () => {
            test.todo("セクションのパディングはp-6 (24px) である");
            test.todo("各ボタンのパディングはpx-4 py-2 (16px左右・8px上下) である");
        });

        describe("色", () => {
            test.todo("セクション背景色はbg-surface-container-low (#f1f4f6相当) である");
            test.todo("アクティブボタンの背景色はbg-surface-container-lowestである");
            test.todo("アクティブボタンのテキスト色はtext-primary (#002045) である");
            test.todo("アクティブボタンのボーダーはborder border-primary/10 (rgba(0,32,69,0.1)) である");
            test.todo("アクティブボタンのhover背景色はhover:bg-primary (#002045) である");
            test.todo("アクティブボタンのhoverテキスト色はhover:text-white (#ffffff) である");
            test.todo("非アクティブボタンの背景色はbg-surface-container-lowestである");
            test.todo("非アクティブボタンのテキスト色はtext-on-surface-variantである");
            test.todo("非アクティブボタンのボーダーはborder border-transparent (透明) である");
            test.todo("非アクティブボタンのhoverボーダーはhover:border-outline-variantである");
        });

        describe("タイポグラフィ", () => {
            test.todo("ボタンテキストはtext-xs (12px) font-bold (700) である");
        });

        describe("形状", () => {
            test.todo("セクションコンテナはrounded-full (9999px) の角丸である");
            test.todo("各ボタンはrounded-lg (8px) の角丸である");
        });

        describe("装飾", () => {
            test.todo("セクションにボーダーやシャドウは付与されていない");
            test.todo("各ボタンはborder-2ではなくborderクラス (1px) のボーダーを持つ");
        });

        describe("インタラクション", () => {
            test.todo("各ボタンのトランジションはtransition-allが適用されている");
            test.todo("アクティブボタンのhover時はbg-primaryに背景変化し文字がwhiteになる");
            test.todo("非アクティブボタンのhover時はborder-outline-variantにボーダーが表示される");
        });
    });
});

