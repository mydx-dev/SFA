# Activity History Page - Quick Reference

## ✅ テストサマリー

| カテゴリ | 総数 | 実装済み | TODO |
|---------|-----|---------|------|
| **初期表示** | 8 | 5 | 3 |
| **データ取得** | 8 | 3 | 5 |
| **データフロー** | 5 | 2 | 3 |
| **ユーザー操作** | 50 | 0 | 50 |
| **状態管理** | 7 | 0 | 7 |
| **レイアウト** | 108 | 0 | 108 |
| **合計** | **186** | **10** | **176** |

## 🎨 デザイン仕様クイックリファレンス

### カラーパレット

```css
/* Primary Colors */
--primary: #002045         /* Deep navy blue */
--secondary: #555f71       /* Muted slate */
--tertiary: #002715        /* Dark forest green */
--surface: #f7fafc         /* Light grey background */
--on-background: #181c1e   /* Text color (never pure black) */

/* Table Colors */
--table-header-bg: #f1f4f6
--table-row-hover: rgba(0, 32, 69, 0.04)
--ghost-border: rgba(85, 95, 113, 0.15)

/* Activity Type Chip Colors */
--chip-meeting: #d6e3ff    /* 面談 */
--chip-phone: #d6e0f6      /* 電話 */
--chip-email: #9ff5c1      /* メール */
--chip-other: #e0e3e5      /* その他 */

/* Activity Type Icon Colors */
--icon-meeting: #002045    /* GroupsIcon */
--icon-phone: #555f71      /* CallIcon */
--icon-email: #003f25      /* EmailIcon */
--icon-other: #74777f      /* MoreHorizIcon */
```

### タイポグラフィ

```css
/* Page Title */
font-family: 'Manrope', sans-serif;
font-size: 32px;           /* h1 variant */
font-weight: 600;          /* semibold */
line-height: 1.3;
letter-spacing: -0.02em;

/* Table Header */
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;          /* semibold */

/* Table Cell */
font-family: 'Inter', sans-serif;
font-size: 14px;           /* body2 variant */
font-weight: 400;
```

### スペーシング

```css
/* Page Structure */
--page-title-mb: 32px      /* mb-4 */
--filter-panel-mb: 16px    /* mb: 2 */
--pagination-mt: 24px      /* mt: 3 */

/* Filter Panel */
--filter-panel-padding: 16px     /* p: 2 */
--filter-panel-gap: 16px         /* gap: 2 */

/* Table */
--table-cell-padding: 16px
```

### Border Radius

```css
--radius-card: 12px        /* 0.75rem - Filter panel, Table container */
--radius-input: 6px        /* Form elements */
```

### コンポーネントサイズ

```css
/* Form Inputs */
--input-height: 40px       /* size="small" */
--search-box-min-width: 200px
--filter-min-width: 160px

/* Pagination */
--pagination-button-height: 32px

/* Loading/Error Area */
--state-area-min-height: 400px
```

## 📋 主要テストケース一覧

### P0 - Critical（最優先実装）

#### 初期表示
- [x] ページタイトル「活動履歴」が表示される
- [x] 活動履歴テーブルが表示される
- [x] フィルターパネルが表示される
- [x] ページネーションが表示される
- [x] ローディング中はCircularProgressが表示される
- [ ] 初期ソート順が活動日時の降順である
- [ ] 初期ページ番号が1である

#### データ取得
- [x] マウント時にAPI呼び出しが行われる
- [x] 取得成功時にデータが表示される
- [x] 取得失敗時にエラーメッセージが表示される
- [ ] 空データ時は「活動履歴がありません」が表示される

### P1 - High（次に実装）

#### フィルター操作
- [ ] 活動種別フィルターで面談/電話/メール/その他を選択できる
- [ ] 複数の活動種別を同時選択できる（OR条件）
- [ ] 期間フィルターで開始日・終了日を選択できる
- [ ] フィルター選択解除で全件表示される

#### 検索操作
- [ ] 検索ボックスにキーワード入力で内容が検索される
- [ ] 検索ボックスクリアで全件表示される
- [ ] Enterキー押下で検索が実行される

#### ソート操作
- [ ] 活動日時カラムヘッダークリックで昇順/降順ソートされる
- [ ] 活動種別カラムヘッダークリックでソートされる
- [ ] 内容カラムヘッダークリックでソートされる
- [ ] ソート中のカラムにインジケーター（▲▼）が表示される

#### ページネーション操作
- [ ] 次ページ・前ページボタンでページ切り替えができる
- [ ] 特定ページ番号クリックでページ移動できる
- [ ] 最初/最終ページでボタンが適切に非活性になる

### P2 - Medium（デザイン詳細）

#### ページタイトル
- [ ] フォント: Manrope、サイズ32px、ウェイト600
- [ ] テキスト色: #002045
- [ ] 下マージン: 32px

#### フィルターパネル
- [ ] 背景色: #ffffff
- [ ] 角丸: 12px
- [ ] パディング: 16px
- [ ] 要素間ギャップ: 16px

#### 検索ボックス
- [ ] 背景色: #ffffff
- [ ] ボーダー色: rgba(85, 95, 113, 0.2)
- [ ] フォーカス時ボーダー色: #002045
- [ ] 角丸: 6px
- [ ] プレースホルダー: 「活動を検索...」

#### 活動履歴テーブル
- [ ] ヘッダー背景色: #f1f4f6
- [ ] 行ホバー背景色: rgba(0, 32, 69, 0.04)
- [ ] ボーダー: rgba(85, 95, 113, 0.15)
- [ ] セルパディング: 16px
- [ ] 角丸: 12px

#### 活動種別Chip
- [ ] 面談: 背景#d6e3ff、アイコンGroupsIcon (#002045)
- [ ] 電話: 背景#d6e0f6、アイコンCallIcon (#555f71)
- [ ] メール: 背景#9ff5c1、アイコンEmailIcon (#003f25)
- [ ] その他: 背景#e0e3e5、アイコンMoreHorizIcon (#74777f)

#### テーブルカラム
- [ ] 活動日時: 日本語フォーマット (YYYY年MM月DD日)
- [ ] 内容: 最大幅300px、超過時は省略記号表示

### P3 - Low（最適化）

#### レスポンシブデザイン
- [ ] 768px未満: フィルターパネル要素が縦並び
- [ ] 768px未満: 検索ボックス・フィルターが幅100%
- [ ] 768px未満: テーブルが横スクロール可能
- [ ] 480px未満: 内容カラム最大幅200px

#### アクセシビリティ
- [ ] テーブルヘッダーにaria-label設定
- [ ] ソート可能カラムにaria-sort設定
- [ ] ページネーションにaria-label設定
- [ ] キーボード操作でテーブル移動可能（Tab）
- [ ] キーボード操作でソート変更可能（Enter/Space）

## 🚀 実装優先順位

```
1. P0: 初期表示の残りTODO (3件)
   ├─ 初期ソート順
   ├─ 初期ページ番号
   └─ 空データメッセージ

2. P1: フィルター機能 (10件)
   └─ 活動種別フィルター実装

3. P1: 検索機能 (5件)
   └─ キーワード検索実装

4. P1: ソート機能 (7件)
   └─ カラムヘッダーソート実装

5. P1: ページネーション機能 (7件)
   └─ ページ切り替え実装

6. P2: デザインシステム適用 (50件)
   ├─ 色・タイポグラフィ調整
   ├─ トーナルレイヤリング
   └─ ゴーストボーダー

7. P3: レスポンシブ & a11y (28件)
   ├─ ブレークポイント対応
   └─ aria属性・キーボード操作
```

## 🔧 テスト実行コマンド

```bash
# すべてのテストを実行
npx vitest run tests/integration/frontend/page.test.tsx

# Activity History Pageのみ
npx vitest run tests/integration/frontend/page.test.tsx -t "ActivityHistoryPage"

# 特定セクションのみ（例: 初期表示）
npx vitest run tests/integration/frontend/page.test.tsx -t "ActivityHistoryPage 初期表示"

# ウォッチモード（開発時）
npx vitest watch tests/integration/frontend/page.test.tsx -t "ActivityHistoryPage"

# カバレッジ付き実行
npx vitest run tests/integration/frontend/page.test.tsx --coverage
```

## 📝 テスト実装例

### test.todoをtestに変換する例

```typescript
// Before (TODO)
test.todo("検索ボックスの背景色は#ffffff (white) である");

// After (実装)
test("検索ボックスの背景色は#ffffff (white) である", async () => {
    vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue([]);
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ActivityHistoryPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    await waitFor(() => {
        const searchBox = container.querySelector('input[placeholder="活動を検索..."]');
        expect(searchBox).toHaveStyle({ backgroundColor: '#ffffff' });
    });
});
```

### インタラクションテストの例

```typescript
test("活動種別フィルターで「面談」を選択すると面談のみが表示される", async () => {
    const mockActivities = [
        { id: "1", activityType: "面談", content: "面談1", activityDate: "2025-01-01", dealId: "D1", assigneeId: "A1" },
        { id: "2", activityType: "電話", content: "電話1", activityDate: "2025-01-02", dealId: "D2", assigneeId: "A2" },
    ];
    vi.mocked(activitiesUseCase.getActivitiesFromLocal).mockResolvedValue(mockActivities);
    
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ActivityHistoryPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    await waitFor(() => {
        expect(screen.getByText("活動履歴")).toBeInTheDocument();
    });
    
    // 活動種別フィルターを開く
    const filterSelect = screen.getByLabelText("活動種別");
    await userEvent.click(filterSelect);
    
    // 「面談」を選択
    const meetingOption = screen.getByText("面談");
    await userEvent.click(meetingOption);
    
    // 面談のみが表示され、電話は表示されない
    await waitFor(() => {
        expect(screen.getByText("面談1")).toBeInTheDocument();
        expect(screen.queryByText("電話1")).not.toBeInTheDocument();
    });
});
```

## 📚 関連ドキュメント

- **詳細仕様**: `ACTIVITY_HISTORY_TEST_SPEC.md`
- **デザインシステム**: `.stitch/DESIGN.md`
- **Stitch画面設計**: `STITCH_SCREENS_DESIGN.md`
- **テストファイル**: `tests/integration/frontend/page.test.tsx`
- **実装ファイル**: `src/frontend/page/ActivityHistoryPage.tsx`
- **コンポーネント**: `src/frontend/component/activity/ActivityHistory.tsx`

---

**最終更新**: 2025年
**総テストケース数**: 186件（実装済み: 10件、TODO: 176件）
