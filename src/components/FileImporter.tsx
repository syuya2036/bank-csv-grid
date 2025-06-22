'use client';
import { useState } from 'react';
import type { BankCode } from '@/types/bank';
import { useCsvParse } from '@/hooks/useCsvParse';
import { TransactionRow } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Props {
    bank: BankCode;
    onBankChange(v: BankCode): void;
    onComplete(rows: TransactionRow[]): void;
  }
  
  export default function FileImporter({ bank, onBankChange, onComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const { parseCsv, progress } = useCsvParse();

  const handleImport = async () => {
    if (!file) return;
    const rows = await parseCsv(file, bank);
    onComplete(rows);
  };

  return (
    <div className="space-y-2 p-4 border rounded-xl">
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <select
        value={bank}
        onChange={e => onBankChange(e.target.value as BankCode)}
        className="border p-2 rounded"
      >
        <option value="paypay">PayPay</option>
        <option value="gmo">GMO あおぞら</option>
        <option value="sbi">住信 SBI</option>
        <option value="mizuhoebiz">みずほ e Biz</option>
        <option value="mizuhobizweb">みずほ Biz Web</option> 
      </select>
      <Button onClick={handleImport} disabled={!file}>Import</Button>
      {progress > 0 && <Progress value={progress} />}
    </div>
  );
}
