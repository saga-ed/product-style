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
2. **Program selector.** A small label, "Current Program", in `--text-sm`
   medium weight at `--color-gray-light`, then a white select (see
   [forms-inputs](forms-inputs.md#select)). The select is the one white
   control on the navy surface, which is what makes it findable. Below it an
   underlined "Configure program" link with a small wrench icon, same muted
   grey, white on hover.
3. **Section links.** One per top-level area, in this canonical order:
   Dashboard, Sessions, Rosters, Surveys, Reports. Each is an icon (20px,
   70% opacity) plus a label in `--text-base`, with `--space-sm` between them
   and `--space-sm` / `--space-md` padding.
4. **Empty flex space** that pushes the footer down.
5. **District footer.** The label "District" and the district name, both in
   `--nav-text`.

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
  `--text-sm` semibold, and a hint line "back to Demo Program 08/17" in
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

- A clock in `--text-sm`, medium weight, `--color-text-secondary`, tabular
  figures ("8:34 PM"). It shows the program's local time when a program is
  selected.
- Icon buttons (search, hamburger menu): 24px glyph, `--color-text-secondary`,
  4px padding, `--radius-sm`. Hover is `--color-bg-tertiary` with
  `--color-text`. Each has an `aria-label` and a tooltip (the search one also
  shows its keyboard shortcut in the tooltip).
- The notification bell, same treatment, with a count badge pinned to its
  top-right corner: `--color-attention-strong` (`#d14600`) fill, white
  11px bold tabular digits, `--radius-full`, 18px tall. The badge shows the
  number of things that need attention; it never shows "0".

| Token | Value |
|---|---|
| `--topbar-height` | `64px` |
| `--topbar-bg` | `--color-bg` |
| `--topbar-border` | `--color-gray` (`#9f9f9f`) |
| title | `--text-2xl` / `--weight-semibold` / `--color-primary` |

## Content area and page tabs

The content area is a scroll container padded `--space-lg`. Pages start with
either a tab strip or a card.

**Page tabs** sit directly under the top bar, on a 2px `--color-border`
baseline that runs the full content width.

- Label: `--tab-font-size` (`15px`), `--tab-text` (`#444444`), padding
  `8px 16px 9px`, no background.
- Active: `--tab-text-active` blue, `--weight-semibold`, and a 3px
  `--color-primary` underline that overlaps the baseline.
- Hover: `--color-text` with a `--color-bg-secondary` wash.
- Count badges follow the label with `--space-sm` gap: `--color-bg-tertiary`
  pill, `--radius-full`, `--text-xs` semibold, `--color-text-secondary`. The
  active tab's badge takes `--color-primary-light` fill and blue text.
- A right-aligned control may share the tab row (for example the
  "Show Entire District" toggle on Rosters).

Below the tabs, an action row (Add, Upload, Download, then a search box at the
far right) and then the table or cards. See [tables-data](tables-data.md).

## Immersive header strip

Full-screen viewers (the Session Viewer in `past_session_figma_comp.png`) drop
the left nav and top bar and use a single navy strip instead:

- `--saga-navy` background, 56 to 64px tall, white text.
- Left: an avatar circle, then the subject name (`--text-base` semibold) with
  a one-line sub-label ("2 students") in `--text-sm` at 70% white.
- Then context chips: a filled `--color-primary` pill for the period and room,
  and icon + text pairs (calendar, clock, duration) in white.
- Right: an underlined white link ("View Workspace") and a round white close
  button. Esc also closes.

Use this only for a viewer that takes the whole screen. Dashboard pages keep
the frame.

## HTML skeleton

```html
<div style="display: flex; height: 100vh">
  <nav class="saga-nav" aria-label="Main">
    <a class="saga-nav__logo" href="/"><img src="saga-logo-white.png" alt="Saga Education"></a>

    <div class="saga-nav__section">
      <span class="saga-label">Current Program</span>
      <button class="saga-select" aria-haspopup="listbox">Demo Program 08/17</button>
      <a href="/config">Configure program</a>
    </div>

    <ul class="saga-nav__section">
      <li><a class="saga-nav__item" href="/dashboard"><iconify-icon icon="material-symbols-light:dashboard-outline-rounded"></iconify-icon> Dashboard</a></li>
      <li><a class="saga-nav__item" href="/sessions"><iconify-icon icon="material-symbols-light:calendar-month-outline-rounded"></iconify-icon> Sessions</a></li>
      <li><a class="saga-nav__item" href="/roster" aria-current="page"><iconify-icon icon="material-symbols-light:group-outline-rounded"></iconify-icon> Rosters</a></li>
      <li><a class="saga-nav__item" href="/surveys"><iconify-icon icon="material-symbols-light:assignment-turned-in-outline-rounded"></iconify-icon> Surveys</a></li>
      <li><a class="saga-nav__item" href="/reports"><iconify-icon icon="material-symbols-light:bar-chart-rounded"></iconify-icon> Reports</a></li>
    </ul>

    <div class="saga-nav__footer">
      <span class="saga-label">District</span>
      Saga SC Sandbox 28
    </div>
  </nav>

  <div style="flex: 1; display: flex; flex-direction: column; min-width: 0">
    <header class="saga-topbar">
      <h1 class="saga-topbar__title">Demo Program 08/17</h1>
      <div class="saga-topbar__actions">
        <span class="text-secondary">8:34 PM</span>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Search pages">
          <iconify-icon icon="material-symbols-light:search-rounded"></iconify-icon>
        </button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Notifications, 2 need attention">
          <iconify-icon icon="material-symbols-light:notifications-outline-rounded"></iconify-icon>
          <span class="saga-badge">2</span>
        </button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Menu">
          <iconify-icon icon="material-symbols-light:menu-rounded"></iconify-icon>
        </button>
      </div>
    </header>

    <main id="main-content" tabindex="-1">
      <nav class="saga-tabs" aria-label="Roster views">
        <button class="saga-tab" aria-selected="true">Students <span class="saga-tab__count">55</span></button>
        <button class="saga-tab" aria-selected="false">Tutors <span class="saga-tab__count">8</span></button>
        <button class="saga-tab" aria-selected="false">Admins <span class="saga-tab__count">1</span></button>
      </nav>
      <!-- page content -->
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

- Don't add a second brand colour to the nav (no teal pills, no coloured
  icons). The nav is navy, white, and one blue pill.
- Don't put page actions (Save, Add) in the top bar; they belong in the
  content area next to what they act on.
- Don't let the top bar grow taller for a long title; ellipsize it.
- Don't style the nav as a light sidebar. The navy chrome is the brand.
