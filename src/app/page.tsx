// src/app/page.tsx:1-120
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic             from 'next/dynamic';
import type { BankCode }   from '@/types/bank';
import FileImporter        from '@/components/FileImporter';
import ExportModal         from '@/components/ExportModal';
import TransactionGrid     from '@/components/TransactionGrid';
import { useTransactions } from '@/hooks/useTransactions';
import { useImportService } from '@/hooks/useImportService';

const DynamicTagMasterEditor = dynamic(
  async () => (await import('@/components/TagMasterEditor')).TagMasterEditor,
  { ssr: false }
);

export default function Page() {
  const [bank, setBank] = useState<BankCode>('gmo');
  const { rows, isLoading, refresh } = useTransactions(bank);
  const { registerTransactions }     = useImportService(bank);
  const [localRows, setLocalRows]    = useState(rows);
  const [isSaving, setIsSaving]      = useState(false);

  useEffect(() => {
    setLocalRows(rows.map(r => ({ ...r })));
  }, [rows]);

  const diff = useMemo(() => ({
    newRows:      localRows.filter(r => !r.isRegistered && r.tag),
    changedTags:  localRows.filter(r => {
      if (!r.isRegistered) return false;
      const original = rows.find(o => o.id === r.id);
      return original && original.tag !== r.tag;
    })
  }), [localRows, rows]);

  /* ----- 省略: handleBulkRegister 等は従来どおり ----- */

  return (
    <main className="p-6 space-y-4">
      {/* インポート／エクスポート */}
      <div className="flex items-center space-x-2">
        <FileImporter
          bank={bank}
          onBankChange={setBank}
          onComplete={registerTransactions}
        />
        <ExportModal bank={bank} />
      </div>

      {isLoading && <p>読み込み中…</p>}

      {/* 内部勘定マスター */}
      <section>
        <DynamicTagMasterEditor />
      </section>

      {/* グリッド */}
      <TransactionGrid
        rows={localRows}
        onRowsChange={setLocalRows}
      />

      {/* 一括反映ボタン（既存） */}
      {/* ... */}
    </main>
  );
}
