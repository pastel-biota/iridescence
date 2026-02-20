---
name: review
description: |
  コードレビューを実行します
---

# Code Review

コードレビューを実行します。指定された diff を要約・リスク分析した上で、複数の観点から並列でレビューし、結果を統合して報告します。

## 使い方

```
/review <diff-spec>
```

例: `/review main...topic`, `/review HEAD~3`

## 実行手順

### Phase 1: Diff の取得と要約

1. **diff の取得**: 引数 `$ARGUMENTS` を使って `git diff` を実行し、変更内容を取得してください。
   - 引数が空の場合は、ステージングされていない変更 (`git diff`) を対象にしてください。

2. **プロジェクト固有ルールの確認**: `.claude/review-rules.md` が存在する場合は読み込んでください。このルールは各レビュー観点に追加で適用されます。

3. **diff の要約とリスク分析**: `diff-summarizer` エージェントを呼び出し、diff を要約してください。

   ```
   subagent_type: "diff-summarizer"
   prompt: |
     以下の diff を分析し、ファイルごとの要約とリスクシグナルを JSON 形式で出力してください。

     ## Diff
     (diff の内容)
   ```

   このエージェントは以下の情報を返します:
   - 各ファイルの変更要約
   - リスクシグナル（AUTH, SECURITY, INPUT, OPERATOR など）
   - `needs_detailed_review`: 詳細レビューが必要かどうか
   - `diff_excerpt`: リスクがある部分の diff 抜粋

### Phase 2: 並列レビューの実行

4. **レビュー用コンテキストの構築**: 各 review agent に渡す内容を構築します。

   **渡す内容**:
   - `overall_summary`: 変更全体の概要
   - `needs_detailed_review: true` のファイル → 要約 + `diff_excerpt`（または原文 diff）
   - `needs_detailed_review: false` のファイル → 要約のみ

5. **並列レビューの実行**: 以下の 4 つのエージェントを **Task ツールで並列実行** してください。
   - `review-security` (セキュリティ観点)
   - `review-performance` (パフォーマンス観点)
   - `review-a11y` (アクセシビリティ観点)
   - `review-quality` (コード品質観点)

   Task ツールの呼び出し例:

   ````
   subagent_type: "review-security"
   prompt: |
     以下の変更をセキュリティ観点でレビューしてください。

     ## プロジェクト固有ルール
     (あれば記載)

     ## 変更の概要
     (overall_summary)

     ## 詳細レビュー対象（リスクシグナルあり）

     ### src/auth/login.ts
     **要約**: ログイン時のパスワード検証ロジックを変更
     **リスクシグナル**: AUTH, SECURITY

     ```diff
     (diff_excerpt または該当ファイルの diff 原文)
   ````

   ## その他の変更（要約のみ）

   ### src/components/Button.tsx

   **要約**: ボタンの背景色を変更

   ```

   ```

### Phase 3: 結果の統合

6. **結果の統合**: 各エージェントからの結果を以下のフォーマットで統合して出力してください。

## 出力フォーマット

```markdown
# レビュー結果

## 変更の概要

(diff-summarizer からの overall_summary)

**リスクシグナル検知**: (検知されたシグナルのリスト、またはなし)

---

## セキュリティ

(review-security の結果)

## パフォーマンス

(review-performance の結果)

## アクセシビリティ

(review-a11y の結果)

## コード品質

(review-quality の結果)

---

レビュー対象: `<diff-spec>`
詳細レビュー対象ファイル数: X / Y
```

各指摘は以下の形式で記述されます:

```
[観点] <発生している問題>
<それが問題である理由>
<修正策>
<根本的な修正も考えられる場合は、その内容>
```

指摘がない観点については「指摘事項はありません」と記載してください。
