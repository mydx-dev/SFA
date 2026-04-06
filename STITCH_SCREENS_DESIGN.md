# Stitch画面からのフロントエンド仕様設計

## 概要

このドキュメントは、StitchプロジェクトのSFAから抽出した画面デザインをもとに、Reactコンポーネントのテストケースとして設計したフロントエンド仕様の詳細を記載しています。

## Stitchプロジェクト情報

- **プロジェクト名**: SFA
- **プロジェクトID**: 11576318200795443616
- **デザインテーマ**: The Digital Curator - 高級感のあるエグゼクティブスタイル
- **カラースキーム**: 
  - Primary: #002045 (深いネイビー)
  - Secondary: #555f71
  - Tertiary: #002715 (成長を象徴するグリーン系)
  - Surface: #f7fafc (明るいグレー)

## 抽出された画面一覧

### 1. ダッシュボード (Dashboard)
- **デバイスタイプ**: Desktop (2560x2310)
- **スクリーンID**: cf6069f2387c4682890bb192493efe34
- **主要機能**:
  - KPI指標の表示（総売上、案件数、リード数、成約率）
  - 売上推移グラフ
  - パイプライン状況の可視化
  - 最近の活動一覧
  - 今後のタスク一覧

**設計したコンポーネント**:
- `DashboardComponent`: メインダッシュボード
- `KPICardComponent`: KPI指標カード
- `SalesChartComponent`: 売上推移グラフ
- `PipelineViewComponent`: パイプライン可視化

**設計したページ**:
- `DashboardPage`: ダッシュボードページ全体

### 2. 活動履歴 (Activity History)
- **デバイスタイプ**: Desktop (2560x2658)
- **スクリーンID**: a182f5cb133b42598e1e4aa80395200a
- **主要機能**:
  - 活動履歴のテーブル表示
  - 活動種別フィルター
  - 期間フィルター
  - 検索機能
  - ソート機能
  - ページネーション

**設計したコンポーネント**:
- `ActivityHistoryComponent`: 活動履歴テーブル
- `SearchFilterPanelComponent`: 検索・フィルターパネル
- `TimelineComponent`: タイムライン表示

**設計したページ**:
- `ActivityHistoryPage`: 活動履歴ページ全体

### 3. 顧客管理（階層構造対応）(Customer Management with Hierarchy)
- **デバイスタイプ**: Desktop (2560x2048)
- **スクリーンID**: 10aa04f556964545adcf7948ffaac967
- **主要機能**:
  - 階層型顧客ツリー表示
  - ツリーノードの展開/折りたたみ
  - 顧客詳細パネル
  - 関連案件一覧
  - 担当者一覧
  - 子顧客管理

**設計したコンポーネント**:
- `CustomerHierarchyTreeComponent`: 顧客階層ツリー
- `CustomerDetailPanelComponent`: 顧客詳細パネル

**設計したページ**:
- `CustomerManagementPage`: 顧客管理ページ（2カラムレイアウト）

### 4. 案件管理（カンバン）- 検索フィルター付 (Deal Kanban Board)
- **デバイスタイプ**: Desktop (2560x2048)
- **スクリーンID**: 9255adabd1e34f739130f85ebd0b03c1
- **主要機能**:
  - カンバンボード形式の案件表示
  - ドラッグ&ドロップによるステータス変更
  - 検索バー
  - フィルター機能
  - 案件カードの詳細情報表示

**設計したコンポーネント**:
- `DealKanbanBoardComponent`: カンバンボード全体
- `DealKanbanCardComponent`: 案件カード
- `SearchFilterPanelComponent`: 検索・フィルターパネル（共通）

**設計したページ**:
- `DealKanbanPage`: 案件カンバンページ

### 5. 案件管理（モバイル）- 検索フィルター付 (Mobile Deal List)
- **デバイスタイプ**: Mobile (780x2272)
- **スクリーンID**: 9c8c0862cd294a129d17500c0df385f6
- **主要機能**:
  - カード形式の案件リスト
  - スワイプアクション（編集・削除）
  - Pull to Refresh
  - 無限スクロール
  - モバイル検索バー
  - フィルタードロワー

**設計したコンポーネント**:
- `MobileDealListComponent`: モバイル案件リスト
- `MobileSearchBarComponent`: モバイル検索バー

**設計したページ**:
- `MobileDealListPage`: モバイル案件一覧ページ

### 6. フェーズ管理 (Phase Management)
- **デバイスタイプ**: Desktop (2560x2360)
- **スクリーンID**: 9d19aa0e0e6f444784c26ee69027d537
- **主要機能**:
  - フェーズ一覧のテーブル表示
  - フェーズの追加・編集・削除
  - ドラッグ&ドロップによる並び替え
  - 成約確率の設定
  - 順序管理

**設計したコンポーネント**:
- `PhaseManagementComponent`: フェーズ管理テーブル
- `PhaseFormComponent`: フェーズ追加・編集フォーム

**設計したページ**:
- `PhaseManagementPage`: フェーズ管理ページ

## 設計したレイアウト

### AppLayout
- ヘッダー（ナビゲーション、TaskList）
- メインコンテンツエリア
- レスポンシブデザイン対応

### DashboardLayout
- グリッドベースのレイアウト
- KPI、グラフ、リストセクションの配置
- レスポンシブ対応

### TwoColumnLayout
- 左カラム（ツリー/リスト）
- 右カラム（詳細）
- リサイザー機能
- レスポンシブ対応（モバイルではタブ切り替え）

## テストケース設計の方針

### コンポーネントレベル
各コンポーネントについて以下のテストケースを定義:
- **props**: プロパティの受け渡しと表示
- **描画**: 初期状態と条件による表示変化
- **状態管理**: 内部状態の管理と更新
- **インタラクション**: ユーザー操作とイベント発火
- **副作用**: マウント/アンマウント時の処理

### ページレベル
各ページについて以下のテストケースを定義:
- **初期表示**: 初期レンダリング時の表示内容
- **データ取得**: APIコールとデータフェッチ
- **データフロー**: コンポーネント間のデータ受け渡し
- **ユーザー操作**: ページ固有の操作フロー
- **状態管理**: ページレベルの状態管理

### レイアウトレベル
各レイアウトについて以下のテストケースを定義:
- **構造**: レイアウトの基本構造
- **ナビゲーション**: ページ間遷移
- **認証・認可**: アクセス制御
- **共通状態**: 全ページ共通の状態管理
- **レスポンシブデザイン**: デバイス別の表示

## デザインシステムの特徴

### The Digital Curator コンセプト
- **高級感**: エグゼクティブな雰囲気を醸成
- **視覚的階層**: トーナルレイヤリングによる深み
- **空白の活用**: データを「呼吸」させる十分な余白
- **意図的な非対称性**: 動的で興味深いレイアウト

### カラー使用ルール
- **100% Blackの禁止**: テキストには`on_background` (#181c1e)を使用
- **1pxボーダーの禁止**: 背景色の変化で境界を表現
- **グラスモーフィズム**: フローティング要素に80%透明度＋20pxブラー
- **グラデーション**: CTAボタンにシルク仕上げのグラデーション（135度）

### タイポグラフィ
- **Display & Headlines**: Manrope（幾何学的モダニズム）
- **Body & UI**: Inter（データグリッドでの優れた可読性）
- **コントラスト**: 大見出し＋小文字間隔の広いサブタイトル

### エレベーション
- **トーナルレイヤリング**: 影の代わりに背景色の変化で奥行きを表現
- **アンビエントシャドウ**: 必要時は`primary`色を含む柔らかい影
- **ゴーストボーダー**: アクセシビリティのため15%透明度の`outline-variant`

## テストファイルの場所

- **コンポーネント**: `tests/unit/frontend/component.test.tsx`
- **ページ**: `tests/integration/frontend/page.test.tsx`
- **レイアウト**: `tests/integration/frontend/layout.test.tsx`

## 次のステップ

1. ✅ テストケースの骨子を作成（完了）
2. ⬜ 実装者がテストケースをもとにReactコンポーネントを実装
3. ⬜ テストケースの実装（test.todoをtestに変更し、実装）
4. ⬜ デザインシステムの適用（Stitchのデザインガイドライン準拠）
5. ⬜ ビジュアルリグレッションテストの追加

## Stitchスクリーンへのアクセス

各画面のスクリーンショットとHTMLコードは、Stitchプロジェクトから以下の方法で取得できます:

```bash
# Stitch MCP tools を使用
stitch-get_screen --name "projects/11576318200795443616/screens/{screenId}"
```

スクリーンショットのダウンロードURL例:
- ダッシュボード: https://lh3.googleusercontent.com/aida/ADBb0uikHs8zMQ7jRM_VNGRgrldRd7CwUgrz5V1NmdzUpv7nRJy9jSL8ZrswzKmYSkZabDwSqk8aSuCNnTUucNel92deD83zf0-7bsJ4f9N73NGobWQ-OCqqbj3-TcRSaGEEDnQcLpgsITfzU_KkXDsgv1Shk-bLBm6YJ1D87hO233woYGwRQavGKlAS1ojOiOJNUEz-ZEETbV9o6Nz_2ZOS_ijEUUzicTm6rAiJn3J4IGNI2z_S01LDGHJF0kCv
- その他の画面も同様にStitch APIから取得可能

## まとめ

Stitchプロジェクトから6つの主要画面を抽出し、それぞれに対応するReactコンポーネントとページのテストケースを設計しました。

- **23個の新規コンポーネント**のテストケースを追加
- **6個の新規ページ**のテストケースを追加
- **3個のレイアウト**のテストケースを拡張

これらのテストケースは、実装の指針となり、仕様書としても機能します。実装者はこれらのテストケースを満たすようにReactコンポーネントを開発することで、Stitchデザインに忠実なフロントエンドを構築できます。
