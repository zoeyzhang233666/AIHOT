import {
  APPLICATION_TREE,
  CHAIN_TAG_PREFIX,
  SOURCE_TREE,
  ancestorsOf,
  findNode,
  searchNodes,
  type ChainLens,
  type ChainNode,
} from "./trees";
import type { CategoryKey } from "@aihot/contracts/taxonomy";
import { hrefWith } from "../feed/Filters";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

function lensFromCategory(category: CategoryKey | null): ChainLens | null {
  if (category === "application") return "application";
  if (category === "macro") return null;
  return "source";
}

function categoryForLens(lens: ChainLens): CategoryKey {
  return lens === "source" ? "source-path" : "application";
}

function tagFor(lens: ChainLens, nodeId: string) {
  return `${CHAIN_TAG_PREFIX[lens]}${nodeId}`;
}

function parseSelectedNode(tag: string | null, lens: ChainLens): string | null {
  if (!tag) return null;
  const prefix = CHAIN_TAG_PREFIX[lens];
  return tag.startsWith(prefix) ? tag.slice(prefix.length) : null;
}

function displayName(name: string) {
  return name
    .replace(/[（(]\s*v?\d+(?:\.\d+)*\s*修订[^）)]*[）)]/gi, "")
    .replace(/[（(]\s*原\s*S-[\d-]+[^）)]*[）)]/g, "")
    .replace(/[（(]\s*修订[^）)]*[）)]/g, "")
    .replace(/\s*修订[：:][^\n（(]*$/g, "")
    .replace(/\s*\[\s*\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function NodeCard({
  node,
  selected,
  href,
  onOpen,
}: {
  node: ChainNode;
  selected: boolean;
  href: string;
  onOpen: () => void;
}) {
  const childCount = node.children?.length ?? 0;
  return (
    <Link
      to={href}
      prefetch="intent"
      onClick={onOpen}
      className={`flex flex-col rounded-xl border p-3 transition-[border-color,box-shadow,background-color,transform] hover:-translate-y-0.5 ${
        selected
          ? "border-accent bg-accent-soft/50 shadow-[0_0_0_1px_var(--accent)]"
          : "border-line-soft bg-surface hover:border-line-strong hover:bg-bg-sunk/70"
      }`}
    >
      <div className="mono text-[11px] text-ink-4">{node.id}</div>
      <div className="mt-1 text-[14px] font-semibold leading-snug text-ink">{displayName(node.name)}</div>
      {node.nameEn ? <div className="mt-0.5 truncate text-[12px] text-ink-3">{node.nameEn}</div> : null}
      {node.cas ? <div className="mono mt-1 text-[11px] text-ink-4">CAS {node.cas}</div> : null}
      {childCount > 0 ? (
        <div className="mt-2 text-[11.5px] font-medium text-accent">{childCount} 个子节点 · 点击进入</div>
      ) : (
        <div className="mt-2 text-[11.5px] text-ink-4">查看节点资讯</div>
      )}
    </Link>
  );
}

/** Interactive 线1 / 线2 explorer: full trees, click a node to filter the feed. */
export function ChainExplorer({
  base,
  category,
  tag,
}: {
  base: string;
  category: CategoryKey | null;
  tag: string | null;
}) {
  const [params] = useSearchParams();
  const lens = lensFromCategory(category);
  const [query, setQuery] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);

  const tree = lens === "source" ? SOURCE_TREE : APPLICATION_TREE;
  const selectedId = lens ? parseSelectedNode(tag, lens) : null;

  useEffect(() => {
    if (selectedId) setFocusId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    setQuery("");
    if (!selectedId) setFocusId(null);
  }, [lens]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when switching 线1/线2

  const hits = useMemo(() => (lens && query.trim() ? searchNodes(lens, query, 24) : []), [lens, query]);

  if (!lens || !tree) return null;

  const focus = focusId ? findNode(tree.roots, focusId) : null;
  const crumb = focusId ? ancestorsOf(tree.roots, focusId) : [];
  const gridNodes: ChainNode[] = focus && (focus.children?.length ?? 0) > 0 ? focus.children : focus && crumb.length >= 2 ? [] : tree.roots;
  // If focus is a leaf, show siblings under parent
  const nodes =
    gridNodes.length > 0
      ? gridNodes
      : focus && crumb.length >= 2
        ? crumb[crumb.length - 2]!.children
        : tree.roots;

  const hrefNode = (nodeId: string) =>
    hrefWith(base, params, {
      category: categoryForLens(lens),
      tag: tagFor(lens, nodeId),
      channel: null,
    });

  const clearNode = hrefWith(base, params, {
    category: categoryForLens(lens),
    tag: null,
    channel: null,
  });

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-line-soft bg-gradient-to-b from-bg-sunk/80 via-surface to-surface dark:from-bg-muted/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
        <div>
          <div className="text-[13px] font-semibold text-ink">{tree.name}图</div>
          <div className="mt-0.5 text-[12px] text-ink-4">{tree.version} · 完整树可下钻 · 点击节点筛选相关资讯</div>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">搜索产业链节点</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lens === "source" ? "搜索品名 / CAS / S-编码…" : "搜索行业 / A-编码…"}
            className="h-9 w-full rounded-full border border-line-soft bg-surface px-3.5 text-[13px] text-ink outline-none placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
          />
        </label>
      </div>

      {hits.length > 0 && (
        <div className="border-b border-line-soft px-4 py-2">
          <div className="mb-1.5 text-[12px] text-ink-4">搜索结果</div>
          <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
            {hits.map((h) => (
              <Link
                key={h.id}
                to={hrefNode(h.id)}
                onClick={() => {
                  setFocusId(h.id);
                  setQuery("");
                }}
                className="rounded-full border border-line-soft bg-surface px-2.5 py-1 text-[12px] text-ink-2 hover:border-accent hover:text-accent"
              >
                <span className="mono text-ink-4">{h.id}</span> {h.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 px-4 pt-3 text-[12.5px]">
        <button type="button" onClick={() => setFocusId(null)} className="rounded-md px-1.5 py-0.5 text-ink-3 hover:bg-bg-sunk hover:text-ink">
          总览
        </button>
        {crumb.map((n) => (
          <span key={n.id} className="contents">
            <span className="text-ink-4">/</span>
            <button
              type="button"
              onClick={() => setFocusId(n.id)}
              className="max-w-[9rem] truncate rounded-md px-1.5 py-0.5 font-medium text-ink-2 hover:bg-bg-sunk hover:text-ink"
              title={`${n.id} ${n.name}`}
            >
              {n.name}
            </button>
          </span>
        ))}
        {selectedId ? (
          <Link to={clearNode} className="ml-auto text-[12px] text-accent hover:underline">
            清除节点筛选
          </Link>
        ) : null}
      </div>

      <div className="grid max-h-[22rem] grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 lg:grid-cols-4">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} selected={selectedId === node.id} href={hrefNode(node.id)} onOpen={() => setFocusId(node.id)} />
        ))}
      </div>
    </section>
  );
}
