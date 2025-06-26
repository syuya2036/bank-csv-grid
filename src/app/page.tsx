'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { BankCode } from '@/types/bank';
import FileImporter from '@/components/FileImporter';
import ExportModal from '@/components/ExportModal';
import TransactionGrid from '@/components/TransactionGrid';
import { useTransactions } from '@/hooks/useTransactions';
import { useImportService } from '@/hooks/useImportService';

// TagMasterEditor をクライアントサイドのみで読み込む（型パラメータ省略）
const DynamicTagMasterEditor = dynamic(
  async () => {
    const mod = await import('@/components/TagMasterEditor');
    return mod.TagMasterEditor;
  },
  { ssr: false }
);

export default function Page() {
  const [bank, setBank] = useState<BankCode>('gmo');
  const { rows, isLoading, refresh } = useTransactions(bank);
  const [localRows, setLocalRows] = useState(rows);
  useEffect(() => {
  // 参照が違うときだけ更新
  if (rows !== localRows) setLocalRows(rows);
  }, [rows, localRows]);


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

      <section>
        <DynamicTagMasterEditor />
      </section>

      <TransactionGrid
        rows={localRows}
        onRowsChange={async (updated) => {
          setLocalRows(updated);           // ① 即座に UI へ
          const diff = updated.filter((r, i) => r.tag !== rows[i]?.tag);
          await Promise.all(
            diff.map(r =>
              fetch(`/api/transactions/${r.id}`, {
                method : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body   : JSON.stringify({ tag: r.tag }),
              })
            )
          );
          refresh();                       // ② サーバー確定後に再取得
        }}
      />

    </main>
  );
}
