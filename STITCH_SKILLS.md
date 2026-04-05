# Stitch Skills Integration

このプロジェクトには、Google Labs の Stitch Skills が統合されています。これらのスキルは、AI エージェントがデザインとReactコンポーネントの開発を支援するためのツールです。

## インストール済みスキル

以下の3つのスキルがインストールされています：

### 1. react:components
**説明**: Stitchデザインをモジュール化されたViteとReactコンポーネントに変換します。

**用途**:
- StitchデザインからReactコンポーネントを生成
- AST（抽象構文木）ベースのバリデーション
- モジュール化されたコンポーネント構造の作成

**場所**: `.agents/skills/react-components/`

### 2. shadcn-ui
**説明**: shadcn/ui コンポーネントの統合とアプリケーション構築のための専門的なガイダンスを提供します。

**用途**:
- shadcn/uiコンポーネントの発見とインストール
- コンポーネントのカスタマイズ
- ベストプラクティスの適用

**場所**: `.agents/skills/shadcn-ui/`

### 3. stitch-design
**説明**: Stitch デザイン作業の統合エントリーポイント。プロンプト強化、デザインシステム合成、高忠実度スクリーン生成を処理します。

**用途**:
- UI/UXキーワードを使用したプロンプト強化
- デザインシステムの合成（.stitch/DESIGN.md）
- Stitch MCPを介した高忠実度スクリーンの生成と編集

**場所**: `.agents/skills/stitch-design/`

## 使用方法

これらのスキルは、対応するAIコーディングエージェント（Claude Code、Cursor、Clineなど）によって自動的に検出され、使用されます。

### AIエージェントでの使用

エージェントに以下のようなタスクを依頼できます：

1. **Reactコンポーネントの生成**:
   ```
   StitchデザインからReactコンポーネントを生成してください
   ```

2. **shadcn/uiコンポーネントの追加**:
   ```
   shadcn/uiのButtonコンポーネントを追加してください
   ```

3. **デザインの生成**:
   ```
   ログインページのデザインを生成してください
   ```

### スキルの確認

インストールされているスキルを確認するには：

```bash
npx skills list
```

### 新しいスキルの追加

追加のスキルをインストールする場合：

```bash
# 利用可能なスキルをリスト表示
npx skills add google-labs-code/stitch-skills --list

# 特定のスキルをインストール
npx skills add google-labs-code/stitch-skills --skill <skill-name> --yes
```

利用可能なその他のスキル：
- `design-md`: Stitchプロジェクトを分析し、包括的なDESIGN.mdファイルを生成
- `enhance-prompt`: 曖昧なUIアイデアを洗練されたStitch最適化プロンプトに変換
- `stitch-loop`: Stitchを使用してWebサイトを反復的に構築
- `remotion`: Stitchプロジェクトからウォークスルービデオを生成
- `taste-design`: Google Stitchのセマンティックデザインシステムスキル

## ディレクトリ構造

```
.agents/skills/
├── react-components/
│   ├── SKILL.md          # スキルの詳細説明
│   ├── scripts/          # 実行可能スクリプト
│   ├── resources/        # テンプレートとガイド
│   └── examples/         # 参照例
├── shadcn-ui/
│   ├── SKILL.md
│   ├── scripts/
│   ├── resources/
│   └── examples/
└── stitch-design/
    ├── SKILL.md
    ├── workflows/        # デザインワークフロー
    ├── references/       # 参照ドキュメント
    └── examples/
```

## 技術的な詳細

### react:components スキルの主な機能

- **モジュラーコンポーネント**: デザインを独立したファイルに分割
- **ロジックの分離**: イベントハンドラとビジネスロジックを`src/hooks/`に移動
- **データの分離**: 静的テキスト、画像URL、リストを`src/data/mockData.ts`に移動
- **型安全性**: すべてのコンポーネントに`Readonly` TypeScriptインターフェースを含める
- **スタイルマッピング**: HTML `<head>`から`tailwind.config`を抽出

### shadcn-ui スキルの主な機能

- **フル所有権**: コンポーネントはnode_modulesではなく、コードベースに存在
- **完全なカスタマイズ**: スタイリング、動作、構造を自由に変更可能
- **バージョンロックなし**: 独自のペースでコンポーネントを選択的に更新
- **ランタイムオーバーヘッドゼロ**: ライブラリバンドルなし、必要なコードのみ

### stitch-design スキルの主な機能

- **プロンプト強化**: 粗いアイデアを構造化されたプロンプトに変換
- **デザインシステム合成**: 既存のStitchプロジェクトを分析して`.stitch/DESIGN.md`を作成
- **ワークフローのルーティング**: 専門的な生成または編集ワークフローにリクエストをルーティング
- **一貫性管理**: 確立されたビジュアル言語を活用

## リソース

- [Stitch Skills GitHub](https://github.com/google-labs-code/stitch-skills)
- [Stitch SDK Documentation](https://github.com/google-labs-code/stitch-sdk)
- [Agent Skills Open Standard](https://github.com/google-labs-code/stitch-skills#repository-structure)

## 注意事項

- これらのスキルは完全なエージェント権限で実行されます。使用前に内容を確認してください。
- スキルは `.agents/skills/` ディレクトリにインストールされます。
- 各スキルの詳細は、対応する `SKILL.md` ファイルを参照してください。

## トラブルシューティング

### スキルが認識されない場合

1. スキルが正しくインストールされているか確認：
   ```bash
   npx skills list
   ```

2. エージェントがスキルをサポートしているか確認（CodeBuddy、Continueなどが対応）

3. スキルを再インストール：
   ```bash
   npx skills add google-labs-code/stitch-skills --skill <skill-name> --yes
   ```

### ドキュメント

各スキルの詳細なドキュメントは、以下の場所にあります：
- `.agents/skills/<skill-name>/SKILL.md`
- `.agents/skills/<skill-name>/README.md`
