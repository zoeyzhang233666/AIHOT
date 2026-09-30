import { SITE, withSubject } from "@aihot/industry/site";
import { Link, useLoaderData } from "react-router";
import { apiGet } from "../lib/api.server";
import { pageMeta } from "../lib/seo";

interface TopicSummary {
  slug: string;
  name: string;
  group: "company" | "field" | "genre";
  definition: string;
  total: number;
  recent: number;
  indexable: boolean;
  latestAt: string | null;
}

export async function loader({ request }: { request: Request }) {
  return apiGet<{ topics: TopicSummary[] }>("/api/site/topics", { signal: request.signal });
}

export function meta() {
  return pageMeta({
    title: "主题",
    description: `按产业主体、品种赛道与内容形态浏览 ${SITE.name} 的化工主题索引：交易所与资讯机构、原油/聚酯/甲醇等品种，以及现货、研报、装置与地缘等形态。`,
    path: "/topics",
    image: "/og/pages/topics.png",
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}

const GROUPS = [
  { key: "company", name: "产业主体", blurb: "资讯机构、交易所与能源中心：一手公告与产业研究从哪来" },
  { key: "field", name: "品种与赛道", blurb: "原油、芳烃、聚酯、甲醇、氯碱、电子化学品……按产品链追踪" },
  { key: "genre", name: "内容形态", blurb: "现货行情、期货研报、装置供需、地缘与政策等阅读入口" },
] as const;

export default function TopicsPage() {
  const { topics } = useLoaderData<typeof loader>();
  return (
    <div className="pb-10">
      <header className="pb-2 pt-5 lg:pt-1">
        <h1 className="text-[24px] font-semibold leading-[1.3] text-ink">按主题看{SITE.subject}</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
          按产业主体、品种赛道与内容形态浏览 <span className="num">{topics.length}</span> 个主题，汇集与{withSubject("产业链")}相关的精选动态。
        </p>
      </header>
      {GROUPS.map((g) => (
        <section key={g.key} aria-labelledby={`topics-${g.key}`} className="pt-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h2 id={`topics-${g.key}`} className="text-[15px] font-bold text-ink">
              {g.name}
            </h2>
            <p className="text-[12px] text-ink-4">{g.blurb}</p>
          </div>
          <ul className="mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topics
              .filter((t) => t.group === g.key)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/topics/${t.slug}`}
                    prefetch="intent"
                    aria-label={`查看${t.name}相关精选文章`}
                    className="card card-hover group flex h-full flex-col px-5 py-[18px]"
                  >
                    <span className="text-[15px] font-bold text-ink transition-colors group-hover:text-accent">{t.name}</span>
                    <span className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-[1.7] text-ink-3">{t.definition}</span>
                    <span className="mono mt-3 text-[11.5px] text-accent">
                      查看 {t.total} 条精选 <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
