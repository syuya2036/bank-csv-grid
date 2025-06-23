// src/hooks/useTransactions.ts
import useSWR from 'swr';
import type { TransactionRow } from '@/types/transaction';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export function useTransactions(bank: string) {
  const { data, error, mutate } = useSWR<TransactionRow[]>(
    ['/api/transactions?bank=', bank].join(''),
    fetcher
  );
  return {
    rows:      data ?? [],
    isLoading: !error && !data,
    isError:   !!error,
    refresh:   () => mutate(),
  };
}
