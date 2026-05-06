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

const requiredLanguageKeys = ["lang", "languageLabel", "assets", "nav", "sections"];

const requiredYears = [
  "1995", "1996", "1997", "2001", "2006", "2007", "2008", "2010", "2011",
  "2013", "2015", "2016", "2018", "2021", "2022", "2023", "2024", "2025"
];

const viHeroSubtext = "Ba thập kỷ bền bỉ cống hiến, Hino Motors Việt Nam không ngừng cung cấp những sản phẩm và giải pháp vận tải chất lượng cao, lấy sự hài lòng của khách hàng làm trọng tâm trong mọi hoạt động, qua đó góp phần nâng cao hiệu quả vận hành, cải thiện chất lượng sống và đồng hành cùng sự phát triển bền vững, thịnh vượng của Việt Nam.";
const enHeroSubtext = "For three decades of dedicated commitment, Hino Motors Vietnam has continuously delivered high-quality transport products and solutions, placing customer satisfaction at the center of every activity, thereby helping enhance operational efficiency, improve quality of life, and accompany Vietnam’s sustainable and prosperous development.";

test("both languages expose the locked top-level structure", () => {
  assert.deepEqual(Object.keys(content.vi), requiredLanguageKeys);
  assert.deepEqual(Object.keys(content.en), requiredLanguageKeys);
});

test("both languages use the approved Vietnamese module order", () => {
  assert.deepEqual(sectionOrder, requiredSections);
  assert.deepEqual(Object.keys(content.vi.sections), requiredSections);
  assert.deepEqual(Object.keys(content.en.sections), requiredSections);
});

test("hero copy is exact and bilingual", () => {
  assert.equal(content.vi.sections.hero.heading, "30 NĂM BẢO CHỨNG - ĐỒNG HÀNH TRIỆU HÀNH TRÌNH");
  assert.equal(content.en.sections.hero.heading, "30 YEARS OF TRUST - ACCOMPANYING MILLIONS OF JOURNEYS");
  assert.equal(content.vi.sections.hero.subtext, viHeroSubtext);
  assert.equal(content.en.sections.hero.subtext, enHeroSubtext);
});

test("milestones keep all source entries in order", () => {
  assert.equal(content.vi.sections.milestones.items.length, 18);
  assert.equal(content.en.sections.milestones.items.length, 18);
  assert.deepEqual(content.vi.sections.milestones.items.map((item) => item.year), requiredYears);
  assert.deepEqual(content.en.sections.milestones.items.map((item) => item.year), requiredYears);
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
  assert.equal(content.vi.assets.heroBannerUrl, "");
  assert.equal(content.en.assets.videoUrl, "");
  assert.equal(content.en.assets.companyProfileUrl, "");
  assert.equal(content.en.assets.heroBannerUrl, "");
  assert.equal(content.vi.sections.appreciation.quote, "<Hino cung cấp>");
  assert.equal(content.en.sections.appreciation.quote, "<Hino cung cấp>");
});
