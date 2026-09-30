/**
 * Browser/Vite copy of chain trees (plain JSON import).
 * Backend uses @aihot/industry/chains (createRequire).
 */
import sourceTree from "@aihot/industry/chains/source-tree.json";
import applicationTree from "@aihot/industry/chains/application-tree.json";
import type { ChainLens, ChainNode, ChainTree } from "@aihot/industry/chains";

export type { ChainLens, ChainNode, ChainTree };

export const SOURCE_TREE = sourceTree as ChainTree;
export const APPLICATION_TREE = applicationTree as ChainTree;

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

export function parseChainTag(tag: string): { lens: ChainLens; nodeId: string } | null {
  if (tag.startsWith("src:")) return { lens: "source", nodeId: tag.slice(4) };
  if (tag.startsWith("app:")) return { lens: "application", nodeId: tag.slice(4) };
  return null;
}

export function nodeLabel(lens: ChainLens, nodeId: string): string {
  const n = findNode(treeOf(lens).roots, nodeId);
  return n ? n.name : nodeId;
}

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
