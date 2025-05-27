// NEW FILE
import { z }                   from 'zod';
import { nanoid }              from 'nanoid';
import type { BankCode }       from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';
import { parseYen }            from '@/utils/parseYen';
import { normalizeDate }       from '@/utils/normalizeDate';

/** この converter の銀行コード */
export const BANK_CODE = 'mizuho-ebiz' satisfies BankCode;

/** みずほ e-Biz ヘッダー after transformHeader */
/** みずほ e-Biz オリジナル → 共通キーへの変換表 */
const HEADER_MAP: Record<string, keyof StandardRow> = {
      '日付'    : '取引日',
      '摘要'    : '内容',
      '受取金額': '入金',
      '支払金額': '出金',
      // '残高' と 'メモ' は一致しているのでそのまま
    };
    
    /** 元 Row のキーを標準キーに変換するユーティリティ */
    const normalizeKeys = (raw: Record<string, string>) => {
      const result: Record<string, string> = {};
      Object.entries(raw).forEach(([k, v]) => {
        const std = HEADER_MAP[k] ?? k;
        result[std] = v;
      });
      return result;
    };
    
    type StandardRow = {
      取引日: string; 内容: string; 入金?: string; 出金?: string; 残高?: string; メモ?: string;
    };
    
    const RawSchema = z.object({
      取引日: z.string(),
      内容 : z.string(),
      入金 : z.string().optional().default(''),
      出金 : z.string().optional().default(''),
      残高 : z.string().optional().default(''),
      メモ : z.string().optional().default(''),
    });

export function convertMizuhoEbiz(raw: unknown): TransactionRow {
  const r = RawSchema.parse(normalizeKeys(raw as Record<string,string>));
  return {
    id      : nanoid(),
    bank    : BANK_CODE,
    date    : normalizeDate(r.取引日),
    description : r.内容,
    credit  : parseYen(r.入金),
    debit   : parseYen(r.出金),
    balance : parseYen(r.残高) || undefined,
    memo    : r.メモ || undefined,
  };
}
