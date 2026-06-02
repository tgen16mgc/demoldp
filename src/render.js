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
    video: "Video sẽ được cập nhật"
  },
  en: {
    video: "Video coming soon"
  }
};
const milestoneControlLabels = {
  vi: {
    headingLines: ["NHỮNG", "CỘT MỐC", "ĐÁNG NHỚ"],
    previous: "Cột mốc trước",
    next: "Cột mốc tiếp theo",
    skip: "Đến phần tiếp theo"
  },
  en: {
    headingLines: ["MEMORABLE", "MILESTONES"],
    previous: "Previous milestone",
    next: "Next milestone",
    skip: "Continue"
  }
};
const footerLabels = {
  vi: {
    products: "SẢN PHẨM",
    about: "VỀ CHÚNG TÔI",
    services: "DỊCH VỤ VÀ PHỤ TÙNG",
    follow: "THEO DÕI CHÚNG TÔI",
    productItems: ["Series 300", "Series 500", "Series 700"],
    aboutItems: ["Hino Motors Việt Nam", "Chặng đường", "Tuyển dụng"],
    serviceItems: ["Dịch vụ sau bán hàng", "Chính sách bảo hành", "Phụ tùng chính hãng"],
    policyItems: ["Quy định & Điều khoản", "Chính sách bảo mật", "Chính sách nhân quyền"],
    copyright: "© 2017 Xe tải Hino. Bản quyền đã được bảo hộ.",
    backToTop: "Lên đầu trang",
    policyAria: "Liên kết chính sách chân trang"
  },
  en: {
    products: "PRODUCTS",
    about: "ABOUT US",
    services: "SERVICE AND PARTS",
    follow: "FOLLOW US",
    productItems: ["Series 300", "Series 500", "Series 700"],
    aboutItems: ["Hino Motors Vietnam", "Milestones", "Careers"],
    serviceItems: ["After-sales service", "Warranty policy", "Genuine parts"],
    policyItems: ["Terms and Conditions", "Privacy Policy", "Human Rights Policy"],
    copyright: "© 2017 Hino Trucks. All rights reserved.",
    backToTop: "Back to top",
    policyAria: "Footer policy links"
  }
};

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

function renderPhraseGradientHeading(section, headingId, activeLang, phrase) {
  const heading = String(section.heading || "");
  const shouldGradientPhrase = activeLang === "vi" && heading.includes(phrase);

  if (!shouldGradientPhrase) {
    return sectionHeading(section, headingId);
  }

  const [before, after] = heading.split(phrase);
  const beforeText = before.trim();
  const afterText = after.trim();

  return `
    <div class="section-heading">
      <h2 id="${escapeHtml(headingId)}" aria-label="${escapeHtml(heading)}">
        ${beforeText ? `<span>${escapeHtml(beforeText)}</span> ` : ""}
        <span class="heading-gradient-text">${escapeHtml(phrase)}</span>
        ${afterText ? ` <span>${escapeHtml(afterText)}</span>` : ""}
      </h2>
      ${section.subtext ? `<p>${escapeHtml(section.subtext)}</p>` : ""}
    </div>
  `;
}

function renderCutReveal(text, className = "") {
  const words = String(text || "").split(" ");
  const visibleText = words
    .map((word, index) => {
      const space = index < words.length - 1 ? `<span class="cut-reveal-space"> </span>` : "";
      return `<span class="cut-reveal-word" style="--reveal-index: ${index}"><span>${escapeHtml(word)}</span></span>${space}`;
    })
    .join("");

  return `<span class="cut-reveal ${className}" aria-label="${escapeHtml(text)}">${visibleText}</span>`;
}

function renderBlockCutReveal(text, className = "") {
  return `<span class="block-cut-reveal ${className}">${escapeHtml(text)}</span>`;
}

function renderHeroTitle(heading) {
  const text = String(heading || "");
  const match = text.match(/^(30\s+(?:NĂM|YEARS))\s+(.+)$/);

  if (!match) {
    if (text === "GIÁ TRỊ VƯỢT THỜI GIAN") {
      return `
        <h1 id="hero-title" class="hero-title">
          <span class="hero-title-line">${renderCutReveal("GIÁ TRỊ", "hero-title-reveal")}</span>
          <span class="hero-title-line"><span class="hero-gradient-text-host" data-gradient-text="VƯỢT THỜI GIAN" aria-label="VƯỢT THỜI GIAN">VƯỢT THỜI GIAN</span></span>
        </h1>
      `;
    }

    return `<h1 id="hero-title" class="hero-title">${renderCutReveal(text, "hero-title-reveal")}</h1>`;
  }

  return `
        <h1 id="hero-title" class="hero-title">
          <span class="hero-title-count">${renderCutReveal(match[1], "hero-title-count-reveal")}</span>
          <span class="hero-title-main">${renderCutReveal(match[2], "hero-title-reveal")}</span>
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
        <span class="a30-mark">
          <img class="a30-mark-image a30-mark-default" src="src/a30new.svg" width="72" height="50" alt="A30">
          <img class="a30-mark-image a30-mark-hero" src="src/assets/a30-nav-white-new.svg" width="72" height="50" alt="" aria-hidden="true">
        </span>
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

function renderHero(section, activeLang, assets) {
  const labels = heroActionLabels[activeLang] || heroActionLabels.vi;
  const hasHeroBannerUrl = hasSafeUrl(assets.heroBannerUrl, { allowHash: false });
  const heroBannerUrl = safeUrl(assets.heroBannerUrl, "", { allowHash: false });

  return `
    <section class="hero-banner" id="hero" aria-label="Hino 30 years anniversary banner">
      ${hasHeroBannerUrl ? `<img class="hero-image-full" src="${heroBannerUrl}" width="2752" height="1536" alt="Hino 30 years hero banner" fetchpriority="high">` : ""}
      <a class="scroll-cue" href="#hero-title" aria-label="Scroll down">
        <span></span>
      </a>
    </section>
    <section class="hero-action-strip" aria-labelledby="hero-title">
      <div class="hero-action-copy">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        ${renderHeroTitle(section.heading)}
      </div>
      <div class="hero-action-side">
        <p class="hero-copy">${renderBlockCutReveal(section.subtext, "hero-copy-reveal")}</p>
        <div class="hero-actions">
          <a class="button primary" href="#milestones">${escapeHtml(labels.milestones)}</a>
          <a class="button secondary" href="#video">${escapeHtml(labels.video)}</a>
        </div>
      </div>
    </section>
  `;
}

function renderAppreciation(section, activeLang) {
  const headingParts = section.heading.split(" & ");
  const headingText = headingParts.length === 2
    ? `${escapeHtml(headingParts[0])} &amp;<br>${escapeHtml(headingParts[1])}`
    : escapeHtml(section.heading);
  const headingHtml = activeLang === "vi"
    ? `<span class="heading-gradient-text">${headingText}</span>`
    : headingText;
  const bodyParagraphs = Array.isArray(section.body) ? section.body : [section.quote || ""];
  const bodyHtml = bodyParagraphs
    .filter((paragraph) => String(paragraph || "").trim())
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const signatureLines = [
    section.signatureName || "",
    section.signatureTitle || section.nameTitle || "",
    section.signatureCompany || ""
  ].filter((line) => String(line || "").trim());
  const signatureHtml = signatureLines
    .map((line, index) => `<span class="${index === 0 ? "signature-name" : "signature-meta"}">${escapeHtml(line)}</span>`)
    .join("");
  const imageUrl = safeUrl(section.imageUrl, "", { allowHash: false });
  const portrait = imageUrl
    ? `<img class="director-image" src="${imageUrl}" width="2582" height="3872" alt="${escapeHtml(section.imageAlt || section.signatureName || "Director portrait")}" loading="lazy">`
    : mediaPlaceholder("Director photo", "portrait-placeholder");

  return `
    <section class="appreciation-section section-pattern" id="appreciation" aria-labelledby="appreciation-title">
      <div class="appreciation-portrait-panel">
        <figure class="director-portrait">
          <div class="director-image-frame">
            ${portrait}
          </div>
          <figcaption>
            <strong>${escapeHtml(section.signatureName || "")}</strong>
            <span>${escapeHtml(section.signatureTitle || section.nameTitle || "")}</span>
          </figcaption>
        </figure>
      </div>
      <div class="appreciation-letter">
        <h2 id="appreciation-title">${headingHtml}</h2>
        <div class="letter-body">
          ${section.salutation ? `<p class="letter-salutation">${escapeHtml(section.salutation)}</p>` : ""}
          ${bodyHtml}
        </div>
        <p class="person-line">${signatureHtml}</p>
      </div>
    </section>
  `;
}

function renderStatistics(section, activeLang = "vi") {
  const countLocale = activeLang === "vi" ? "vi-VN" : "en-US";
  const items = section.items
    .map((item, i) => {
      return `
      <article class="stat-cell" style="--stat-i:${i}" role="listitem">
        <div class="stat-info">
          <h3 class="stat-label">${escapeHtml(item.label)}</h3>
        </div>
        <div class="stat-figure">
          <span
            class="stat-number"
            data-count-to="${escapeHtml(item.value)}"
            data-count-suffix="${escapeHtml(item.suffix || "")}"
            data-count-locale="${escapeHtml(countLocale)}"
          >0${escapeHtml(item.suffix || "")}</span>
          <p class="stat-unit">${escapeHtml(item.unit || "")}</p>
        </div>
      </article>
    `;
    })
    .join("");

  return `
    <section class="stats-section section-pattern" id="statistics" aria-labelledby="statistics-title">
      <div class="stats-section-bg" aria-hidden="true">
        <span class="stats-glow stats-glow--a"></span>
        <span class="stats-glow stats-glow--b"></span>
      </div>
      <div class="stats-shell">
        <div class="stats-intro">
          ${renderPhraseGradientHeading(section, "statistics-title", activeLang, "CON SỐ ẤN TƯỢNG")}
        </div>
        <div class="stats-grid" role="list">${items}</div>
        ${section.note ? `<p class="stats-note">${escapeHtml(section.note)}</p>` : ""}
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
      ${renderPhraseGradientHeading(section, "video-title", activeLang, "30 NĂM")}
      <div class="video-frame">${videoBody}</div>
      ${cta}
    </section>
  `;
}

function renderMilestones(section, activeLang) {
  const labels = milestoneControlLabels[activeLang] || milestoneControlLabels.vi;
  const headingLines = labels.headingLines
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  const introPanel = `
    <article class="timeline-intro-panel">
      <div class="timeline-intro-top">
        <img class="timeline-intro-mark" src="src/a30new.svg" alt="A30" loading="lazy">
        <p class="timeline-intro-small">${escapeHtml(section.subtext || "")}</p>
      </div>
      <div class="timeline-intro-main">
        <h2 id="milestones-title" class="heading-gradient-text" aria-label="${escapeHtml(section.heading)}">${headingLines}</h2>
      </div>
    </article>
  `;
  const controls = `
    <div class="timeline-controls" aria-label="Timeline controls">
      <button class="timeline-arrow timeline-arrow-prev" type="button" data-timeline-prev aria-label="${escapeHtml(labels.previous)}">
        <span class="sr-only">${escapeHtml(labels.previous)}</span>
      </button>
      <button class="timeline-arrow timeline-arrow-next" type="button" data-timeline-next aria-label="${escapeHtml(labels.next)}">
        <span class="sr-only">${escapeHtml(labels.next)}</span>
      </button>
      <a class="timeline-skip button secondary" href="#news">${escapeHtml(labels.skip)}</a>
    </div>
  `;
  const items = section.items
    .map((item, index) => {
      const hasImage = hasSafeUrl(item.imageUrl, { allowHash: false });
      const isAnniversaryMilestone = item.year === "2026";
      const eventClass = `milestone-event${isAnniversaryMilestone ? " is-anniversary" : ""}`;
      const imageClass = `milestone-image${isAnniversaryMilestone ? " milestone-image-anniversary" : ""}`;
      const image = hasImage
        ? `<img class="${imageClass}" src="${safeUrl(item.imageUrl, "", { allowHash: false })}" alt="${escapeHtml(item.imageAlt || `${item.year} milestone image`)}" loading="lazy">`
        : `<div class="milestone-image milestone-image-placeholder" role="img" aria-label="${escapeHtml(item.imageAlt || `${item.year} milestone image`)}"></div>`;

      return `
      <article class="${eventClass}">
        <div class="milestone-copy">
          <p class="milestone-date">${escapeHtml(item.year)}</p>
          <h3 class="milestone-title">${escapeHtml(item.text)}</h3>
        </div>
        <figure class="milestone-card">
          ${image}
        </figure>
      </article>
    `;
    })
    .join("");

  return `
    <section class="timeline-section section-pattern" id="milestones" aria-labelledby="milestones-title">
      <div class="timeline-pin">
        <div class="timeline-viewport" tabindex="0" aria-label="${escapeHtml(section.heading)}">
          <div class="timeline-track">
            <div class="timeline-canvas">
              ${introPanel}
              ${items}
            </div>
          </div>
        </div>
        ${controls}
      </div>
    </section>
  `;
}

function renderCards(section, type) {
  const items = section.items
    .map((item) => {
      const hasHref = hasSafeUrl(item.href);
      const href = hasHref ? safeUrl(item.href) : `#${escapeHtml(type)}`;
      const hasImage = hasSafeUrl(item.imageUrl, { allowHash: false });
      const image = hasImage
        ? `<img class="card-image" src="${safeUrl(item.imageUrl, "", { allowHash: false })}" alt="${escapeHtml(item.imageAlt || `${type} image`)}" loading="lazy">`
        : mediaPlaceholder(`${type} image placeholder`, "card-image");
      const cta = section.cta
        ? `<a class="text-link" href="${href}">${escapeHtml(section.cta)}</a>`
        : "";

      return `
        <article class="${type}-card">
          <figure class="card-media">${image}</figure>
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

}

function renderProfile(section, assets) {
  const hasProfileUrl = hasSafeUrl(assets.companyProfileUrl);
  const href = hasProfileUrl ? safeUrl(assets.companyProfileUrl) : "#profile";
  const downloadAttr = hasProfileUrl ? ` download` : "";
  const cta = `<a class="button primary" href="${href}"${downloadAttr}>${escapeHtml(section.cta)}</a>`;

  return `
    <section class="profile-cta section-pattern" id="profile" aria-labelledby="profile-title">
      ${sectionHeading(section, "profile-title")}
      ${cta}
    </section>
  `;
}

function renderFooter(contact, activeLang = "vi") {
  const labels = footerLabels[activeLang] || footerLabels.vi;
  const offices = (contact.offices || [])
    .map((office) => `
      <div class="footer-office">
        <strong>${escapeHtml(office.label)}</strong>
        <span>${escapeHtml(office.address)}</span>
        <span>${escapeHtml(office.phoneFax)}</span>
      </div>
    `)
    .join("");

  return `
    <footer class="site-footer" id="contact" aria-labelledby="footer-contact-title">
      <div class="footer-main">
        <section class="footer-group" aria-labelledby="footer-products-title">
          <h2 id="footer-products-title">${escapeHtml(labels.products)}</h2>
          <ul class="footer-list">
            ${labels.productItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
        <section class="footer-group" aria-labelledby="footer-about-title">
          <h2 id="footer-about-title">${escapeHtml(labels.about)}</h2>
          <ul class="footer-list">
            ${labels.aboutItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
        <section class="footer-group" aria-labelledby="footer-service-title">
          <h2 id="footer-service-title">${escapeHtml(labels.services)}</h2>
          <ul class="footer-list">
            ${labels.serviceItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
        <section class="footer-group footer-follow" aria-labelledby="footer-follow-title">
          <h2 id="footer-follow-title">${escapeHtml(labels.follow)}</h2>
          <div class="footer-social-list">
            <span class="footer-social-item"><span class="social-icon social-facebook" aria-hidden="true">f</span>Facebook</span>
            <span class="footer-social-item"><span class="social-icon social-youtube" aria-hidden="true"></span>Youtube</span>
          </div>
        </section>
        <section class="footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">${escapeHtml(contact.heading)}</h2>
          <address>
            <strong>${escapeHtml(contact.company)}</strong>
            ${offices}
          </address>
        </section>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <nav class="footer-policy" aria-label="${escapeHtml(labels.policyAria)}">
            ${labels.policyItems.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </nav>
          <p>${escapeHtml(labels.copyright)}</p>
          <a class="back-to-top" href="#hero">${escapeHtml(labels.backToTop)} <span aria-hidden="true">^</span></a>
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
    ${renderAppreciation(sections.appreciation, activeLang)}
    ${renderStatistics(sections.statistics, activeLang)}
    ${renderVideo(sections.video, data.assets, activeLang)}
    ${renderMilestones(sections.milestones, activeLang)}
    ${renderCards(sections.news, "news")}
    ${renderProfile(sections.profile, data.assets)}
    ${renderFooter(sections.contact, activeLang)}
  `;
}
