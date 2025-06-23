// src/hooks/useTagOptions.ts
/**
 * 固定タグの選択肢を返すフック
 */
export function useTagOptions() {
  return [
    { value: '',    label: '-- タグなし --' },
    { value: '食費', label: '食費' },
    { value: '交通費', label: '交通費' },
    { value: '交際費', label: '交際費' },
    { value: 'その他', label: 'その他' },
  ] as { value: string; label: string }[];
}
