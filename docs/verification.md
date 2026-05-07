# Hino A30 Landing Page Verification

Run the local server:

```bash
cd /Users/tienduonn/hino-a30-landing
npm run serve
```

Open:

```text
http://localhost:5173
```

## Functional Checks

- VN is the default language.
- EN toggle switches every section to English.
- Switching languages preserves module order.
- Hino logo opens `https://hino.vn/`.
- Nav anchors scroll to same-page sections.
- Mobile menu opens and closes.

## Content Checks

- Hero heading matches the workbook.
- Appreciation quote/name display `<Hino cung cấp>`.
- Video area is a disabled pending state until a URL is configured.
- All 18 milestones appear in order for VN and EN.
- News has exactly 2 cards.
- Contest has exactly 2 cards.
- Company Profile CTA does not link to a fake PDF.

## UI/UX Pro Max Checks

- Hero banner spans the full hero section, not a side square.
- Plus Jakarta Sans is used for hero/nav/major headings.
- Be Vietnam Pro is used for body/fallback and Vietnamese text renders correctly.
- Body text is at least 16px on mobile.
- Tap targets are at least 44px high where practical.
- Focus states are visible.
- Text contrast is readable over the hero banner.
- No emoji icons are used as structural icons.
- No horizontal page overflow at 375px, 768px, 1024px, and 1440px.

## Timeline Checks

- Timeline is horizontal.
- Desktop scroll pins the section and moves the timeline sideways.
- Timeline is manually draggable with mouse.
- Native scrollbar is hidden.
- Custom progress indicator updates.
- Arrow keys move the timeline when the timeline viewport is focused.
- Reduced motion disables forced pinned animation and keeps manual scroll behavior.
