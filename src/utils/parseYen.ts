/**
 * 金額文字列を数値に変換します。
 * - カンマ, 通貨記号(¥,￥), 空白を除去
 * - 負の値は先頭に '-' または '(…)’ で囲まれている形式に対応
 * @param raw 例："¥1,234"、"(1,234)"、"- 1,234"、undefined
 * @returns 変換された数値、空文字・非数値は 0
 */
export function parseYen(raw?: string): number {
  if (!raw) return 0;
  const s = raw
    .trim()
    .replace(/[\s¥￥,]/g, '')     // 空白・通貨記号・カンマを一掃
    .replace(/^\((.*)\)$/, '-$1'); // (123) → -123
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}