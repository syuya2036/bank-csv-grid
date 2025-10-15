/** @jest-environment node */
import { GET as getTags, POST as postTag } from '@/app/api/tags/route';
import { checkTagShape, resetDb } from './helpers';

function resToJson(res: Response) { return res.json(); }

describe('GET /api/tags', () => {
	beforeAll(async () => {
		await resetDb();
		// seed a few tags
		await postTag({ json: async () => ({ name: 'RootA', type: 'SUBJECT' }) } as any);
		await postTag({ json: async () => ({ name: 'RootB', type: 'SUBJECT' }) } as any);
		await postTag({ json: async () => ({ name: '顧客数', type: 'KPI' }) } as any);
	});

	it('returns 200 and array of tags', async () => {
		const res = await getTags({ url: 'http://localhost/api/tags' } as any);
		expect(res.status).toBe(200);
		const data = await resToJson(res as any);
		expect(Array.isArray(data)).toBe(true);
		if (data.length > 0) checkTagShape(data[0]);
	});

	it('excludes KPI when excludeKPI=1', async () => {
		const res = await getTags({ url: 'http://localhost/api/tags?excludeKPI=1' } as any);
		expect(res.status).toBe(200);
		const data = await resToJson(res as any);
		const flat: any[] = flatten(data);
		expect(flat.some(n => n.name === '顧客数')).toBe(false);
	});
});

function flatten(nodes: any[], acc: any[] = []) {
	for (const n of nodes) {
		acc.push(n);
		if (n.children?.length) flatten(n.children, acc);
	}
	return acc;
}
