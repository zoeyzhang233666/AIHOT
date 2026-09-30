import { SITE } from "@aihot/industry/site";
import { data as withHeaders, redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import type { TimelineResponse } from "@aihot/contracts/site";
import { isCategoryKey, isChannelKey } from "@aihot/contracts/taxonomy";
import { loadOr404, queryString, releaseBoundCache } from "../lib/api.server";
import { listPath, organizationLd, pageMeta } from "../lib/seo";
import { Wordmark } from "../components/Logo";
import { Timeline } from "../features/feed/Timeline";
import { HotTopics } from "../features/feed/HotTopics";
import { CategoryTabs, SearchField, SearchIconLink } from "../features/feed/Filters";
import { ChainExplorer } from "../features/chain/ChainExplorer";
import { beijingDate, beijingWeekday } from "../lib/format";
import { parseChainTag, nodeLabel } from "../features/chain/trees";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (q && q.trim()) throw redirect(`/all${url.search}`);
  const channelParam = url.searchParams.get("channel") ?? "all";
  const categoryParam = url.searchParams.get("category");
  const channel = isChannelKey(channelParam) ? channelParam : "all";
  const category = categoryParam && isCategoryKey(categoryParam) ? categoryParam : null;
  const tag = url.searchParams.get("tag")?.trim() || null;
  const upstream = new Headers();
  const data = await loadOr404<TimelineResponse>(
    `/api/site/timeline${queryString({
      channel: channel === "all" ? null : channel,
      category,
      tag,
    })}`,
    { responseHeaders: upstream, signal: request.signal },
  );
  return withHeaders({ data, filters: { channel, category, tag, topic: null, opportunity: false } }, { headers: releaseBoundCache(data.refreshAt, 60, Date.now(), upstream) });
}

export function meta({ loaderData }: Route.MetaArgs) {
  const f = loaderData?.filters;
  const path = listPath("/", { channel: f && f.channel !== "all" ? f.channel : null, category: f?.category, tag: f?.tag });
  return pageMeta({ path, jsonLd: path === "/" ? organizationLd() : undefined });
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

function TodayLabel() {
  const today = beijingDate(Date.now());
  const [, m, d] = today.split("-").map(Number) as [number, number, number];
  return (
    <span className="text-[12.5px] text-ink-4" suppressHydrationWarning>
      {m}月{d}日 · {beijingWeekday(today).replace("星期", "周")}
    </span>
  );
}

function feedTitle(filters: { tag: string | null; category: string | null }) {
  if (filters.tag) {
    const parsed = parseChainTag(filters.tag);
    if (parsed) return nodeLabel(parsed.lens, parsed.nodeId);
    return `#${filters.tag}`;
  }
  if (filters.category === "macro") return "地缘宏观";
  if (filters.category === "application") return "应用去向";
  if (filters.category === "source-path") return "原料来源";
  return "精选";
}

export default function Home() {
  const { data, filters } = useLoaderData<typeof loader>();
  const title = feedTitle(filters);
  const showMap = filters.category !== "macro";
  return (
    <div className="pb-6">
      <div className="flex h-14 items-center justify-between lg:hidden">
        <Wordmark size={20} className="text-ink" />
        <TodayLabel />
      </div>
      <div className="hidden lg:block">
        <h1 className="text-[24px] font-semibold leading-[1.3] text-ink">{SITE.tagline}</h1>
        <p className="mt-1 text-[13px] text-ink-3">在完整产业链图上点选节点，查看挂接的资讯与动态</p>
        <div className="mb-2 mt-4 flex flex-wrap items-center gap-3">
          <CategoryTabs base="/" category={filters.category} channel={filters.channel} layoutId="home-cat-desk" className="min-w-0" />
          <div className="ml-auto">
            <SearchField
              variant="track"
              keep={{
                category: filters.category,
                tag: filters.tag,
              }}
            />
          </div>
        </div>
      </div>

      <div className="-mx-4 mt-1 flex items-center gap-2 pl-4 pr-2 lg:hidden">
        <CategoryTabs base="/" category={filters.category} channel={filters.channel} layoutId="home-cat-mobile" size="sm" className="min-w-0 flex-1" />
        <SearchIconLink />
      </div>

      {showMap && <ChainExplorer base="/" category={filters.category} tag={filters.tag} />}

      {data.hot && !filters.category && !filters.tag && <HotTopics entries={data.hot} />}

      <h2 className="mt-6 text-[20px] font-bold text-ink">{title === "精选" ? "最新精选" : title}</h2>
      <Timeline initial={data} filters={data.filters} />
    </div>
  );
}
