import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;

function file(path) {
  return readFileSync(join(root, path), "utf8");
}

test("project shell files exist", () => {
  [
    "index.html",
    "src/content.js",
    "src/render.js",
    "src/smoothScroll.js",
    "src/timeline.js",
    "src/main.jsx",
    "src/App.jsx",
    "src/components/ui/button.jsx",
    "src/lib/utils.js",
    "src/styles.css",
    "src/a30new.svg",
    "src/assets/back-milestone.jpg",
    "src/assets/hinologonew.png",
    "src/assets/hinobannernew.jpg",
    "src/assets/new1.png",
    "src/assets/new2.png",
    "src/assets/a30-nav-white.svg",
    "src/assets/news-eco-driving-can-tho.jpg",
    "src/assets/news-vilog-2025.jpg",
    "src/assets/milestone-1995.jpg",
    "src/assets/milestone-1996.jpg",
    "src/assets/milestone-1997.jpg",
    "src/assets/milestone-2001.jpg",
    "src/assets/milestone-2006.jpg",
    "src/assets/milestone-2007.jpg",
    "src/assets/milestone-2008.png",
    "src/assets/milestone-2010.jpg",
    "src/assets/milestone-2011.jpg",
    "src/assets/milestone-2013.jpg",
    "src/assets/milestone-2015.jpg",
    "src/assets/milestone-2016.jpg",
    "src/assets/milestone-2018.png",
    "src/assets/milestone-2021.png",
    "src/assets/milestone-2022.png",
    "src/assets/milestone-2023.jpg",
    "src/assets/milestone-2024.jpg",
    "src/assets/milestone-2025.jpg"
  ].forEach((path) => {
    assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
  });
});

test("index loads app modules and uses a mobile-safe viewport", () => {
  const html = file("index.html");
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /src\/styles\.css/);
  assert.match(html, /src\/main\.jsx/);
  assert.match(html, /<main id="app"/);
});

test("project is configured as a Vite React app with shadcn registry support", () => {
  const pkg = JSON.parse(file("package.json"));
  const components = JSON.parse(file("components.json"));

  assert.match(pkg.scripts.dev, /vite/);
  assert.match(pkg.scripts.build, /vite build/);
  assert.match(pkg.scripts.serve, /vite --host/);
  assert.ok(pkg.dependencies.react);
  assert.ok(pkg.dependencies["react-dom"]);
  assert.ok(pkg.dependencies["@base-ui/react"]);
  assert.equal(components.$schema, "https://ui.shadcn.com/schema.json");
  assert.equal(components.style, "base-nova");
  assert.equal(components.aliases.ui, "@/components/ui");
  assert.equal(components.registries["@react-bits"], "https://reactbits.dev/r/{name}.json");
});

test("app modules expose the scaffold contract", async () => {
  const [{ sectionOrder, content }, { renderPage }, { setupTimeline }, { setupSmoothScroll }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js"),
    import("../src/timeline.js"),
    import("../src/smoothScroll.js")
  ]);

  assert.deepEqual(sectionOrder, [
    "hero",
    "appreciation",
    "statistics",
    "video",
    "milestones",
    "news",
    "profile",
    "contact"
  ]);
  assert.deepEqual(Object.keys(content).sort(), ["en", "vi"]);
  assert.equal(typeof renderPage, "function");
  assert.equal(typeof renderPage(), "string");
  assert.equal(typeof setupTimeline, "function");
  assert.equal(typeof setupTimeline(), "function");
  assert.equal(typeof setupSmoothScroll, "function");
  assert.equal(typeof setupSmoothScroll(), "function");
});

test("render module includes semantic sections and language controls", () => {
  const render = file("src/render.js");
  [
    "site-nav",
    "hero",
    "appreciation",
    "statistics",
    "video",
    "milestones",
    "news",
    "profile",
    "contact"
  ].forEach((id) => assert.match(render, new RegExp(`id="${id}"`)));
  assert.match(render, /data-lang="vi"/);
  assert.match(render, /data-lang="en"/);
  assert.match(render, /aria-label="Switch language"/);
});

test("rendered pages expose heading ids, language state, and menu label", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const vi = renderPage(content.vi, "vi");
  const en = renderPage(content.en, "en");

  ["statistics", "video", "milestones", "news", "profile"].forEach((id) => {
    assert.match(vi, new RegExp(`aria-labelledby="${id}-title"`));
    assert.match(vi, new RegExp(`id="${id}-title"`));
  });

  assert.match(vi, /aria-label="Toggle navigation"/);
  assert.match(vi, /data-lang="vi" aria-pressed="true"/);
  assert.match(vi, /data-lang="en" aria-pressed="false"/);
  assert.match(en, /data-lang="vi" aria-pressed="false"/);
  assert.match(en, /data-lang="en" aria-pressed="true"/);
});

test("rendered page uses requested Hino logo and copied footer", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");

  assert.match(html, /src="src\/assets\/hinologonew\.png"/);
  assert.match(html, /src="src\/a30new\.svg"/);
  assert.match(html, /src="src\/assets\/new1\.png"/);
  assert.doesNotMatch(html, /src="src\/assets\/hino-logo\.svg"/);
  assert.doesNotMatch(html, /src="src\/assets\/a30-mark\.svg"/);
  assert.doesNotMatch(html, /src="src\/assets\/hero-banner\.png"/);
  assert.match(html, /alt="Hino"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /SẢN PHẨM/);
  assert.match(html, /Series 300/);
  assert.match(html, /DỊCH VỤ VÀ PHỤ TÙNG/);
  assert.match(html, /FOLLOW US/);
  assert.match(html, /CÔNG TY LIÊN DOANH TNHH HINO MOTORS VIỆT NAM/);
  assert.match(html, /Tầng 15 - Tòa nhà Diamond Park Plaza/);
  assert.match(html, /Tầng 22 - Cao ốc Saigon Trade Center/);
  assert.match(html, /\+8424 73 016 017 \| \+8424 3861 6018/);
  assert.match(html, /Quy định &amp; Điều khoản/);
  assert.match(html, /Lên đầu trang/);
});

test("rendered statistics expose animated numeric counters", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");

  assert.match(html, /class="stat-number"[\s\S]*data-count-to="354"/);
  assert.match(html, /data-count-to="6.2"[\s\S]*data-count-suffix="B"/);
  assert.match(html, /class="stat-unit">NHÂN VIÊN<\/p>/);
  assert.match(html, /class="stat-meta">lũy kế FY2018-2023<\/p>/);
});


test("rendered page omits the removed contest section", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");

  assert.doesNotMatch(html, /id="contest"/);
  assert.doesNotMatch(html, /contest-card/);
  assert.doesNotMatch(html, /Cuộc thi ảnh A30/);
});

test("rendered output escapes text and filters unsafe urls", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);
  const data = structuredClone(content.vi);
  data.nav.logoHref = "javascript:alert(1)";
  data.sections.hero.heading = `<img src=x onerror="alert(1)">`;
  data.assets.videoUrl = "javascript:alert(2)";
  data.assets.companyProfileUrl = "data:text/html,<script>alert(3)</script>";

  const html = renderPage(data, "vi");

  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, /data:text\/html/i);
  assert.doesNotMatch(html, /<img src=x/i);
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.match(html, /class="brand-lockup" href="#"/);
  assert.doesNotMatch(html, /<iframe/);
  assert.doesNotMatch(html, /aria-disabled="true"/);
  assert.match(html, /class="asset-status"/);
});

test("rendered output rejects control-character url obfuscation", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);
  const data = structuredClone(content.vi);
  data.nav.logoHref = "java\nscript:alert(1)";
  data.assets.videoUrl = "jav\tascript:alert(2)";
  data.assets.companyProfileUrl = "java\rscript:alert(3)";

  const html = renderPage(data, "vi");

  assert.doesNotMatch(html, /java\s*script:/i);
  assert.doesNotMatch(html, /jav\s*ascript:/i);
  assert.match(html, /class="brand-lockup" href="#"/);
  assert.doesNotMatch(html, /<iframe/);
  assert.doesNotMatch(html, /aria-disabled="true"/);
  assert.match(html, /class="asset-status"/);
});

test("rendered cards keep active CTAs when item hrefs are missing", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const dataWithoutHref = structuredClone(content.vi);
  dataWithoutHref.sections.news.items.forEach((item) => {
    delete item.href;
  });
  const withoutHref = renderPage(dataWithoutHref, "vi");
  const staleCardCopy = ["Sắp", "cập nhật"].join(" ");
  assert.match(withoutHref, /class="text-link" href="#news">XEM THÊM<\/a>/);
  assert.doesNotMatch(withoutHref, /class="text-status"/);
  assert.doesNotMatch(withoutHref, new RegExp(staleCardCopy));

  const data = structuredClone(content.vi);
  data.sections.news.items[0].href = "/news/a30";
  const withHref = renderPage(data, "vi");
  assert.match(withHref, /class="text-link" href="\/news\/a30">XEM THÊM<\/a>/);
});

test("rendered news and milestones use real local images", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");

  assert.match(html, /<figure class="card-media"><img class="card-image" src="src\/assets\/news-vilog-2025\.jpg" alt="Recap sự kiện kỷ niệm 30 năm Hino Motors Việt Nam" loading="lazy"><\/figure>/);
  assert.match(html, /<img class="milestone-image" src="src\/assets\/milestone-1995\.jpg" alt="1995 milestone image" loading="lazy">/);
  assert.match(html, /<img class="milestone-image" src="src\/assets\/milestone-2025\.jpg" alt="2025 milestone image" loading="lazy">/);
  assert.match(html, /<img class="milestone-image milestone-image-anniversary" src="src\/a30new\.svg" alt="A30 anniversary logo" loading="lazy">/);
});

test("rendered milestones expose horizontal scroll-pinned timeline", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");

  assert.match(html, /class="timeline-viewport" tabindex="0"/);
  assert.match(html, /class="timeline-intro-panel"/);
  assert.match(html, /class="timeline-intro-mark" src="src\/a30new\.svg" alt="A30" loading="lazy"/);
  assert.match(html, /data-timeline-prev/);
  assert.match(html, /data-timeline-next/);
  assert.doesNotMatch(html, /class="timeline-rail"/);
  assert.doesNotMatch(html, /class="timeline-progress"/);
});

test("rendered milestones use coded reference-style timeline structure", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);
  const css = file("src/styles.css");
  const html = renderPage(content.vi, "vi");

  assert.match(html, /class="timeline-canvas"/);
  assert.match(html, /class="timeline-section-index" aria-hidden="true">II<\/span>/);
  assert.match(html, /class="milestone-index" aria-hidden="true">19<\/span>/);
  assert.match(html, /class="milestone-date">1995<\/p>/);
  assert.match(html, /class="milestone-title">Mở văn phòng đại diện tại Hà Nội<\/h3>/);
  assert.match(html, /class="milestone-event is-anniversary"/);
  assert.match(html, /class="milestone-image milestone-image-anniversary"/);
  assert.doesNotMatch(html, /class="milestone-stem"/);
  assert.doesNotMatch(html, /class="milestone-node"/);
  assert.doesNotMatch(html, /milestone-reference\.png/);
  assert.match(css, /\.timeline-canvas\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.milestone-event\s*\{[^}]*position:\s*relative/s);
  assert.match(css, /\.timeline-section\s*\{[^}]*min-height:\s*100svh/s);
  assert.match(css, /\.timeline-intro-panel\s*\{[^}]*border-right:\s*1px solid rgba\(201,\s*0,\s*0,\s*0\.12\)/s);
  assert.match(css, /\.milestone-index\s*\{[^}]*color:\s*rgba\(201,\s*0,\s*0,\s*0\.075\)/s);
  assert.match(css, /\.milestone-event\.is-current/);
  assert.match(css, /\.milestone-image-anniversary/);
});

test("rendered page avoids design-slop placeholders and preserves the supplied banner artwork", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const html = renderPage(content.vi, "vi");
  const heroBanner = html.match(/<section class="hero-banner"[\s\S]*?<\/section>/)?.[0] || "";

  assert.doesNotMatch(html, /picsum\.photos/);
  assert.match(html, /<section class="hero-banner" id="hero" aria-label="Hino 30 years anniversary banner">/);
  assert.match(html, /<img class="a30-mark-image a30-mark-default" src="src\/a30new\.svg" width="72" height="50" alt="A30">/);
  assert.match(html, /<img class="a30-mark-image a30-mark-hero" src="src\/assets\/a30-nav-white\.svg" width="72" height="50" alt="" aria-hidden="true">/);
  assert.match(html, /<img class="hero-image-full" src="src\/assets\/new1\.png" width="2752" height="1536" alt="Hino 30 years hero banner" fetchpriority="high">/);
  assert.doesNotMatch(heroBanner, /<h1 id="hero-title">/);
  assert.match(html, /<section class="hero-action-strip" aria-labelledby="hero-title">[\s\S]*class="hero-actions"/);
  assert.match(html, /<h1 id="hero-title" class="hero-title">[\s\S]*hero-title-line[\s\S]*VỮNG[\s\S]*VÀNG[\s\S]*hero-title-line[\s\S]*CÙNG[\s\S]*PHÁT[\s\S]*TRIỂN[\s\S]*<\/h1>/);
  assert.match(html, /<p class="hero-copy">[\s\S]*hero-copy-reveal/);
});

test("build asset copier includes root-level anniversary mark", () => {
  const script = file("scripts/copy-assets.mjs");
  assert.match(script, /src\/a30new\.svg/);
  assert.match(script, /dist\/src\/a30new\.svg/);
});

test("rendered hero actions and language toggle are localized and grouped", async () => {
  const [{ content }, { renderPage }] = await Promise.all([
    import("../src/content.js"),
    import("../src/render.js")
  ]);

  const vi = renderPage(content.vi, "vi");
  const en = renderPage(content.en, "en");

  assert.match(vi, /<div class="language-toggle" role="group" aria-label="Switch language">/);
  assert.match(vi, /href="#milestones">Hành trình 30 năm<\/a>/);
  assert.match(vi, /href="#news">Tin tức<\/a>/);
  assert.match(vi, /href="#contact">Liên hệ<\/a>/);
  assert.match(vi, /href="#video">Video<\/a>/);
  assert.match(en, /href="#milestones">Milestones<\/a>/);
  assert.match(en, /href="#news">News<\/a>/);
  assert.match(en, /href="#contact">Contact<\/a>/);
  assert.match(en, /href="#video">Video<\/a>/);
});

test("css includes approved UI/UX Pro Max quality gates", () => {
  const css = file("src/styles.css");
  assert.match(css, /--hino-red:\s*#c90000/);
  assert.match(css, /Helvetica Neue/);
  assert.match(css, /section-pattern/);
  assert.match(css, /url\("\.\/assets\/back-milestone\.jpg"\)/);
  assert.doesNotMatch(css, /\.hino-logo\s*\{[^}]*border-radius/s);
  assert.doesNotMatch(css, /\.hino-logo\s*\{[^}]*box-shadow/s);
  assert.match(css, /\.hero-banner/);
  assert.match(css, /\.site-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /\.site-nav\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.site-nav\.is-scrolled,\s*\.site-nav\.is-menu-open\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.94\)/s);
  assert.match(css, /\.a30-mark-default\s*\{[^}]*opacity:\s*0/s);
  assert.match(css, /\.a30-mark-hero\s*\{[^}]*opacity:\s*1/s);
  assert.match(css, /\.site-nav\.is-scrolled \.a30-mark-default,\s*\.site-nav\.is-menu-open \.a30-mark-default\s*\{[^}]*opacity:\s*1/s);
  assert.match(css, /\.hero-banner\s*\{[^}]*min-height:\s*100svh/s);
  assert.doesNotMatch(css, /\.hero-banner::before/);
  assert.match(css, /\.hero-image-full\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(css, /\.hero-image-full\s*\{[^}]*height:\s*100%/s);
  assert.match(css, /\.hero-image-full\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*?\.hero-image-full\s*\{[^}]*object-fit:\s*contain/s);
  assert.doesNotMatch(css, /hero-image-full\s*\{[^}]*min-width/s);
  assert.doesNotMatch(css, /hero-image-full\s*\{[^}]*transform:\s*scale/s);
  assert.doesNotMatch(css, /\.hero-banner:hover/);
  assert.doesNotMatch(css, /\.hero-banner::after/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /animation:\s*grid-flow/);
  assert.doesNotMatch(css, /@keyframes grid-flow/);
  assert.doesNotMatch(css, /filter:\s*brightness\(0\.8\)/);
});

test("css avoids responsive overflow and focus clipping regressions", () => {
  const css = file("src/styles.css");
  assert.match(css, /@media \(max-width:\s*900px\)/);
  assert.doesNotMatch(css, /letter-spacing:\s*-/);
  assert.doesNotMatch(css, /html\s*\{[^}]*overflow-x\s*:/s);
  assert.doesNotMatch(css, /body\s*\{[^}]*overflow-x\s*:/s);
  assert.doesNotMatch(css, /\.language-toggle\s*\{[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(css, /\.timeline-section\s*\{[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(
    css,
    /\.hero-content\s*\{[^}]*width:\s*min\(760px,\s*calc\(100%\s*-\s*36px\)\)[^}]*margin-left:/s
  );
});

test("timeline uses GSAP ScrollTrigger pin and respects reduced motion", () => {
  const js = file("src/timeline.js");
  const css = file("src/styles.css");
  assert.match(js, /setupTimeline/);
  assert.match(js, /ScrollTrigger/);
  assert.match(js, /pin:\s*true/);
  assert.match(js, /scrub/);
  assert.match(js, /is-active/);
  assert.match(js, /is-current/);
  assert.match(js, /aria-current/);
  assert.match(js, /setInterval/);
  assert.match(js, /data-timeline-next/);
  assert.match(js, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.milestone-event\.is-active/);
  assert.match(css, /\.timeline-intro-panel/);
  assert.doesNotMatch(css, /\.timeline-progress\s*\{/);
});

test("smooth scrolling uses Lenis and stays synchronized with ScrollTrigger", () => {
  const smoothScroll = file("src/smoothScroll.js");
  const css = file("src/styles.css");
  assert.match(smoothScroll, /from "lenis"/);
  assert.match(css, /lenis\/dist\/lenis\.css/);
  assert.match(smoothScroll, /anchors:\s*{/);
  assert.match(smoothScroll, /window\.location\.hash/);
  assert.match(smoothScroll, /lenis\.scrollTo/);
  assert.match(smoothScroll, /ScrollTrigger\.update/);
  assert.match(smoothScroll, /gsap\.ticker\.add/);
  assert.match(smoothScroll, /lenis\.destroy\(\)/);
});

test("css omits the removed contest section styles", () => {
  const css = file("src/styles.css");
  assert.doesNotMatch(css, /\.contest-/);
  assert.doesNotMatch(css, /\.marquee-/);
});

test("rendering protects missing video and profile assets", () => {
  const render = file("src/render.js");
  assert.match(render, /Video placeholder - awaiting Hino YouTube link/);
  assert.match(render, /asset-status/);
  assert.doesNotMatch(render, /aria-disabled="true"/);
  assert.match(render, /companyProfileUrl/);
  assert.doesNotMatch(render, new RegExp(["Sắp", "cập nhật"].join(" ")));
  assert.doesNotMatch(render, new RegExp(["Hồ sơ công ty", "sẽ được cập nhật"].join(" ")));
  assert.doesNotMatch(render, /fake\.pdf/);
});
