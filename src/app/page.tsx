// src/app/page.tsx
'use client';
import { useState } from 'react';
import type { BankCode } from '@/types/bank';
import FileImporter from '@/components/FileImporter';
import TransactionGrid from '@/components/TransactionGrid';
import ExportModal from '@/components/ExportModal';
import { useTransactions } from '@/hooks/useTransactions';
import { useImportService } from '@/hooks/useImportService';

export default function Page() {
  const [bank, setBank] = useState<BankCode>('gmo');
  const { rows, isLoading, refresh } = useTransactions(bank);
  // 正しく useImportService フックを呼び出し
  const { registerTransactions } = useImportService(bank);

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <FileImporter
          bank={bank}
          onBankChange={setBank}
          onComplete={registerTransactions}
        />
        <ExportModal bank={bank} />
      </div>
      {isLoading && <p>読み込み中…</p>}
      <TransactionGrid
        rows={rows}
        onRowsChange={() => {
          /* renderEditCell の onRowChangeで即 DB or SWR mutate */
        }}
      />
    </main>
  );
}
