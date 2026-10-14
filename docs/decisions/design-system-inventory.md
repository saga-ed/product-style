# Saga product style: inventory of existing sources (2026-10-13)

Survey of every source named in `prompt.md`, plus the GitHub org, package
registry, and DNS. Companion to `design-system.md` in this directory.

## 1. The brand palette already converges

Every source carries the same 17-colour Figma palette (first exported by the
design team into `design-tokens/src/tokens.json`). Hex values agree across
saga-dash, coach, qboard, legacy saga_style, constellation-bg and 20 of 28
prototypes. Only the *names* disagree.

| Role (proposed) | Hex | Upstream Figma name | Known naming bugs |
|---|---|---|---|
| Blue — primary action, links, focus | `#006298` | saga-medium-blue | dash + janus call it `--color-brand-teal`; prototypes call it `--teal`; pod_roster calls it `--navy` |
| Navy — chrome (left nav, top bar, headings) | `#0b2a4a` | saga-dark-blue | coach uses `#0A2A49` |
| Teal — accent only (not legible on white) | `#1ececa` | saga-light-blue | dash `--color-brand-teal-light`; dash adds legible `--color-teal: #0d7377` |
| Clay — danger / destructive | `#991a21` | saga-clay | legacy `error` alias = clay (correct); coach `--color-error` = pink (wrong) |
| Pink — brand mark only | `#ff595a` | saga-red | coach/qboard treat as "red"; qboard `--cv3-danger` = pink |
| Green — success | `#20912d` | saga-dark-green | dash also has `--color-brand-green: #30883a` (off-palette) |
| Lime — brand mark only | `#6ed34b` | saga-green | |
| Orange / Dark orange / Yellow | `#ffad00` / `#d14600` / `#f9e547` | | |
| Magenta | `#bb16a3` | saga-purple | favicon board uses `#741BC1` instead |
| Coral / Light green | `#ffa38b` / `#a7e163` | | |
| Beige light / medium, Dark gray, Light gray | `#d6d1ca` / `#a59c94` / `#6e6259` / `#f3f4f4` | | |

Body text disagrees: legacy + coach `#444`; dash + prototypes `#111827`
(Tailwind gray-900). Borders: dash `#e5e7eb`; qboard `#dbd6d5` (warm gray).

**Font:** Montserrat everywhere, loaded three different ways (dash:
`@fontsource-variable/montserrat`; coach/qboard/design-tokens/prototypes:
Google Fonts link; some prototypes: CSS `@import`; some prototypes: not loaded
at all). JetBrains Mono is named in dash but never loaded. Figma weight tokens
have 400/500 labels swapped (`font-400: Medium`, `font-500: Regular`).

**Scales that recur:** spacing 4/8/16/24/32/48 px; radius 4/6/8/9999 px;
type 12/14/16/20/24 px (dash rem ladder) vs 10–48 px (Figma ladder); motion
90/150/210/300 ms with `--ease-out/in/emphasized` (dash only, plus the motion
prototype). Responsive root size 15→17→19 px at 1400/1800 (dash, legacy,
design-tokens agree). qboard deliberately uses `em` with 16→14/18 px root.

## 2. Per-source state

### saga-dash (`~/dev/saga-dash`) — newest, richest, not shareable
- **Tokens:** three hand-copied `tokens.css` files (dash 270 lines / ~165
  props; staff-admin 264; analytics 91). Families: `--color-*` (48, with
  semantic + severity surfaces), `--nav-*`/`--topbar-*`/`--tab-*`,
  `--space-*`, `--text-*`/`--leading-*`, `--radius-*`, `--shadow-*`,
  `--modal-scrim`, `--motion-*`/`--ease-*`, component tokens `--btn-*`
  (17) `--input-*` (11) `--card-*` `--scrollbar-*`, feature tokens
  `--qtf-*` `--note-*` `--timeline-*`. No dark mode. CI keeps motion blocks
  in parity; staff-admin has a test that fails on undefined tokens.
- **core-ui** (`packages/web/core-ui`, `@saga-ed/dash-core-ui`): private,
  no build step (exports raw `.svelte`), ~35 components, ~55 test files
  (Vitest browser mode). Mixed Svelte 4 (`export let`: StandardButton,
  SagaCard, SagaInput, StandardCheckbox, LocalDateRangePicker,
  FWModalMultiStepHeader) and Svelte 5 (`$props`: Tooltip, SelectMenu, Modal,
  ConfirmDialog, DatePicker, DateRangePicker, Tabs, SplitPane, Skeleton*,
  Toast, Impact*, Time*, FacetedSearch…). Barrel-import hazard (#531) forces
  subpath imports for several. Consumers: 2 apps, 8 page packages, 3 other
  packages — extraction is a real migration.
- **icons** (`@saga-ed/dash-icons`): 110 generated inline-SVG Svelte 4
  components (Material Symbols Light via iconify + custom brand marks);
  generator script is *not* in the repo (it lives in design-tokens).
- **legacy-styles**: SCSS port of saga_style mixins; effectively unused.
- **constellation-bg**: the only *published* package (CodeArtifact, Svelte 5,
  `svelte-package`). Ships its own `@layer constellation` `--saga-*` tokens.
- **Guides worth harvesting:** `docs/motion/index.md`,
  `docs/ux-patterns/notices-warnings-and-confirmations.md`,
  `docs/ui-writing-guide.md`, `.claude/rules/{motion,figma-design}.md`, and
  the CI guards (`ensure-no-native-{title,select,date}.js`).
- No Storybook/gallery; only `?preview=1&mock=` design-preview mode.

### coach (`~/dev/coach`) — small, Style-Dictionary-flavoured
- `apps/web/coach-web/src/styles/tokens.css`: 110 lines, two tiers:
  `--sdt-p-*` primitives copied from design-tokens output (8-digit hex),
  `--saga-*` corrected-name aliases, `--color-*` semantics (32), 3 spacing
  tokens, 2 shadows. **No radius/type/motion tokens** — components reference
  `--sdt-radius-md`, `--sdt-radius-sm`, `--sdt-spacing-xs` that are never
  defined. Fluid root font `calc(0.5vw + 0.5vh + 5px)`.
- Also `authored-theme.css` (frozen `--theme-*` contract for curriculum
  content) and `data-theme` switching.
- No shared button/modal/toast; no icon library (inline SVG).
- `apps/web/coach-web/docs/CSS_TOKENS.md` + `THEME.md` exist but are stale.

### qboard / Saga Connect (`~/dev/qboard`) — best vanilla primitives
- `apps/web/connectv3/src/styles/tokens.css`: two tiers `--cv3-saga-*`
  primitives → `--cv3-*` semantics; em-based type/spacing/radius ladders;
  `:root.cv3-high-contrast` remaps tier-2 only; text-scale a11y knob.
  ~1,457 `var(--cv3-*)` uses vs ~280 hex literals.
- **Reusable vanilla primitives** (plain TS + sibling CSS, no framework):
  `util/modal.ts` (`showModal` → Promise, a11y complete, 17 call sites),
  `util/toast.ts` (`showToast`, stack of 3, dwell by length, 16 sites),
  `util/popover-menu.ts`, `util/avatar.ts`, `util/icon.ts` (iconify
  `cv3:` set, bundled). No generic button/tooltip (native `title`).
- qboard-lib engine chrome injects CSS from TS strings, themed via ~22
  `--qb-*` hooks. Canvas colours are hardcoded TS constants (ink palette,
  sticky notes, selection indigo `#6366f1`, brand pen stamp uses slightly
  off values `#10cfc9`/`#70d44b`).
- Conventions documented in `apps/web/connectv3/CLAUDE.md` (em not rem,
  tokens not hex, WCAG AA) and `spec/connectv3/accessibility.md`.
- Comments explicitly say values were pasted because design-tokens and
  core-ui are unreachable.

### prototypes (`~/dev/prototypes`) — public site, zero shared style
- 28 HTML files, 16 topic dirs; every file inlines its own `<style>` and
  its own `:root`. Seven+ variable-naming schemes. De-facto convergence on
  `#006298` + Montserrat; outliers use `#1C77C3`, `#0d7d7d`, `#c41e3a`,
  system fonts.
- **No CLAUDE.md / AGENTS.md / .claude/** (`.claude/` is gitignored).
  Conventions live in file headers: public site ⇒ invented content only;
  violet `.ptag`/`.standin` marks prototype-only chrome; "Copy preferences"
  button pattern for decision boards.
- `design_system/` holds three decision boards by Nathan Neri (Jul–Aug
  2026) that already propose a two-tier token model, flat modal buttons,
  one danger red (clay), teal-confirm → blue, hover soft-blue `#e6f0f6`.
- Build (`scripts/build.mjs`) copies **only `.html`**, verbatim, to
  `dist/<dir>/<slug>/index.html`; CSS/JS/images are dropped. Amplify would
  serve them if present (rewrite rule excludes static extensions). Shared
  CSS needs an absolute `/assets/...` URL or a hosted URL.
- Infra (`infra/OPS.md`): SAM stacks in dev account, OIDC deploy role,
  PR previews at `pr-N.prototypes.wootdev.com`, ~2 min deploy — a ready
  template for hosting a style site.
- Contributors: Nathan Neri 35, Seth Paul 22, Darnell Melvin 8, others.

### design-tokens (`~/dev/design-tokens`, GitHub **hipponot**/design-tokens)
- Figma Design Tokens plugin export (`src/tokens.json`, 175 KB, three tiers:
  primitives / aliases / mapped component tokens) → custom parser
  (`parse_tokens.js`) → `dist/tokens.css` (`--sdt-p/a/m-*`) + `tokens.scss`.
- 13 Svelte components + 90 generated icons + a Svelte 5 showcase
  `test-app` deployed to GitHub Pages and Amplify (`d2rr5va8dyh97d`).
- Not an npm package (no version/exports); delivered by copying files into
  web-maul. Last commit 2025-09-21 (Jeff). Dirty working tree.
- `@saga-ed/design-tokens` *does* exist in CodeArtifact, but nothing in
  this repo publishes it and no repo depends on it.
- Only "guidelines" are comments/code: 50 px header, 16 px default
  padding, body `#444` 16 px/500, h1 xl/600, h2 large/400, h3 medium/600,
  "our style is outlined icons".

### web-maul `saga_style` + `widget_showcase` (`~/dev/nimbee/edu/web-maul`)
- Svelte 4, SCSS, bit.js build, no tests, no CI. `tokens.css` is 412 lines
  (69 primitives, 97 aliases, 240 mapped) — verbose because names repeat
  paths (`chip-chip-`), ramps duplicate, every hex carries `ff`.
- Worth keeping as *concepts*: `saga_constants.scss` mixins (app font with
  responsive root, scrollbar, card, loading overlay, input, select),
  `app_and_page.scss` (shell layering, accordion widths at breakpoints),
  `text_headers_paragraphs_and_spacing.scss` (vertical rhythm).
- `widget_showcase`: registry pattern (`{component, icon, title,
  description}` keyed by name, two-level nav "Core Styles / Core UI /
  Saga Dash Components") — good shape for a gallery, nothing reusable as code.

## 3. Org, registry, hosting facts
- `saga-ed` has **3 public repos** (soa, saga-ai-context, deidentify_systems_sandbox); none is design-related. `prototypes` is private but its *site* is public.
- Package registry is AWS CodeArtifact (`@saga-ed:registry=…/saga_js/`), private; requires AWS auth to install. Fine for product repos, unusable from single-file prototypes or Claude Design.
- `style.wootdev.com`, `tokens.wootdev.com`, `design.wootdev.com` all resolve to the dev-account ALB catch-all and serve nothing — free to claim. `wootdev.com` zone is in the dev account (same as prototypes).
- A Figma MCP plugin is configured in this environment; `.claude/rules/figma-design.md` in saga-dash describes a node-id workflow. `past_session_figma_comp.png` is the only Figma comp provided.

## 4. What the screenshots show (dash, Oct 2026)
- Navy left nav (240 px) with white logo, program selector as a white
  `SelectMenu`, active item = blue filled pill with white text; district
  footer. White top bar, blue page title, clock, icon buttons, red badge.
- Content: white cards, 8 px radius, hairline borders, 2 px blue top edge
  on stat cards; tabs with blue underline + count badges; tables with gray
  header row, 1 px borders, pencil/lock row actions.
- Buttons: blue filled primary, white outline secondary, clay filled
  danger; but the Configure Period modal uses a **teal filled "Continue"**
  — the exact inconsistency Nathan's board flags.
- Modals: 8 px radius, scrim over navy, flat footer with Cancel/Save/Delete.
- Day-type chips: filled clay "Regular", filled teal "Advisory"; calendar
  cells filled blue when sessions exist.
- Session Viewer Figma comp (newer): navy header strip, pill chips with
  colour-coded outlines, rail of skill tiers in teal/blue/navy, Glows &
  Grows with heart/leaf icons, pink scatter dots. Wireframe for Coaching
  uses a placeholder mono style — not a visual reference.
