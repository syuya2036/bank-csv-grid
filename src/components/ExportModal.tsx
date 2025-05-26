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
     // 行データは 8 列 (id,bank,…)。ヘッダーも 8 列に揃える
     const csv = toCsv(bank, rows, {
      headers: ['ID','銀行','取引日','内容','入金','出金','残高','メモ']
    });
    const bomCsv = '\uFEFF' + csv;   // Excel 用 BOM
    const blob = new Blob([bomCsv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${bank}-edited.csv`;
    a.click();
  };
  return <Button onClick={handleExport}>Export CSV</Button>;
}
