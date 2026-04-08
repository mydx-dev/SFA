# サイドバーボタン追加のテストケース仕様書

## 概要

このドキュメントは、Stitchダッシュボード画面（cf6069f2387c4682890bb192493efe34）のデザインに基づいて定義された、サイドバーへの新規案件追加ボタンと設定ボタンのテストケースを記載しています。

## デザイン元情報

### Stitch プロジェクト
- **プロジェクトID**: 11576318200795443616
- **スクリーンID**: cf6069f2387c4682890bb192493efe34
- **スクリーン名**: ダッシュボード
- **デバイスタイプ**: Desktop (2560x2310)

### 抽出したサイドバーデザイン仕様

#### サイドバーの基本構造
```html
<aside class="fixed left-0 top-0 h-full z-40 flex flex-col bg-slate-900 dark:bg-slate-950 font-manrope text-sm font-semibold tracking-wide docked left-0 h-full w-64 border-r-0 shadow-2xl shadow-slate-950/20">
```

- **位置**: fixed left-0 top-0
- **高さ**: h-full（画面全体）
- **幅**: w-64（256px）
- **z-index**: 40
- **背景色**: bg-slate-900（ライトモード）、bg-slate-950（ダークモード）
- **フォント**: font-manrope, text-sm, font-semibold
- **シャドウ**: shadow-2xl shadow-slate-950/20

#### ナビゲーションリンクの構造
```html
<nav class="flex-1 space-y-1">
  <a class="flex items-center space-x-3 text-slate-400 px-6 py-4 hover:bg-slate-800/50 hover:text-white transition-colors">
    <span class="material-symbols-outlined" data-icon="icon_name">icon_name</span>
    <span>テキスト</span>
  </a>
</nav>
```

#### 下部セクション（設定ボタンエリア）の構造
```html
<div class="mt-auto px-6 py-8 border-t border-slate-800">
  <div class="space-y-1">
    <a class="flex items-center space-x-3 text-slate-400 py-2 hover:text-white transition-colors">
      <span class="material-symbols-outlined" data-icon="settings">settings</span>
      <span>設定</span>
    </a>
  </div>
</div>
```

## テストケース一覧

### 1. 構造レベルのテストケース

これらのテストケースは`tests/integration/frontend/layout.test.tsx`の`AppLayout > 構造`セクションに追加されています。

#### TC-SIDEBAR-001: サイドバーに新規案件追加ボタンが表示される
- **目的**: 新規案件追加ボタンがサイドバー内に表示されることを確認
- **検証内容**: ボタンが存在し、適切なテキスト「新規案件追加」が表示される
- **優先度**: 高

#### TC-SIDEBAR-002: サイドバーの下部に設定ボタンが表示される
- **目的**: 設定ボタンがサイドバーの下部に表示されることを確認
- **検証内容**: ボタンが存在し、サイドバー下部に配置される
- **優先度**: 高

#### TC-SIDEBAR-003: 設定ボタンにアイコンが表示される
- **目的**: 設定ボタンにMaterial Symbolsの「settings」アイコンが表示されることを確認
- **検証内容**: アイコンが正しく表示される
- **優先度**: 中

### 2. レイアウト - 配置

#### TC-LAYOUT-POS-001: 新規案件追加ボタンがサイドバーのナビゲーション要素の直後に配置される
- **検証内容**: 
  - ボタンが`<nav>`タグの直後に配置される
  - 他のナビゲーション要素と同じコンテナ内に存在する
- **Tailwind CSS**: ナビゲーション領域の直後

#### TC-LAYOUT-POS-002: 設定ボタンがサイドバーの下部（mt-auto）に配置される
- **検証内容**:
  - ボタンが`mt-auto`クラスを持つコンテナ内に配置される
  - サイドバーの最下部に固定される
- **Tailwind CSS**: `mt-auto`

#### TC-LAYOUT-POS-003: 設定ボタンがボーダー（border-t border-slate-800）で区切られている
- **検証内容**:
  - 設定ボタンを含むセクションが上部ボーダーを持つ
  - ボーダー色が`slate-800`である
- **Tailwind CSS**: `border-t border-slate-800`

### 3. レイアウト - サイズ

#### TC-LAYOUT-SIZE-001: 新規案件追加ボタンのパディングがpx-6 py-4である
- **検証内容**:
  - 左右パディング: 24px（px-6）
  - 上下パディング: 16px（py-4）
- **Tailwind CSS**: `px-6 py-4`
- **理由**: 他のナビゲーションリンクと同じパディングで統一感を保つ

#### TC-LAYOUT-SIZE-002: 設定ボタンのパディングがpy-2である
- **検証内容**:
  - 上下パディング: 8px（py-2）
- **Tailwind CSS**: `py-2`
- **理由**: 下部セクションのボタンは縦方向により密に配置

### 4. レイアウト - 色

#### TC-LAYOUT-COLOR-001: 新規案件追加ボタンのテキスト色がtext-slate-400（非アクティブ時）である
- **検証内容**:
  - デフォルト状態のテキスト色: `#94a3b8`（slate-400）
- **Tailwind CSS**: `text-slate-400`

#### TC-LAYOUT-COLOR-002: 新規案件追加ボタンのホバー時テキスト色がhover:text-whiteである
- **検証内容**:
  - ホバー時のテキスト色: `#ffffff`
- **Tailwind CSS**: `hover:text-white`

#### TC-LAYOUT-COLOR-003: 新規案件追加ボタンのホバー時背景色がhover:bg-slate-800/50である
- **検証内容**:
  - ホバー時の背景色: `rgba(30, 41, 59, 0.5)`（slate-800の50%透明度）
- **Tailwind CSS**: `hover:bg-slate-800/50`

#### TC-LAYOUT-COLOR-004: 設定ボタンのテキスト色がtext-slate-400である
- **検証内容**:
  - デフォルト状態のテキスト色: `#94a3b8`（slate-400）
- **Tailwind CSS**: `text-slate-400`

#### TC-LAYOUT-COLOR-005: 設定ボタンのホバー時テキスト色がhover:text-whiteである
- **検証内容**:
  - ホバー時のテキスト色: `#ffffff`
- **Tailwind CSS**: `hover:text-white`

### 5. レイアウト - タイポグラフィ

#### TC-LAYOUT-TYPO-001: 新規案件追加ボタンのフォントサイズがtext-sm（14px）である
- **検証内容**:
  - フォントサイズ: 14px
- **Tailwind CSS**: `text-sm`
- **フォントファミリー**: Manrope

#### TC-LAYOUT-TYPO-002: 新規案件追加ボタンのフォントウェイトがfont-semibold（600）である
- **検証内容**:
  - フォントウェイト: 600
- **Tailwind CSS**: `font-semibold`

#### TC-LAYOUT-TYPO-003: 設定ボタンのフォントサイズがtext-sm（14px）である
- **検証内容**:
  - フォントサイズ: 14px
- **Tailwind CSS**: `text-sm`
- **フォントファミリー**: Manrope

### 6. レイアウト - 形状

#### TC-LAYOUT-SHAPE-001: 新規案件追加ボタンのボーダー半径は適用されない
- **検証内容**:
  - ボタンにボーダー半径が設定されていない（デフォルトの直角）
- **理由**: サイドバーのナビゲーションリンクはボーダー半径を持たない

#### TC-LAYOUT-SHAPE-002: 設定ボタンのボーダー半径は適用されない
- **検証内容**:
  - ボタンにボーダー半径が設定されていない（デフォルトの直角）
- **理由**: サイドバーのナビゲーションリンクはボーダー半径を持たない

### 7. レイアウト - 装飾

#### TC-LAYOUT-DECO-001: 新規案件追加ボタンにアイコン（add）が表示される
- **検証内容**:
  - Material Symbols Outlinedの「add」アイコンが表示される
  - アイコンが`<span class="material-symbols-outlined">`要素として存在する
- **アイコン**: `add`

#### TC-LAYOUT-DECO-002: 新規案件追加ボタンのアイコンとテキストにspace-x-3のスペースがある
- **検証内容**:
  - アイコンとテキストの間隔: 12px（space-x-3）
- **Tailwind CSS**: `space-x-3`

#### TC-LAYOUT-DECO-003: 設定ボタンにアイコン（settings）が表示される
- **検証内容**:
  - Material Symbols Outlinedの「settings」アイコンが表示される
  - アイコンが`<span class="material-symbols-outlined">`要素として存在する
- **アイコン**: `settings`

#### TC-LAYOUT-DECO-004: 設定ボタンのアイコンとテキストにspace-x-3のスペースがある
- **検証内容**:
  - アイコンとテキストの間隔: 12px（space-x-3）
- **Tailwind CSS**: `space-x-3`

### 8. レイアウト - インタラクション

#### TC-LAYOUT-INTER-001: 新規案件追加ボタンクリックで新規案件作成画面に遷移する
- **検証内容**:
  - ボタンクリック時に`/deals/new`または適切な新規案件作成画面に遷移する
  - リンクのhref属性が正しく設定されている
- **期待される挙動**: 新規案件作成フォームが表示される

#### TC-LAYOUT-INTER-002: 新規案件追加ボタンホバー時に背景色が変化する（hover:bg-slate-800/50）
- **検証内容**:
  - マウスホバー時に背景色が`rgba(30, 41, 59, 0.5)`に変化する
- **Tailwind CSS**: `hover:bg-slate-800/50`

#### TC-LAYOUT-INTER-003: 新規案件追加ボタンホバー時にテキスト色が変化する（hover:text-white）
- **検証内容**:
  - マウスホバー時にテキスト色が`#ffffff`に変化する
- **Tailwind CSS**: `hover:text-white`

#### TC-LAYOUT-INTER-004: 新規案件追加ボタンにtransition-colorsアニメーションが適用される
- **検証内容**:
  - 色変化にトランジションアニメーションが適用される
  - アニメーションがスムーズである
- **Tailwind CSS**: `transition-colors`

#### TC-LAYOUT-INTER-005: 設定ボタンクリックで設定画面に遷移する
- **検証内容**:
  - ボタンクリック時に`/settings`または適切な設定画面に遷移する
  - リンクのhref属性が正しく設定されている
- **期待される挙動**: 設定画面が表示される

#### TC-LAYOUT-INTER-006: 設定ボタンホバー時にテキスト色が変化する（hover:text-white）
- **検証内容**:
  - マウスホバー時にテキスト色が`#ffffff`に変化する
- **Tailwind CSS**: `hover:text-white`

#### TC-LAYOUT-INTER-007: 設定ボタンにtransition-colorsアニメーションが適用される
- **検証内容**:
  - 色変化にトランジションアニメーションが適用される
  - アニメーションがスムーズである
- **Tailwind CSS**: `transition-colors`

## 実装時の参考コード例

### 新規案件追加ボタン（ナビゲーション領域直後に配置）

```tsx
<a 
  className="flex items-center space-x-3 text-slate-400 px-6 py-4 hover:bg-slate-800/50 hover:text-white transition-colors" 
  href="/deals/new"
>
  <span className="material-symbols-outlined">add</span>
  <span>新規案件追加</span>
</a>
```

### 設定ボタン（サイドバー下部に配置）

```tsx
<div className="mt-auto px-6 py-8 border-t border-slate-800">
  <div className="space-y-1">
    <a 
      className="flex items-center space-x-3 text-slate-400 py-2 hover:text-white transition-colors" 
      href="/settings"
    >
      <span className="material-symbols-outlined">settings</span>
      <span>設定</span>
    </a>
  </div>
</div>
```

## デザインシステムとの整合性

これらのテストケースは、Stitchプロジェクトの「The Digital Curator」デザインシステムに準拠しています:

### カラーパレット
- **Primary**: #002045
- **Secondary**: #555f71
- **Surface**: #f7fafc
- **Sidebar Background**: #1e293b (slate-900)
- **Text (Inactive)**: #94a3b8 (slate-400)
- **Text (Active/Hover)**: #ffffff

### タイポグラフィ
- **フォントファミリー**: Manrope, sans-serif
- **フォントサイズ**: 14px (text-sm)
- **フォントウェイト**: 600 (font-semibold)
- **Letter Spacing**: tracking-wide

### エレベーション
- **Shadow**: shadow-2xl shadow-slate-950/20
- **トーナルレイヤリング**: ホバー時に背景色の変化でフィードバック

## テストケースの実行

### 既存のテスト実行
```bash
pnpm vitest --run tests/integration/frontend/layout.test.tsx
```

### 特定のテストケースの実行
```bash
pnpm vitest --run tests/integration/frontend/layout.test.tsx -t "サイドバー"
```

## 次のステップ

1. ✅ テストケースの定義（完了）
2. ⬜ AppLayout.tsxにボタンを実装
3. ⬜ test.todoをtestに変更し、実装に合わせてテストを記述
4. ⬜ E2Eテストの追加（必要に応じて）
5. ⬜ ビジュアルリグレッションテストの追加（必要に応じて）

## 関連ドキュメント

- [DESIGN.md](./.stitch/DESIGN.md) - デザインシステム全体の仕様
- [STITCH_SCREENS_DESIGN.md](./STITCH_SCREENS_DESIGN.md) - Stitchスクリーンから抽出した画面仕様
- [layout.test.tsx](./tests/integration/frontend/layout.test.tsx) - レイアウトテストケース

## 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|------|-----------|---------|--------|
| 2026-04-08 | 1.0.0 | 初版作成 | Copilot Agent |
