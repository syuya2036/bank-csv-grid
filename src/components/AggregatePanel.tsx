"use client";

import BankSelect from "@/components/BankSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";

type ReportNode = {
  id: string;
  name: string;
  order: number;
  active: boolean;
  debit: number;
  credit: number;
  children: ReportNode[];
};

type ReportResponse = {
  from: string | null;
  to: string | null;
  bank: string | null;
  tree: ReportNode[];
};

type FlatRow = ReportNode & {
  depth: number;
  childrenCount: number;
  parentId?: string | null;
};

export default function AggregatePanel() {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [bank, setBank] = useState<
    "paypay" | "gmo" | "sbi" | "mizuhoebiz" | "mizuhobizweb" | "all"
  >("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (bank && bank !== "all") params.set("bank", bank);
      const qs = params.toString();
      const url = qs ? `/api/report?${qs}` : "/api/report";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`failed: ${res.status}`);
      const json: ReportResponse = await res.json();
      setData(json);
      // 初回は第1階層だけ展開
      const next = new Set<string>();
      (json.tree || []).forEach((n) => next.add(n.id));
      setExpanded(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoading(false);
    }
  }, [from, to, bank]);

  useEffect(() => {
    // 初期ロード
    fetchReport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // フィルタ変更で自動再取得
    fetchReport();
  }, [from, to, bank, fetchReport]);

  const rows = useMemo<FlatRow[]>(
    () => flattenVisible(data?.tree ?? [], expanded),
    [data, expanded]
  );

  const rootNodes = useMemo(() => data?.tree ?? [], [data]);

  // ネット合計 (収入 - 支出)。支出はマイナス扱い。
  const totalNet = useMemo(
    () =>
      rootNodes.reduce<number>(
        (s, r) => s + ((r.credit ?? 0) - (r.debit ?? 0)),
        0
      ),
    [rootNodes]
  );

  function toggle(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }
  function expandAll() {
    const all = new Set<string>();
    collectIds(data?.tree ?? [], all);
    setExpanded(all);
  }
  function collapseAll() {
    setExpanded(new Set());
  }

  // console.log({ data, rows });

  return (
    <section className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">集計レポート</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={fetchReport} disabled={loading}>
              {loading ? "更新中…" : "更新"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-gray-600">From</span>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-gray-600">To</span>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-gray-600">銀行</span>
              <div className="w-48">
                <BankSelect
                  value={bank as any}
                  onChange={(v) => setBank(v as any)}
                />
              </div>
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="secondary" onClick={expandAll}>
                全展開
              </Button>
              <Button variant="secondary" onClick={collapseAll}>
                全折りたたみ
              </Button>
            </div>
          </div>
          {/* 現在の条件／APIエコー */}
          {/* <div className="mt-2 text-xs text-gray-500 space-x-3">
            <span>
              条件: from={from || "-"} to={to || "-"} bank={bank || "-"}
            </span>
            {data && (
              <span>
                API: from={data.from ?? "-"} to={data.to ?? "-"} bank=
                {data.bank ?? "-"}
              </span>
            )}
          </div> */}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-red-600">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">結果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[600px]">
            {/** 最大深度を計算し、階層毎に列を分離するレイアウトに変更 */}
            {(() => {
              const maxDepth = rows.reduce((m, r) => Math.max(m, r.depth), 0);
              const depthCols = Array.from(
                { length: maxDepth + 1 },
                (_, i) => i
              );
              return (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      {depthCols.map((d) => (
                        <th
                          key={d}
                          className="py-1 px-2 font-normal text-gray-500 min-w-[140px]"
                        >
                          {d === 0 ? "タグ" : ""}
                        </th>
                      ))}
                      <th className="py-1 px-2 text-right">収支(収入-支出)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/** 総合計行（グランドトータル）: 先頭に表示 */}
                    <tr className="border-b bg-gray-50">
                      {depthCols.map((d) => (
                        <td key={d} className="py-1 px-2" />
                      ))}
                      <td className="py-1 px-2 text-right font-semibold tabular-nums">
                        {formatSignedYen(totalNet)}
                      </td>
                    </tr>
                    {rows.map((r: FlatRow) => {
                      const isSubtotal = r.childrenCount > 0; // 子を持つ=小計行
                      return (
                        <tr
                          key={r.id}
                          className={
                            "border-b last:border-0 " +
                            (isSubtotal && r.depth === 0 ? "bg-white" : "")
                          }
                        >
                          {depthCols.map((d) => {
                            if (d !== r.depth) {
                              return <td key={d} className="py-1 px-2" />;
                            }
                            return (
                              <td
                                key={d}
                                className={`py-1 px-2 whitespace-nowrap ${
                                  isSubtotal ? "font-semibold" : ""
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <span className="w-5 h-5 flex items-center justify-center">
                                    {r.childrenCount > 0 ? (
                                      <button
                                        onClick={() => toggle(r.id)}
                                        aria-label={
                                          expanded.has(r.id)
                                            ? "折りたたむ"
                                            : "展開"
                                        }
                                        className="w-full h-full rounded hover:bg-gray-100"
                                      >
                                        {expanded.has(r.id) ? "-" : "+"}
                                      </button>
                                    ) : (
                                      <div className="w-5 h-5" />
                                    )}
                                  </span>
                                  <span>{r.name}</span>
                                </div>
                              </td>
                            );
                          })}
                          <td className="py-1 px-2 text-right tabular-nums">
                            {renderNetAmount(r.credit, r.debit, isSubtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td
                        colSpan={depthCols.length}
                        className="py-1 px-2 font-semibold"
                      >
                        合計
                      </td>
                      <td className="py-1 px-2 text-right font-semibold tabular-nums">
                        {formatSignedYen(totalNet)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function formatYen(n: number) {
  return (n ?? 0).toLocaleString("ja-JP");
}

function collectIds(nodes: ReportNode[], out: Set<string>) {
  for (const n of nodes) {
    out.add(n.id);
    collectIds(n.children ?? [], out);
  }
}

function flattenWithDepth(
  nodes: ReportNode[],
  depth = 0
): Array<ReportNode & { depth: number; childrenCount: number }> {
  const out: Array<ReportNode & { depth: number; childrenCount: number }> = [];
  for (const n of nodes) {
    const item = { ...n, depth, childrenCount: n.children?.length ?? 0 };
    out.push(item);
    out.push(...flattenWithDepth(n.children ?? [], depth + 1));
  }
  return out;
}

function flattenVisible(
  nodes: ReportNode[],
  expanded: Set<string>,
  depth = 0,
  parentExpanded = true
): FlatRow[] {
  const out: FlatRow[] = [];
  // 収入(正)→支出(負) 順で並び替え: net = credit - debit
  const ordered = [...nodes]
    .map((n, i) => ({ n, i, net: (n.credit ?? 0) - (n.debit ?? 0) }))
    .sort((a, b) => {
      const signA = a.net >= 0 ? 0 : 1;
      const signB = b.net >= 0 ? 0 : 1;
      if (signA !== signB) return signA - signB; // 正→負
      return a.i - b.i; // 元の順序維持
    })
    .map((x) => x.n);

  for (const n of ordered) {
    const isRoot = depth === 0;
    const visible = isRoot || parentExpanded;
    if (!visible) continue;
    out.push({ ...n, depth, childrenCount: n.children?.length ?? 0 });
    const childParentExpanded = expanded.has(n.id);
    if (n.children && n.children.length) {
      out.push(
        ...flattenVisible(n.children, expanded, depth + 1, childParentExpanded)
      );
    }
  }
  return out;
}

function indentClass(depth: number) {
  const map = [
    "flex items-center pl-0",
    "flex items-center pl-4",
    "flex items-center pl-8",
    "flex items-center pl-12",
    "flex items-center pl-16",
    "flex items-center pl-20",
    "flex items-center pl-24",
    "flex items-center pl-28",
  ];
  return map[Math.min(depth, map.length - 1)];
}

function renderNetAmount(credit: number, debit: number, isSubtotal = false) {
  const net = (credit ?? 0) - (debit ?? 0);
  const clsBase =
    net < 0 ? "text-red-600" : net > 0 ? "text-green-700" : "text-gray-600";
  const weight = isSubtotal ? " font-semibold" : "";
  return <span className={clsBase + weight}>{formatSignedYen(net)}</span>;
}

function formatSignedYen(n: number) {
  const abs = Math.abs(n).toLocaleString("ja-JP");
  if (n === 0) return "0";
  return n < 0 ? `-${abs}` : abs;
}
