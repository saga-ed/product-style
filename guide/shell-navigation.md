---
title: Shell and navigation
order: 100
summary: The frame every Saga dashboard page sits in, a navy left nav, a white top bar, and a padded content area with page-level tabs.
---

Every Saga dashboard screen is the same frame with a different page inside it.
If you only read one chapter before building a prototype, read this one: get
the frame right and a page reads as Saga even when its contents are rough.

The frame has three parts, left to right and top to bottom:

| Part | Size | Surface | Role |
|---|---|---|---|
| Left nav | `--nav-width` (`240px`), full height | `--nav-bg` (navy `#0b2a4a`) | identity, program context, section links, district |
| Top bar | `--topbar-height` (`64px`), full width of the content column | `--topbar-bg` (white) with a `--topbar-border` bottom rule | page title, context, clock, utilities |
| Content area | the rest, scrolls on its own | `--color-bg` (white) | the page, padded `--space-lg` (24px) on all sides |

The nav and top bar never scroll. Only the content area scrolls, so the frame
stays put while a long roster goes by.

## Left nav

Read top to bottom, the nav has five bands. Each band is separated from the
next by a 1px `--nav-border` rule (white at 38%).

1. **Logo band.** The same height as the top bar (`--topbar-height`) so the
   white Saga logotype sits on the top bar's line. Logo height 34px, left
   padding `--space-md`. It links home.
2. **Program selector** (`.saga-nav__group`). A small label
   (`.saga-nav__label`), "Current Program", in `--text-base` medium weight,
   white (`--nav-text-active`), then the painted select
   (`.saga-select > .saga-select__trigger`, see
   [forms-inputs](forms-inputs.md#select)). The select is the one white
   control on the navy surface, which is what makes it findable. Below it an
   underlined "Configure program" link (`.saga-nav__link`) with a small
   settings icon, `--nav-text` grey, white on hover.
3. **Section links** (`.saga-nav__items > li > .saga-nav__item`). One per
   top-level area, in this canonical order: Dashboard, Sessions, Rosters,
   Surveys, Reports. Each is an icon (`--text-xl`, 70% opacity) plus a label
   (`.saga-nav__text`) in `--text-base`, with `--space-sm` between them and
   `--space-sm` / `--space-md` padding. A label is one line and ends in an
   ellipsis when it does not fit; the list never scrolls sideways, and its
   vertical scrollbar is the faint on-dark one (DS-131).
4. **Empty flex space** that pushes the footer down.
5. **District footer** (`.saga-nav__footer`). A `.saga-nav__label`
   "District" and the district name in `--nav-text`.

| Token | Value | Used for |
|---|---|---|
| `--nav-text` | `rgba(255,255,255,0.7)` | resting link and footer text |
| `--nav-text-active` | `#ffffff` | hover and active text |
| `--nav-text-muted` | `rgba(255,255,255,0.45)` | group labels in configure mode |
| `--nav-item-hover` | `rgba(255,255,255,0.06)` | link hover wash |
| `--nav-item-active` | `--color-primary` (`#006298`) | the active pill |
| `--nav-border` | `rgba(255,255,255,0.38)` | band dividers |
| `--nav-attention-bg` | `#f2a33c` | amber attention marks on navy |

**The active pill.** The current section is a fully rounded pill
(`--radius-full`) filled with `--nav-item-active` blue, white text at
`--weight-semibold`, icon at full opacity. Only one link is active at a time.
Hover on other links is the faint `--nav-item-hover` wash with white text, never
a second pill. Mark the active link with `aria-current="page"`.

The pill is inset `--space-sm` from the nav edges (it does not run edge to
edge) and has `--space-xs` between pills.

## Configure mode

When an admin enters program configuration the nav swaps bands 2 and 3 for a
checklist (see `dashboard_schedule.png`):

- An **exit box** at the top: a left arrow, "Exit configuration" in
  `--text-base` semibold, and a hint line "back to Demo Program 08/17" in
  `--text-xs` at 75% opacity. It is a translucent light-blue panel with a 1px
  border and `--radius-md` corners. This box is the only way out; the section
  links are gone.
- A **group label**, "CONFIGURE", in `--text-xs` semibold, uppercase, letter
  spacing 0.08em, `--nav-text-muted`.
- **Step links** (Details, People, Schedule, Groups, Review). Each has a 6px
  hollow dot on the left instead of an icon, and a status glyph pushed to the
  right: a check for complete, an amber triangle (`--nav-attention-bg`) for a
  warning, a lock for blocked, three dots for in progress. The active step is
  the same blue fill as a normal active link but with `--radius-sm` corners
  rather than a full pill, so the two modes read differently at a glance.
  Blocked steps are 55% opacity and not clickable.

The district footer stays. The top bar title gains the step name (below).

## Top bar

A single 64px row, white, with a 1px `--topbar-border` rule and a soft
`--shadow-sm` below it. Horizontal padding `--space-lg`.

**Left cluster**

- The page title is an `<h1>` in `--text-2xl`, `--weight-semibold`,
  `--color-primary` blue. It is the current program's name when one program is
  selected, else the district name. It ellipsizes before it wraps; the bar
  never grows taller.
- In configure mode the title is followed by a step badge (a small round
  illustration, ~2.6em) and the step name in `--text-base`, medium weight,
  `--color-text-secondary`. The badge is the divider; there is no dot or
  colon between them.

**Right cluster**, `--space-xs` apart, all vertically centred:

- A clock in `--text-base`, medium weight, `--color-text-secondary`, tabular
  figures ("8:34 PM"). It shows the program's local time when a program is
  selected.
- Icon buttons (search, hamburger menu): 24px glyph, `--color-text-secondary`,
  4px padding, `--radius-sm`. Hover is `--color-bg-tertiary` with
  `--color-text`. Each has an `aria-label` and a tooltip (the search one also
  shows its keyboard shortcut in the tooltip).
- The notification bell, same treatment, with a count badge
  (`.saga-badge-anchor > .saga-badge`) pinned to its top-right corner: clay
  fill by default, `.saga-badge--attention` for the dark-orange
  `--color-attention-strong` (`#d14600`) variant, white `--text-xs` semibold
  tabular digits, `--radius-full`, 1.25rem tall. The badge shows the number
  of things that need attention; it never shows "0".

| Token | Value |
|---|---|
| `--topbar-height` | `64px` |
| `--topbar-bg` | `--color-bg` |
| `--topbar-border` | `--color-gray` (`#9f9f9f`) |
| title | `--text-2xl` / `--weight-semibold` / `--color-primary` |

## Content area and page tabs

The content area (`.saga-page`) is a scroll container padded `--space-lg`.
Pages start with either a tab strip or a card.

**Page tabs** (`.saga-tabs > .saga-tab`) sit directly under the top bar, on a
1px `--color-border` baseline that runs the full content width.

- Label: `--tab-font-size` (`15px`), `--tab-text` (`#444444`), padding
  `8px 16px 9px`, no background.
- Active (`aria-selected="true"`): `--tab-text-active` blue,
  `--weight-semibold`, and a 2px `--color-primary` underline that overlaps
  the baseline.
- Hover: `--color-text` with a `--color-bg-secondary` wash.
- Count badges follow the label with `--space-sm` gap: `--color-bg-tertiary`
  pill, `--radius-full`, `--text-xs` semibold, `--color-text-secondary`. The
  active tab's badge takes `--color-primary-light` fill and blue text.
- A right-aligned control may share the tab row in `.saga-tabs__end` (for
  example the "Show Entire District" toggle on Rosters).

Below the tabs, an action row (Add, Upload, Download, then a search box at the
far right) and then the table or cards. See [tables-data](tables-data.md).

## Immersive header strip

Full-screen viewers (the Session Viewer in `past_session_figma_comp.png`) drop
the left nav and top bar and use a single navy strip instead:

- `--saga-navy` background, 56 to 64px tall, white text.
- Left: an avatar circle, then the subject name (`--text-base` semibold) with
  a one-line sub-label ("2 students") in `--text-base` at 70% white.
- Then context chips: a filled `--color-primary` pill for the period and room,
  and icon + text pairs (calendar, clock, duration) in white.
- Right: an underlined white link ("View Workspace") and a round white close
  button. Esc also closes.

Use this only for a viewer that takes the whole screen. Dashboard pages keep
the frame.

## HTML skeleton

This is the markup of the [shell showcase](/showcase/shell/) and of the
starter; the class names are the contract. `.saga-shell` is a two-column grid
(`--nav-width` + the rest) at `100vh`; `.saga-shell__main` is a column that
holds the top bar and the scrolling `.saga-page`. The nav is the full height of the
viewport however short the page is; only `.saga-page` scrolls. A shell that must sit inside
a page frame instead of the viewport (a showcase scene, never an app) adds `.saga-shell--framed` (see
[spacing-layout](spacing-layout.md#page-layout)).

```html
<div class="saga-shell">
  <nav class="saga-nav" aria-label="Main">
    <div class="saga-nav__logo"><a href="/" aria-label="Saga home"><img src="/assets/brand/saga-logo-white.png" alt="Saga Education"></a></div>
    <div class="saga-nav__group">
      <span class="saga-nav__label" id="prog-label">Current Program</span>
      <div class="saga-select">
        <button type="button" class="saga-select__trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="prog-label"><span>Demo Program 08/17</span></button>
      </div>
      <a class="saga-nav__link" href="#"><iconify-icon icon="material-symbols-light:settings-outline-rounded"></iconify-icon> Configure program</a>
    </div>
    <ul class="saga-nav__items">
      <li><a class="saga-nav__item" href="#"><iconify-icon icon="material-symbols-light:dashboard-outline-rounded"></iconify-icon> <span class="saga-nav__text">Dashboard</span></a></li>
      <li><a class="saga-nav__item" href="#"><iconify-icon icon="material-symbols-light:calendar-month-outline-rounded"></iconify-icon> <span class="saga-nav__text">Sessions</span></a></li>
      <li><a class="saga-nav__item" href="#" aria-current="page"><iconify-icon icon="material-symbols-light:group-outline-rounded"></iconify-icon> <span class="saga-nav__text">Rosters</span></a></li>
      <li><a class="saga-nav__item" href="#"><iconify-icon icon="material-symbols-light:checklist-rounded"></iconify-icon> <span class="saga-nav__text">Surveys</span></a></li>
      <li><a class="saga-nav__item" href="#"><iconify-icon icon="material-symbols-light:bar-chart-rounded"></iconify-icon> <span class="saga-nav__text">Reports</span></a></li>
    </ul>
    <div class="saga-nav__footer">
      <span class="saga-nav__label">District</span>
      <span>Saga SC Sandbox 28</span>
    </div>
  </nav>
  <div class="saga-shell__main">
    <header class="saga-topbar">
      <h1 class="saga-topbar__title">Demo Program 08/17</h1>
      <div class="saga-topbar__actions">
        <span class="saga-topbar__meta">8:34 PM</span>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Search this page"><iconify-icon icon="material-symbols-light:document-search-outline-rounded" class="saga-icon saga-icon--lg"></iconify-icon></button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Notifications, 2 unread"><span class="saga-badge-anchor"><iconify-icon icon="material-symbols-light:notifications-outline-rounded" class="saga-icon saga-icon--lg"></iconify-icon><span class="saga-badge">2</span></span></button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Menu"><iconify-icon icon="material-symbols-light:menu-rounded" class="saga-icon saga-icon--lg"></iconify-icon></button>
      </div>
    </header>
    <main class="saga-page saga-scrollbar" id="main-content" tabindex="-1">
      <div class="saga-tabs" role="tablist" aria-label="Roster">
        <button class="saga-tab" role="tab" aria-selected="true">Students <span class="saga-tab__count">55</span></button>
        <button class="saga-tab" role="tab" aria-selected="false">Tutors <span class="saga-tab__count">8</span></button>
        <button class="saga-tab" role="tab" aria-selected="false">Admins <span class="saga-tab__count">1</span></button>
        <div class="saga-tabs__end"><label class="saga-check"><input type="checkbox" class="saga-toggle" role="switch"> Show Entire District</label></div>
      </div>
      <!-- page content: .saga-page__toolbar, then the table or cards -->
    </main>
  </div>
</div>
```

Put a "Skip to main content" link as the first focusable element in the shell,
visually hidden until focused, pointing at `#main-content`.

## Do and don't

Do

- Keep the nav at exactly 240px and the top bar at exactly 64px.
- Use one active pill; everything else in the nav is text on navy.
- Put the program name in the title; the page's own name lives in the tabs
  or the first card heading, not repeated in the bar.
- Give every icon button an `aria-label` and a tooltip.

Don't

- Don't add a second brand color to the nav (no teal pills, no colored
  icons). The nav is navy, white, and one blue pill.
- Don't put page actions (Save, Add) in the top bar; they belong in the
  content area next to what they act on.
- Don't let the top bar grow taller for a long title; ellipsize it.
- Don't style the nav as a light sidebar. The navy chrome is the brand.
