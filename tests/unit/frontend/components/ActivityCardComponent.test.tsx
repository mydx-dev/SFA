import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lead } from "../../../../src/backend/domain/entity/Lead";
import { Deal } from "../../../../src/backend/domain/entity/Deal";

describe("ActivityCardComponent", () => {
    describe("props", () => {
        test.todo("activityTypeが'電話'の場合、アイコン背景クラスbg-secondary-fixedが適用される");
        test.todo("activityTypeが'メール'の場合、アイコン背景クラスbg-primary-fixedが適用される");
        test.todo("activityTypeが'面談'の場合、アイコン背景クラスbg-tertiary-fixedが適用される");
        test.todo("activityTypeが'その他'の場合、アイコン背景クラスbg-surface-container-highが適用される");
        test.todo("activity.contentが存在する場合、メモエリアが表示される");
        test.todo("activity.contentが空の場合、メモエリアは表示されない");
        test.todo("activity.activityDateから時刻がHH:MM形式で表示される");
    });

    describe("描画", () => {
        test.todo("カードコンテナのクラスにbg-surface-container-lowest p-6 rounded-full shadow-sm border border-transparentが付与されている");
        test.todo("アイコンコンテナのクラスにw-12 h-12 rounded-full flex items-center justify-center flex-shrink-0が付与されている");
        test.todo("カードのコンテンツエリアにactivityTypeテキストがh4として表示される");
        test.todo("時刻はtext-xs font-mediumクラスで表示される");
        test.todo("メモエリアにmt-4 p-4 bg-surface-container-low rounded-xl border-l-4 border-tertiary-fixedクラスが付与されている");
        test.todo("メモテキストにtext-sm italicクラスが付与されている");
        test.todo("バッジはinline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed/20クラスで表示される");
        test.todo("バッジにactivityTypeが表示される");
        test.todo("アイコンエリアとコンテンツエリアはflex items-start space-x-6で水平配置される");
        test.todo("タイトルと時刻はflex justify-between items-startで両端揃え配置される");
    });

    describe("状態管理", () => {
        test.todo("ActivityCardコンポーネントは内部状態を持たない (表示のみ)");
    });

    describe("インタラクション", () => {
        test.todo("カードがホバーされるとhover:shadow-xl hover:shadow-primary/5のシャドウが適用される");
        test.todo("カードがホバーされるとhover:border-outline-variant/10のボーダーが表示される");
        test.todo("カードのトランジションはtransition-all duration-300 (300ms) である");
    });

    describe("副作用", () => {
        test.todo("ActivityCardコンポーネントはマウント・アンマウント時に副作用を持たない");
    });

    describe("レイアウト", () => {
        describe("配置", () => {
            test.todo("アイコンとコンテンツエリアはspace-x-6 (24px) の水平ギャップで配置される");
            test.todo("バッジエリアはmt-4 flex items-center space-x-4で配置される");
            test.todo("メモエリアはコンテンツエリア内でmt-4のマージンを持つ");
        });

        describe("サイズ", () => {
            test.todo("カードのパディングはp-6 (24px) である");
            test.todo("アイコンコンテナはw-12 h-12 (48px×48px) の正方形である");
            test.todo("メモエリアのパディングはp-4 (16px) である");
            test.todo("バッジのパディングはpx-3 py-1 (12px左右・4px上下) である");
        });

        describe("色", () => {
            test.todo("カード背景色はbg-surface-container-lowest (#ffffff相当) である");
            test.todo("電話アイコン背景はbg-secondary-fixed (#d6e0f6相当) である");
            test.todo("メールアイコン背景はbg-primary-fixed (#d6e3ff相当) である");
            test.todo("面談アイコン背景はbg-tertiary-fixed (#9ff5c1相当) である");
            test.todo("その他アイコン背景はbg-surface-container-high (#e0e3e5相当) である");
            test.todo("メモエリア背景はbg-surface-container-low (#f1f4f6相当) である");
            test.todo("メモエリア左ボーダー色はborder-tertiary-fixed (#9ff5c1相当) である");
            test.todo("バッジ背景はbg-tertiary-fixed/20 (rgba(159,245,193,0.2)) である");
        });

        describe("タイポグラフィ", () => {
            test.todo("活動タイトル (h4) はfont-headline (Manrope) font-boldが適用されている");
            test.todo("時刻はtext-xs font-medium (12px, weight 500) である");
            test.todo("メモテキストはtext-sm italic (14px, イタリック体) である");
            test.todo("バッジテキストはtext-[10px] font-bold uppercase tracking-widerである");
        });

        describe("形状", () => {
            test.todo("カードコンテナはrounded-full (9999px) の角丸である");
            test.todo("アイコンコンテナはrounded-full (円形) である");
            test.todo("メモエリアはrounded-xl (12px) の角丸である");
            test.todo("メモエリアの左ボーダーはborder-l-4 (4px) である");
            test.todo("バッジはrounded-full (完全な丸角) である");
        });

        describe("装飾", () => {
            test.todo("カードは通常時shadow-sm (軽いボックスシャドウ) を持つ");
            test.todo("カードのホバー時はhover:shadow-xl hover:shadow-primary/5 (大きなシャドウ、primary色5%不透明度) になる");
            test.todo("カードのボーダーは通常時border-transparent、ホバー時はhover:border-outline-variant/10になる");
        });

        describe("インタラクション", () => {
            test.todo("カードはホバー時にシャドウがshadow-smからhover:shadow-xlに変化する");
            test.todo("カードはホバー時にボーダーがtransparentからoutline-variant/10に変化する");
            test.todo("トランジションはtransition-all duration-300 (全プロパティ300ms) である");
        });
    });
});

