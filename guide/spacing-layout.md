---
title: Spacing and layout
order: 30
summary: The 4px spacing ladder, the shell frame (240px nav, 64px top bar, 24px content gutter), card grids, density and breakpoints.
---

Saga screens are dashboards: a fixed navy nav, a fixed top bar, and a white content
area holding cards and tables. Spacing is a short ladder on a 4px grid (DS-008) and
nearly every gap on a screen is one of three values: 8, 16 or 24.

## Scale

| Token | Value | Use it for |
|---|---|---|
| `--space-2xs` | `2px` | Hairline gaps: between a chip's icon and label, badge inset, the gap under a tab underline |
| `--space-xs` | `4px` | Inside compact controls: chip padding, icon-to-text in a button, gap between stacked badges |
| `--space-sm` | `8px` | Label to control, items in a button row, gap between chips, table cell vertical padding |
| `--space-md` | `16px` | The default. Between form fields, list rows, paragraphs; cell horizontal padding; card grid gap when dense |
| `--space-lg` | `24px` | Card padding (`--card-padding`), content gutter, gap between cards |
| `--space-xl` | `32px` | Between sections on a page; above a section heading |
| `--space-2xl` | `48px` | Top of a page below the top bar when there is no tab strip; empty-state padding |
| `--space-3xl` | `64px` | Hero and marketing blocks only; equal to `--topbar-height` |

Rules:
- Spacing comes from the ladder. `13px`, `20px` and `1.3rem` are not on it.
- Spacing is in `px` tokens, so it does not grow with the text-size preference; text
  does. That is intentional: a user who wants bigger text does not want bigger gaps,
  and a 1.7× gutter would eat the screen.
- Padding inside a container is uniform (`24px` all round on a card), not "a bit more
  at the top".
- Use `gap` on flex and grid rather than margins on children, so the last item needs
  no exception.

## Page layout

The shell is three fixed regions and one scrolling one (DS-007):

```
┌──────────┬────────────────────────────────────────┐
│          │ top bar  64px  (page title, clock, ⋯)  │
│ nav      ├────────────────────────────────────────┤
│ 240px    │ content: padding 24px                  │
│ navy     │   tab strip (optional)                 │
│ fixed    │   action row                           │
│          │   cards / table (scrolls)              │
│ district │                                        │
└──────────┴────────────────────────────────────────┘
```

| Region | Size | Token |
|---|---|---|
| Left nav | `240px` wide, full height, fixed | `--nav-width`, `--nav-bg` |
| Top bar | `64px` tall, white, hairline bottom border | `--topbar-height`, `--topbar-bg`, `--topbar-border` |
| Content gutter | `24px` on all sides | `--space-lg` |
| Tab strip | sits at the top of the content, full width, underline rule | `--tab-font-size` |

```html
<div class="saga-shell">
  <nav class="saga-nav">…</nav>
  <div class="saga-shell__main">
    <header class="saga-topbar"><h1 class="saga-topbar__title">Demo Program 08/17</h1>…</header>
    <main class="saga-page">
      <div class="saga-tabs" role="tablist">…</div>
      <div class="saga-page__toolbar">…</div>
      <div class="saga-card">…</div>
    </main>
  </div>
</div>
```

`.saga-shell` is a `100vh` grid of `--nav-width` plus the rest; `.saga-page`
is the padded scroll region. When the shell has to live inside something else
(a decision-board scene, a preview panel, a tutorial frame) add
`.saga-shell--framed`: it fills its positioned parent's height instead of the
viewport, and overlays inside it use `.saga-scrim--local` and
`.saga-toast-stack--local` so they stay in the frame (DS-118). The full markup
is in [shell-navigation](shell-navigation.md#html-skeleton).

Content width (DS-026):
- Data pages (rosters, schedules, reports) are fluid. A table uses the whole width and
  scrolls horizontally inside its card when it must.
- Forms and settings cap at `max-width: 720px`; a form wider than that has fields the
  eye cannot connect to their labels.
- Reading content (help, onboarding, empty states) caps at `72ch`.
- Nothing is centred in the content area except an empty state.

The top bar holds the page title (h1, blue), an optional context crumb ("Schedule"), and
a right cluster of clock, icon buttons and the user menu with `--space-md` between
them. It never holds page actions; those go in the content's action row.

## Cards

Cards are the unit of layout (see [Elevation and surfaces](elevation-surfaces.md#cards)
for their look). `.saga-grid` is the grid: `--space-md` gaps, one column by
default, `--2` / `--3` / `--4` for fixed columns, `--stats` (alias
`.stat-grid`) for an `auto-fit` row of stat cards that reflows without
breakpoints, `--lg` to widen the gap to `--space-lg` for content cards:

```html
<div class="saga-grid saga-grid--stats">…three .saga-card--stat…</div>
<div class="saga-grid saga-grid--2 saga-grid--lg">…two content cards…</div>
```

| Grid | Min column | Gap | Example |
|---|---|---|---|
| Stat cards (`.saga-grid--stats`) | `220px`, `auto-fit` so three cards fill the row | `--space-md` | Surveys report: Completion / Submissions / Launches |
| Content cards (`.saga-grid--2`/`--3` with `--lg`) | half or a third of the row | `--space-lg` | Day-type cards on Schedule |
| Option cards (radio-as-card, `.saga-grid--4`) | a quarter of the row | `--space-md` | Rotation Pattern in Configure Period |
| Full-width card | one column | `--space-lg` between stacked cards | "All Periods", "Questions" |

Inside a card: heading, then `--space-md` steps (the rhythm rule), with the card's
`24px` padding doing the framing. Cards in a grid share a height row; put variable
content at the bottom so the tops line up.

A card never contains another card. A card may contain a table, a list of rows with
hairline dividers, or a sub-grid of option cards.

## Density

Two densities, chosen per surface, never mixed inside one table (DS-027):

| | Comfortable (default) | Dense |
|---|---|---|
| Table row height | about `40px` (`.saga-table`: cell padding `--space-sm` `--space-md`, `--text-base`) | about `32px` (`.saga-table--dense`: cell padding `--space-xs` `--space-sm`) |
| List row | `--space-md` vertical padding | `--space-sm` |
| Card grid gap | `--space-lg` | `--space-md` |
| Button | default `.saga-btn` | `.saga-btn--sm` |
| When | Forms, settings, anything a user edits | Rosters, logs, anything a user scans; 20+ rows |

The Rosters grid is dense: 37px rows, 13px text in `#444`, a sticky header row on
`--color-bg-secondary`. The Schedule "All Periods" list is comfortable. Dense is for
reading many rows, comfortable is for acting on one.

Density is a container class, not a global setting:

```html
<table class="saga-table saga-table--dense">…</table>
```

## Breakpoints

The root font size steps up at two widths (DS-010), so the type and every `rem`
measurement grows on big monitors while the pixel spacing ladder stays put:

| Width | Root | What changes |
|---|---|---|
| under 1024px | 15px | Nav collapses to a drawer; content gutter drops to `--space-md`; stat cards stack |
| 1024 to 1399px | 15px | The reference layout. Screenshots in this guide are 1225px wide |
| 1400 to 1799px | 17px | Text grows about 13%; card grids gain a column |
| 1800px and up | 19px | Text grows again; keep `max-width` on forms and prose or lines get long |

Under 1024px (DS-026): the nav becomes an overlay drawer opened from a menu button in
the top bar, at `--z-overlay` with `--modal-scrim` behind it; the top bar stays 64px;
tables keep their columns and scroll horizontally inside the card rather than
reflowing into stacked cells. Saga products are used on laptops and Chromebooks, not
phones, so there is no phone layout to design; the drawer rule exists so a half-width
window still works.

```css
@media (max-width: 1023px) {
  .saga-nav { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%); z-index: var(--z-overlay); }
  .saga-nav[data-open] { transform: none; }
  .saga-page { padding: var(--space-md); }
}
```

Do not add breakpoints for card grids; `auto-fill` handles them. Do not change the
spacing ladder at any width.

## Alignment

- Labels sit above their controls, left-aligned, `--space-sm` below the label. Side
  labels (the legacy `fixed-width-labels` form) are for dense settings panels only.
- Action rows: primary action first on the left in content, last on the right in a
  modal footer. Buttons in a row are `--space-sm` apart.
- Icons align to the text baseline at `1.333em` (the legacy icon size) with a
  `-0.075em` vertical offset, and sit `--space-xs` from their label.
- Everything on a page snaps to the 4px grid. If a measurement is odd, it is wrong.
