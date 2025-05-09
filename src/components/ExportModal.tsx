// src/components/ExportModal.tsx
'use client';
import { Button } from '@/components/ui/button';


import { toCsv } from '@/utils/exporter';
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

interface Props { bank: BankCode; rows: TransactionRow[] }

export default function ExportModal({ bank, rows }: Props) {
  const handleExport = () => {
    const csv = toCsv(bank, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${bank}-edited.csv`;
    a.click();
  };
  return <Button onClick={handleExport}>Export CSV</Button>;
}