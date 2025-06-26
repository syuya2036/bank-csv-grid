// src/hooks/useTransactions.ts
import useSWR from 'swr';
import type { TransactionRow } from '@/types/transaction';
import { useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export function useTransactions(bank: string) {
  const { data, error, mutate } = useSWR<TransactionRow[]>(
    ['/api/transactions?bank=', bank].join(''),
    fetcher
  );
  // same-reference 配列を返す
  const rows = useMemo<TransactionRow[]>(() => data ?? [], [data]);
  return {
    rows,
    isLoading: !error && !data,
    isError:   !!error,
    refresh:   () => mutate(),
  };
}
