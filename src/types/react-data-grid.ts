// src/types/react-data-grid.ts
import type { TransactionRow } from '@/types/transaction';

export interface EditorProps<T = any> {
  row: T;
  rowIdx: number;                      // 追加
  column: {
    key: keyof T;
    name: string;
  };
  onRowChange: (row: T, commit?: boolean) => void;
  onClose: () => void;
}

export interface FormatterProps<T = any> {
  row: T;
  column: {
    key: keyof T;
    name: string;
  };
}
