function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mediaPlaceholder(label, className = "") {
  return `<div class="media-placeholder ${className}" role="img" aria-label="${escapeHtml(label)}">${escapeHtml(label)}</div>`;
}

function sectionHeading(section, kicker = "") {
  return `
    <div class="section-heading">
      ${kicker ? `<p class="eyebrow">${escapeHtml(kicker)}</p>` : ""}
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.subtext ? `<p>${escapeHtml(section.subtext)}</p>` : ""}
    </div>
  `;
}

function renderNav(data, activeLang) {
  const links = data.nav.links
    .map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`)
    .join("");

  return `
    <header class="site-nav" id="site-nav">
      <a class="brand-lockup" href="${data.nav.logoHref}" aria-label="${escapeHtml(data.nav.homeLabel)}">
        <span class="hino-logo">HINO</span>
        <span class="a30-mark">30</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-links" id="nav-links" aria-label="Primary navigation">
        ${links}
      </nav>
      <div class="language-toggle" aria-label="Switch language">
        <button type="button" data-lang="vi" aria-pressed="${activeLang === "vi"}">VI</button>
        <button type="button" data-lang="en" aria-pressed="${activeLang === "en"}">EN</button>
      </div>
    </header>
  `;
}

function renderHero(section) {
  return `
    <section class="hero-banner" id="hero" aria-labelledby="hero-title">
      <div class="hero-scrim"></div>
      <div class="hero-content">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        <h1 id="hero-title">${escapeHtml(section.heading)}</h1>
        <p class="hero-copy">${escapeHtml(section.subtext)}</p>
        <div class="hero-actions">
          <a class="button primary" href="#milestones">Milestones</a>
          <a class="button secondary" href="#video">Video</a>
        </div>
      </div>
    </section>
  `;
}

function renderAppreciation(section) {
  return `
    <section class="split-section" id="appreciation" aria-labelledby="appreciation-title">
      ${mediaPlaceholder("TGĐ photo placeholder", "portrait-placeholder")}
      <div class="split-copy">
        <h2 id="appreciation-title">${escapeHtml(section.heading)}</h2>
        <blockquote>${escapeHtml(section.quote)}</blockquote>
        <p class="person-line">${escapeHtml(section.nameTitle)}</p>
      </div>
    </section>
  `;
}

function renderVideo(section, assets) {
  const videoBody = assets.videoUrl
    ? `<iframe src="${escapeHtml(assets.videoUrl)}" title="${escapeHtml(section.heading)}" allowfullscreen></iframe>`
    : mediaPlaceholder("Video placeholder - awaiting Hino YouTube link", "video-placeholder");
  const disabled = assets.videoUrl ? "" : " aria-disabled=\"true\" tabindex=\"-1\"";

  return `
    <section class="content-band" id="video" aria-labelledby="video-title">
      ${sectionHeading(section)}
      <div class="video-frame">${videoBody}</div>
      <a class="button primary ${assets.videoUrl ? "" : "is-disabled"}" href="${assets.videoUrl || "#video"}"${disabled}>${escapeHtml(section.cta)}</a>
    </section>
  `;
}

function renderMilestones(section) {
  const items = section.items
    .map((item, index) => `
      <article class="milestone-card" tabindex="0" data-index="${index}">
        <div class="milestone-dot" aria-hidden="true"></div>
        <p class="milestone-year">${escapeHtml(item.year)}</p>
        <p class="milestone-text">${escapeHtml(item.text)}</p>
        ${mediaPlaceholder(item.imageAlt, "milestone-image")}
      </article>
    `)
    .join("");

  return `
    <section class="timeline-section" id="milestones" aria-labelledby="milestones-title">
      ${sectionHeading(section)}
      <div class="timeline-pin">
        <div class="timeline-viewport" tabindex="0" aria-label="${escapeHtml(section.heading)}">
          <div class="timeline-track">${items}</div>
        </div>
        <div class="timeline-progress" aria-hidden="true"><span></span></div>
      </div>
    </section>
  `;
}

function renderCards(section, type) {
  const items = section.items
    .map((item) => `
      <article class="${type}-card">
        ${mediaPlaceholder(`${type} image placeholder`, "card-image")}
        <div class="card-copy">
          <h3>${escapeHtml(item.title || item.name)}</h3>
          <p>${escapeHtml(item.excerpt || item.quote)}</p>
          ${section.cta ? `<a class="text-link" href="#${type}">${escapeHtml(section.cta)}</a>` : ""}
        </div>
      </article>
    `)
    .join("");

  if (type === "news") {
    return `
      <section class="card-section" id="news" aria-labelledby="news-title">
        ${sectionHeading(section)}
        <div class="card-grid">${items}</div>
      </section>
    `;
  }

  return `
    <section class="card-section" id="contest" aria-labelledby="contest-title">
      ${sectionHeading(section)}
      <div class="card-grid">${items}</div>
    </section>
  `;
}

function renderProfile(section, assets) {
  const href = assets.companyProfileUrl || "#profile";
  const disabled = assets.companyProfileUrl ? "" : " aria-disabled=\"true\" tabindex=\"-1\"";
  return `
    <section class="profile-cta" id="profile" aria-labelledby="profile-title">
      ${sectionHeading(section)}
      <a class="button primary ${assets.companyProfileUrl ? "" : "is-disabled"}" href="${href}"${disabled}>${escapeHtml(section.cta)}</a>
    </section>
  `;
}

function renderContact(section) {
  return `
    <section class="contact-section" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">${escapeHtml(section.heading)}</h2>
      <address>
        <strong>${escapeHtml(section.company)}</strong>
        <span>${escapeHtml(section.address)}</span>
        <span>${escapeHtml(section.tax)}</span>
        <span>${escapeHtml(section.hotline)}</span>
      </address>
    </section>
  `;
}

export function renderPage(data, activeLang) {
  if (!data) {
    return "";
  }

  const sections = data.sections;
  return `
    ${renderNav(data, activeLang)}
    ${renderHero(sections.hero)}
    ${renderAppreciation(sections.appreciation)}
    ${renderVideo(sections.video, data.assets)}
    ${renderMilestones(sections.milestones)}
    ${renderCards(sections.news, "news")}
    ${renderCards(sections.contest, "contest")}
    ${renderProfile(sections.profile, data.assets)}
    ${renderContact(sections.contact)}
    <footer class="site-footer">
      <p>© Hino Motors Vietnam</p>
      <a href="https://hino.vn/">hino.vn</a>
    </footer>
  `;
}
