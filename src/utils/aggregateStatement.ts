export type StatementLine = {
	tag: string | null | undefined;
	side: "出金" | "入金";
	amount: number;
	aggregated: boolean;   // true: 集計行, false: 元明細の写し
	index?: number;        // aggregated=false のとき、元配列の位置（原順維持に利用）
};

export type TxInput = {
	tag?: string | null;
	debit?: number | null;
	credit?: number | null;
};

/**
 * 仕様:
 * - タグあり: (タグ×側) で合算。タグ出現順を保持。各タグの中では 出金→入金 の順。
 * - タグなし(null/undefined/''/'notag'): 合算しない。全タグ集計後の末尾に原順で並べる。
 * - 0/未指定は無視。debitとcreditが両方>0なら両方に加算。
 */
export function aggregateStatement(txs: TxInput[]): StatementLine[] {
	// 実装はこのあとでOK（TDD）
	throw new Error("not implemented");
}

export function formatStatement(lines: StatementLine[]): string[] {
	// 実装はこのあとでOK。 e.g., `${tag ?? ""}, ${side}, ${amount}円`
	throw new Error("not implemented");
}
