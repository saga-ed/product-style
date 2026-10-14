---
title: Tables and data
order: 130
summary: Data tables, stat cards, key-value lists, chips and badges, progress and skeleton bars, chart conventions, and calendar cells.
---

Most of a Saga dashboard is data: rosters, schedules, survey results, session
counts. This chapter is the look of that data at rest. The rule underneath all
of it is that structure comes from hairlines and grey fills, never from heavy
borders or coloured backgrounds, and colour is spent only on meaning (day type,
status, selection).

## Data tables

The roster grid (`dashboard_rosters_page.png`) is the reference table.

| Part | Treatment |
|---|---|
| Container | 1px `--color-border` on all sides, `--radius-md`, white |
| Header row | `--color-bg-tertiary` (`#f3f4f6`) fill, `--text-sm` `--weight-semibold` `--color-text-dark`, sticky to the top of the scroll container (`--z-sticky`) |
| Cells | `--text-sm` `--color-text`, padding `--space-sm` `--space-md`, 1px `--color-border` between rows and columns |
| Row height | about 36px; dense tables may drop to 32px, never below |
| Row hover | `--color-bg-secondary` wash; selected row `--color-primary-light` |
| Sort | the sorted column shows a small up or down triangle after its label in `--color-text`; unsorted columns show nothing until hovered. Click toggles direction. |
| Actions column | first column, fixed width, icon-only quiet buttons: a pencil (edit) and a lock (locked or read-only), 16px glyphs in `--color-text-dark` |
| Overflow | the table scrolls horizontally inside its container with a visible bottom scrollbar; the first column and header stay put |
| Numbers | right-aligned, tabular figures; text left-aligned |

```html
<table class="saga-table">
  <thead>
    <tr>
      <th scope="col"><span class="sr-only">Actions</span></th>
      <th scope="col" aria-sort="ascending">Display Name ▲</th>
      <th scope="col">Student ID</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <button class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm" aria-label="Edit Aaliyah L"><iconify-icon icon="material-symbols-light:edit-outline-rounded"></iconify-icon></button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm" aria-label="Locked"><iconify-icon icon="material-symbols-light:lock-outline-rounded"></iconify-icon></button>
      </td>
      <td>Aaliyah L</td><td>sbx28-s21</td><td>training-sbx28-s21@saga.org</td>
    </tr>
  </tbody>
</table>
```

**Empty state.** A table with no rows keeps its header and shows one centred
message row in `--color-text-secondary`: what is empty and the one action that
fills it ("No students yet. Add a student or upload a roster."). Never an
illustration, never a blank box. See [voice-writing](voice-writing.md#empty-states).

**Loading.** First load shows a skeleton with the real column count (below).
A re-sort or filter keeps the old rows visible and dims them; it does not
flash a skeleton.

**List rows.** A list of editable things that is not quite a table (the All
Periods list in `dashboard_schedule.png`) is a stack of 1px-bordered rows
sharing one container: a drag handle at the left in `--color-text-muted`, the
name in `--text-base` with a quiet pencil beside it, inline detail chips, and
a trash icon pushed to the right.

## Stat cards

A stat card is a `.saga-card` with a `--stat` modifier and three lines:

1. The number: `--text-2xl`, `--weight-semibold`, `--color-primary`. A
   percentage keeps its sign in the same size ("0%").
2. The label: `--text-base`, `--weight-semibold`, `--color-text` ("Completion").
3. The caption: `--text-xs`, `--color-text-secondary`, one line
   ("0 of 55 students").

The card has the standard hairline border and `--shadow-sm`, plus a 2px
`--color-primary` top edge that marks it as a stat rather than a content
card. Stat cards sit in a grid of equal widths with `--space-md` gaps,
three or four across.

```html
<div class="saga-card saga-card--stat">
  <strong>55</strong>
  <h3>Submissions</h3>
  <small class="text-secondary">Responses received</small>
</div>
```

## Key-value lists

Two columns, no borders: the key in `--text-sm` `--weight-semibold`
`--color-text-dark`, the value in `--text-sm` `--color-text`, rows
`--space-sm` apart, keys a fixed width (about 160px) so values line up. When
there are more than six pairs, add hairline rules between rows and it becomes
a borderless table (the Day Types / Time / Duration block in the Configure
Period modal is exactly that: a header row in semibold with a 2px rule, then
hairline rows).

## Chips

A chip is a small rounded label. Four kinds, one height (`--text-xs`,
`--weight-semibold`, `2px 8px` padding).

| Kind | Class | Look | Example |
|---|---|---|---|
| Day type, Regular | `.saga-chip--regular` | `--chip-regular` (clay) fill, white text, `--radius-sm` | "Regular" on every weekday cell |
| Day type, Advisory | `.saga-chip--advisory` | `--chip-advisory` (teal) fill, white text, `--radius-sm` | "Advisory" on Fridays |
| Neutral tag | `.saga-chip--neutral` | `--chip-neutral-bg` fill, `--chip-neutral-text`, `--radius-full` | "Math" next to a survey question |
| Status pill | `.saga-chip--outline` | 1px border and text in the status colour, white fill, `--radius-full` | "Not Started", "In Progress", skill levels |

Day-type chips are the two filled exceptions; they come straight from the
Schedule and Calendar screens and a chip filled with any other colour is wrong.
A day-type reference inside running text (the All Periods list) is a 8px dot
in the chip colour followed by the name in semibold, not a filled chip.

Status pills follow the newer Figma direction (`past_session_figma_comp.png`):
outlined, not filled, so a row of them reads as labels rather than buttons.
The selected one in a filter row inverts to a navy fill with white text. Colour
the outline by meaning: `--color-primary` for an active or current state,
`--color-success` for done, `--color-warning` for attention, `--color-teal`
for the teal rail tiers, `--color-text-secondary` for not started.

```html
<span class="saga-chip saga-chip--regular">Regular</span>
<span class="saga-chip saga-chip--advisory">Advisory</span>
<span class="saga-chip saga-chip--neutral">Math</span>
<span class="saga-chip saga-chip--outline" style="color: var(--color-primary)">In Progress</span>
```

**Count badges** (`.saga-badge`) are the numeric sibling: `--radius-full`,
18px tall, `--text-xs` bold tabular digits. On a tab they are
`--color-bg-tertiary` with `--color-text-secondary`; on the notification bell
and anywhere attention is meant, `--color-attention-strong` fill with white
text. A badge never shows zero; hide it instead.

**Avatars** that accompany people in chips and cards are 26px circles,
`--color-primary-light` fill, `--color-primary` initials in `--text-xs` bold.

## Progress and skeleton bars

A **progress bar** is a 6px track in `--color-bg-tertiary`, `--radius-full`,
with a `--color-primary` fill. Put the percentage as text beside it; the bar
alone is not enough. In a result list (the Questions card in
`dashboard_reports_surveys.png`) an unanswered row shows an empty grey track
and a dash where the number would be.

A **skeleton** (`.saga-skeleton`) is a `--color-gray-light` bar with
`--radius-sm` corners that pulses between 42% and 85% opacity over 1.15s
(static at 60% under reduced motion; never a sliding shimmer). Match the
shape of the content it stands in for: the same number of rows, the same
column widths, a card grid for cards. Group the bars in a container with
`role="status"` and a visually hidden "Loading students" label; the bars
themselves are `aria-hidden`.

```html
<div role="status" aria-busy="true">
  <span class="sr-only">Loading students</span>
  <div class="saga-skeleton" style="height: 40px"></div>
  <div class="saga-skeleton" style="height: 40px; width: 92%"></div>
</div>
```

## Charts

Charts follow the AI Insights screens (`ai_insights_*.png`):

- **Frame**: a `.saga-card` with a title row (an uppercase `h4` section label,
  then the chart title in `--text-base` semibold) and a one-line caption in
  `--color-text-secondary` that says what a mark is and what the user can do
  ("Click on any dot to observe a recorded session").
- **Axes**: hairline `--color-border` lines, `--text-xs` labels in
  `--color-text-secondary`, rotated date labels when they would collide. No
  gridlines by default.
- **Group bands**: adjacent groups (Period 1, Period 2) alternate white and
  `--chart-band` backgrounds, each with a header giving the group name
  and its summary ("Average: 11.5") in `--text-xs` semibold.
- **Average line**: a 1px `--chart-average` horizontal rule per band.
- **Marks**: 8px filled circles. Series take `--chart-1` through `--chart-8`
  in order (blue, magenta, teal, orange, pink, navy, lime, coral; DS-024). A
  chart that is about one named thing may pick its series colour, which is
  why the shipped AI Insights scatter is magenta. Hover enlarges the mark and
  shows a tooltip; a click opens the thing the mark stands for.
- **Timelines**: event ticks are 2px by 10px bars in the series colour on a
  hairline track; a legend at the left pairs a 10px square swatch with the
  label. Glow and grow markers use the brand heart and leaf glyphs.
- Never red versus green for good versus bad; use the chip and notice colours
  (`--color-success`, `--color-warning`) only when the chart is about status.

## Calendar cells

The month grid (`calendar_view.png`) is a 7-column table of `.saga-card`-like
cells, 1px `--color-border` between them, 96px tall:

- Day number top-left in `--text-sm`; adjacent-month days in
  `--color-text-muted`.
- A day-type chip (Regular or Advisory) to the right of the number.
- One **count tile** per day with sessions, left-aligned, `--text-xs`
  semibold, `--radius-sm`: for today and upcoming days `--color-primary` fill
  with white text ("18 sessions"); for past days `--color-bg-tertiary` fill with
  `--color-text-secondary` text; for next-month days `--color-primary-light`
  with blue text. Hover brightens it; clicking opens the day.
- Holidays are striped in `--color-bg-secondary`; days filtered out are dimmed.
- Today's cell has a `--color-primary-light` background.

## Do and don't

Do

- Sort numbers right, text left; header text matches the cell alignment.
- Keep one hairline weight (`1px --color-border`) everywhere in a table.
- Use the blue top edge only on stat cards.

Don't

- Don't zebra-stripe rows; hover and selection are the only row tints.
- Don't fill a chip with a colour other than clay (Regular) or teal (Advisory).
- Don't put a filled button in every row; row actions are quiet icons.
- Don't show "0" in a badge.
