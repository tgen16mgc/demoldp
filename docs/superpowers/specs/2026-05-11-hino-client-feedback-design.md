# Hino Client Feedback Design

## Goal

Update the Hino A30 landing page to address client feedback while preserving the existing one-page bilingual structure and source workbook content. The revision should feel more like an official Hino anniversary campaign page: cleaner brand typography, correct logo usage, a stronger hero treatment, and more visual texture across the background.

## Approved Direction

Use the `Corporate Anniversary Polish` direction.

The chosen slogan direction is:

`30 nam ben bi dong hanh`

The Vietnamese on-page display may use proper accents:

`30 năm bền bỉ đồng hành`

## Scope

In scope:

- Replace the header Hino logo with `/Users/tienduonn/Downloads/Asset 1de.svg`.
- Keep logo corners unrounded and remove artificial logo shadow so the original asset is displayed faithfully.
- Keep the A30 mark from `/Users/tienduonn/Downloads/Asset 4de.svg`.
- Use the current hero banner image asset as a full-bleed hero image.
- Reduce the heavy gray hero overlay so the banner feels less dull.
- Prevent oversized duplicated text over the hero image. The hero image should carry the main visual, while accessible text remains available for screen readers and SEO.
- Switch typography toward Hino's Helvetica Neue brand feel using a Helvetica Neue / Helvetica / Arial stack.
- Reduce large heading and body sizes where the current page feels oversized.
- Add subtle Hino red/gray visual patterns behind sections so the page feels less basic without adding new copy.
- Keep existing bilingual content intact unless the change is specifically the approved hero slogan treatment.
- Update tests to lock the new assets and visual-system expectations.
- Commit and push the implementation after verification.

Out of scope:

- Rewriting the client-provided workbook content.
- Designing a final replacement PNG banner beyond integrating the current/provided banner image.
- Creating additional campaign sections.
- Changing the horizontal timeline behavior.
- Changing the footer text/content.

## Page-Level Design

The page should shift from a generic landing style to an OEM campaign style. The overall feel should be clean, technical, and brand-led, with restrained red accents and lightweight background structure.

Primary design changes:

- Header becomes more official: original Hino logo asset, original A30 mark, no rounded logo treatment.
- Hero uses the banner image as the primary visual, with a lighter overlay and no competing oversized HTML headline.
- Sections use subtle background treatments: fine diagonal lines, low-contrast dot/grid pattern, and small red accent rules.
- Typography becomes more neutral and corporate, using Helvetica Neue style rather than the current rounded/modern web font.
- Type scale is tightened so headings and cards read less oversized.

## Assets

Source assets:

- Hino logo: `/Users/tienduonn/Downloads/Asset 1de.svg`
- A30 mark: `/Users/tienduonn/Downloads/Asset 4de.svg`
- Logo PDF reference: `/Users/tienduonn/Downloads/0. Hino_Logo A30 (3 ver)_ver 20251218.pdf`
- Hero banner: existing `src/assets/hero-banner.png`, matching the currently pulled GitHub asset.

Implementation assets:

- `src/assets/hino-logo.svg`
- `src/assets/a30-mark.svg`
- `src/assets/hero-banner.png`

The header must use the SVG files through existing `renderNav()` markup. Asset replacement should be done by copying the source SVGs into `src/assets` so the site remains self-contained.

## Hero Design

Desktop:

- Hero remains a full-width image-led section with stable height.
- The image should use `object-fit: cover`.
- Overlay should be lighter than the current gray treatment.
- Existing hero heading/subtext should not visually compete with the text already embedded in the banner image.
- Keep hero actions if they do not overlap the banner's important text. If overlap occurs, move actions into a compact bottom-left control row or visually hide them on the hero while preserving navigation elsewhere.

Mobile:

- Hero image should remain readable and avoid cropping the main `30` mark too aggressively.
- If the banner text becomes too small, prioritize showing the center/right anniversary mark and let the following page sections carry the detailed text.
- Do not introduce horizontal scrolling.

Accessibility:

- Keep `aria-labelledby` and meaningful alternative text for the hero image.
- If visual hero text is hidden, keep a screen-reader-only copy of the hero heading.

## Typography

Use this font stack globally:

`"Helvetica Neue", Helvetica, Arial, sans-serif`

Type changes:

- Reduce hero heading scale if shown.
- Reduce section heading scale by roughly 10-18%.
- Reduce card heading and body sizes slightly.
- Keep Vietnamese punctuation support through system Helvetica/Arial fallback.
- Maintain `letter-spacing: 0` for normal text.

## Background Pattern

Add a reusable background language through CSS, not markup:

- Light diagonal line texture in section backgrounds.
- Subtle dot/grid motif on selected content bands.
- Thin Hino red accent bars or rules for section separation.
- Avoid decorative blobs, purple/blue gradients, and heavy shadows.

The pattern should be visible enough to remove the "basic" feel, but light enough that it does not compete with content.

## Testing

Run:

- `npm test`
- `git diff --check`

Update static tests to verify:

- `src/assets/hino-logo.svg` exists.
- `src/assets/a30-mark.svg` exists.
- `src/assets/hero-banner.png` exists.
- Rendered header references both logo assets.
- Rendered hero references `hero-banner.png`.
- CSS no longer applies rounded corners or shadow to the Hino logo.
- CSS includes Helvetica Neue typography.
- CSS includes the new subtle section background pattern rules.

## Push

After implementation and verification:

- Commit with a focused message, for example `feat: apply hino client visual feedback`.
- Push `main` to `origin`.

