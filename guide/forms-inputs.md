---
title: Forms and inputs
order: 120
summary: Field anatomy, text and select inputs, checkboxes and toggles, the date and time pickers, faceted search, validation, and form layout.
---

Saga forms are quiet: a label above, a bordered white box, a blue focus,
clay for errors. Native controls are welcome where they fit: a short plain
`<select>` or a single `<input type="date">` is accessible by default and
handles keyboard, touch and viewport edges for free. Reach for the painted
`.saga-select` listbox and `.saga-datepicker` when the control needs search,
groups, annotations, a range, or one look across browsers (see "Native or
painted?" under Select). One caveat to weigh: a native popup paints outside
the tab, so it is missing from a tab share.

## Field anatomy

```html
<div class="saga-field">
  <label class="saga-label" for="title">Session Title</label>
  <input class="saga-input" id="title" placeholder="Out of window test">
  <p class="saga-help">Shown to tutors on their schedule.</p>
</div>
```

- **Label** above the control, `--text-base`, `--weight-semibold`,
  `--color-text`, Title Case, `--space-xs` below it. Every control has one;
  a search box may use a visually hidden label plus placeholder.
- **Control** at full width of its column.
- **Help** (`.saga-help`) below, `--text-base`, `--color-text-secondary`,
  `--space-xs` above. Optional. One sentence.
- **Error** (`.saga-error`) replaces help (same slot; `data-invalid` on the
  field hides the help), `--text-base`, `--color-danger`, with a small warning
  glyph. The control's border turns `--input-border-color-invalid`.
- Fields stack `--space-md` apart; related fields sit side by side on one
  row with `--space-md` between them (Tutoring Period | When | Time in the
  Edit Session modal).

A field-level annotation that is computed rather than typed (the "DURATION
30m" readout next to the time pair) is a tiny uppercase label in
`--text-xs` `--color-text-secondary` with the value in `--weight-semibold`
beneath it.

## Text input

| Token | Value |
|---|---|
| `--input-height` | `2.4rem` |
| `--input-padding` | `0.3rem 0.75rem` |
| `--input-radius` | `--radius-md` (6px) |
| `--input-bg` | white |
| `--input-border-color` | `--color-border-strong` (`#d9d9d9`), 1px |
| `--input-border-color-hover` | `--color-gray` (`#9f9f9f`) |
| `--input-border-color-focus` | `--color-primary`, plus the global focus ring |
| `--input-border-color-invalid` | `--color-danger` |
| `--input-color-placeholder` | `--saga-beige-dark` (`#a59c94`), italic |
| text | inherits (`--text-base`), `--color-text`; `.saga-input--sm` drops to `--text-sm` at 80% height |

Placeholder text is italic and beige, so an empty field and a filled field
are different at a glance even in a screenshot. Placeholders describe the
format ("Search whole name, Student ID, school"), not the label.

`.saga-textarea` is the same box, minimum three lines, resizable vertically.

### Password field

A password input is the text input with a Show/Hide eye inside its right end,
so the field keeps its width (DS-143). It is a `.saga-input-adorn.saga-input-adorn--end`
wrapper holding the `type="password"` input and a `.saga-input-adorn__end` span;
the span holds the toggle.

- **The eye** is `button[type="button"]` with `saga-btn saga-btn--quiet
  saga-btn--icon saga-btn--sm`, showing `visibility-outline-rounded` while the
  password is hidden and `visibility-off-outline-rounded` while it is shown.
  `type="button"` keeps it from submitting a surrounding form. A button in the
  adornment takes clicks even though the span around it does not; the rest of
  the adornment still passes them to the input.
- **Its name** is the action, `aria-label="Show password"` or `"Hide password"`,
  and flips with the field. It carries `aria-controls` for the input and no
  `aria-pressed`: the label already says the state, and a pressed button paints
  the mode-toggle wash (DS-113). Focus stays on the eye after a click.
- **Help** (`.saga-help`) says the rule: "At least 8 characters."
- **An advisory** is a second `.saga-help` under the first, a note about the
  value typed so far ("This is one of the most commonly used passwords in the
  world."). It informs and never blocks. Like help it is hidden while the
  field is invalid, so `aria-describedby` names the `.saga-error` alone then
  and lists help and advisory otherwise.
- **The input** sets `autocomplete="new-password"` when a password is being
  chosen (`current-password` when signing in), `spellcheck="false"` and
  `autocapitalize="off"`. A password field is never prefilled.

```html
<div class="saga-field">
  <label class="saga-label" for="pw">New password</label>
  <div class="saga-input-adorn saga-input-adorn--end">
    <input class="saga-input" id="pw" type="password" autocomplete="new-password" spellcheck="false" autocapitalize="off" aria-describedby="pw-help pw-advisory">
    <span class="saga-input-adorn__end">
      <button type="button" class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm" aria-label="Show password" aria-controls="pw"><iconify-icon icon="material-symbols-light:visibility-outline-rounded"></iconify-icon></button>
    </span>
  </div>
  <span class="saga-help" id="pw-help">At least 8 characters.</span>
  <span class="saga-help" id="pw-advisory">This is one of the most commonly used passwords in the world.</span>
</div>
```

## Select

Both kinds of select share one box: `.saga-select` wraps either a native
`<select>` or a painted trigger, and both get the input border with a blue
caret at the right (DS-101, DS-124). The painted select is a trigger that
looks like an input and opens a painted listbox; it is the one to use when
the list needs search, groups, multi-select or rich rows:

- **Trigger**: `.saga-select > button.saga-select__trigger`, the text-input
  box with a CSS-drawn down caret in `--color-primary` at the right. Shows the
  chosen value in a `<span>`, or the placeholder (`.is-placeholder`) in italic
  beige. `aria-haspopup="listbox"`, `aria-expanded` while open.
- **List**: `.saga-select__menu`, a white panel, 1px `--color-border`,
  `--radius-md`, `--shadow-popover`, anchored under the trigger at the
  trigger's width or wider, max height 18rem then scrolls. It flips above when
  there is no room below. Layer `--z-dropdown`.
- **Search** row (`.saga-select__search`) at the top once there are more than
  a handful of options: a `.saga-search` with a magnifier glyph and an italic
  "Search..." input, hairline rule below.
- **Rows**: `.saga-select__option`, either the `<li role="option">` itself or
  a `<button role="option">` inside it; `--space-sm --space-md` padding.
  Hover and the keyboard-active row (`data-active`) take `--color-bg-tertiary`;
  the active row also carries a 3px `--color-primary` bar on its left edge
  (DS-136). In a multi-select every row has a `.saga-check` checkbox at its
  right end, after the label.
  The selected row (`aria-selected="true"`) is `--color-primary-light` fill
  with `--color-primary` semibold text (the "Demo Program 08/17" row in
  `program_dropdown.png`). A row that cannot be chosen is
  `aria-disabled="true"` in `--color-text-disabled`. A de-emphasized
  escape-valve choice such as "No Period" (`data-muted`, on the row and on the
  trigger's label when it is the value) is italic `--color-text-secondary`. A
  row the page marks, such as a school holding a search match (`data-marked`),
  takes the selected tint and a small primary dot before its label. A trigger
  that needs a look (`data-attention`) gets a primary border and ring (DS-134).
- **Footer** slot (`.saga-select__footer`) for an add action, separated by a
  hairline: the blue add-disc and "Add New Program".
- Group headers inside the list are navy, `--text-xs` bold, uppercase, with a
  hairline beneath; de-emphasized options are italic.
- `.saga-select--inline` makes the control shrink to its content (a filter in
  a toolbar); `.saga-select--sm` takes the `--sm` input metrics.

Keyboard: arrow keys move, Enter picks, Esc closes, typing filters. Multi-select
rows carry a checkbox; single-select rows carry no indicator, the highlight is
the mark.

```html
<div class="saga-field">
  <label class="saga-label" id="ratio-label">Tutor:Student Ratio</label>
  <div class="saga-select">
    <button type="button" class="saga-select__trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="ratio-label"><span>1:3</span></button>
    <ul class="saga-select__menu" role="listbox" aria-labelledby="ratio-label" hidden>
      <li class="saga-select__option" role="option" aria-selected="false">1:1</li>
      <li class="saga-select__option" role="option" aria-selected="true">1:3</li>
      <li class="saga-select__option" role="option" aria-selected="false">1:4</li>
    </ul>
  </div>
</div>
```

**Native or painted?** A native `<select>` wrapped in `.saga-select` takes
the same box and caret (`appearance: none`) and is the right control when the
shoe fits (DS-124):

- **Native** for a short plain list: roughly a dozen options or fewer, text
  only, single choice. Also for a form inside a modal, where a custom popover
  fights the dialog's stacking and viewport, and on mobile, where the
  platform picker beats anything painted. It is accessible by default and
  handles keyboard, viewport edges and touch for free.
- **Painted** (`.saga-select__trigger` + `.saga-select__menu`) when the list
  needs search, groups, multi-select or rich option content, or when a dense
  toolbar wants a consistent painted look. Dash's program selector, with
  dozens of entries and a search row, is the canonical case.
- Dash's own CI bans the native element outright. That is a repo-level
  ratchet dash chose for itself, not this guide's rule.

```html
<div class="saga-select"><select aria-label="Ratio"><option>1:1</option><option selected>1:3</option></select></div>
```

## Checkbox, radio, toggle

All three are the native input drawn with `appearance: none`, sized by the
spacing tokens, wrapped in a `label.saga-check` that puts the text `--space-sm`
to the right (DS-116).

- **Checkbox** `.saga-checkbox`: a `--space-md` (16px) square, 1px
  `--input-border-color-hover` border, `--radius-xs`, white. Checked fills the
  box `--color-primary` and draws a white check inside; indeterminate fills
  it and draws a white bar. Hover turns the border blue.
- **Radio** `.saga-radio`: a `--space-md` circle, the same 1px ring. Selected
  fills `--color-primary` with a white dot in the centre (DS-060). Radios in
  a row sit `--space-md` apart; in a column, `--space-sm`.
- **Toggle** `.saga-toggle` (`role="switch"`): a 36 × 20px track
  (`--space-xl + --space-xs` by `--space-md + --space-xs`), `--radius-full`,
  with a `--space-md` white knob inset `--space-2xs` from the track edge. Off
  is `--color-gray-light` track; on is `--color-primary` track with the knob
  slid `--space-md` to the right. The label follows ("Show Entire District").
- Disabled is a `--input-bg-disabled` fill with a `--color-gray-light` border
  (checked and disabled: `--color-gray` fill), never opacity.

```html
<label class="saga-check"><input type="checkbox" class="saga-checkbox" checked> Email me a copy</label>
<label class="saga-check"><input type="radio" name="pattern" class="saga-radio" checked> Same Every Week</label>
<label class="saga-check"><input type="checkbox" class="saga-toggle" role="switch"> Show Entire District</label>
```

Large choices become **option cards** (Same Every Week / Varies by Day Type;
the four Rotation Pattern tiles): a `.saga-card` with the radio or an icon in
the top-left, a `--text-base` semibold title, and a `--text-base` secondary
description. The selected card gets a 2px `--color-primary` border and a
`--color-primary-light` fill. Use option cards when each choice needs a
sentence of explanation; use plain radios when the labels are enough.

## Date picker

Dates are entered through `.saga-datepicker` (DS-140). A native
`<input type="date">` with the `.saga-input` class is an exception the owning
team chooses case by case, for a single plain date where the browser's own
control is good enough; it does not draw annotations, ranges or quick options
and looks different in every browser. The picker is a `.saga-datepicker__trigger` that looks like an
input with a calendar glyph in `--color-text-secondary` at the right
("10/12/2026"), sized to its content rather than the column. Clicking opens a
`.saga-datepicker__popover` (`date_picker.png`):

- 264px wide, white, 1px `--color-border`, `--radius-lg`, `--space-md`
  padding, `--shadow-popover`, `--z-dropdown`.
- `.saga-datepicker__nav`: a `.saga-datepicker__month` label ("October 2026")
  in `--text-base` semibold, centred, with small quiet chevron buttons in
  `--color-primary` on either side.
- `.saga-datepicker__grid`: seven 32px columns. The weekday row
  (`.saga-datepicker__weekday`) is `--text-xs` semibold
  `--color-text-secondary`, Su through Sa.
- Day cells are `button.saga-datepicker__day`, 32px squares, `--text-base`,
  `--radius-md`, hover `--color-bg-tertiary`. Adjacent-month days are
  `--muted` (`--color-text-muted`); today is `--today`, a 1px `--color-primary`
  ring with the number at its normal weight (DS-137). The selected
  day (`aria-selected="true"`) is a `--color-primary` filled square with white
  text and a 2px `--color-primary-light` ring, which replaces today's ring. Unselectable days
  (`:disabled` or `aria-disabled`) are `--datepicker-day-disabled`, lighter than
  adjacent-month days, with no hover fill and no pointer cursor (DS-133).
- Keyboard: arrows move by day, PageUp and PageDown by month, Enter selects,
  Esc closes. Focus moves into the grid on open and back to the trigger on
  close.
- A date that heads the content it filters (a single-day list, a reporting
  range) uses the header trigger instead of the field (DS-142):
  `.saga-datepicker__trigger--header`, no border or glyph, semibold
  `--color-primary` text centred above the list, a `--color-primary-light`
  tint on hover and while open, muted text when disabled. It is the field's
  variant, not a replacement: a date inside a form stays a field.
- A blocked day says why. The reason ("After the program ends") ends the day's
  accessible name, and while the day is under the pointer or focus it shows in
  a `.saga-datepicker__hint` line under the grid. Colour is never the only cue.

```html
<div class="saga-datepicker">
  <button type="button" class="saga-datepicker__trigger" aria-haspopup="dialog" aria-expanded="true" aria-label="When: 10/12/2026">
    <span>10/12/2026</span><iconify-icon icon="material-symbols-light:calendar-today-outline-rounded"></iconify-icon>
  </button>
  <div class="saga-datepicker__popover" role="dialog" aria-label="Choose a date">
    <div class="saga-datepicker__nav">
      <button class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm" aria-label="Previous month"><iconify-icon icon="material-symbols-light:chevron-left-rounded"></iconify-icon></button>
      <span class="saga-datepicker__month">October 2026</span>
      <button class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm" aria-label="Next month"><iconify-icon icon="material-symbols-light:chevron-right-rounded"></iconify-icon></button>
    </div>
    <div class="saga-datepicker__grid" role="grid">
      <span class="saga-datepicker__weekday">Su</span> … <span class="saga-datepicker__weekday">Sa</span>
      <button class="saga-datepicker__day saga-datepicker__day--muted">27</button> …
      <button class="saga-datepicker__day" aria-selected="true">12</button> …
    </div>
  </div>
</div>
```

In the painted picker, dates are entered by picking; the native date input
also accepts typing, which is fine for a plain single date.

## Time picker

The time field is a short text input (6em) that accepts typing and also opens
a list on focus (`time_picker.png`):

- Options every 15 minutes in 12-hour form: "4:30 AM", "4:45 AM".
- When the field is the end of a range, each option carries a right-aligned
  annotation with the resulting duration in `--text-xs`
  `--color-text-secondary`: "30 min", "45 min", "1 hr", "1 hr 15 min".
- The selected option is `--color-primary` semibold; the keyboard-active
  option has a `--color-bg-tertiary` wash.
- Typing "430p" completes to "4:30 PM" on blur. Invalid input turns the border
  clay and shows an error below.
- Focus is the blue border plus a soft 3px blue halo at 18% opacity, which is
  the one place the ring sits inside the control instead of outside it.

- When the time lands on another calendar day than the date being edited
  (a viewer in another zone), a `.saga-chip--square` naming that weekday
  ("WED") sits inside the input's right end, not beside it, so the field keeps
  its width. The field is a `.saga-input-adorn.saga-input-adorn--end` wrapper
  holding the input and a `.saga-input-adorn__end` span; the input reserves the
  chip's room so typed text never runs under it (DS-139). The span is
  click-through; a button in it still takes clicks (DS-143).

A time range is two of these with an en dash between them and the DURATION
readout to the right.

## Date range with quick options

A reporting range that heads the list it filters ("Oct 9 – Oct 13, 2026") is a
clickable blue date heading, not a bordered box; inside a form the range keeps
the input-shaped trigger. Either way it opens a two-column popover: a list of quick options on the
left (This week, Last week, Last 30 days, Custom) and a month grid on the
right. Picking a quick option applies and closes; clicking two days in the
grid sets start and end and applies live. The checked quick option is derived
from the applied range, so "Custom" lights up whenever the dates do not match
a preset.

The class contract (DS-142):

- The heading trigger is `.saga-datepicker__trigger.saga-datepicker__trigger--header`
  (see *Date picker* above). Each date in it is a `[data-seg="start|end"]` span
  that underlines on hover; clicking one opens straight into replacing that
  end. In a form, the plain `.saga-datepicker__trigger` field does the same.
- The popover is `.saga-datepicker__popover.saga-datepicker__popover--range`,
  two columns. `.saga-datepicker__presets` holds the quick options as
  `.saga-popover__item` radios; Custom carries `data-custom` and is italic,
  `--color-text-secondary` until checked. `.saga-datepicker__calendar` holds the
  usual nav and grid, always visible, with a `.saga-datepicker__hint` line under
  it saying what the day or quick option under the pointer will do ("Set Sep 3 –
  9, 2026"). The month heading stays on one line, whichever month it names.
- The days between the ends are `.saga-datepicker__day--in-range`. A day beyond
  the range's length cap carries `data-soft`: still clickable (it starts a new
  range), `--color-text-secondary` with a dotted underline.

```html
<div class="saga-datepicker">
  <button type="button" class="saga-datepicker__trigger saga-datepicker__trigger--header" aria-haspopup="dialog" aria-expanded="true" aria-label="Time period">
    <span>Past Week (<span data-seg="start">Oct 7</span> – <span data-seg="end">13, 2026</span>)</span>
  </button>
  <div class="saga-datepicker__popover saga-datepicker__popover--range" role="dialog" aria-label="Time period">
    <div class="saga-datepicker__presets" role="radiogroup" aria-label="Quick ranges">
      <button type="button" class="saga-popover__item" role="radio" aria-checked="true">Past Week</button>
      <button type="button" class="saga-popover__item" role="radio" aria-checked="false">Past Month</button>
      <button type="button" class="saga-popover__item" role="radio" aria-checked="false" data-custom>Custom</button>
    </div>
    <div class="saga-datepicker__calendar">
      <div class="saga-datepicker__nav">…</div>
      <div class="saga-datepicker__grid" role="grid">…</div>
      <div class="saga-datepicker__hint">Pick a date to change the range</div>
    </div>
  </div>
</div>
```

## Faceted search

A search box that grows chips (`dashboard_rosters_page.png` top right, the
sessions search in `calendar_view.png`):

- The bar is an input box with a magnifier at the left and an italic
  placeholder that lists what can be searched.
- A "+ Filter" affordance at the right end is a dashed `--radius-full` pill
  in `--color-primary` text.
- Choosing a facet adds a **chip** inside the bar: `--color-primary-light`
  fill, 1px blue-tinted border, `--radius-full`, `--text-xs` semibold,
  `--color-primary` text, with the value and a small ✕. Chips that the page
  pins (a locked School filter) are navy on grey and have no ✕.
- Typing offers suggestions in a popover; each suggestion shows its facet as
  a tiny uppercase tag.

## Validation and errors

- Validate on blur and on submit, not on every keystroke.
- An invalid control: `--input-border-color-invalid` border, a
  `--color-danger-bg` tint is allowed on the time field, and the `.saga-error`
  line below naming what to change: "Enter a time after 4:00 AM".
- On submit with errors, focus the first invalid control and keep the submit
  button enabled; a disabled Save with no explanation is a dead end.
- Form-level failures (the server said no) are a `.saga-notice--danger` at the
  top of the form, not a toast.

## Required, read-only, disabled

- **Required** fields are the default and carry no mark. Mark the exceptions
  instead: "(optional)" after the label in `--color-text-secondary`. If a form
  is mostly optional, flip it and mark required with an asterisk, but never
  mix both schemes on one screen.
- **Read-only** keeps the text color and shows `--input-border-color-readonly`
  (`#f9f9f9`, nearly invisible) so the value reads as text, not as a control.
- **Disabled** is `--input-bg-disabled` (`#f9f9f9`) fill with
  `--input-color-disabled` (`#444444`) text and `cursor: not-allowed`. Not
  reduced opacity. The disabled "No Period" field in the Edit Session modal
  is the reference. A select that is being bypassed (the program selector
  while "Show Entire District" is on) adds diagonal grey hatching so it reads
  as "ignored", not merely "off".

## Layout

- Single column by default. Modal forms are 640px wide; a two-column row is
  for short related fields (start and end, first and last name).
- Control widths follow content: a time is 6em, a date picker its value, a
  ratio select the full column (or `.saga-select--inline` in a toolbar). Do not stretch a short control to the column width to make
  the grid look even.
- Labels never sit to the left of controls; the top-label layout is what
  lets fields line up in rows.
- Group long forms into cards with an `h3` title; the Define Tutoring Patterns
  card in `dashboard_schedule.png` is the shape.

## Do and don't

Do

- Label every control, above it, in Title Case.
- Keep placeholders italic and beige; they are hints, not labels.
- Choose native or painted by what the list or date needs, not by habit;
  see "Native or painted?" under Select.

Don't

- Don't let `title=` be a control's only name or only tooltip; `aria-label`
  names it and a painted tooltip describes it.
- Don't paint a select or date picker the native control already handles.
- Don't fade disabled controls; fill them.
- Don't mark required fields when they are the majority.
- Don't validate while the user is still typing.
