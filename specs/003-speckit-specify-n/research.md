# Research: 月次予測（KPI連動）機能

## Unknowns to Resolve

- 式サポート範囲：四則演算・括弧以外（SUM/AVERAGE等）の関数サポート有無（NEEDS CLARIFICATION）
- 参照スコープ：同一月内のみか、他月参照を許すか（NEEDS CLARIFICATION）
- 保存形式：KPI/予測セルの式と値の保存スキーマ詳細（NEEDS CLARIFICATION）
- 既存のタグAPI/DB拡張の影響範囲（NEEDS CLARIFICATION）

## Decisions & Rationale

### Decision: HyperFormula採用し、react-data-gridと連携
- Rationale: 循環検出、依存再計算、Excel互換の式評価が必要。導入実績とAPIが安定。
- Alternatives considered: handsontable内蔵計算, 独自実装, formula.js → 依存管理/循環検出/性能観点で不採用。

### Decision: 参照スコープは同一月内に限定しない
- Rationale: 月跨ぎ参照が必要なユースケースがあるかもしれない。
- Alternatives: 月跨ぎ参照, 年次参照 → ユースケース未確定。

### Decision: 最小式セット（+,-,*,/,括弧）で開始
- Rationale: UXのわかりやすさと実装容易性。SUM等は将来検討する。
- Alternatives: 関数群を初期から開放 → テスト/サポートコスト増。

### Decision: KPIはタグ×月で式と値を保存
- Rationale: 再現性（SC-004）と即時再計算の両立。
- Alternatives: 値のみ保存 → 参照解決できず再現性低下。

## Best Practices & Patterns

- HyperFormula: 一意のシートID、依存グラフ、batching再計算でUIスレッド負荷を抑制。
- react-data-grid: 編集ハンドラで入力を正規化し、外部ストア（zustand）でセル状態管理。
- Undo/Redo: 操作履歴をzustandのimmerミドルウェアで管理、保存はスナップショットではなく差分。

## Open Items (to confirm with stakeholders)

- 関数拡張の優先度（SUM/AVERAGE/MIN/MAX）
- KPI/予測の保存先テーブルの命名と外部キー方針
