# Tasks: 月次予測（KPI連動）機能

## Phase 1: Setup

- [ ] T001 Create docs directory structure for artifacts at specs/003-speckit-specify-n/
- [ ] T002 Add HyperFormula to dependencies in package.json
- [ ] T003 Ensure PostgreSQL DATABASE_URL is set in environment (.env.local)

## Phase 2: Foundational

- [ ] T004 Add Tag.type enum (SUBJECT|KPI) to prisma/schema.prisma
- [ ] T005 Create Prisma model MonthlyMetric in prisma/schema.prisma
- [ ] T006 Generate and run migration (pnpm prisma migrate dev)
- [ ] T007 Seed example KPI/Subject tags update in prisma/seed.ts
- [ ] T008 Update src/types/tag.ts with TagType enum and structures

## Phase 3: [US1] 月次予測列でKPIを編集し予測を得る (P1)

- [ ] T009 [US1] Add forecast GET handler at src/app/api/forecast/route.ts
- [ ] T010 [US1] Add forecast PUT handler (validate cycles) at src/app/api/forecast/route.ts
- [ ] T011 [US1] Implement server service for MonthlyMetric CRUD at src/lib/metrics.ts
- [ ] T012 [US1] Create HyperFormula bridge utils at src/utils/hf.ts
- [ ] T013 [US1] Extend report grid to render monthly forecast columns at src/utils/reportGrid.tsx
- [ ] T014 [US1] Make KPI cells editable and wire to HyperFormula at src/components/TransactionGrid.tsx
- [ ] T015 [US1] Persist KPI/forecast (value/formula) on edit at src/hooks/useExportService.ts or new hook
- [ ] T016 [US1] Disable edit on actual cells at src/components/TransactionGrid.tsx
- [ ] T017 [US1] Add integration test for forecast API at tests/integration/tagging-report.test.ts

## Phase 4: [US2] タグ定義でKPI/科目を切替 (P1)

- [ ] T018 [US2] Add select to switch Tag type in src/components/TagMasterEditor.tsx
- [ ] T019 [US2] Colorize KPI tags in tree in src/hooks/useTagTree.ts
- [ ] T020 [US2] Hide KPI from assignment UI in src/components/TagSelectEditor.tsx
- [ ] T021 [US2] Contract test for tags API reflecting type at tests/contract/tags.get.test.ts

## Phase 5: [US3] 実績セルは参照専用 (P2)

- [ ] T022 [US3] Enforce read-only on actual cells in src/utils/columns.tsx
- [ ] T023 [US3] Block paste/delete on actual cells in src/components/TransactionGrid.tsx

## Final Phase: Polish & Cross-Cutting

- [ ] T024 Add error banners and formula error highlighting in src/components/TransactionGrid.tsx
- [ ] T025 Add undo/redo support for KPI cells in src/components/TransactionGrid.tsx
- [ ] T026 Document quickstart updates in specs/003-speckit-specify-n/quickstart.md

## Dependencies
- US1 → US2 independent（UI分離）。US3はUS1のグリッド拡張に依存。

## Parallel Execution Examples
- T004/T005/T008は並行可能（異なるファイル）。
- T009とT011は一部並行可能（契約に沿った実装）

## Implementation Strategy
- MVPはUS1のKPIセル編集→予測再計算→保存まで。US2/US3/Polishは後続。
