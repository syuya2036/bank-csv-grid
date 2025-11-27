// src/components/TagSelectEditor.tsx:1-63
/* eslint-disable react/jsx-no-bind */
"use client";

import { UNASSIGNED_TAG } from "@/constants/tags";
import { useTagTree } from "@/hooks/useTagTree";
import type { TransactionRow } from "@/types/transaction";
import { useMemo, useState } from "react";
import type { RenderEditCellProps } from "react-data-grid";
import { createPortal } from "react-dom";
const EMPTY = UNASSIGNED_TAG;

export default function TagSelectEditor({
  row,
  onRowChange,
  onClose,
}: RenderEditCellProps<TransactionRow>) {
  const { tree } = useTagTree();
  const [levels, setLevels] = useState<string[]>([]); // 選択中の階層の tagId
  const [search, setSearch] = useState("");

  const currentChildren = useMemo(() => {
    let nodes = tree;
    for (const id of levels) {
      const next = nodes.find((n) => n.id === id);
      if (!next) break;
      nodes = next.children;
    }
    return nodes;
  }, [tree, levels]);

  function resetAndClose() {
    setTimeout(onClose, 0);
  }

  function handleClear() {
    onRowChange({ ...row, tag: undefined, isDirty: true }, true);
    resetAndClose();
  }

  function handlePick(id: string, name: string) {
    // 葉: children が無ければ確定
    const pathNodes = [...levels, id];
    const last = findNodeByPath(tree, pathNodes);
    if (last && (!last.children || last.children.length === 0)) {
      if (row.tag !== name) {
        onRowChange({ ...row, tag: name, isDirty: true }, true);
      }
      resetAndClose();
      return;
    }
    setLevels(pathNodes);
  }

  const flatFiltered = useMemo(
    () => searchFilter(flatten(tree), search),
    [tree, search]
  );

  // クリッピング回避のため、フルスクリーンのモーダルとして表示
  return (
    <>
      {typeof window !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999]"
              onMouseDownCapture={(e) => e.stopPropagation()}
            >
              <div
                className="absolute inset-0 bg-black/10"
                onClick={() => onClose()}
              />
              <div className="absolute left-1/2 top-16 -translate-x-1/2">
                <div className="p-2 bg-white rounded shadow-lg min-w-[360px] max-w-[80vw] border">
                  <div className="flex gap-2 mb-2">
                    <input
                      autoFocus
                      className="border rounded px-2 py-1 w-full"
                      placeholder="検索（名前）"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          e.stopPropagation();
                          onClose();
                        }
                      }}
                    />
                    <button
                      className="border rounded px-2"
                      onClick={handleClear}
                    >
                      未割当
                    </button>
                  </div>

                  {search ? (
                    <div className="max-h-96 overflow-auto">
                      {flatFiltered.map((n) => (
                        <button
                          key={n.id}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100"
                          onClick={() => handlePick(n.id, n.name)}
                        >
                          {n.path}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {renderLevel(tree, levels, handlePick)}
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

type Node = { id: string; name: string; children: Node[] };

function renderLevel(
  nodes: Node[],
  levels: string[],
  onPick: (id: string, name: string) => void
): JSX.Element[] {
  const cols: JSX.Element[] = [];
  let colNodes: Node[] = nodes;
  for (let i = 0; i <= levels.length; i++) {
    cols.push(
      <div key={i} className="max-h-64 overflow-auto border rounded w-48">
        {colNodes.map((n) => (
          <div key={n.id}>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100"
              onClick={() => onPick(n.id, n.name)}
            >
              {n.name}
            </button>
          </div>
        ))}
      </div>
    );
    const sel = levels[i];
    const next = colNodes.find((n) => n.id === sel);
    if (!next) break;
    colNodes = next.children ?? [];
  }
  return cols;
}

function flatten(
  nodes: Node[],
  prefix: string[] = []
): { id: string; name: string; path: string }[] {
  const out: { id: string; name: string; path: string }[] = [];
  for (const n of nodes) {
    const path = [...prefix, n.name];
    if (!n.children || n.children.length === 0) {
      out.push({ id: n.id, name: n.name, path: path.join(">") });
    }
    out.push(...flatten(n.children ?? [], path));
  }
  return out;
}

function searchFilter(
  items: { id: string; name: string; path: string }[],
  q: string
) {
  const s = q.trim();
  if (!s) return items;
  return items.filter((x) => x.name.includes(s) || x.path.includes(s));
}

function findNodeByPath(nodes: Node[], ids: string[]): Node | undefined {
  let cur: Node | undefined;
  let list = nodes;
  for (const id of ids) {
    cur = list.find((n) => n.id === id);
    if (!cur) return undefined;
    list = cur.children ?? [];
  }
  return cur;
}
