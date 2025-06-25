// src/hooks/useTagOptions.ts
import { TAG_OPTIONS, UNASSIGNED_TAG } from '@/constants/tags';

export function useTagOptions() {
  return TAG_OPTIONS.map((name) => ({
    value: name,
    label: name === UNASSIGNED_TAG ? '（未割当）' : name,
  }));
}
