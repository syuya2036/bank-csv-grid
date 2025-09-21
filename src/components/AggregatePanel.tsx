"use client";

import BankSelect from "@/components/BankSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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

  const totalDebit = useMemo(
    () => rootNodes.reduce<number>((s, r) => s + (r.debit ?? 0), 0),
    [rootNodes]
  );
  const totalCredit = useMemo(
    () => rootNodes.reduce<number>((s, r) => s + (r.credit ?? 0), 0),
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

  console.log({ data, rows });

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
          <div className="overflow-auto max-h-[480px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1 px-2">タグ</th>
                  <th className="py-1 px-2 text-right">支出(借方)</th>
                  <th className="py-1 px-2 text-right">収入(貸方)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: FlatRow) => (
                  <React.Fragment key={r.id}>
                    <tr className="border-b last:border-0">
                      <td className="py-1 px-2 whitespace-nowrap">
                        <div className={indentClass(r.depth)}>
                          <span className="mr-1 w-5 h-5 flex items-center justify-center">
                            {r.childrenCount > 0 ? (
                              <button
                                onClick={() => toggle(r.id)}
                                aria-label={
                                  expanded.has(r.id) ? "折りたたむ" : "展開"
                                }
                                className="w-full h-full rounded hover:bg-gray-100"
                              >
                                {expanded.has(r.id) ? "-" : "+"}
                              </button>
                            ) : (
                              // 子要素がない場合は、空のスペースを確保
                              <div className="w-5 h-5"></div>
                            )}
                          </span>
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-1 px-2 text-right tabular-nums">
                        {formatYen(r.debit)}
                      </td>
                      <td className="py-1 px-2 text-right tabular-nums">
                        {formatYen(r.credit)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td className="py-1 px-2 font-semibold">合計</td>
                  <td className="py-1 px-2 text-right font-semibold tabular-nums">
                    {formatYen(totalDebit)}
                  </td>
                  <td className="py-1 px-2 text-right font-semibold tabular-nums">
                    {formatYen(totalCredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
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
  for (const n of nodes) {
    const isRoot = depth === 0;
    const visible = isRoot || parentExpanded;
    if (visible) {
      out.push({ ...n, depth, childrenCount: n.children?.length ?? 0 });
      const childParentExpanded = expanded.has(n.id);
      if (n.children && n.children.length) {
        out.push(
          ...flattenVisible(
            n.children,
            expanded,
            depth + 1,
            childParentExpanded
          )
        );
      }
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
