# 产业链树数据

由 `scripts/chains/parse-trees.mjs` 从蒋老师文档生成：

- 线1 来源路径树 → `source-tree.json`
- 线2 应用去向树 → `application-tree.json`

重新生成：

```bash
node scripts/chains/parse-trees.mjs
# 或指定路径
node scripts/chains/parse-trees.mjs "C:/path/线1.md" "C:/path/线2.md"
```

运行时通过 `@aihot/industry/chains` 读取；资讯用 `src:` / `app:` 标签挂到节点。
