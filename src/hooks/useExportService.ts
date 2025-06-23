// src/hooks/useExportService.ts
import type { BankCode } from '@/types/bank';
import { useTransactions } from './useTransactions';

export function useExportService(bank: BankCode) {
  const { rows, refresh } = useTransactions(bank);

  const registerAndDownload = async () => {
    // (1) DB 登録
    await fetch('/api/transactions/bulk-register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(rows),
    });
    // (2) CSV 取得
    const res     = await fetch(`/api/export?bank=${bank}`);
    const csvBlob = await res.blob();
    // (3) BOM付きでダウンロード
    const bom  = new Uint8Array([0xEF,0xBB,0xBF]);
    const blob = new Blob([bom, csvBlob], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${bank}-export.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    // (4) 再フェッチ
    refresh();
  };

  return { registerAndDownload };
}
