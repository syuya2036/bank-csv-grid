'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { aggregateStatement, formatStatement, toTxInput, type TxInput, type StatementLine } from '@/utils/aggregateStatement';
import type { TransactionRow } from '@/types/transaction';

export default function AggregatePanel() {
  const [lines, setLines] = useState<StatementLine[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAggregate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transactions/all');
      if (!res.ok) throw new Error(`failed: ${res.status}`);
      const data: TransactionRow[] = await res.json();
      const txs: TxInput[] = data.map(toTxInput);
      const aggregated = aggregateStatement(txs);
      setLines(aggregated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatted = lines ? formatStatement(lines) : [];

  return (
    <section className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">全銀行データの集計</CardTitle>
          <Button onClick={handleAggregate} disabled={loading} variant="default">
            {loading ? '集計中…' : '集計'}
          </Button>
        </CardHeader>
      </Card>

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-red-600">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {lines && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">集計結果</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {formatted.map((s, i) => (
                <li key={i} className="font-mono whitespace-pre">{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

