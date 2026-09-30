/**
 * Parse 蒋老师 线1/线2 markdown trees into industry/chains/*.json
 * Usage: node scripts/chains/parse-trees.mjs [line1.md] [line2.md]
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const outDir = path.join(root, "industry/chains");

const defaults = {
  line1: String.raw`C:\Users\EDY\Nutstore\1\ob\线1_来源路径树_v2.1-蒋老师.md`,
  line2: String.raw`C:\Users\EDY\Nutstore\1\ob\线2_应用去向树_v3.0-蒋老师.md`,
};

const line1Path = process.argv[2] || defaults.line1;
const line2Path = process.argv[3] || defaults.line2;

/** @typedef {{ id: string, name: string, nameEn?: string | null, cas?: string | null, formula?: string | null, children: ChainNode[] }} ChainNode */

function cleanName(s) {
  return s
    // Strip priority / coverage markers before removing bare ★, or "[★]" becomes "[]".
    .replace(/\[芯化智数已覆盖\]/g, "")
    .replace(/\[[\s★*]+\]/g, "")
    .replace(/【[\s★*]+】/g, "")
    .replace(/★+/g, "")
    // Drop editorial notes like (v2.0修订新增) / （原S-04-03，修订：…） / trailing 修订：…
    .replace(/[（(]\s*v?\d+(?:\.\d+)*\s*修订[^）)]*[）)]/gi, "")
    .replace(/[（(]\s*原\s*S-[\d-]+[^）)]*[）)]/g, "")
    .replace(/[（(]\s*修订[^）)]*[）)]/g, "")
    .replace(/[（(]\s*基于[^）)]*重建[^）)]*[）)]/g, "")
    .replace(/\s*修订[：:][^\n（(]*$/g, "")
    .replace(/\s*\[\s*\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNameExtras(raw) {
  let name = cleanName(raw);
  let nameEn = null;
  let cas = null;
  let formula = null;
  const casM = name.match(/\[(\d{2,7}-\d{2}-\d)\]/);
  if (casM) {
    cas = casM[1];
    name = name.replace(casM[0], "").trim();
  }
  // "中文 English" or "中文 / English"
  const enM = name.match(/^(.+?)\s+([A-Za-z][A-Za-z0-9 /.+·\-()]{1,60})$/);
  if (enM && /[A-Za-z]/.test(enM[2]) && /[\u4e00-\u9fff]/.test(enM[1])) {
    name = enM[1].trim();
    nameEn = enM[2].trim();
  }
  const formM = name.match(/\b([A-Z][A-Za-z0-9₀-₉₂₃₄₅₆₇₈₉·]{0,20})\b/);
  if (formM && /[₀-₉₂₃₄]|O\d|H\d|Cl|Na|SO/.test(formM[1])) formula = formM[1];
  name = name.replace(/[（(]\s*[不涉及化学品]\s*[）)]/g, "").trim();
  return { name: cleanName(name), nameEn, cas, formula };
}

function indentOf(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

/** Parse ascii tree lines inside a ``` block into nested nodes under a synthetic root children list. */
function parseAsciiChildren(lines, idPrefix) {
  /** @type {ChainNode[]} */
  const roots = [];
  /** @type {{ indent: number, node: ChainNode }[]} */
  const stack = [];
  let seq = 0;

  for (const raw of lines) {
    const line = raw.replace(/\t/g, "  ");
    if (!line.trim()) continue;
    if (/^注[:：]/.test(line.trim()) || line.trim().startsWith(">")) continue;
    // tree branch or plain bullet-like "├──" / "└──" / "│" only
    const branch = line.match(/^([\s│]*)(?:├──|└──)\s*(.+)$/);
    const rootish = !branch && !/^[│\s]+$/.test(line) && indentOf(line) === 0
      ? line.trim()
      : null;
    const content = branch ? branch[2] : rootish;
    if (!content) continue;
    // skip pure connectors
    if (/^[│\s]+$/.test(content)) continue;
    const indent = branch ? branch[1].replace(/│/g, " ").length : -1;
    const extras = parseNameExtras(content.split(/←/)[0].trim());
    if (!extras.name || extras.name === "│") continue;
    seq += 1;
    const id = `${idPrefix}-n${String(seq).padStart(3, "0")}`;
    /** @type {ChainNode} */
    const node = { id, name: extras.name, nameEn: extras.nameEn, cas: extras.cas, formula: extras.formula, children: [] };

    if (indent < 0 || stack.length === 0) {
      // treat as top of this block (may be root label without ├──)
      if (indent < 0 && roots.length === 0 && !branch) {
        // rename later — first line often is the feedstock root; keep as child still
        roots.push(node);
        stack.length = 0;
        stack.push({ indent: 0, node });
        continue;
      }
    }

    while (stack.length && stack[stack.length - 1].indent >= indent && indent >= 0) stack.pop();
    if (stack.length === 0 || indent < 0) {
      roots.push(node);
      stack.push({ indent: Math.max(indent, 0), node });
    } else {
      stack[stack.length - 1].node.children.push(node);
      stack.push({ indent, node });
    }
  }
  return roots;
}

function parseLine1(md) {
  const lines = md.split(/\r?\n/);
  /** @type {ChainNode[]} */
  const roots = [];
  /** @type {ChainNode | null} */
  let currentL0 = null;
  /** @type {ChainNode | null} */
  let currentL1 = null;
  /** @type {string[]} */
  let fence = [];
  let inFence = false;

  const flushFence = () => {
    if (!currentL1 || fence.length === 0) {
      fence = [];
      return;
    }
    const kids = parseAsciiChildren(fence, currentL1.id);
    // merge: if kids look like detail under L1, attach
    for (const k of kids) currentL1.children.push(k);
    fence = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inFence) {
        flushFence();
        inFence = false;
      } else {
        inFence = true;
        fence = [];
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }

    const l0 = line.match(/^##\s+(S-\d{2})\s+(.+)$/);
    if (l0) {
      flushFence();
      const extras = parseNameExtras(l0[2]);
      currentL0 = { id: l0[1], name: extras.name, nameEn: extras.nameEn, cas: null, formula: null, children: [] };
      roots.push(currentL0);
      currentL1 = null;
      continue;
    }
    const l1 = line.match(/^###\s+(S-\d{2}-\d{2})\s+(.+)$/);
    if (l1 && currentL0) {
      flushFence();
      const extras = parseNameExtras(l1[2]);
      currentL1 = { id: l1[1], name: extras.name, nameEn: extras.nameEn, cas: null, formula: null, children: [] };
      currentL0.children.push(currentL1);
      continue;
    }
  }
  flushFence();
  return {
    id: "line1",
    name: "原料来源路径",
    version: "v2.1",
    encoding: "S-XX[-XX][-nNNN]",
    roots,
  };
}

function parseLine2(md) {
  const lines = md.split(/\r?\n/);
  /** @type {Map<string, ChainNode>} */
  const sectors = new Map(); // B / C / D / E
  /** @type {ChainNode | null} */
  let currentMajor = null; // C-26
  /** @type {string[]} */
  let fence = [];
  let inFence = false;

  const sectorOf = (code) => {
    const letter = code[0];
    const names = { B: "采矿业", C: "制造业", D: "电力热力燃气水", E: "建筑业", N: "环境治理业" };
    if (!sectors.has(letter)) {
      sectors.set(letter, {
        id: letter === "N" ? "N" : letter,
        name: names[letter] || letter,
        nameEn: null,
        cas: null,
        formula: null,
        children: [],
      });
    }
    return sectors.get(letter);
  };

  const flushFence = () => {
    if (!currentMajor || fence.length === 0) {
      fence = [];
      return;
    }
    // Prefer explicit A-XX-XXXX nodes in fence lines
    /** @type {ChainNode[]} */
    const found = [];
    /** @type {{ indent: number, node: ChainNode }[]} */
    const stack = [];
    for (const raw of fence) {
      const line = raw.replace(/\t/g, "  ");
      const branch = line.match(/^([\s│]*)(?:├──|└──)\s*(.+)$/);
      if (!branch) continue;
      const indent = branch[1].replace(/│/g, " ").length;
      let rest = branch[2].trim();
      const idM = rest.match(/^(A-\d{2}-\d{4}(?:-\d{2})?)\s+(.+)$/);
      let id;
      let title;
      if (idM) {
        id = idM[1];
        title = idM[2];
      } else {
        // child without A- code — synthetic under last
        id = null;
        title = rest;
      }
      title = title.split(/←/)[0].trim();
      const extras = parseNameExtras(title);
      if (!extras.name) continue;
      /** @type {ChainNode} */
      const node = {
        id: id || `${currentMajor.id}-x${found.length + stack.length + 1}`,
        name: extras.name,
        nameEn: extras.nameEn,
        cas: extras.cas,
        formula: extras.formula,
        children: [],
      };
      while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
      if (stack.length === 0) {
        found.push(node);
        stack.push({ indent, node });
      } else {
        // avoid duplicate ids under same parent
        const parent = stack[stack.length - 1].node;
        if (!parent.children.some((c) => c.id === node.id && node.id.startsWith("A-"))) {
          parent.children.push(node);
        }
        stack.push({ indent, node });
      }
    }
    for (const n of found) {
      if (!currentMajor.children.some((c) => c.id === n.id)) currentMajor.children.push(n);
    }
    fence = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inFence) {
        flushFence();
        inFence = false;
      } else {
        inFence = true;
        fence = [];
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }

    // #### C-26 化学原料... or #### N-772
    const major = line.match(/^####\s+([BCDE]-\d{2}|N-\d{3})\s+(.+)$/);
    if (major) {
      flushFence();
      const code = major[1];
      const extras = parseNameExtras(major[2]);
      currentMajor = {
        id: code,
        name: extras.name,
        nameEn: extras.nameEn,
        cas: null,
        formula: null,
        children: [],
      };
      const sector = sectorOf(code);
      sector.children.push(currentMajor);
      continue;
    }
  }
  flushFence();

  return {
    id: "line2",
    name: "应用去向",
    version: "v3.0",
    encoding: "A-XX-XXXX[-子类]",
    roots: [...sectors.values()],
  };
}

function countNodes(nodes) {
  let n = 0;
  const walk = (arr) => {
    for (const x of arr) {
      n += 1;
      walk(x.children || []);
    }
  };
  walk(nodes);
  return n;
}

function main() {
  if (!fs.existsSync(line1Path)) throw new Error(`missing line1: ${line1Path}`);
  if (!fs.existsSync(line2Path)) throw new Error(`missing line2: ${line2Path}`);
  fs.mkdirSync(outDir, { recursive: true });

  const source = parseLine1(fs.readFileSync(line1Path, "utf8"));
  const application = parseLine2(fs.readFileSync(line2Path, "utf8"));

  fs.writeFileSync(path.join(outDir, "source-tree.json"), JSON.stringify(source, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "application-tree.json"), JSON.stringify(application, null, 2), "utf8");

  const index = {
    source: { file: "source-tree.json", version: source.version, roots: source.roots.length, nodes: countNodes(source.roots) },
    application: { file: "application-tree.json", version: application.version, roots: application.roots.length, nodes: countNodes(application.roots) },
    generatedAt: new Date().toISOString(),
    sources: { line1: line1Path, line2: line2Path },
  };
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 2), "utf8");
  console.log(JSON.stringify(index, null, 2));
}

main();
