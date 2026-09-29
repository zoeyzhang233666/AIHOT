// 站点身份和读者看得到的文案。站点地址在部署时用 SITE_URL 设置。

export const SITE = {
  name: "ChemHOT",
  subject: "化工",
  homeTitle: "ChemHOT — 化工现货与期货热点 · 商机、研报与市场事件",
  description: "聚合化工现货商机、产业资讯、期货公司研报、交易所公告与全球地缘事件，用模型筛选、归并并解释它们对化工现货和期货市场的影响。",
  tagline: "化工现货与期货，每天真正值得关注的变化",
  locale: "zh-CN",
  defaultUrl: "http://localhost:3000",
  mcpPrefix: "chemhot",
  contactEmail: null as string | null,
  footerNote: "化工现货与期货热点聚合与阅读索引",
  icp: null as string | null,
  organization: {
    name: "ChemHOT",
    founder: null as null | { name: string; url?: string; description?: string },
  },
  crawlerName: "ChemHOTBot",
} as const;

export const ABOUT = {
  kicker: `关于 ${SITE.name}`,
  headline: ["化工市场每天都有大量变化，", "真正影响价格和商机的，只有一部分。"] as [string, string],
  lead: `${SITE.name} 替你盯着 {sources} 个信源：现货企业商机、产业资讯、期货研报、交易所公告与海外能源地缘事件，自动抓取、归并、打分和精选，每天生成一份化工日报。`,
  steps: {
    collect: "跟踪公开交易所、政府与能源机构信息，同时为隆众资讯、卓创资讯、期货公司研报和企业商机数据预留授权或内部数据接入口。",
    store: "把同一装置、同一政策、同一供需变化或同一地缘事件的多篇报道归并到一起，保留时间、来源和原文链接。",
    select: "模型优先识别能改变供需、价格、基差、库存、开工、进出口、利润或企业采购销售机会的信息，压低软文、重复转发和无实质变化的行情复述。",
    publish: "按现货、期货研报、商机供需、装置库存、地缘宏观等维度发布热点，并生成日报、周报和月报。",
  },
  maker: null as null | {
    name: string;
    greeting: string[];
    avatarSourceId?: string | null;
    wechat?: { title: string; note: string };
    feishu?: { title: string; note: string };
  },
  copyright: `${SITE.name} 只做聚合摘要和阅读索引，原文版权归各来源所有。付费、授权或受限内容默认不展示全文；如需更正、下架或调整展示方式，可以通过`,
} as const;

export function withSubject(noun: string): string {
  return /[A-Za-z0-9]$/.test(SITE.subject) ? `${SITE.subject} ${noun}` : `${SITE.subject}${noun}`;
}
