/**
 * 生文字列を "YYYY/M/D" 形式に正規化します。
 * - "YYYYMMDD", "YYYY-MM-DD", "YYYY.MM.DD", "MM/DD/YYYY" 等をサポート
 * - 時刻付き "YYYYMMDD hh:mm:ss" も日付部分のみ取り出す
 */
export function normalizeDate(raw: string): string {
  const s0 = raw.trim();
  if (!s0) return '';

  // 時刻部分を除去 (スペース以降)
  const s1 = s0.split(/\s+/)[0];

  // YYYYMMDD
  const onlyNum = s1.replace(/[./-]/g, '');
  if (/^\d{8}$/.test(onlyNum)) {
    const y = onlyNum.slice(0, 4);
    const m = String(parseInt(onlyNum.slice(4, 6), 10));
    const d = String(parseInt(onlyNum.slice(6, 8), 10));
    return `${y}/${m}/${d}`;
  }

  // MM/DD/YYYY → YYYY/M/D
  const mdy = s1.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const [, mm, dd, yyyy] = mdy;
    return `${yyyy}/${parseInt(mm, 10)}/${parseInt(dd, 10)}`;
  }

  // その他は区切り文字を / に統一
  return s1.replace(/[.\-]/g, '/');
}
