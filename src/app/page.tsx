// --- src/app/page.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { BankCode } from '@/types/bank';
import FileImporter from '@/components/FileImporter';
import ExportModal from '@/components/ExportModal';
import TransactionGrid from '@/components/TransactionGrid';
import { useTransactions } from '@/hooks/useTransactions';
import { useImportService } from '@/hooks/useImportService';

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

  // rowsがサーバから変わった時のみlocalRowsをリセット
    useEffect(() => {
      setLocalRows(rows.map(row => ({ ...row })));
    }, [rows]);


  const { registerTransactions } = useImportService(bank);

  // ■ 一括反映ロジック
  const [isSaving, setIsSaving] = useState(false);
  const handleBulkRegister = async () => {
    const toRegister = localRows.filter(r => !r.isRegistered && r.tag);
    if (!toRegister.length) return;
    setIsSaving(true);
    const res = await fetch('/api/transactions/bulk-register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRegister),
    });
    if (res.ok) {
      await refresh();
    } else {
      console.error(await res.text());
    }
    setIsSaving(false);
  };

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

      {/* グリッド */}
      // onRowsChangeの直前にlogを仕込むことで、参照の変化・中身の違いを確認
      <TransactionGrid
        rows={localRows}
        onRowsChange={(updated) => {
          console.log('updated rows', updated);
          // shallow copyの場合はlocalRows[0] === updated[0]がtrueになるので比較
          console.log('row[0] identity eq?', localRows[0] === updated[0]);
          setLocalRows(updated.map(row => ({ ...row })));
        }}
      />



      {/* 一括反映ボタン */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleBulkRegister}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          内部勘定反映
        </button>
      </div>
    </main>
  );
}
