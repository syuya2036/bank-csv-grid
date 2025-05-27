// src/app/page.tsx
'use client';
import { useState }            from 'react';
import type { BankCode }       from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';
import FileImporter            from '@/components/FileImporter';
import TransactionGrid         from '@/components/TransactionGrid';
import ExportModal             from '@/components/ExportModal';

export default function Page() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [bank, setBank] = useState<BankCode>('gmo');
  return (
    <main className="p-6 space-y-4">
      <FileImporter
        bank={bank}
        onBankChange={setBank}
        onComplete={setRows}
      />
      <TransactionGrid rows={rows} onRowsChange={setRows} />
      <ExportModal bank={bank} rows={rows} />
    </main>
  );
}