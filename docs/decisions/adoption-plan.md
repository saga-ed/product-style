---
status: Accepted
---

# Phase 5: adopting the system in the product repos

Status: **RESOLVED 2026-10-16** — all options A (agreed in chat).

## Context

Five repos carry their own copy of the palette under five naming schemes.
The gate test showed that the token layer maps mechanically (the deprecated
alias block in `tokens.css` keeps dash's names working unchanged) while the
exceptions need product knowledge. Component adoption waits for phase 4;
token adoption does not. Owners by area, per Jeff: Jeff (Connect, Past
Sessions, QTF reports, Surveys reports), Darnell (Coach, Star assessment,
other reports), Sean (Attendance), Kevin (program configuration, roster
upload dialogs), Nathan (the rest of saga-dash).

## A5.1 — Who does the first pass

Resolved 2026-10-16: **A**.

- **A (recommended)**: we do the mechanical first pass per repo (a sizing
  report plus a draft PR that swaps the token file for the published
  `@saga-ed/product-style` CSS behind an app alias layer for the app's own
  tokens, CI green) and the owner reviews, decides the exceptions, and
  merges. The published values apply as-is: the four values the guide
  changed from dash's (button radius and padding, card radius and shadow,
  the rem ladder) are not pinned, and the goal is no breakage, not zero
  visual difference. A script that diffs the resolved value of every token
  before and after the swap is attached to each PR so the owner sees
  exactly which values moved. The owner's time goes to judgement, not plumbing.
- **B**: hand each owner an issue and let them run Claude against their
  area. Slower, inconsistent, and the token swap would be done five ways.
- **C**: we do everything including component swaps. Owners lose the
  chance to shape their own pages and the system loses their corrections.

Confidence: high.

## A5.2 — Order of repos

Resolved 2026-10-16: **A**.

- **A (recommended)**: saga-dash tokens first (largest blast radius but the
  most mechanical, three hand-copied files become one import, and CI
  guards exist), then coach (small, fixes its undefined `--sdt-radius-*`
  tokens), then qboard (tier-1 under `--cv3-*` aliases; canvas constants
  from the published `tokens.ts`), then staff-admin and analytics consoles.
- **B**: coach first as a low-risk rehearsal. Reasonable, but dash is where
  the owners are and where phase 4 lands.

Confidence: medium.

## A5.3 — Connect's vanilla primitives

Resolved 2026-10-16: **A**.

- **A (recommended)**: upstream Connect's `modal.ts`, `toast.ts` and
  `popover-menu.ts` into product-style as `components.js`, a dependency-free
  behaviour layer over the `.saga-*` classes (focus trap, Escape, dwell,
  stack of three, aria-live). Connect then imports it instead of owning it;
  prototypes get real modals and toasts in a single file. Published with
  the CSS in `@saga-ed/product-style`.
- **B**: leave Connect's primitives where they are and only align its CSS
  to the tokens. Two implementations of the same behaviour stay.

Confidence: medium-high.

## A5.4 — What each owner's issue asks for

Resolved 2026-10-16: **A**.

- **A (recommended)**: one issue per owner area, same shape: (1) read
  style.wootdev.com/CLAUDE.md and the chapter for your pages; (2) run
  Claude against your area with the prompt "list every place this page
  departs from the Saga product style and classify it as token swap,
  component swap, or a gap in the system"; (3) fix token swaps in a PR,
  queue component swaps for after `@saga-ed/ui-svelte` reaches your
  component, and file gaps as product-style issues naming a DS id or
  asking for one. Owners report back on the epic.
- **B**: a single shared issue. Loses per-area accountability.

Confidence: high.

## Per-repo first-pass plan (what "we" deliver)

| Repo | First pass | Owner decides |
|---|---|---|
| saga-dash | Replace the three `tokens.css` with `@import '@saga-ed/product-style/tokens.css'` plus a small app alias file for dash-only tokens (`--timeline-*`, `--qtf-*`, `--note-*`, `--color-role-*`); move the root-size steps from `body` px to the system's `html` rem model; point CLAUDE.md at the system; keep the CI guards; later the core-ui shim (phase 4). | The value changes the diff script lists; per-page component swaps. |
| coach | Replace `tokens.css` with the published one plus an alias file mapping `--sdt-p-*` and `--color-error` (pink → clay is a visible change); fontsource stays; update `docs/CSS_TOKENS.md`. | Whether `--color-error` changes now; theme-example handling. |
| qboard | Tier-1 primitives from the published CSS under `--cv3-saga-*` aliases; `--cv3-danger` pink → clay flagged; canvas constants from `tokens.ts`; Connect primitives upstreamed (A5.3). | The pen-stamp brand colours; whether high-contrast remap stays app-level. |
| staff-admin, analytics | Same as dash; `--banner-*` and `--color-role-*` stay app-level. | Nothing expected. |
| prototypes | Done (CLAUDE.md, starter, drift check). | — |

## Related artifacts

- Phase 4 plan: product-ui-components `docs/decisions/phase-4-svelte-library.md`.
- Source survey: `design-system-inventory.md` (per-repo token state).
- Epic: saga-dash#1954.
