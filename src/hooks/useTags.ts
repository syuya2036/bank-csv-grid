// File: src/hooks/useTags.ts

import useSWR, { mutate } from 'swr';
import { Tag } from '@/types/tag';

const TAGS_API = '/api/tags';

// GET
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

// カスタムフック
export function useTags() {
  const { data, error, isLoading } = useSWR<Tag[]>(TAGS_API, fetcher);

  // タグ追加
  const addTag = async (name: string) => {
    const res = await fetch(TAGS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to add tag');
    await mutate(TAGS_API);
    return res.json();
  };

  // タグ編集
  const editTag = async (id: string, name: string) => {   // ← id 型を string
    const res = await fetch(TAGS_API, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    if (!res.ok) throw new Error('Failed to edit tag');
    await mutate(TAGS_API);
    return res.json();
  };
    // タグ削除
   const deleteTag = async (id: string) => {
    const res = await fetch(`${TAGS_API}?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete tag');
    await mutate(TAGS_API);
  };

  return {
    tags: data,
    isLoading,
    isError: !!error,
    addTag,
    editTag,
    deleteTag,
    mutateTags: () => mutate(TAGS_API),
  };
}
