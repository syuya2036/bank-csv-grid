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
    const csv = toCsv(bank, rows, {
      headers: ['取引日', '内容', '入金', '出金', '残高', 'メモ']
    });
    /* Excel が UTF-8 を正しく判定できるよう BOM を付与 */
    const bomCsv = '\uFEFF' + csv;
    const blob = new Blob([bomCsv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${bank}-edited.csv`;
    a.click();
  };
  return <Button onClick={handleExport}>Export CSV</Button>;
}
