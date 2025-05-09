import { useState } from 'react';
import Papa from 'papaparse';
import { registry } from '@/converters';
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

export function useCsvParse() {
  const [progress, setProgress] = useState(0);

  async function parseCsv(file: File, bank: BankCode) {
    /** ------------ ★ 文字エンコーディングを SJIS → UTF-8 変換 ----------- */
    const buffer = await file.arrayBuffer();
    const csvText = new TextDecoder('shift-jis').decode(buffer);

    return new Promise<TransactionRow[]>((resolve, reject) => {
      const rows: TransactionRow[] = [];
      const temp: Record<string, string>[] = [];

      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        transformHeader: h =>
          h
            .trim()            // 前後の空白・\t を除去
            .replace(/\uFEFF/g, '') // BOM 対応
            .replace(/^日付$/, '取引日'),  // 別名 → 正名
            //.replace(/^摘要$/, '内容'),    // 〃
        skipEmptyLines: true,
        worker: false,
        step: (row, parser) => {
          temp.push(row.data as Record<string, string>);
        },
        complete: () => {
          const convert = registry[bank];
          const rows = temp.flatMap(r => {
            try   { return [convert(r)] }
            catch { console.warn('Skip row', r); return [] }
          });
          resolve( rows );
        },
        error: reject
      });
    });
  }

  return { parseCsv, progress };
}
