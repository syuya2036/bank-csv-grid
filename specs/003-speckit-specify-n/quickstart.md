# Quickstart: 月次予測（KPI連動）機能

## 前提
- Node.js / pnpm
- PostgreSQL（`DATABASE_URL` 設定）

## セットアップ
```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

## 開発手順（概要）
1. Prismaに`Tag.type`と`MonthlyMetric`を追加し、マイグレーション。
2. API
   - GET `/api/forecast?ym=YYYY-MM[&tagIds=,]`
   - PUT `/api/forecast`（式/値の保存）
3. UI
   - 月次集計グリッドに予測列を追加
   - KPIセル編集をHyperFormulaで評価 → 再計算
   - 実績セルは編集不可
4. 保存
   - KPI/予測は`MonthlyMetric`に保存（値/式）

## テスト
```bash
pnpm test
```
- 契約テスト: `tests/contract/*`
- 予測計算の単体テストを追加
