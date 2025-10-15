// useTagTree.ts
import type { TagType } from '@/types/tag';
import useSWR from 'swr';

export type TagNode = {
	id: string;
	name: string;
	active: boolean;
	order: number;
	children: TagNode[];
	type?: TagType;
};

const fetcher = (url: string) => fetch(url).then(res => {
	if (!res.ok) throw new Error(res.statusText);
	return res.json();
});

export function useTagTree({ excludeKPI = false }: { excludeKPI?: boolean } = {}) {
	const url = excludeKPI ? '/api/tags?excludeKPI=1' : '/api/tags';
	const { data, error, isLoading, mutate } = useSWR<TagNode[]>(url, fetcher);
	return { tree: data ?? [], isLoading, isError: !!error, mutate };
}
