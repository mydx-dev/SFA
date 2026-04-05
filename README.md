# SFA (Sales Force Automation)

Google Apps Script ベースの営業支援システム（SFA）です。リード管理、商談管理、活動履歴の記録などの機能を提供します。

## 概要

このプロジェクトは、Google スプレッドシートをデータベースとして使用し、React と TypeScript で構築されたモダンな Web アプリケーションです。

## 技術スタック

### バックエンド
- Google Apps Script
- TypeScript
- [@mydx-dev/gas-boost-runtime](https://www.npmjs.com/package/@mydx-dev/gas-boost-runtime) - データベースORM
- [@mydx-dev/gas-boost-cli](https://www.npmjs.com/package/@mydx-dev/gas-boost-cli) - ビルドツール

### フロントエンド
- React 19
- TypeScript 6
- Material-UI (MUI)
- React Router
- TanStack Query
- Dexie (IndexedDB wrapper)
- Vite (ビルドツール)

## 機能

- **リード管理**: 見込み顧客の情報を登録・管理
- **商談管理**: 商談の進捗を追跡・管理
- **活動履歴**: リードや商談に関連する活動を記録
- **オフライン対応**: IndexedDBを使用したローカルデータキャッシュ
- **同期機能**: ローカルデータとサーバーデータの同期

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm
- Google アカウント
- Google Apps Script プロジェクト

### インストール

```bash
# 依存関係のインストール
pnpm install

# ビルド
pnpm run build

# テスト実行
pnpm test
```

### デプロイ

```bash
# Google Apps Scriptへデプロイ
npx clasp push
```

## 開発

### ディレクトリ構成

```
src/
├── backend/           # Google Apps Script バックエンド
│   ├── application/   # ユースケース層
│   ├── domain/        # ドメインモデル
│   ├── infrastructure/# データアクセス層
│   └── presentation/  # コントローラー層
├── frontend/          # React フロントエンド
│   ├── app/           # アプリケーションエントリーポイント
│   ├── component/     # UI コンポーネント
│   ├── page/          # ページコンポーネント
│   ├── lib/           # ユーティリティ
│   └── usecase/       # フロントエンドユースケース
└── shared/            # 共有型定義
```

### コマンド

```bash
# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# テスト実行
pnpm test

# リント
pnpm run lint

# 依存関係の検証
pnpm run depcruise
```

## AI エージェントスキル

このプロジェクトには、Google Labs の [Stitch Skills](https://github.com/google-labs-code/stitch-skills) が統合されています。これらのスキルにより、AI コーディングエージェント（Claude Code、Cursor、Cline など）がより効果的にデザインとコンポーネント開発を支援できます。

### インストール済みスキル

- **react:components** - Stitch デザインを React コンポーネントに変換
- **shadcn-ui** - shadcn/ui コンポーネントの統合ガイダンス
- **stitch-design** - デザインシステムの合成とプロンプト強化

詳細は以下のドキュメントを参照してください：
- [STITCH_SKILLS.md](STITCH_SKILLS.md) - スキルの概要と説明
- [STITCH_SKILLS_USAGE.md](STITCH_SKILLS_USAGE.md) - 使用例とベストプラクティス

## テスト

```bash
# すべてのテストを実行
pnpm test

# カバレッジレポート生成
pnpm run test:coverage
```

## アーキテクチャ

このプロジェクトは、クリーンアーキテクチャの原則に従って構成されています：

- **ドメイン層**: ビジネスロジックとエンティティ
- **アプリケーション層**: ユースケース
- **インフラストラクチャ層**: データアクセス（SheetDB）
- **プレゼンテーション層**: UI コンポーネントとコントローラー

## ライセンス

このプロジェクトのライセンスについては、ライセンスファイルを参照してください。

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず issue を開いて変更内容を議論してください。
