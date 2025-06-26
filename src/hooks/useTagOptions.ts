// useTagOptions.ts
import { UNASSIGNED_TAG } from '@/constants/tags';
import { useTags } from '@/hooks/useTags';

export function useTagOptions() {
  const { tags = [] } = useTags();
  return [
    { value: UNASSIGNED_TAG, label: '（未割当）' },
    ...tags.map(t => ({ value: t.name, label: t.name })),
  ];
}
