// src/components/ExportModal.tsx
'use client';
import { Button } from '@/components/ui/button';
import { toCsv } from '@/utils/exporter';
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

interface Props {
  bank: BankCode;
  rows: TransactionRow[];
}

export default function ExportModal({ bank, rows }: Props) {
    const handleExport = () => {
      if (rows.length === 0) return;
      const csv = toCsv(bank, rows, {
        // 6 列ヘッダーなら `exporter.ts` が自動で id/bank を除外
        headers: ['取引日','内容','入金','出金','残高','メモ']
      });
    const bomCsv = '\uFEFF' + csv;   // Excel 用 BOM
    const blob = new Blob([bomCsv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${bank}-edited.csv`;
    a.click();
  };
  return (
        <Button onClick={handleExport} disabled={rows.length === 0}>
          Export CSV
        </Button>
      );
}
