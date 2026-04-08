# 活動履歴ページ UI仕様書

## 概要

この仕様書は、Stitchデザイン（Screen ID: a182f5cb133b42598e1e4aa80395200a）から抽出した活動履歴ページのUI要件を定義します。
テストケースが唯一の契約となる前提で、全ての仕様はテストケースとして記述されています。

## 参照元

- **Stitch Project ID**: 11576318200795443616
- **Screen ID**: a182f5cb133b42598e1e4aa80395200a
- **Screen Title**: 活動履歴
- **Device Type**: Desktop (2560x2658)
- **HTML**: `.stitch/designs/activity-history-a182f5cb133b42598e1e4aa80395200a.html`

## テストケース参照

以下のテストファイルに全ての仕様が記述されています：

### ページレベル
- **ファイル**: `tests/integration/frontend/page.test.tsx`
- **テストスイート**: `describe("ActivityHistoryPage")`
- **対象範囲**:
  - ページ全体のレイアウト（サイドナビ、ヘッダー、メインコンテンツ）
  - Bentoレイアウト（12列グリッド、8:4分割）
  - 配置、サイズ、色、タイポグラフィ、形状、装飾、インタラクション

### コンポーネントレベル

#### ActivityHistoryComponent
- **ファイル**: `tests/unit/frontend/component.test.tsx`
- **テストスイート**: `describe("ActivityHistoryComponent")`
- **対象範囲**:
  - 活動カード（アイコン、タイトル、メモ、バッジ）
  - 日付グループヘッダー
  - 活動タイプごとの色分け

#### SearchFilterPanelComponent
- **ファイル**: `tests/unit/frontend/component.test.tsx`
- **テストスイート**: `describe("SearchFilterPanelComponent")`
- **対象範囲**:
  - 検索フィールド（ヘッダー内）
  - フィルターボタン
  - アクティブ状態の表現

## 主要UI要素の仕様サマリー

### サイドナビゲーション
- **位置**: 固定左側 (fixed left-0 top-0)
- **サイズ**: 256px幅 (w-64)、画面全体高さ (h-full)
- **z-index**: 40
- **背景色**: #0f172a (bg-slate-900)
- **シャドウ**: shadow-2xl shadow-slate-950/20

### ヘッダー
- **位置**: Sticky top (sticky top-0)
- **サイズ**: 左マージン256px (ml-64)、幅 calc(100%-16rem)
- **z-index**: 30
- **背景**: 半透明 #f8fafc80 (bg-slate-50/80) + backdrop-blur-xl
- **パディング**: 水平32px、垂直16px (px-8 py-4)

### メインコンテンツ
- **レイアウト**: Bentoレイアウト (grid-cols-12 gap-8)
- **左マージン**: 256px (ml-64)
- **パディング**: 48px (p-12)
- **コンテナ**: max-w-6xl mx-auto

### 活動フィード（左カラム）
- **幅**: 8列 (col-span-12 lg:col-span-8)
- **カード形状**: 完全な丸角 (rounded-full)
- **カードパディング**: 24px (p-6)
- **シャドウ**: sm → hover時にxl
- **アイコンサイズ**: 48px×48px (w-12 h-12)

#### 活動タイプ別の色
- **通話**: #d6e0f6 (bg-secondary-fixed)
- **メール**: #d6e3ff (bg-primary-fixed)
- **会議**: #9ff5c1 (bg-tertiary-fixed)

### サイドパネル（右カラム）
- **幅**: 4列 (col-span-12 lg:col-span-4)
- **構成要素**:
  1. クイック記録フォーム（完全な丸角、8項目パディング）
  2. 統計カード（Primary背景、装飾円形要素）
  3. フィルターセクション（8pxギャップのボタン配置）

### 日付グループヘッダー
- **区切り線**: 1px高さ (h-[1px])、#c4c6cf30 (bg-outline-variant/30)
- **テキスト**: xsサイズ、太字、大文字、letter-spacing広め (tracking-widest)
- **マージン**: 下32px (mb-8)

### タイポグラフィスケール
- **ページタイトル**: 4xl、極太 (font-extrabold)、Manrope、#002045
- **ページラベル**: xs、太字、letter-spacing: 0.2em、大文字
- **カードタイトル**: Manrope、太字
- **サブテキスト**: sm
- **時刻**: xs、ミディアムウェイト
- **メモ**: sm、イタリック体
- **バッジ**: 10px、太字、大文字、letter-spacing広め

### インタラクション
- **ホバートランジション**: 300ms (transition-all duration-300)
- **活動カードホバー**: シャドウxl + ボーダー表示
- **ナビリンクホバー**: 背景 slate-800/50、文字色white
- **フォーカスリング**: 2px (focus:ring-2 focus:ring-surface-tint)

## 実装ガイドライン

1. **コンポーネント分割**:
   - ActivityCard（活動カード）
   - DateGroupHeader（日付グループヘッダー）
   - QuickLogForm（クイック記録フォーム）
   - StatsCard（統計カード）
   - FilterButtons（フィルターボタン群）

2. **カラーパレット**: `.stitch/DESIGN.md` のカラー定義を参照

3. **フォント**:
   - ヘッドライン/タイトル: Manrope
   - ボディ/UI: Inter

4. **レスポンシブ**: Desktop-first (2560px基準)

## 注意事項

- HTML直書きは禁止。Reactコンポーネントで実装すること
- 全ての仕様はテストケースに記述されており、このドキュメントはサマリーです
- 詳細な仕様が必要な場合は、対応するテストケースを参照してください
- テストケースが唯一の契約であり、仕様書はそれを補完するものです

## テスト実行

```bash
# ページレベルテスト
pnpm vitest --run tests/integration/frontend/page.test.tsx -t "ActivityHistoryPage"

# コンポーネントレベルテスト
pnpm vitest --run tests/unit/frontend/component.test.tsx -t "ActivityHistoryComponent"
pnpm vitest --run tests/unit/frontend/component.test.tsx -t "SearchFilterPanelComponent"
```

## 変更履歴

- 2026-04-08: Stitchデザイン（a182f5cb133b42598e1e4aa80395200a）からUI仕様を抽出しテストケースとして記述
