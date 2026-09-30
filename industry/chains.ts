/**
 * 蒋老师线1（原料来源）/ 线2（应用去向）产业链树。
 * JSON 由 scripts/chains/parse-trees.mjs 生成。
 * 使用 createRequire 以便 Node（backend）与打包器都能加载。
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type ChainNode = {
  id: string;
  name: string;
  nameEn?: string | null;
  cas?: string | null;
  formula?: string | null;
  children: ChainNode[];
};

export type ChainTree = {
  id: string;
  name: string;
  version: string;
  encoding: string;
  roots: ChainNode[];
};

export const SOURCE_TREE = require("./chains/source-tree.json") as ChainTree;
export const APPLICATION_TREE = require("./chains/application-tree.json") as ChainTree;

export type ChainLens = "source" | "application";

export const CHAIN_TAG_PREFIX = { source: "src:", application: "app:" } as const;

export function treeOf(lens: ChainLens): ChainTree {
  return lens === "source" ? SOURCE_TREE : APPLICATION_TREE;
}

export function findNode(roots: ChainNode[], id: string): ChainNode | null {
  for (const n of roots) {
    if (n.id === id) return n;
    const hit = findNode(n.children ?? [], id);
    if (hit) return hit;
  }
  return null;
}

/** Root → … → node（含自身）。 */
export function ancestorsOf(roots: ChainNode[], id: string): ChainNode[] {
  const path: ChainNode[] = [];
  const walk = (nodes: ChainNode[]): boolean => {
    for (const n of nodes) {
      path.push(n);
      if (n.id === id) return true;
      if (walk(n.children ?? [])) return true;
      path.pop();
    }
    return false;
  };
  return walk(roots) ? [...path] : [];
}

/** 写入 publications.tags：节点自身 + 全部祖先，便于按上级筛选。 */
export function chainTagsFor(lens: ChainLens, nodeIds: string[]): string[] {
  const prefix = CHAIN_TAG_PREFIX[lens];
  const roots = treeOf(lens).roots;
  const out: string[] = [];
  for (const id of nodeIds) {
    const path = ancestorsOf(roots, id);
    const ids = path.length ? path.map((n) => n.id) : [id];
    for (const x of ids) {
      const tag = `${prefix}${x}`;
      if (!out.includes(tag)) out.push(tag);
    }
  }
  return out;
}

export function parseChainTag(tag: string): { lens: ChainLens; nodeId: string } | null {
  if (tag.startsWith("src:")) return { lens: "source", nodeId: tag.slice(4) };
  if (tag.startsWith("app:")) return { lens: "application", nodeId: tag.slice(4) };
  return null;
}

export function isChainTag(tag: string): boolean {
  return tag.startsWith("src:") || tag.startsWith("app:");
}

export function nodeLabel(lens: ChainLens, nodeId: string): string {
  const n = findNode(treeOf(lens).roots, nodeId);
  return n ? n.name : nodeId;
}

/** 扁平化供搜索（id / 中文名 / 英文 / CAS）。 */
export function flattenNodes(roots: ChainNode[]): Array<ChainNode & { depth: number }> {
  const out: Array<ChainNode & { depth: number }> = [];
  const walk = (nodes: ChainNode[], depth: number) => {
    for (const n of nodes) {
      out.push({ ...n, depth });
      walk(n.children ?? [], depth + 1);
    }
  };
  walk(roots, 0);
  return out;
}

export function searchNodes(lens: ChainLens, q: string, limit = 30): Array<ChainNode & { depth: number }> {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const hits: Array<ChainNode & { depth: number }> = [];
  for (const n of flattenNodes(treeOf(lens).roots)) {
    const hay = [n.id, n.name, n.nameEn ?? "", n.cas ?? ""].join(" ").toLowerCase();
    if (hay.includes(needle)) {
      hits.push(n);
      if (hits.length >= limit) break;
    }
  }
  return hits;
}
