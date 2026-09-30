/**
 * ChemHOT 分类：一级视角 = 原料来源 / 应用去向 / 地缘宏观。
 * 具体产业链节点见 industry/chains.ts（线1 / 线2 全树），以 src: / app: 标签挂到资讯上。
 */

export const CATEGORIES = [
  {
    key: "source-path",
    label: "原料来源",
    section: "原料来源",
    guide: "资讯主要落在线1原料来源路径上的化学品、装置、价格、供需或商机；须同时抽出 sourcePaths 节点 id（如 S-01、S-01-03）。聚酯、烯烃等属于 S-01 下的子节点，不要另造分类",
  },
  {
    key: "application",
    label: "应用去向",
    section: "应用去向",
    guide: "资讯主要落在线2应用行业（国标）上的下游需求、项目、招标、采购场景；须同时抽出 applications 节点 id（如 C-39、A-26-2611）。原料节点仍可填 sourcePaths",
  },
  {
    key: "macro",
    label: "地缘宏观",
    section: "地缘宏观",
    guide: "战争、制裁、航运中断、OPEC、原油天然气宏观、汇率利率，以及跨多条线1/线2、无法归到单一产业链节点的产业或贸易政策",
  },
] as const;

/** 内容形态（评分用，不是读者 Tab）。 */
export const ITEM_TYPES = [
  "business_opportunity",
  "spot_market_update",
  "supply_demand_event",
  "futures_research",
  "geopolitical_macro",
  "policy_exchange",
  "industry_analysis",
] as const;

export const CATEGORY_TAGS = ["原料来源", "应用去向", "地缘宏观", "其他"] as const;

/**
 * 产品族：与线1 下游捏合类别对齐，供 products.family；具体节点仍用 sourcePaths。
 */
export const PRODUCT_FAMILIES = [
  "能源化工",
  "基础无机化工",
  "基础有机化工",
  "聚合物/树脂",
  "橡塑原料",
  "精细化工",
  "电子化学品",
  "医药原料/中间体",
  "农药原料/中间体",
  "涂料/油墨原料",
  "胶黏剂/密封材料",
  "橡塑助剂",
  "表面活性剂",
  "催化剂/助催化剂",
  "染料/颜料",
  "水处理化学品",
  "日化原料",
  "食品/饲料添加剂",
  "溶剂",
  "功能助剂",
  "新能源材料",
  "其他新材料",
  "其他化学品",
] as const;

export const TOPIC_TAGS = [
  "原油", "燃料油", "低硫燃料油", "沥青", "LPG", "石脑油",
  "纯苯", "甲苯", "PX", "苯乙烯", "PTA", "乙二醇", "聚酯",
  "甲醇", "PP", "PE", "PVC", "烧碱", "纯碱", "玻璃", "尿素",
  "天然橡胶", "合成橡胶", "纸浆",
  "精细化工", "电子化学品", "医药原料/中间体", "农药原料/中间体", "涂料/油墨原料",
  "胶黏剂/密封材料", "橡塑助剂", "表面活性剂", "催化剂/助催化剂", "染料/颜料",
  "水处理化学品", "日化原料", "食品/饲料添加剂", "溶剂", "功能助剂", "新能源材料", "其他新材料",
  "基差", "月差", "库存", "开工率", "利润", "装置检修", "新增产能", "进口", "出口", "航运",
  "招标", "采购", "项目", "投产", "扩产", "商机",
] as const;

export const ENTITY_TAGS = [
  "隆众资讯", "卓创资讯", "上海期货交易所", "上海国际能源交易中心", "大连商品交易所", "郑州商品交易所", "广州期货交易所",
  "中国海关", "国家统计局", "国家发改委", "EIA", "OPEC", "IEA",
] as const;

export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "现货": "原料来源", "报价": "原料来源", "价格": "原料来源",
  "研报": "原料来源", "策略": "原料来源", "期货研究": "原料来源",
  "求购": "商机", "采购": "商机", "招标": "商机", "供应": "商机",
  "装置": "原料来源", "检修": "原料来源", "停车": "原料来源", "复产": "原料来源", "投产": "商机",
  "库存": "原料来源", "开工": "原料来源", "开工率": "原料来源",
  "进口": "原料来源", "出口": "原料来源", "物流": "原料来源", "运费": "地缘宏观",
  "地缘": "地缘宏观", "宏观": "地缘宏观", "原油宏观": "地缘宏观",
  "政策": "地缘宏观", "交易所": "地缘宏观", "监管": "地缘宏观",
  "分析": "原料来源", "专题": "原料来源",
  "应用": "应用去向", "下游": "应用去向", "行业需求": "应用去向",
  "LLDPE": "PE", "聚乙烯": "PE", "聚丙烯": "PP", "聚氯乙烯": "PVC",
  "MEG": "乙二醇", "EG": "乙二醇", "液化石油气": "LPG",
  "精细化学品": "精细化工", "电子化学": "电子化学品", "医药中间体": "医药原料/中间体",
  "农药中间体": "农药原料/中间体", "涂料原料": "涂料/油墨原料", "油墨原料": "涂料/油墨原料",
  "胶粘剂": "胶黏剂/密封材料", "胶黏剂": "胶黏剂/密封材料",
  "橡胶助剂": "橡塑助剂", "塑料助剂": "橡塑助剂", "表活": "表面活性剂",
  "水处理剂": "水处理化学品", "新能源化学品": "新能源材料",
};

export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  business_opportunity: "原料来源",
  spot_market_update: "原料来源",
  supply_demand_event: "原料来源",
  futures_research: "原料来源",
  geopolitical_macro: "地缘宏观",
  policy_exchange: "地缘宏观",
  industry_analysis: "原料来源",
};

export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  oilchem: { name: "隆众资讯", displayTag: "隆众资讯", aliases: ["隆众", "隆众资讯", "OilChem"] },
  sci99: { name: "卓创资讯", displayTag: "卓创资讯", aliases: ["卓创", "卓创资讯", "SCI99", "chem99"] },
  shfe: { name: "上海期货交易所", displayTag: "上海期货交易所", aliases: ["上期所", "上海期货交易所", "SHFE"] },
  ine: { name: "上海国际能源交易中心", displayTag: "上海国际能源交易中心", aliases: ["上期能源", "能源中心", "INE"] },
  dce: { name: "大连商品交易所", displayTag: "大连商品交易所", aliases: ["大商所", "大连商品交易所", "DCE"] },
  czce: { name: "郑州商品交易所", displayTag: "郑州商品交易所", aliases: ["郑商所", "郑州商品交易所", "CZCE"] },
  gfex: { name: "广州期货交易所", displayTag: "广州期货交易所", aliases: ["广期所", "广州期货交易所", "GFEX"] },
  customs: { name: "中国海关", displayTag: "中国海关", aliases: ["海关总署", "中国海关"] },
  stats: { name: "国家统计局", displayTag: "国家统计局", aliases: ["国家统计局"] },
  ndrc: { name: "国家发展改革委", displayTag: "国家发改委", aliases: ["国家发展改革委", "国家发改委", "发改委"] },
  eia: { name: "U.S. EIA", displayTag: "EIA", aliases: ["EIA", "U.S. Energy Information Administration", "美国能源信息署"] },
  opec: { name: "OPEC", displayTag: "OPEC", aliases: ["OPEC", "欧佩克", "OPEC+"] },
  iea: { name: "IEA", displayTag: "IEA", aliases: ["IEA", "International Energy Agency", "国际能源署"] },
};

export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "oilchem", name: "隆众资讯", patterns: [/隆众资讯|隆众|oilchem/i] },
  { id: "sci99", name: "卓创资讯", patterns: [/卓创资讯|卓创|sci99|chem99/i] },
  { id: "shfe", name: "上海期货交易所", patterns: [/上海期货交易所|上期所|\bSHFE\b/i] },
  { id: "ine", name: "上海国际能源交易中心", patterns: [/上海国际能源交易中心|能源中心|上期能源|\bINE\b/i] },
  { id: "dce", name: "大连商品交易所", patterns: [/大连商品交易所|大商所|\bDCE\b/i] },
  { id: "czce", name: "郑州商品交易所", patterns: [/郑州商品交易所|郑商所|\bCZCE\b/i] },
  { id: "gfex", name: "广州期货交易所", patterns: [/广州期货交易所|广期所|\bGFEX\b/i] },
  { id: "eia", name: "EIA", patterns: [/\bEIA\b|Energy Information Administration|美国能源信息署/i] },
  { id: "opec", name: "OPEC", patterns: [/\bOPEC\+?\b|欧佩克/i] },
  { id: "iea", name: "IEA", patterns: [/\bIEA\b|International Energy Agency|国际能源署/i] },
];

export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "oilchem", domains: ["oilchem.net"] },
  { entityId: "sci99", domains: ["sci99.com", "chem99.com"] },
  { entityId: "shfe", domains: ["shfe.com.cn", "shfe.cn"] },
  { entityId: "eia", domains: ["eia.gov"] },
  { entityId: "opec", domains: ["opec.org"] },
  { entityId: "iea", domains: ["iea.org"] },
];

export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
