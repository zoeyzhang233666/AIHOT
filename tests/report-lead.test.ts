// A daily's front-page picture comes from the item its lead is about: the editors' lead matched to an
// item by title, never simply the first highlight.
import "./setup.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ReportCitation } from "@aihot/contracts/site";
import { leadItemOf } from "@aihot/backend/publication/reports";

const cite = (itemId: string, title: string) => ({ itemId, title }) as ReportCitation;
const inventory = cite("a", "华东甲醇港口库存连续第二周下降，现货基差走强");
const outage = cite("b", "伊朗大型甲醇装置计划外停车，市场关注后续中国进口到港");

test("an editors' lead is matched to the item it is written about", () => {
  assert.equal(leadItemOf("伊朗大型甲醇装置计划外停车，市场关注进口影响", [inventory, outage], [inventory, outage])?.itemId, "b");
});

test("a lead that matches no item clearly has no item", () => {
  assert.equal(leadItemOf("原油与纯碱成为本周两条市场主线", [inventory], [inventory, outage]), undefined);
});

test("without an editors' lead the first highlight leads", () => {
  assert.equal(leadItemOf(undefined, [inventory], [outage, inventory])?.itemId, "a");
});
