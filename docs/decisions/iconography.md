---
status: Accepted
---

# Iconography: one rule for new icons, and what changes now

Status: **RESOLVED 2026-11-10**. I1 to I4 are A, with Jeff's changes below;
I5 is B. DS-154 supersedes DS-063, and `guide/iconography.md` is rewritten to
match.

## Resolution (Jeff, 2026-11-10)

- **I1 = A**, with two exceptions:
  - **Info is always outlined.** Filled, it gets too dark and pulls too much
    attention.
  - **Sentiment faces stay outlined.** That is the classic smiley.
  - Exceptions like these are fine when someone carefully designs a
    particular UI; the reason sits next to the icon in the app's icon list.
- **I2 = A** and **I3 = A**, with the interim.
- **I4 = A**, plus **success and close**. Twelve meanings change now: info,
  warning, error, success, close, kebab, chevron, search, download, edit,
  delete and menu. Everything else (avatar, cameras, time and so on) is tuned
  in place.
- **I5 = B.** No CI rule for now; the product-style guide is the rule.

## Context

A survey of the product repos on 2026-11-09 found icons drawn from at least
five sources:

- the dashboard's left nav uses classic filled Material Icons;
- the top bar and most dashboard pages use hand-drawn strokes, at 13 different
  widths (1.2 to 4);
- `@saga-ed/dash-icons` ships Material Symbols Light (300) as `XIcon` and
  weight 400 as `XBoldIcon`;
- ui-svelte's internal icons are Light;
- Connect's `cv3-icons` mixes Light with Fluent glyphs swapped in "for weight",
  plus MDI;
- the hosted report pages (sentiment, session insights) paste filled Material
  Icons.

DS-063 (still *proposed*) prescribes Light 300, which is why prototypes look
thinner than the product. That was never the intent.

Direction from Jeff on 2026-11-10:

- Heavier, not lighter. Small icons and icons on dark surfaces read best
  filled, and much of today's dashboard already looks right.
- Leave qboard's whiteboard tool icons alone; they are hand-picked.
- Prefer curated packages over pasted SVG. Connect keeps its own set, and
  dashboards and reports share one.
- Back-propagate only a short list of meanings. The priority is new code.

The decision board at prototypes `/design_system/iconography` (prototypes#67)
shows today's exact icons next to each option. Its **Recommended rule** and
**Changes now** presets show I1-A and I4-A below.

## The decisions

### I1: the rule for weight and fill

- **A (recommended): size tiers.**
  - At **24px and up**, use Material Symbols Rounded at **weight 400,
    outlined**. Fill only to show state: the current nav item, selected, or
    off/muted.
  - **Under 24px, or on a dark surface** (left nav, Connect header and tiles),
    use the **filled form at weight 500**. Line glyphs that have no filled form
    (chevron, kebab, search, close, menu, download) just take the heavier
    weight.
  - *Impact:* it matches today's left nav and most dashboard icons, so the
    visible change is small. The top bar (24px) stays outlined.
- **B: weight 400 everywhere, outlined, with fill decided by role.**
  - *Impact:* only one variant per icon, but 15–18px row icons read light (see
    the board's note rows and card actions).
- **C: keep DS-063 (Light 300).**
  - *Impact:* keeps the thin look we are moving away from.

### I2: where icons come from

- **A (recommended): curated icon packages, following the cv3-icons pattern.**
  - Each package holds a typed list of names. A build step fills it from
    `@material-symbols/svg-400` and `@material-symbols/svg-500` (Apache-2.0,
    every icon, filled and outlined), and each entry carries its large and
    small variant.
  - A call site passes a name and a size, never a weight or a path.
  - There are two sets:
    - **Connect** keeps `cv3-icons`. qboard-lib's whiteboard tools stay as
      they are.
    - **Dashboards and reports** share one set. This builds the
      `@saga-ed/ui-icons` package planned in product-ui-components P4.4, with
      an `<Icon>` in ui-svelte.
  - An icon from another set is allowed when Material Symbols lacks one or
    draws it badly. It goes in the list with a one-line reason (for example,
    Fluent `mic-prohibited`).
  - *Impact:* one place to change a glyph. The 500 weight costs nothing at
    runtime.
- **B: `@iconify/svelte` at runtime**, as P4.4 is written today.
  - *Impact:* Iconify carries only weights 300 and 400, so the small tier
    can't be built. Icons are also fetched at runtime unless they are bundled.
- **C: each repo keeps pasting SVGs** (status quo).
  - *Impact:* the drift continues.

### I3: icons in prototypes

- **A (recommended): style.wootdev.com serves the same curated set** as a
  small `saga-icon` web component generated from the I2 list, and the starter
  switches to it.
  - Until it exists, prototypes use the `iconify-icon` tag with
    `material-symbols:<name>-outline-rounded` for large icons and
    `material-symbols:<name>-rounded` (filled) for small ones. That is weight
    400 only, which is close enough for a mock.
  - *Impact:* prototypes and product draw identical glyphs.
- **B: prototypes stay on iconify at weight 400 permanently.**
  - *Impact:* the simplest option, but small icons in prototypes are a shade
    lighter than in the product.

### I4: what changes now vs going forward

- **A (recommended): the rule applies to new code from today. Back-propagate
  only info, warning, error, kebab, chevron, search, download, edit, delete
  and menu.**
  - First at the **chokepoints**, where one edit changes every use:
    - ui-svelte's internal icons (the Tooltip info icon covers all its uses);
    - the dash-icons entries for those meanings (34 files import dash-icons,
      and none of them need editing);
    - core-ui FacetedSearch, NotificationBell and UserMenu;
    - sentiment-pages InfoTip.
  - Then the hand-drawn copies: about 20 files across dash, sentiment-pages
    and session-insights, one icon-only PR per repo.
  - Everything else (avatar, mic and camera, time, calendar, the left nav,
    Connect) changes only when someone is already working in that code.
  - Two optional additions: **success**, which completes the status set in one
    `StatusIcon`, and **close**, which is the same kind of line glyph as kebab
    and chevron.
  - *Impact:* a few small PRs. Status and info icons agree on every screen;
    for example, Reports → Surveys shows dash's and sentiment-pages' info icons
    side by side today.
- **B: forward only, no back-propagation.**
  - *Impact:* no churn, but the four different info icons stay.
- **C: full port.**
  - *Impact:* hundreds of edits for small visual gain. Not wanted.

### I5: keeping new code on the rule

- **A (recommended): docs plus a ratchet.**
  - `guide/iconography.md`, the starter and prototypes' CLAUDE.md line say it.
  - Each product repo gets a short rule file.
  - saga-dash gets a CI ratchet like its native-`title=` one: the count of
    inline 24-grid icon SVGs in `.svelte` files may not grow.
  - *Impact:* new code can't quietly paste icons. Old code is untouched.
- **B: docs only.**
  - *Impact:* relies on review to catch pasted icons.

## Recommendation

- **I1: A (high).** It is what the dashboard mostly does already, and it
  explains why the filled left nav looks right.
- **I2: A (high for the package pattern; medium for weight 500).** If 500
  disappoints at some size, the small tier falls back to filled 400 without
  touching any call site.
- **I3: A, with the interim (medium).**
- **I4: A (high).** Adding success and close is your call.
- **I5: A (medium).** The ratchet is cheap, but its pattern needs tuning so
  that chart SVGs don't count.

Order of work once resolved:

1. **product-style:** a new DS entry superseding DS-063, a rewrite of
   `guide/iconography.md`, and the starter and prototypes CLAUDE.md lines.
2. **product-ui-components:** `@saga-ed/ui-icons` (generator plus a curated
   list, starting with the twelve meanings and the nav set), ui-svelte `<Icon>`
   with sizes, and `StatusIcon` and `InfoTip`. Swapping ui-svelte's internal
   icons moves every Tooltip info icon.
3. **saga-dash:** re-point the dash-icons entries for the twelve meanings, then
   one icon-only PR for the hand-drawn copies. The hosted pages
   (sentiment-pages, session-insights) each get one small PR. There is no
   ratchet and no per-repo rule file (I5 = B).
4. **Connect:** nothing now. New Connect icons follow I1 inside `cv3-icons`.

## Related artifacts

- Decision board: prototypes `/design_system/iconography`
  (saga-ed/prototypes#67). Its presets are *Today*, *Changes now* and
  *Recommended rule*, plus the earlier option set. Copy preferences produces
  the settings block.
- DS-063 (`guide/decisions.md`), which this record supersedes.
- product-ui-components `docs/decisions/phase-4-svelte-library.md` P4.4
  (icons; it plans `@saga-ed/ui-icons`).
- `@material-symbols/svg-400` and `@material-symbols/svg-500` on npm
  (marella/material-symbols, Apache-2.0).
