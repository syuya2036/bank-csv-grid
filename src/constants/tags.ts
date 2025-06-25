/** 「未割当」を表す内部コード */
export const UNASSIGNED_TAG = '__UNASSIGNED__';

export const TAG_OPTIONS = [
  UNASSIGNED_TAG,
  '食費',
  '交通費',
  '交際費',
  'その他',
] as const;
