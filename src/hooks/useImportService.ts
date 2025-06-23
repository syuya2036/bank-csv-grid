// src/hooks/useImportService.ts
import { useCallback } from 'react';
import type { TransactionRow } from '@/types/transaction';
import { useTransactions } from '@/hooks/useTransactions';

/**
 * CSV インポート後の一括登録フック
 *
 * @param bank - 対象の銀行コード
 * @returns registerTransactions: (rows) => Promise<void>
 */
export function useImportService(bank: string) {
  // SWR の mutate 関数
  const { refresh } = useTransactions(bank);

  /**
   * 一括登録 & UI 再取得
   * @param rows - インポート済みの TransactionRow 配列
   */
  const registerTransactions = useCallback(
    async (rows: TransactionRow[]) => {
      if (rows.length === 0) return;
      // (1) API へ一括登録リクエスト
      await fetch('/api/transactions/bulk-register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(rows),
      });
      // (2) 成功したら最新データを取得（UI 再レンダリング）
      await refresh();
    },
    [bank, refresh]
  );

  return { registerTransactions };
}
