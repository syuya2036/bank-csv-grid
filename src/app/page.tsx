'use client';
import { useState } from 'react';
import type { BankCode } from '@/types/bank';
import FileImporter from '@/components/FileImporter';
import TransactionGrid from '@/components/TransactionGrid';
import ExportModal from '@/components/ExportModal';
import { useTransactions } from '@/hooks/useTransactions';
import { useImportService } from '@/hooks/useImportService';
import { TagMasterEditor } from '@/components/TagMasterEditor';

export default function Page() {
  const [bank, setBank] = useState<BankCode>('gmo');
  const { rows, isLoading, refresh } = useTransactions(bank);
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

      <section style={{ margin: '24px 0' }}>
        <TagMasterEditor />
      </section>
      <TransactionGrid
        rows={rows}
        onRowsChange={nextRows => {
          // 必ず参照が変わる操作をする。SWRの場合はrefreshで再取得。
          refresh(); // or mutate()
        }}
      />
    </main>
  );
}
