---
status: Accepted
---

# Saga product design system: where it lives and how it is built

> Origin record. Written in saga-dash on 2026-10-13 while the system was being
> planned, moved here when the repos existed. Decisions made after this point
> live in `guide/decisions.md` (the DS-nnn ledger).

Status: **RESOLVED 2026-10-14** — all eight decisions = A. Repos
`saga-ed/product-style` (public) and `saga-ed/product-ui-components`
(private) created; `style.wootdev.com` provisioned in the dev account
(Amplify app `d3fs2idf1g1zrk`). Phases 1–3 delivered as a first cut the same
day; ledger review happens on the site (`/decisions/`).

## Context

Every Saga front end (dash, staff-admin, analytics, coach, Connect, the
public prototypes site) carries a hand-pasted copy of the same 17-colour
Figma palette and Montserrat, under at least six different variable-naming
schemes, with no shared package and no written guide. saga-dash's `core-ui`
is the most mature component set but is private, build-less and
workspace-only; the legacy `design-tokens` repo (hipponot org, Figma →
custom parser → verbose `--sdt-*` CSS) is the only prior attempt and is
unused by any current app. The goal is a public guide any AI-assisted tool
can read, plus framework-specific libraries built on it. Full survey:
the source survey (`docs/decisions/design-system-inventory.md`).

## D1 — Public home for the guide

Resolved 2026-10-14: **A** (confirmed in chat).

- **A (recommended)**: a new **public GitHub repo** holding the guide as
  Markdown plus a small static site, deployed to `style.wootdev.com` with a
  copy of the prototypes Amplify/OIDC infra (PR previews, ~2-minute deploy).
  Readable by Claude Code (`git clone`/raw URLs), Claude Design/Cowork
  (fetch a URL), humans (the site). The site doubles as the component
  showcase (D8).
- **B**: public repo, Markdown only, GitHub Pages for rendering. Cheapest;
  no live component demos, no PR previews.
- **C**: a wiki / Notion / Claude artifact. Easy for PMs to read, invisible
  to agents working from a terminal, no version history tied to the code.

Confidence: high. Note `saga-ed` has only three public repos today; making
a fourth public may need an org-owner decision.

## D2 — What is public and what is private

Resolved 2026-10-14: **A**.

- **A (recommended)**: **public** = guide + `tokens.css` + base/reset CSS +
  the vanilla HTML/CSS component layer (buttons, cards, inputs, modal,
  toast, tabs) with no build step; **private** = the Svelte 5 component
  library and anything else that needs a build or ties to product
  internals. Rationale: a single-file prototype or a Claude Design session
  must be able to `<link>` or paste the CSS without CodeArtifact/AWS auth,
  and the vanilla layer contains nothing sensitive.
- **B**: everything public in one repo (guide + all libraries). Simplest
  graph, but publishes Svelte components that reference product domain
  types and tests, and CodeArtifact publishing from a public repo is odd.
- **C**: guide public, *all* code private (the prompt's literal split).
  Prototypes and web tools would have to inline hand-copied CSS — which is
  exactly today's failure mode.

Confidence: high.

## D3 — The private component-library repo

Resolved 2026-10-14: **A**.

- **A (recommended)**: new `saga-ed/product-ui-components` (name from the
  prompt; open to alternatives) as a pnpm/Turbo monorepo publishing to
  CodeArtifact: `@saga-ed/ui-svelte` (Svelte 5, built with
  `svelte-package` like constellation-bg), later `@saga-ed/ui-icons`.
  Seeded by moving `constellation-bg` (already published) first, then
  `dash-icons`, then `core-ui` once its Svelte 4 components are converted.
- **B**: resurrect `design-tokens`. It is in the wrong org, Figma-plugin
  shaped, Svelte 4 in the consumers, and its token output is the verbose
  `--sdt-*` nobody adopted. Only its icon generator and showcase shape are
  worth salvaging — and those can be copied.
- **C**: publish `core-ui` from inside saga-dash (as constellation-bg is).
  Lowest effort, but keeps dash as the owner, keeps the no-build export of
  raw `.svelte`, and does nothing for coach/qboard/prototypes.

Confidence: medium. The expensive part under any option is extracting
core-ui from saga-dash (2 apps, 8 page packages, ~55 browser-mode tests,
barrel-import hazard #531, mixed Svelte 4/5). Proposed phasing keeps that
as the last phase, so the new repo is useful long before the extraction.

## D4 — Token naming canon

Resolved 2026-10-14: **A** (confirmed in chat).

- **A (recommended)**: two tiers. Primitives `--saga-<name>` with
  *corrected* names (`--saga-blue: #006298`, `--saga-navy`, `--saga-teal:
  #1ececa`, `--saga-clay`, `--saga-pink: #ff595a`, …) — the names
  constellation-bg and coach's alias layer already use. Semantics keep the
  saga-dash scheme (`--color-primary`, `--color-danger`, `--color-text`,
  `--space-*`, `--radius-*`, `--text-*`, `--shadow-*`, `--motion-*`,
  `--ease-*`, `--btn-*`, `--input-*`) because it is the newest, is already
  in three apps and in most prototypes, and the `.claude/rules/motion.md`
  + CI guards are written against it. Apps may keep a local alias layer
  (qboard's em-based `--cv3-*` is deliberate and stays).
- **B**: the legacy three-tier `--sdt-p/a/m-*`. Already rejected by every
  current app; verbose; names encode Figma paths.
- **C**: a fresh namespaced scheme (`--sg-color-primary` …). Clean, but
  forces a rename in every consumer for no semantic gain.

Confidence: high.

## D5 — Resolving disagreements between sources

Resolved 2026-10-14: **A** (confirmed in chat).

Known conflicts: teal-filled confirm buttons (dash Configure Period) vs
blue; body text `#444` vs `#111827`; magenta `#bb16a3` vs `#741BC1`;
"red" meaning pink vs clay; `--color-brand-teal` holding blue; green
`#20912d` vs `#30883a`; borders cool `#e5e7eb` vs warm `#dbd6d5`.

- **A (recommended)**: the guide decides, preferring current dash code and
  Nathan's `design_system/` boards, and every choice is logged as a
  numbered entry in a `decisions.md` ledger inside the public repo so you
  (or a future designer) can overturn individual ones.
- **B**: defer to the Figma `tokens.json` export as the source of truth.
  It has the swapped weight labels and names nobody uses; and no designer
  currently maintains it.
- **C**: block on a designer. None in house.

Confidence: medium.

## D6 — How the prototypes repo consumes the system

Resolved 2026-10-14: **A**.

- **A (recommended)**: add `CLAUDE.md` + a `_starter.html` template whose
  `:root` block is *generated* from the canonical `tokens.css` (keeps the
  "one self-contained file, opens from disk" property), plus an optional
  `<link href="https://style.wootdev.com/tokens.css">` line for authors
  who prefer live tokens. CI checks that the starter's token block matches
  the published one. No change to `build.mjs`.
- **B**: `<link>` to the hosted CSS only. Minimal, but prototypes stop
  working offline/from disk and break if the style site is down.
- **C**: vendor `assets/` into the prototypes repo and extend `build.mjs`
  to copy non-HTML. Works, but duplicates the public repo and needs
  absolute `/assets/` URLs.

Confidence: high.

## D7 — Icon library

Resolved 2026-10-14: **A** (confirmed in chat).

- **A (recommended)**: Material Symbols (light / outlined / rounded) via
  iconify as the guide's recommendation — it is what `dash-icons` was
  generated from and what qboard's `cv3:` set bundles, and it matches the
  legacy "our style is outlined icons" note. Brand marks (Saga S, leaf,
  f(x)) ship as SVG in the public repo. The vanilla layer uses
  `<iconify-icon>`; the Svelte layer keeps generated components.
- **B**: lucide. Popular with AI tools, but a visible departure from every
  current screen.
- **C**: the custom 110-icon `dash-icons` set as the canon, frozen.

Confidence: high.

## D8 — Showcase and CI for UI elements

Resolved 2026-10-14: **A**.

- **A (recommended)**: the public site *is* the showcase for tokens and
  the vanilla layer (one page per component, rendered from the real CSS);
  the private Svelte repo gets a gallery route (web-maul's registry shape:
  `{component, title, description}` per entry) with Playwright screenshot
  tests on PRs. Dash's design-preview `?preview=1&mock=` mode stays for
  page-level work.
- **B**: no showcase; rely on docs and tests.
- **C**: Storybook. Heavy for a Svelte 5 shop with no existing stories.

Confidence: medium (you said you were on the fence).

## Proposed phasing

0. Agree this doc; file the epic in saga-dash with cross-links.
1. **Guide + tokens** (public repo, local first): style guide chapters
   (colour, type, spacing, elevation, motion, shell/nav, tables, forms,
   modals/toasts, iconography, voice — harvesting `docs/motion`,
   `docs/ux-patterns`, `docs/ui-writing-guide.md`, Nathan's boards),
   `tokens.css`, `base.css`, decisions ledger, `CLAUDE.md`/`AGENTS.md`
   for agents. **Test gate:** rebuild two or three existing prototypes
   against the new CSS before anything is pushed.
2. **Vanilla layer** (public): buttons, cards, inputs, tabs, modal, toast,
   popover — porting qboard's `modal.ts`/`toast.ts` (already a11y-complete)
   and dash's button/input token contracts. Site + Amplify deploy.
3. **Prototypes integration**: `CLAUDE.md`, starter template, parity check.
4. **Private Svelte repo**: scaffold, move constellation-bg, add icons,
   publish `@saga-ed/ui-svelte` 0.x with a handful of converted core-ui
   components; CLAUDE.md pointers in dash/coach/qboard; adoption sizing
   reports per repo.
5. **Adoption** (piecemeal, per-repo issues): coach tokens swap (fixes its
   undefined tokens), qboard primitives alignment + canvas palette
   constants, dash core-ui extraction last.

## Related artifacts

- Survey: the source survey (`docs/decisions/design-system-inventory.md`); screenshots in the same dir.
- Delivered: https://style.wootdev.com · https://github.com/saga-ed/product-style ·
  https://github.com/saga-ed/product-ui-components · prototypes branch
  `style-guide-gate` (CLAUDE.md, starter, three rebuilt prototypes).
- Prior art: `hipponot/design-tokens` (last commit 2025-09-21);
  `~/dev/nimbee/edu/web-maul/widget/saga_style`.
- Prototype decision boards: `prototypes/design_system/*.html` (saga-dash
  #649, #627).
- Hosting template: `prototypes/infra/OPS.md`.
