// 站点身份和读者看得到的文案。站点地址在部署时用 SITE_URL 设置。

export const SITE = {
  name: "ChemHOT",
  subject: "化工",
  homeTitle: "ChemHOT — 产业链商机资讯",
  description: "基于完整化工原料来源路径与应用去向产业链图，聚合国内外商机、装置供需与地缘宏观，点节点即可查看挂接资讯。",
  tagline: "在产业链上找商机",
  locale: "zh-CN",
  defaultUrl: "http://localhost:3000",
  mcpPrefix: "chemhot",
  contactEmail: null as string | null,
  footerNote: "化工产业链商机资讯聚合与阅读索引",
  icp: null as string | null,
  organization: {
    name: "ChemHOT",
    founder: null as null | { name: string; url?: string; description?: string },
  },
  crawlerName: "ChemHOTBot",
} as const;

export const ABOUT = {
  kicker: `关于 ${SITE.name}`,
  headline: ["化工商机藏在产业链节点上，", "散落的资讯需要一张可点的图。"] as [string, string],
  lead: `${SITE.name} 按原料来源（线1）与应用去向（线2）画出完整产业链，盯着 {sources} 个信源抓取招标、采购、项目、装置与地缘事件，挂到对应节点并优先突出可跟进的商机。`,
  steps: {
    collect: "跟踪公开招标与政务、产业资讯、能源机构与海外地缘信息；隆众、卓创、期货研报等授权或内部源经推送接入。",
    store: "把资讯归到线1/线2 节点（可同时挂原料与应用），同一装置、项目或地缘事件归并，保留时间、来源和原文链接。",
    select: "优先识别能落地的采购销售机会与改变供需/成本的事件；压低软文、重复转发和无实质变化的行情复述。",
    publish: "在可交互产业链图上按原料来源、应用去向、地缘宏观浏览，点击节点查看商机与相关动态，并生成日报。",
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
