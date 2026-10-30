# Validation record

Worker observations from 30 October 2026. These results are self-reported checks of this deliverable, not independent verification or a general accessibility certification.

## Summary

| Area | Final result |
| --- | --- |
| Brief requirements | 17 implemented/prepared; 3 publication outputs after submission; 0 fabricated features |
| Broken features in tested scope | 0 remaining |
| Product and main action on first screen at 390px | Yes; title, refresh, and all four metrics |
| taste@1 | 16/16 passed on the final export |
| Production build / typecheck | Passed / passed |
| Data / Chromium tests | 6 passed / 8 passed |
| Automated accessibility scan | No violations for the selected WCAG A/AA tags in the tested populated, expanded-table state |
| Share metadata | Title, description, favicon, og:title, and local 1200 × 630 og:image present |
| Remaining limitations | WebKit launch unavailable; no native-device, screen-reader, native zoom, or social-crawler testing; public publication links unavailable here |

The visual idea is a live hamster-wheel instrument panel with sage surfaces, lime emphasis, and a small original wheel illustration.

## Scope and assumptions

One English single-page dashboard, implemented with Vite, React, and TypeScript. `dist/` is the finished static export, served for checking under `/preview/` to exercise relative asset paths. No backend, account, wallet, private key, or RPC is part of the application. Wallet-connector guidance was read and deemed not applicable: nothing on this page asks visitors to sign.

The three specified public APIs were inspected directly, then fetched from the actual production page in a browser. No fixture or random number is used by the application. Synthetic fixtures in `tests/fixtures.ts` are used only for deterministic interaction tests. The observed public economy identifies Sepolia; explorer links derive from the response's chain ID.

The public repository, deployed website, and job-page links are publication-system outputs. They are not present in this workspace and have not been guessed. The repository source, lockfile, documentation, and static export are prepared for the submission bundle; no Git metadata or hosting account was modified.

## Requirement coverage

| Requirement | Status and evidence |
| --- | --- |
| “Squeekchain Live Dashboard” | Met: page title and h1 |
| “a hamster-powered PoW chain” intro | Met: short intro beside the live dashboard, plus a lower explanation |
| “fetch directly from the browser, no backend needed” | Met: real browser HTTP 200 responses from all three specified endpoints; runtime host is only `api.squeekchain.com` |
| “Cumulative work units” | Met: `measurement.cumulativeWorkUnits`, formatted with BigInt |
| “current wheel speed” | Met: milli-RPM converted to RPM; linear speed shown in mm/s |
| “core status (SPINNING/IDLE)” | Met: exact enum parsing; visible sentence-case labels; both transitions exercised |
| “current block height and block progress %” | Met: builder anchor values; fraction × 100; numeric percentage and native meter |
| “24h settlements” | Met: authoritative summary total, hourly activity, and returned recent entries |
| “Auto-refresh every 10 seconds” | Met: timed concurrent fetches, actual repeated browser requests, and virtual-clock assertions for all sources |
| “usable website ... working primary interactions and responsive layouts” | Met: refresh/retry, chart switches, disclosure, row expansion, pause, and anchors; 320/390/768/1440px checks |
| “dist/index.html and its assets ... source and lockfile ... relative asset URLs” | Prepared: complete export plus matching checked source and lockfile; HTML/CSS references verified; commit/publication handled by submission system |
| “production build, typecheck and useful interaction validation ... actual results and limitations” | Met: commands below and reproducible tests included |
| “Better Interface ... six domains ... fixes ... coverage” | Met: source and browser review below; five consolidated findings corrected |
| “first screen at 390 wide ... product and ... main action” | Met: inspected final screenshot at 390 × 844; four metrics and Refresh now visible |
| “title, favicon, description, og:title and og:image” | Met: final HTML integrity check; favicon and actual PNG present |
| “DESIGN.md ... tokens, typography, components and responsive behavior” | Met: root document extracted from final CSS and components |
| “README ... project ... data sources ... install, preview and rebuild” | Met: root README with commands, API field mapping, conversions, state behavior, and limitations |
| “public GitHub repository” | After submission/publication; public URL not available in this workspace |
| “publicly accessible deployed website” | After submission/publication; complete static export supplied |
| “The job page link” | After submission/publication; job-page URL not supplied here |

## Better Interface review: all six domains

The pinned workflow and the core principles of accessibility, layout, writing, typography, colors, and UI were read before implementation. Supporting guidance on motion, native controls, numeric formatting, and design documentation informed the implementation. The guide and documentation-method attribution are preserved in `DESIGN.md` and the retained guidance licenses.

| Domain | Coverage | Evidence and limits |
| --- | --- | --- |
| Accessibility | Checked | Native controls, names, heading/landmark structure, a skip link, row value labels, accessible chart alternative, polite status regions, motion opt-in, and focus styles reviewed. Keyboard: Tab → skip link → Enter → Tab → refresh → Enter → Tab → illustration toggle → Space. The visible refresh ring was inspected in a screenshot. axe scan returned no selected-rule violations with the hourly table expanded. Screen readers and native high-contrast devices not tested; forced-colors CSS was reviewed but not rendered. |
| Layout | Checked | Actual production screenshots inspected at 390 × 844, 768 × 1024, and 1440px; taste@1 also rendered 320px. No horizontal overflow, overlapping text, floating controls over text, or clipped text in the probe. At 200% root text size, 320 and 390px reflow and the expanded hourly table passed width checks; recent rows were visually inspected. A 768px RTL mirror had no horizontal overflow, but no translated locale is claimed. Browser-native zoom was not tested. |
| Writing | Checked | Labels name the data or action; refresh and retry describe recovery; initial failure is not displayed as a successful zero. Idle, stale sensor observations, and failed fetches are distinguished. Receipt notes identify their sections. API summary and limited recent list are explicitly distinguished. No tracked-capital kickers or slogan stack. |
| Typography | Checked | Local DM Sans load confirmed with `document.fonts.check`. Six declared sizes; five recurring sizes at 390 and 1440, with the 44px title as a desktop one-off. Three weights, two rendered families. Counters use tabular numerals; hashes retain a complete accessible name/destination/title. Long headings and source text reflow under enlargement. No native font-substitution or translated-text test. |
| Colors | Checked | Semantic tokens reviewed, actual solid-background text pairs measured, chart non-text contrast corrected, selected chart state given a visible border and weight change. Probe passed all measured text contrast. Focus was measured on white, page, and lime surfaces. Only the implemented light theme was checked. Decorative artwork and every possible transitional pixel were not contrast audited. |
| UI details | Checked | Rest, selected, disabled/loading, error, stale, empty, recovered, expanded/collapsed, and paused states exercised by source review and browser tests. Primary controls have native keyboard behavior. Flat borders without card shadows; no cards nested as independent panels; one icon style. Reduced motion disables wheel and refresh animation. The live wheel was idle during snapshots; spinning and idle transitions were exercised with clearly test-only fixtures. A 10%-speed Animations-panel replay was not performed. |

Forms, destructive actions, dialogs, transactions, wallet switching, dark theme, and localization are not applicable to the requested product.

## Findings and fixes

All source citations below point to the final source at the corrected implementation. Before/after statements are observations from this worker's review, not claims about an earlier public site.

1. **High — enlarged product name overflowed the phone width.** Source: `src/styles.css:103`, `overflow-wrap: anywhere`, and the wrapping header/controls at `:172`, `:392`, and `:512`. At a 390px viewport with the root text at 200%, the first implementation had a 427px document width and clipped the product name. Long headings now break, and relevant rows/controls wrap. Recheck: document width equals viewport at 320 and 390px, including the expanded hourly table; a recent-settlements enlarged-text screenshot was inspected.

2. **Medium — chart bars and selected state needed a stronger non-text cue.** Source: `src/styles.css:589`, `.bar { background: var(--color-chart) }`, and `:531`, selected chart border and font weight. The initial pale bar fill was replaced with `#77995b`; the final rendered bar/white pair measures **3.23:1**. Selected buttons now have a discernible border and heavier label. Recheck: final desktop/mobile control states inspected; chart interaction and axe test pass.

3. **Medium — desktop list numbers needed accessible labels.** Source: `src/App.tsx:291` and `:298`, visually hidden “Work units:” and “Blocks:” labels. The desktop layout's visual column labels were hidden from assistive technology, while mobile labels were CSS-hidden on desktop. Explicit labels now remain in the accessibility tree at every width. Full transaction hashes are available in link names, titles, and destinations; settlement dates were added to the visible status line. Recheck: source/semantic review and expanded-table axe scan pass. This was not a screen-reader session.

4. **Low — repeated receipt labels were ambiguous and triggered repetition.** Source: `src/App.tsx:40`, `SourceNote`. Four concurrent fetch receipts originally read “Received … UTC”. They now identify wheel telemetry, hourly activity, settlements, or economy. The initial probe passed 15/16, with repetition as the sole failed check. Recheck: final probe passes repetition and all 16 checks; final screenshot shows section-specific receipt times.

5. **Low — initial countdown could briefly say 11 seconds.** Source: `src/useDashboard.ts:114`, `Math.min(REFRESH_MS / 1000, ...)`. Initial render and effect timestamps could straddle a millisecond boundary before the one-second clock tick. The count is now bounded to 0–10. Recheck: final desktop screenshot shows “Next in 10s”; the automatic refresh interaction test still passes. Manual-refresh announcements were also made explicitly UTC to match the rest of the page.

No reproduced high or medium finding remains open within the tested implementation. The unperformed checks below are limitations, not passes.

## Measured contrast

These ratios were calculated from computed foreground/background values on the rendered production page using WCAG relative luminance. All listed backgrounds are solid.

| Foreground / background | Ratio |
| --- | --- |
| `#263629` heading / `#f5f6f2` page | 11.78:1 |
| `#263629` primary-action text / `#d1f5a5` lime | 10.54:1 |
| `#4f5c49` label / `#d1f5a5` lime | 5.85:1 |
| `#4f5c49` source note / `#ffffff` | 7.10:1 |
| `#4f5c49` idle badge / `#f0f5eb` | 6.41:1 |
| `#263629` selected control text / `#ffffff` | 12.79:1 |
| `#77995b` chart bar / `#ffffff` | 3.23:1 |
| `#385ac2` focus / white, page, lime | 6.16:1 / 5.67:1 / 5.08:1 |

## Commands and actual results

Dependencies were installed in a temporary workspace with `npm install --no-audit --no-fund`. Source, configuration, package manifest, and lockfile were copied there exactly. A byte comparison confirmed that the delivered source equals the checked copy. No dependencies or caches were installed in this repository.

| Command/check | Result |
| --- | --- |
| `npm run typecheck` | Exit 0 on final source |
| `npm test` | Exit 0; 6/6 parser/formatting tests |
| `npm run build` | Exit 0 on final source; 21 modules transformed; 10 complete export files |
| `npm run test:browser -- --project=chromium` | Exit 0; 8/8 tests in the final run, 14.6 seconds |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | Exit 0, 16/16 checks. Playwright module and downloaded browser location were supplied from the external temporary install. Actual check output saved as `artifacts/design-probe.json`. |
| WebKit `launch()` attempt | Failed before rendering: missing host libraries including `libgtk-4.so.1`, `libgraphene-1.0.so.0`, and media libraries. WebKit interaction tests were not run. |
| Final browser capture | Four widths: 320, 390, 768, 1440; zero horizontal overflow, zero script errors; 12 API responses, all HTTP 200 |
| HTML/CSS/export integrity | Passed 5 checks: metadata, relative/existing assets, PNG dimensions, manifest/lockfile consistency, and delivered/checked-source equality. Per-file hashes saved in `artifacts/export-integrity.json`. |

The 6 data tests cover conversions and real zeroes; missing/unsafe readings; precision-safe token formatting; summary-versus-recent settlement counts; sensor staleness; and economy field mapping/unavailable state.

The 8 browser tests cover:

1. Manual refresh, automatic 10-second updates to all sources, and a spinning-to-idle/zero-speed transition.
2. Chart metric switching, 24-row hourly disclosure, returned-row expansion/collapse, illustration pause, explorer links, and anchor navigation.
3. Initial HTTP failure without fake numbers, followed by successful retry.
4. Partial telemetry failure retaining labeled old values while other sources update.
5. Stale observations, empty settlements, and malformed JSON retaining honest state.
6. Mobile first screen, keyboard entry, reduced motion, 320/390/768/1440px reflow, and enlarged text at 320/390px with the hourly table open.
7. Loading/disabled refresh and the recoverable eight-second timeout, with exactly three initial requests.
8. axe analysis of the populated mobile dashboard and expanded hourly table using `wcag2a`, `wcag2aa`, `wcag21aa`, and `wcag22aa` tags.

The real browser session additionally observed repeated live polling from all three sources, successful manual refresh, no console warnings/errors, and successful JS/CSS/font/favicon requests at the preview subpath. The fixtures establish behavior deterministically; they do not substitute for that live API check.

## Evidence and packaging

- [Final desktop export](dashboard-desktop.png): 1440px wide, full page, actual live API data.
- [Final mobile first screen](dashboard-mobile.png): 390 × 844, actual live API data.
- [Final design probe output](design-probe.json): actual 16-check output, not a recreated score.
- [Export integrity and hashes](export-integrity.json): actual checked export files.
- The probe's original 320/390/1440 screenshots, intermediate-width capture, enlarged-text inspection, and scratch logs were generated locally. Temporary scratch output is deliberately excluded from delivery.

`dist/` contains **402,852 bytes** across 10 files, below its 1 MiB path budget. Local fonts, social image, favicon, React notice, and font license are present. There are no source maps, dependency archives, caches, or vendored package registries in the export. The separate SVG social-card source remains available for editing.

The ignore-file budget is explicit: generated dependency/cache/browser-tool directories, coverage, build caches, and `test/scratch/` receive **0 submitted bytes**; `dist/` receives at most **1 MiB**, `artifacts/` at most **5 MiB**, and all remaining deliverables together at most **2 MiB**. The final measured bundle size is recorded in `artifacts/bundle-budget.json` and checked against **8,388,608 bytes**. Git internals, GitHub configuration, environment files, and existing dependency directories were not modified. No submodule was created.

## Completion and limits

**Complete for the implemented static-dashboard scope.** The repository, deployment, and job-page URLs remain external publication outputs after submission. No public availability is claimed before that step.

WebKit/Safari behavior remains unverified because the browser could not launch with this machine's available libraries. Physical devices, a screen-reader session, native browser 200% zoom, forced-colors rendering, translated locales, and actual social-platform crawling remain unperformed. The relative social-card URL is suitable for the static export but has not been tested with social crawlers before a public origin exists. The site relies on the specified APIs continuing to support their public schema, availability, and CORS policy. Browser timer throttling can delay refreshes in inactive tabs.
