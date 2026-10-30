# Squeekchain design system

## Overview

Squeekchain Live Dashboard is a compact read-only view of wheel telemetry, blocks, settlements, and economy state. Its visual idea is a small illustrated hamster wheel inside a calm instrument panel: pale sage surfaces, dark green text, a lime primary action, and stable numeric readings.

The metrics and refresh action precede the illustration and explanation. The page is a dashboard rather than a marketing landing page. Its English interface uses sentence case, short labels, and explicit source and error states. The source of truth is `src/styles.css`, with markup and component patterns in `src/App.tsx`.

## Colors

Primitive values and semantic aliases live in `src/styles.css:6`. Components normally consume the semantic role.

| Semantic token | Value | Role |
| --- | --- | --- |
| `--color-page` | `#f5f6f2` / `--sage-25` | Page background |
| `--color-surface` | `#ffffff` | Header and panels |
| `--color-soft` | `#f0f5eb` / `--sage-50` | Wheel scene, neutral badges, table header |
| `--color-border` | `#dfe4da` / `--sage-200` | Structural borders and row dividers |
| `--color-text` | `#263629` / `--sage-900` | Headings, readings, primary text |
| `--color-muted` | `#4f5c49` / `--sage-700` | Labels, captions, source notes |
| `--color-accent` | `#d1f5a5` / `--lime-200` | Refresh button and cumulative-work emphasis |
| `--color-accent-hover` | `#c1ec8c` / `--lime-300` | Primary button hover |
| `--color-success` | `#3c612d` / `--green-700` | Fresh spinning status, progress, confirmation text |
| `--color-chart` | `#77995b` / `--green-500` | Hourly chart bars and legend |
| `--color-warning` | `#78501e` / `--amber-800` | Source failures, stale telemetry, paused economy dot |
| `--color-warning-bg` | `#fff5e5` / `--amber-50` | Recoverable error banner |
| `--color-focus` | `#385ac2` | Keyboard outline |

`--sage-100: #e7efdf` groups the block meter and about section. `--sage-500: #687561` marks the selected chart control border. The native progress track is `#cbd9c0`; its icon border is `#c4d2b8`. Decorative illustration colors are local to `src/Wheel.tsx`, `src/Icons.tsx`, and `public/social-card.svg`, rather than additional UI status colors.

Measured rendered pairs include muted text on white **7.10:1**, muted text on lime **5.85:1**, heading text on the page **11.78:1**, primary action text **10.54:1**, and chart bars on white **3.23:1**. The focus token measures **6.16:1** on white, **5.67:1** on the page, and **5.08:1** on lime. More coverage and limits are in `artifacts/validation.md`. There is one light theme; no dark theme is implemented.

## Typography

`--font-body` is `'DM Sans Variable', fallback, sans-serif`. The package `@fontsource-variable/dm-sans` supplies local normal-style WOFF2 fonts, with Latin and Latin Extended subsets, covering weights 100–1000. The interface uses only **400, 500, and 700**. An Arial local fallback is size adjusted to 102%; the final generic fallback is sans-serif. The loaded DM Sans face was confirmed in the browser.

`--font-data` is `ui-monospace, 'SFMono-Regular', Consolas, monospace`, used for abbreviated transaction hashes only. Reading values otherwise use DM Sans with tabular numerals.

| Token | At a 16px root | Use |
| --- | --- | --- |
| `--text-xs` | 12px / .75rem | Dense labels, captions, receipt times, mobile utilities |
| `--text-sm` | 14px / .875rem | Intro, navigation, table readings, supporting copy |
| `--text-base` | 16px / 1rem | Body baseline, wheel readings, smaller headings |
| `--text-title` | 20px / 1.25rem | Panel headings, economy readings, brand |
| `--text-number` | 32px / 2rem | Summary readings and compact page title |
| `--text-display` | 44px / 2.75rem | Wide-screen page title |

Body line height is 1.5; supporting prose uses 1.6. Page title line height is 1.15 and panel headings 1.3. The wide title tracks at −.045em, compact title and readings at −.04em, panel headings at −.02em. Labels use natural spacing. Headings balance lines and can break long words under text enlargement; explanatory copy uses pretty wrapping and a bounded measure. Important counters are never clipped or ellipsized. Hash links expose their full hash through the destination, title, and accessible name.

## Layout

The header and `.page-shell` share a maximum 1320px border-box container with 40px side padding, giving a 1240px content area. Wide layouts use a four-column summary and a two-column telemetry grid in a .82:1.18 ratio. Shared panels use 24px padding and the primary grid gap is 24px; metrics use a 16px gap. Smaller within-group gaps are generally 4–12px, and larger section separation is 20–40px. Spacing is declared in the component styles; there is no separate spacing-token library.

Breakpoints use rem units and respond to content width:

| Breakpoint | Behavior |
| --- | --- |
| At or below 75rem (1200px at the default root) | Side padding 32px; title 32px; chart header can wrap; metric gap 12px |
| At or below 57rem (912px) | Summary becomes two columns; telemetry stays two equal columns; API header utility hides; economy becomes two columns; about section stacks |
| At or below 43rem (688px) | Side padding 20px; telemetry becomes one column; first title is limited to 14ch; refresh countdown hides; recent entries become two-column labeled records; block progress spans its own row; footer wraps |
| At or below 23rem (368px) | Side padding 16px; metric padding tightens; metric icons hide; speed units can occupy their own line |

The document order stays the same across widths. Header, refresh row, panel headings, wheel readout, and segmented controls wrap rather than clipping when text grows. Anchors have a 24px scroll margin. There is no sticky or fixed content covering the dashboard.

The final export was rendered at 320, 390, 768, and 1440px. The first 390 × 844 screen contains the product, refresh action, and all four summary metrics. Enlarged root text at 200% was checked at 320 and 390px, including the expanded hourly table. This is not a claim about browser-native zoom or translated locales.

## Elevation & Depth

The interface is flat. White panels have one structural border and no box shadow. Tonal sage sections group block progress and the explanation. The lime summary and refresh button supply emphasis. Status badges and the segmented control use tonal fills; the selected chart button adds an explicit border and heavier type. Source failures use a pale amber surface plus text.

## Shapes

`--radius-card` is 1rem (16px); `--radius-control` is .625rem (10px). Mobile metrics use a 12px radius. Wheel scenes, table headers, and segmented-control containers use 8px, with 6px inner chart buttons. Status tags use a 30px radius; dots and diagram icon discs are circular. Bars have 3px top corners. Rounded SVG wheel artwork follows its own geometry and is decorative.

## Components

| Pattern and source | Intended use and behavior |
| --- | --- |
| `Metric`, `src/App.tsx:73` | Label, current reading, optional unit, and note. Optional `accent` highlights cumulative work. Uses explicit loading/unavailable text and space for a full-sized reading. |
| `SourceNote`, `src/App.tsx:40` | A source-specific successful receipt time or a recoverable failure with the last receipt. Keeps failed data labeled. |
| `SettlementChart`, `src/App.tsx:107` | Count/work metric buttons use `aria-pressed`; bars reflect only returned buckets; native details exposes an exact hourly table. Empty data gets an explanatory state. |
| `RecentSettlements`, `src/App.tsx:229` | Shows five returned records by default; toggles all returned records and back. Work, block, and timestamp labels remain accessible. Explorer destinations depend on the reported chain ID. |
| `.primary-button`, `src/styles.css:279` | The filled refresh action. Native disabled state while fetching, hover fill, visible focus, and press feedback under normal motion preferences. |
| `.segmented`, `src/styles.css:512` | Related chart controls with a selected border, background, heavier label, and `aria-pressed`. Wraps when text grows. |
| `Wheel`, `src/Wheel.tsx` | Original SVG illustration. Rotation/bobbing require fresh spinning telemetry and an unpaused illustration. The adjacent status remains the authoritative reading. |
| `Icon`, `HamsterMark`, `src/Icons.tsx` | One custom SVG icon set using currentColor, with a 1.7px stroke. Decorative icons are hidden from assistive technology. |
| `useDashboard`, `src/useDashboard.ts` | Independent source state, timed refresh, manual refresh, abort/timeout, receipt tracking, cleanup, and manual-refresh announcements. |

These are app-local components and patterns, not a separate component library. `App`, `Wheel`, and the icon helpers are exported; the other UI helpers remain local to `App.tsx`.

Native links, buttons, details, and progress preserve keyboard behavior. Focus is a 3px outline with a 4px offset; forced-colors mode uses the system Highlight color. The skip link appears on focus. Routine manual refresh results use a stable polite status region. Automatic polling does not announce every changing counter.

Hover treatments are gated by `(hover: hover)`. Color transitions take 150ms and name their properties. No page entrance is animated. Wheel motion, the refresh icon rotation, smooth scrolling, and .96 press scaling are opt-in under `prefers-reduced-motion: no-preference`. The illustration has a native pause toggle; network polling continues.

## Do's and Don'ts

- Reuse `.page-shell`, `.panel`, the six type tokens, and existing semantic colors for another dashboard section.
- Keep critical readings above explanations. Pair numbers with a label, units, and the source's state.
- Use the filled lime button for the primary refresh action; keep secondary controls neutral and visibly selected when appropriate.
- Keep telemetry truth separate from illustration state. Preserve last values on source failure and mark them; do not simulate live numbers.
- Add a new section in document order using an existing panel pattern, a semantic heading, and `SourceNote` when it owns an independent source. Let its contents wrap at the current breakpoints and check it at 320 and 390px.
- Do not add another font, shadow layer, tracked capital label, or motion effect without an actual content need. Do not hide critical values to make a layout fit.

## Guidance attribution

The design review applied all six domains of Jakub Krehel's [Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), pinned at `267330e1adfc66a718fb65fa6918c1f06d0a689e` (MIT). This implementation-focused documentation adapts the method in Paul Bakaus's [Impeccable document reference](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), pinned at `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` (Apache-2.0). The adaptation documents the actual final dashboard; the combined license texts are retained in `artifacts/licenses/Better-Interface-and-Impeccable.txt`.
