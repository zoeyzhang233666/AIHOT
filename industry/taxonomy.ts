/**
 * ChemHOT 行业分类、标签、产品族和主体词表。
 * category key / topic slug 上线后不要随意修改。
 */

export const CATEGORIES = [
  { key: "spot-market", label: "现货", section: "现货与产业动态", guide: "化工品现货价格、企业报价、成交、装置、库存、开工、利润、进口、出口、物流和区域供需变化" },
  { key: "futures-research", label: "期货研报", section: "期货与研究", guide: "期货公司和研究机构对能源化工品种的日报、周报、专题、策略、基差、月差、库存和供需研究" },
  { key: "business-opportunity", label: "商机", section: "企业商机", guide: "真实采购、招标、求购、供应、扩产、投产、项目建设、原料需求、渠道与进出口商机；包括精细化工长尾产品" },
  { key: "supply-demand", label: "供需", section: "供需与产业链", guide: "产能、装置检修与停车、复产、库存、开工率、产量、消费、利润和上下游供需变化" },
  { key: "geo-macro", label: "地缘宏观", section: "地缘与宏观", guide: "战争、制裁、航运中断、OPEC、原油天然气、汇率、利率和宏观事件对能源化工成本与预期的影响" },
  { key: "policy-exchange", label: "政策交易所", section: "政策与交易所", guide: "交易所规则、限仓与保证金、交割、仓单、政府产业政策、环保安全、进出口与监管政策" },
  { key: "industry-analysis", label: "行业分析", section: "行业分析", guide: "产业机构、企业和研究者对化工产业链、价格驱动、竞争格局和中长期趋势的分析" },
] as const;

export const ITEM_TYPES = [
  "spot_market_update",
  "futures_research",
  "business_opportunity",
  "supply_demand_event",
  "geopolitical_macro",
  "policy_exchange",
  "industry_analysis",
] as const;

export const CATEGORY_TAGS = [
  "现货行情",
  "期货研报",
  "商机供需",
  "装置/产能",
  "库存/开工",
  "进出口/物流",
  "地缘/宏观",
  "政策/交易所",
  "行业分析",
  "其他",
] as const;

/**
 * 产品族是独立于新闻类别的一层。
 * 具体精细化工产品不进入固定白名单，而由 structure 动态抽取 name/CAS/规格。
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
  "原油","燃料油","低硫燃料油","沥青","LPG","石脑油",
  "纯苯","甲苯","PX","苯乙烯","PTA","乙二醇","聚酯",
  "甲醇","PP","PE","PVC","烧碱","纯碱","玻璃","尿素",
  "天然橡胶","合成橡胶","纸浆",
  "精细化工","电子化学品","医药原料/中间体","农药原料/中间体","涂料/油墨原料",
  "胶黏剂/密封材料","橡塑助剂","表面活性剂","催化剂/助催化剂","染料/颜料",
  "水处理化学品","日化原料","食品/饲料添加剂","溶剂","功能助剂","新能源材料","其他新材料",
  "基差","月差","库存","开工率","利润","装置检修","新增产能","进口","出口","航运",
] as const;

export const ENTITY_TAGS = [
  "隆众资讯","卓创资讯","上海期货交易所","上海国际能源交易中心","大连商品交易所","郑州商品交易所","广州期货交易所",
  "中国海关","国家统计局","国家发改委","EIA","OPEC","IEA",
] as const;

export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "现货": "现货行情", "报价": "现货行情", "价格": "现货行情",
  "研报": "期货研报", "策略": "期货研报", "期货研究": "期货研报",
  "求购": "商机供需", "采购": "商机供需", "招标": "商机供需", "供应": "商机供需",
  "装置": "装置/产能", "检修": "装置/产能", "停车": "装置/产能", "复产": "装置/产能", "投产": "装置/产能",
  "库存": "库存/开工", "开工": "库存/开工", "开工率": "库存/开工",
  "进口": "进出口/物流", "出口": "进出口/物流", "物流": "进出口/物流", "运费": "进出口/物流",
  "地缘": "地缘/宏观", "宏观": "地缘/宏观", "原油宏观": "地缘/宏观",
  "政策": "政策/交易所", "交易所": "政策/交易所", "监管": "政策/交易所",
  "分析": "行业分析", "专题": "行业分析",
  "LLDPE": "PE", "聚乙烯": "PE", "聚丙烯": "PP", "聚氯乙烯": "PVC",
  "MEG": "乙二醇", "EG": "乙二醇", "液化石油气": "LPG",
  "精细化学品": "精细化工", "电子化学": "电子化学品", "医药中间体": "医药原料/中间体",
  "农药中间体": "农药原料/中间体", "涂料原料": "涂料/油墨原料", "油墨原料": "涂料/油墨原料",
  "胶粘剂": "胶黏剂/密封材料", "胶黏剂": "胶黏剂/密封材料",
  "橡胶助剂": "橡塑助剂", "塑料助剂": "橡塑助剂", "表活": "表面活性剂",
  "水处理剂": "水处理化学品", "新能源化学品": "新能源材料",
};

export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  spot_market_update: "现货行情",
  futures_research: "期货研报",
  business_opportunity: "商机供需",
  supply_demand_event: "装置/产能",
  geopolitical_macro: "地缘/宏观",
  policy_exchange: "政策/交易所",
  industry_analysis: "行业分析",
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
