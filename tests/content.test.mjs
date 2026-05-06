import test from "node:test";
import assert from "node:assert/strict";
import { content, sectionOrder } from "../src/content.js";

const requiredSections = [
  "hero",
  "appreciation",
  "video",
  "milestones",
  "news",
  "contest",
  "profile",
  "contact"
];

test("both languages use the approved Vietnamese module order", () => {
  assert.deepEqual(sectionOrder, requiredSections);
  assert.deepEqual(Object.keys(content.vi.sections), requiredSections);
  assert.deepEqual(Object.keys(content.en.sections), requiredSections);
});

test("hero copy is exact and bilingual", () => {
  assert.equal(content.vi.sections.hero.heading, "30 NĂM BẢO CHỨNG - ĐỒNG HÀNH TRIỆU HÀNH TRÌNH");
  assert.equal(content.en.sections.hero.heading, "30 YEARS OF TRUST - ACCOMPANYING MILLIONS OF JOURNEYS");
  assert.match(content.vi.sections.hero.subtext, /Ba thập kỷ bền bỉ cống hiến/);
  assert.match(content.en.sections.hero.subtext, /For three decades of dedicated commitment/);
});

test("milestones keep all source entries in order", () => {
  assert.equal(content.vi.sections.milestones.items.length, 18);
  assert.equal(content.en.sections.milestones.items.length, 18);
  assert.deepEqual(content.vi.sections.milestones.items.map((item) => item.year), [
    "1995", "1996", "1997", "2001", "2006", "2007", "2008", "2010", "2011",
    "2013", "2015", "2016", "2018", "2021", "2022", "2023", "2024", "2025"
  ]);
  assert.match(content.vi.sections.milestones.items[2].text, /Xuất xưởng chiếc xe đầu tiên - FF3H/);
  assert.match(content.en.sections.milestones.items[17].text, /Delivered the 60,000th truck in Vietnam/);
});

test("news and contest examples remain limited to source examples", () => {
  assert.equal(content.vi.sections.news.items.length, 2);
  assert.equal(content.en.sections.news.items.length, 2);
  assert.equal(content.vi.sections.contest.items.length, 2);
  assert.equal(content.en.sections.contest.items.length, 2);
});

test("missing assets are explicitly represented", () => {
  assert.equal(content.vi.assets.videoUrl, "");
  assert.equal(content.vi.assets.companyProfileUrl, "");
  assert.equal(content.vi.sections.appreciation.quote, "<Hino cung cấp>");
});
