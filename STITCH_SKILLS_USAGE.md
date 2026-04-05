# Stitch Skills Usage Examples

このドキュメントでは、インストールされたStitch Skillsを実際にSFAプロジェクトで使用する方法の例を示します。

## 前提条件

これらのスキルを使用する前に、以下を確認してください：

1. **AIコーディングエージェント**: Claude Code、Cursor、Cline、CodeBuddyなどのエージェントが必要です
2. **Stitch MCP Server**: デザイン生成機能を使用する場合、Stitch MCP Serverの設定が必要です
3. **プロジェクト環境**: React、TypeScript、Tailwind CSSが設定されていること

## 使用例

### 例1: 既存のコンポーネントをshadcn/uiで改善

AIエージェントに以下のように依頼できます：

```
LeadFormコンポーネントをshadcn/uiのフォームコンポーネントを使って改善してください。
バリデーション機能も追加してください。
```

スキルが以下を自動的に行います：
- shadcn/uiのFormコンポーネントをインストール
- 適切なバリデーションライブラリ（zod、react-hook-formなど）を統合
- 既存のフォームを改善されたUIコンポーネントで置き換え

### 例2: Stitchデザインから新しいコンポーネントを生成

Stitch MCPが設定されている場合：

```
Stitchで「モダンなダッシュボード画面」をデザインして、
それをReactコンポーネントに変換してください。
```

スキルが以下を自動的に行います：
1. stitch-designスキルがプロンプトを強化
2. Stitch MCPを使用してデザインを生成
3. react:componentsスキルがHTMLをReactコンポーネントに変換
4. モックデータを`src/data/mockData.ts`に抽出
5. 型安全なコンポーネントを生成

### 例3: 新しいUIコンポーネントライブラリの追加

```
shadcn/uiのDataTableコンポーネントを追加して、
LeadListPageで使用できるようにしてください。
```

スキルが以下を自動的に行います：
- shadcn/uiのDataTableコンポーネントをインストール
- 必要な依存関係を追加
- LeadListPageを更新してDataTableを使用
- 既存のデータ構造に合わせてカスタマイズ

## React Components スキルの詳細な使用法

### ステップバイステップ

1. **デザインの準備**
   - Stitch MCPを使用してデザインを作成、または既存のHTMLデザインを用意

2. **コンポーネント生成の依頼**
   ```
   この Stitch デザイン [URL or file path] を React コンポーネントに変換してください。
   モジュール化されたコンポーネント構造で、TypeScript の型定義も含めてください。
   ```

3. **自動処理**
   - スキルが`.stitch/designs/`にデザインファイルをダウンロード
   - HTMLを解析してReactコンポーネントを生成
   - スタイルをTailwindクラスに変換
   - データを`src/data/mockData.ts`に抽出
   - 型安全なPropsインターフェースを生成

4. **検証**
   - 自動的にAST（抽象構文木）ベースのバリデーションを実行
   - アーキテクチャチェックリストに対して検証

## Shadcn-ui スキルの詳細な使用法

### 利用可能なコンポーネント

shadcn/uiから以下のようなコンポーネントを追加できます：

```bash
# ボタン
npx shadcn@latest add button

# フォーム
npx shadcn@latest add form

# データテーブル
npx shadcn@latest add table

# ダイアログ
npx shadcn@latest add dialog

# カレンダー
npx shadcn@latest add calendar
```

### AIエージェントを使った統合

```
shadcn/uiのDialogコンポーネントを使って、
新しいリードを追加するモーダルを作成してください。
```

スキルが：
- Dialogコンポーネントをインストール
- モーダルコンポーネントを作成
- フォームとバリデーションを統合
- 既存のLeadForm機能と統合

## Stitch Design スキルの詳細な使用法

### デザイン生成

```
SFAアプリケーション用の以下の画面をデザインしてください：

1. ダッシュボード画面
   - 売上サマリーカード
   - リードとディールの一覧
   - アクティビティタイムライン

デザインシステム：
- プライマリーカラー: #3B82F6 (青)
- セカンダリーカラー: #10B981 (緑)
- モダンでクリーンな印象
- モバイルファーストのレスポンシブデザイン
```

スキルが：
- プロンプトを専門的なUI/UX用語で強化
- Stitch MCPでデザインを生成
- `.stitch/DESIGN.md`にデザインシステムを文書化
- HTMLとスクリーンショットをダウンロード

### デザインの編集

```
ダッシュボード画面のヘッダーを編集して、
検索バーとユーザープロフィールアイコンを追加してください。
```

スキルが：
- 既存のデザインを読み込み
- 指定された変更を適用
- 更新されたデザインを保存

## ベストプラクティス

### 1. デザインシステムの一貫性
```
.stitch/DESIGN.mdファイルを作成して、
プロジェクト全体のデザインシステムを定義してください。
```

### 2. モジュール化されたコンポーネント
- 大きなコンポーネントは小さな再利用可能な部品に分割
- カスタムフックでロジックを分離
- モックデータを外部ファイルに保存

### 3. 型安全性
- すべてのコンポーネントでTypeScriptインターフェースを使用
- `Readonly`を使用してPropsの不変性を保証

### 4. スタイルの一貫性
- Tailwindの設定ファイルでデザイントークンを定義
- 任意の色コードではなくテーマ変数を使用

## トラブルシューティング

### スキルが認識されない

```bash
# スキルが正しくインストールされているか確認
npx skills list

# 必要に応じて再インストール
npx skills add google-labs-code/stitch-skills --skill react:components --yes
```

### デザインのダウンロードに失敗

react:componentsスキルには専用のfetchスクリプトが含まれています：

```bash
# 直接スクリプトを使用
.agents/skills/react-components/scripts/fetch-stitch.sh "<url>" "<output-path>"
```

### バリデーションエラー

```bash
# コンポーネントのバリデーションを実行
cd .agents/skills/react-components
npm install
npm run validate <component-file-path>
```

## 参考リソース

- [react:components SKILL.md](.agents/skills/react-components/SKILL.md)
- [shadcn-ui SKILL.md](.agents/skills/shadcn-ui/SKILL.md)
- [stitch-design SKILL.md](.agents/skills/stitch-design/SKILL.md)
- [Stitch Skills GitHub](https://github.com/google-labs-code/stitch-skills)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## サポート

問題が発生した場合：

1. 各スキルのSKILL.mdファイルを確認
2. examplesディレクトリの参照実装を確認
3. GitHub Issuesで報告

---

これらのスキルを活用することで、デザインからコンポーネント実装までのワークフローを大幅に効率化できます。
