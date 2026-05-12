function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const safeUrlBase = "https://hino.local/";
const heroActionLabels = {
  vi: {
    milestones: "Hành trình 30 năm",
    video: "Video"
  },
  en: {
    milestones: "Milestones",
    video: "Video"
  }
};
const unavailableLabels = {
  vi: {
    video: "Video sẽ được cập nhật",
    profile: "Hồ sơ công ty sẽ được cập nhật",
    card: "Sắp cập nhật"
  },
  en: {
    video: "Video coming soon",
    profile: "Company profile coming soon",
    card: "Coming soon"
  }
};
const contestCardCount = 5;

function safeUrl(value, fallback = "#", options = {}) {
  const { allowHash = true } = options;
  const rawUrl = String(value || "");
  const url = rawUrl.trim();

  if (!url || /[\u0000-\u001F\u007F]/.test(rawUrl)) {
    return escapeHtml(fallback);
  }

  if (url.startsWith("#")) {
    return escapeHtml(allowHash ? url : fallback);
  }

  try {
    const parsed = new URL(url, safeUrlBase);
    const base = new URL(safeUrlBase);
    const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      if (!hasExplicitScheme && parsed.origin !== base.origin) {
        return escapeHtml(fallback);
      }

      return escapeHtml(url);
    }
  } catch {
    return escapeHtml(fallback);
  }

  return escapeHtml(fallback);
}

function hasSafeUrl(value, options = {}) {
  return safeUrl(value, "", options) !== "";
}

function mediaPlaceholder(label, className = "") {
  return `
    <div class="media-placeholder ${className}" role="img" aria-label="${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function sectionHeading(section, headingId, kicker = "") {
  return `
    <div class="section-heading">
      ${kicker ? `<p class="eyebrow">${escapeHtml(kicker)}</p>` : ""}
      <h2 id="${escapeHtml(headingId)}">${escapeHtml(section.heading)}</h2>
      ${section.subtext ? `<p>${escapeHtml(section.subtext)}</p>` : ""}
    </div>
  `;
}

function renderHeroTitle(heading) {
  const text = String(heading || "");
  const match = text.match(/^(30\s+(?:NĂM|YEARS))\s+(.+)$/);

  if (!match) {
    return `<h1 id="hero-title" class="hero-title">${escapeHtml(text)}</h1>`;
  }

  return `
        <h1 id="hero-title" class="hero-title">
          <span class="hero-title-count">${escapeHtml(match[1])}</span>
          <span class="hero-title-main">${escapeHtml(match[2])}</span>
        </h1>
  `;
}

function renderNav(data, activeLang) {
  const links = data.nav.links
    .map(([id, label]) => `<a href="${safeUrl(`#${id}`)}">${escapeHtml(label)}</a>`)
    .join("");

  return `
    <header class="site-nav" id="site-nav">
      <a class="brand-lockup" href="${safeUrl(data.nav.logoHref)}" aria-label="${escapeHtml(data.nav.homeLabel)}">
        <img class="hino-logo" src="src/assets/hinologonew.png" width="52" height="52" alt="Hino">
        <span class="logo-divider"></span>
        <img class="a30-mark" src="src/a30new.svg" width="72" height="50" alt="A30">
      </a>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-links" id="nav-links" aria-label="Primary navigation">
        ${links}
      </nav>
      <div class="language-toggle" role="group" aria-label="Switch language">
        <button type="button" data-lang="vi" aria-pressed="${activeLang === "vi"}">VI</button>
        <button type="button" data-lang="en" aria-pressed="${activeLang === "en"}">EN</button>
      </div>
    </header>
  `;
}

function renderCarouselButton(direction, label) {
  const path = direction === "prev"
    ? "M15 18l-6-6 6-6M9 12h12"
    : "M9 6l6 6-6 6m-6-6h12";

  return `
    <button class="carousel-button" type="button" data-carousel-${direction} aria-label="${escapeHtml(label)}">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
        <path d="${path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
  `;
}

function renderHero(section, activeLang, assets) {
  const labels = heroActionLabels[activeLang] || heroActionLabels.vi;
  const hasHeroBannerUrl = hasSafeUrl(assets.heroBannerUrl, { allowHash: false });
  const heroBannerUrl = safeUrl(assets.heroBannerUrl, "", { allowHash: false });

  return `
    <section class="hero-banner" id="hero" aria-label="Hino 30 years anniversary banner">
      ${hasHeroBannerUrl ? `<img class="hero-image-full" src="${heroBannerUrl}" alt="Hino 30 years hero banner">` : ""}
    </section>
    <section class="hero-action-strip" aria-labelledby="hero-title">
      <div class="hero-action-copy">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        ${renderHeroTitle(section.heading)}
      </div>
      <div class="hero-action-side">
        <p class="hero-copy">${escapeHtml(section.subtext)}</p>
        <div class="hero-actions">
          <a class="button primary" href="#milestones">${escapeHtml(labels.milestones)}</a>
          <a class="button secondary" href="#video">${escapeHtml(labels.video)}</a>
        </div>
      </div>
    </section>
  `;
}

function renderAppreciation(section) {
  const headingParts = section.heading.split(" & ");
  const headingHtml = headingParts.length === 2
    ? `${escapeHtml(headingParts[0])} &amp;<br>${escapeHtml(headingParts[1])}`
    : escapeHtml(section.heading);

  return `
    <section class="split-section section-pattern" id="appreciation" aria-labelledby="appreciation-title">
      ${mediaPlaceholder("TGĐ photo placeholder", "portrait-placeholder")}
      <div class="split-copy">
        <h2 id="appreciation-title">${headingHtml}</h2>
        <blockquote>${escapeHtml(section.quote)}</blockquote>
        <p class="person-line">${escapeHtml(section.nameTitle)}</p>
      </div>
    </section>
  `;
}

function renderVideo(section, assets, activeLang) {
  const labels = unavailableLabels[activeLang] || unavailableLabels.vi;
  const hasVideoUrl = hasSafeUrl(assets.videoUrl, { allowHash: false });
  const videoUrl = safeUrl(assets.videoUrl, "#", { allowHash: false });
  const videoBody = hasVideoUrl
    ? `<iframe src="${videoUrl}" title="${escapeHtml(section.heading)}" allowfullscreen></iframe>`
    : mediaPlaceholder("Video placeholder - awaiting Hino YouTube link", "video-placeholder");
  const cta = hasVideoUrl
    ? `<a class="button primary" href="${videoUrl}">${escapeHtml(section.cta)}</a>`
    : `<p class="asset-status">${escapeHtml(labels.video)}</p>`;

  return `
    <section class="content-band section-pattern" id="video" aria-labelledby="video-title">
      ${sectionHeading(section, "video-title")}
      <div class="video-frame">${videoBody}</div>
      ${cta}
    </section>
  `;
}

function renderMilestones(section) {
  const items = section.items
    .map((item, index) => {
      const position = index % 2 === 0 ? "top" : "bottom";
      const hasImage = hasSafeUrl(item.imageUrl, { allowHash: false });
      const image = hasImage
        ? `<img class="milestone-image" src="${safeUrl(item.imageUrl, "", { allowHash: false })}" alt="${escapeHtml(item.imageAlt || `${item.year} milestone image`)}" loading="lazy">`
        : mediaPlaceholder(item.imageAlt, "milestone-image");

      return `
      <div class="milestone-column" data-position="${position}" data-index="${index}">
        <div class="milestone-card" tabindex="0">
          ${image}
          <div class="milestone-card-body">
            <p class="milestone-year">${escapeHtml(item.year)}</p>
            <p class="milestone-text">${escapeHtml(item.text)}</p>
          </div>
        </div>
        <div class="milestone-connector" aria-hidden="true"></div>
        <div class="milestone-dot" aria-hidden="true"></div>
      </div>
    `;
    })
    .join("");

  return `
    <section class="timeline-section section-pattern" id="milestones" aria-labelledby="milestones-title">
      ${sectionHeading(section, "milestones-title")}
      <div class="timeline-pin">
        <div class="timeline-viewport" tabindex="0" aria-label="${escapeHtml(section.heading)}">
          <div class="timeline-track">${items}</div>
        </div>
        <div class="timeline-progress" aria-hidden="true"><span></span></div>
      </div>
    </section>
  `;
}

function renderCards(section, type, activeLang) {
  const labels = unavailableLabels[activeLang] || unavailableLabels.vi;
  const items = section.items
    .map((item) => {
      const hasHref = hasSafeUrl(item.href);
      const hasImage = hasSafeUrl(item.imageUrl, { allowHash: false });
      const image = hasImage
        ? `<img class="card-image" src="${safeUrl(item.imageUrl, "", { allowHash: false })}" alt="${escapeHtml(item.imageAlt || `${type} image`)}" loading="lazy">`
        : mediaPlaceholder(`${type} image placeholder`, "card-image");
      const cta = section.cta
        ? hasHref
          ? `<a class="text-link" href="${safeUrl(item.href)}">${escapeHtml(section.cta)}</a>`
          : `<span class="text-status">${escapeHtml(labels.card)}</span>`
        : "";

      return `
        <article class="${type}-card">
          ${image}
          <div class="card-copy">
            <h3>${escapeHtml(item.title || item.name)}</h3>
            <p>${escapeHtml(item.excerpt || item.quote)}</p>
            ${cta}
          </div>
        </article>
      `;
    })
    .join("");

  if (type === "news") {
    return `
      <section class="card-section section-pattern" id="news" aria-labelledby="news-title">
        ${sectionHeading(section, "news-title")}
        <div class="card-grid">${items}</div>
      </section>
    `;
  }

  return `
    <section class="card-section" id="contest" aria-labelledby="contest-title">
      ${sectionHeading(section, "contest-title")}
      <div class="card-grid">${items}</div>
    </section>
  `;
}

function renderContest(section) {
  const items = [...section.items];

  while (items.length < contestCardCount) {
    items.push({
      name: "<Hino cung cấp>",
      quote: "<Hino cung cấp>",
      isPlaceholder: true
    });
  }

  const makeCard = (item, index) => `
    <article class="contest-card${item.isPlaceholder ? " is-placeholder" : ""}" aria-label="A30 contest card ${index + 1}">
      <div class="contest-card-top">
        <span class="contest-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="contest-label">A30</span>
      </div>
      ${mediaPlaceholder("Contest image placeholder", "contest-image")}
      <blockquote class="contest-quote">${escapeHtml(item.quote)}</blockquote>
      <p class="contest-name">${escapeHtml(item.name)}</p>
    </article>
  `;

  const row1 = items.slice(0, contestCardCount).map(makeCard).join("");
  const row2 = [...items].reverse().slice(0, contestCardCount).map(makeCard).join("");

  return `
    <section class="card-section contest-section section-pattern" id="contest" aria-labelledby="contest-title">
      <div class="contest-heading-row">
        ${sectionHeading(section, "contest-title")}
      </div>
      <div class="marquee-wrapper">
        <div class="marquee-row">
          <div class="marquee-set">${row1}</div>
          <div class="marquee-set" aria-hidden="true">${row1}</div>
        </div>
        <div class="marquee-row marquee-row--reverse">
          <div class="marquee-set">${row2}</div>
          <div class="marquee-set" aria-hidden="true">${row2}</div>
        </div>
      </div>
    </section>
  `;
}

function renderProfile(section, assets, activeLang) {
  const labels = unavailableLabels[activeLang] || unavailableLabels.vi;
  const hasProfileUrl = hasSafeUrl(assets.companyProfileUrl);
  const href = safeUrl(assets.companyProfileUrl);
  const cta = hasProfileUrl
    ? `<a class="button primary" href="${href}">${escapeHtml(section.cta)}</a>`
    : `<p class="asset-status">${escapeHtml(labels.profile)}</p>`;

  return `
    <section class="profile-cta section-pattern" id="profile" aria-labelledby="profile-title">
      ${sectionHeading(section, "profile-title")}
      ${cta}
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer" id="contact" aria-labelledby="footer-contact-title">
      <div class="footer-main">
        <section class="footer-group" aria-labelledby="footer-products-title">
          <h2 id="footer-products-title">SẢN PHẨM</h2>
          <ul class="footer-list">
            <li>Series 300</li>
            <li>Series 500</li>
            <li>Series 700</li>
          </ul>
        </section>
        <section class="footer-group" aria-labelledby="footer-about-title">
          <h2 id="footer-about-title">VỀ CHÚNG TÔI</h2>
          <ul class="footer-list">
            <li>Hino Motors Việt Nam</li>
            <li>Chặng đường</li>
            <li>Tuyển dụng</li>
          </ul>
        </section>
        <section class="footer-group" aria-labelledby="footer-service-title">
          <h2 id="footer-service-title">DỊCH VỤ VÀ PHỤ TÙNG</h2>
          <ul class="footer-list">
            <li>Dịch vụ sau bán hàng</li>
            <li>Chính sách bảo hành</li>
            <li>Phụ tùng chính hãng</li>
          </ul>
        </section>
        <section class="footer-group footer-follow" aria-labelledby="footer-follow-title">
          <h2 id="footer-follow-title">FOLLOW US</h2>
          <div class="footer-social-list">
            <span class="footer-social-item"><span class="social-icon social-facebook" aria-hidden="true">f</span>Facebook</span>
            <span class="footer-social-item"><span class="social-icon social-youtube" aria-hidden="true"></span>Youtube</span>
          </div>
        </section>
        <section class="footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">LIÊN HỆ</h2>
          <address>
            <strong>CÔNG TY LD TNHH HINO MOTORS VIỆT NAM</strong>
            <span>Ngõ 83 Đường Ngọc Hồi, Phường Yên Sở, Thành phố Hà Nội, Việt Nam</span>
            <span>Mã số thuế: 0100114272</span>
            <span><strong>Hotline:</strong> <a href="tel:18009280"><b>18009280</b></a></span>
          </address>
        </section>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <nav class="footer-policy" aria-label="Footer policy">
            <span>Quy định &amp; Điều khoản</span>
            <span>Chính sách bảo mật</span>
            <span>Chính sách nhân quyền</span>
          </nav>
          <p>© 2017 Xe tải Hino. Bản quyền đã được bảo hộ.</p>
          <a class="back-to-top" href="#hero">Lên đầu trang <span aria-hidden="true">^</span></a>
        </div>
      </div>
    </footer>
  `;
}

export function renderPage(data, activeLang) {
  if (!data) {
    return "";
  }

  const sections = data.sections;
  return `
    ${renderNav(data, activeLang)}
    ${renderHero(sections.hero, activeLang, data.assets)}
    ${renderAppreciation(sections.appreciation)}
    ${renderVideo(sections.video, data.assets, activeLang)}
    ${renderMilestones(sections.milestones)}
    ${renderCards(sections.news, "news", activeLang)}
    ${renderContest(sections.contest)}
    ${renderProfile(sections.profile, data.assets, activeLang)}
    ${renderFooter()}
  `;
}
