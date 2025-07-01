// --- src/app/page.tsx ---
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  /* rows がサーバから変わった時のみ localRows をリセット */
  useEffect(() => {
    setLocalRows(rows.map(r => ({ ...r })));
  }, [rows]);

  /* 未登録かつタグ割当済みの行（＝反映対象） */
  const dirtyRows = useMemo(
    () => localRows.filter(r => !r.isRegistered && r.tag),
    [localRows]
  );

  const { registerTransactions } = useImportService(bank);

  // ■ 一括反映ロジック
    const [isSaving, setIsSaving] = useState(false);

  /** 画面 ↔ サーバ間の差分を抽出 */
  const diff = useMemo(() => ({
    newRows:      localRows.filter(r => !r.isRegistered && r.tag),
    changedTags:  localRows.filter(r => {
      if (!r.isRegistered) return false;
      const original = rows.find(o => o.id === r.id);
      return original && original.tag !== r.tag;
    })
  }), [localRows, rows]);

  /** 一括反映ボタンのハンドラ */
  const handleBulkRegister = async () => {
    if (!diff.newRows.length && !diff.changedTags.length) return;
    setIsSaving(true);

    try {
      // 1) 新規行の登録
      if (diff.newRows.length) {
        await fetch('/api/transactions/bulk-register', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(diff.newRows),
        });
      }
      // 2) 既存行タグの更新
      if (diff.changedTags.length) {
        await fetch('/api/transactions/bulk-tag', {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(
            diff.changedTags.map(r => ({ id: r.id, tag: r.tag }))
          ),
        });
      }

      // 3) ローカルで isRegistered を立てる
      const newIds = diff.newRows.map(r => r.id);
      setLocalRows(prev =>
        prev.map(r =>
          newIds.includes(r.id) ? { ...r, isRegistered: true } : r
        )
      );

      // 4) サーバ再取得で完全同期
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
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
      <TransactionGrid
        rows={localRows}
        onRowsChange={(updated) => {
          // shallow-copy 判定デバッグ
          console.log('row[0] identity eq?', localRows[0] === updated[0]);
          setLocalRows(updated.map(row => ({ ...row })));
        }}
      />

      {/* 一括反映ボタン */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleBulkRegister}
          disabled={
            isSaving ||
            (!diff.newRows.length && !diff.changedTags.length)
          }

          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          内部勘定反映
        </button>
      </div>
    </main>
  );
}
