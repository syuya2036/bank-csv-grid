# Data Model: 月次予測（KPI連動）機能

## Entities

### Tag
- id: string (uuid)
- name: string
- parentId: string | null
- type: enum('SUBJECT','KPI')  ← 追加
- order: number
- active: boolean
- children: Tag[]

### MonthlyMetric
- id: string (cuid)
- tagId: string (FK → Tag)
- yearMonth: string (YYYY-MM)
- kind: enum('ACTUAL','FORECAST','KPI')
- value: number | null
- formula: string | null  （HyperFormula互換の式。KPI/FORECASTで使用）
- error: string | null
- updatedAt: Date

### ForecastDefinition（論理）
- subjectTagId: string
- formula: string （KPIタグ参照のみ/同月内）

## Relationships
- Tag (1) — (N) MonthlyMetric
- Subject Tag may have children KPI Tags; such Subject is treated as leaf for assignment eligibility.

## Validation Rules
- KPIタグは葉であること（子にKPI以外が存在しない）。
- MonthlyMetric(kind='KPI'|'FORECAST') の式は循環参照を含まない。
- 参照は同一yearMonthに限定（研究方針）。
- 実績(ACTUAL)は編集不可、保存は集計処理のみ。

## Migrations (Prisma)
- `Tag` に `type` を追加（enum: SUBJECT, KPI）。
- 新規テーブル `MonthlyMetric` を追加。
