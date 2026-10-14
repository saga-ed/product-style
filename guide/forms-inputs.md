---
title: Forms and inputs
order: 120
summary: Field anatomy, text and select inputs, checkboxes and toggles, the date and time pickers, faceted search, validation, and form layout.
---

Saga forms are quiet: a label above, a bordered white box, a blue focus,
clay for errors. The one hard rule, enforced by CI in the dashboard, is that
nothing opens a native popup. Native `<select>`, `<input type="date">` and
`title=` tooltips render outside the browser's paint surface and are invisible
during a tab share, and every tutoring session runs inside a tab share.

## Field anatomy

```html
<div class="saga-field">
  <label class="saga-label" for="title">Session Title</label>
  <input class="saga-input" id="title" placeholder="Out of window test">
  <p class="saga-help">Shown to tutors on their schedule.</p>
</div>
```

- **Label** above the control, `--text-sm`, `--weight-semibold`,
  `--color-text`, Title Case, `--space-xs` below it. Every control has one;
  a search box may use a visually hidden label plus placeholder.
- **Control** at full width of its column.
- **Help** below, `--text-xs`, `--color-text-secondary`, `--space-xs` above.
  Optional. One sentence.
- **Error** replaces help (same slot), `--text-xs`, `--color-danger`, with a
  small warning glyph. The control's border turns `--input-border-color-invalid`.
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
| text | `--text-sm`, `--color-text` |

Placeholder text is italic and beige, so an empty field and a filled field
are different at a glance even in a screenshot. Placeholders describe the
format ("Search whole name, Student ID, school"), not the label.

`.saga-textarea` is the same box, minimum three lines, resizable vertically.

## Select

Never a native `<select>`. The select is a button that looks like an input
with a blue caret at the right, and it opens a painted list:

- **Trigger**: `.saga-select`, the text-input box with a down caret in
  `--color-primary` at the right. Shows the chosen value, or the placeholder in
  italic beige.
- **List**: a white panel, 1px `--color-border-strong`, `--radius-md`,
  `--shadow-popover`, anchored under the trigger at the trigger's width or
  wider, max height about 240px then scrolls. It flips above when there is no
  room below. Layer `--z-dropdown`.
- **Search** row at the top once there are more than a handful of options:
  a magnifier glyph and an italic "Search..." input, hairline rule below.
- **Rows**: `--text-sm`, `--color-text-dark`, `0.375rem 0.75rem` padding.
  Hover `--color-bg-tertiary`. The selected row is `--color-primary-light`
  fill with `--color-primary` semibold text (the "Demo Program 08/17" row in
  `program_dropdown.png`).
- **Footer** slot for an add action, separated by a hairline: the blue
  add-disc and "Add New Program".
- Group headers inside the list are navy, `--text-xs` bold, uppercase, with a
  hairline beneath; de-emphasized options are italic.

Keyboard: arrow keys move, Enter picks, Esc closes, typing filters. Multi-select
rows carry a checkbox; single-select rows carry no indicator, the highlight is
the mark.

```html
<div class="saga-field">
  <label class="saga-label">Tutor:Student Ratio</label>
  <button class="saga-select" aria-haspopup="listbox" aria-expanded="false">1:3</button>
</div>
```

## Checkbox, radio, toggle

All three share one geometry built on the em, so they scale with text.

- **Checkbox** `.saga-checkbox`: a 1.375em square, 1px `--color-gray`
  border, `--radius-xs`, transparent. Checked draws a `--color-primary` check
  inside; the box itself stays white. Label to the right, `--space-sm` away,
  `--text-sm`.
- **Radio** `.saga-radio`: a 1.125em circle, 2px `--color-gray` ring. Selected
  fills the centre with `--color-primary`, leaving a 2px white gap inside the
  ring. Radios in a row sit 1.5em apart; in a column, `--space-sm`.
- **Toggle** `.saga-toggle`: a 2.25em by 1em track, `--radius-full`, with a
  1.375em white knob that overhangs the track. Off is `--color-gray-light`
  track; on is `--color-primary` track with the knob at the right. The label
  follows ("Show Entire District").

Large choices become **option cards** (Same Every Week / Varies by Day Type;
the four Rotation Pattern tiles): a `.saga-card` with the radio or an icon in
the top-left, a `--text-base` semibold title, and a `--text-sm` secondary
description. The selected card gets a 2px `--color-primary` border and a
`--color-primary-light` fill. Use option cards when each choice needs a
sentence of explanation; use plain radios when the labels are enough.

## Date picker

The date field is a trigger that looks like an input with a calendar glyph in
`--color-text-secondary` at the right ("10/12/2026"). Clicking opens a
calendar popover (`date_picker.png`):

- 264px wide, white, 1px `--color-border-strong`, `--radius-md`,
  `--shadow-popover`, `--z-dropdown`.
- Header: a month and year label in `--text-sm` semibold, with round
  26px chevron buttons in `--color-primary` on either side.
- Weekday row in `--text-xs` semibold, Su through Sa.
- Day cells are 32px squares, `--text-sm`. Adjacent-month days are
  `--color-text-muted`. Today has a 1px `--color-primary` ring. The selected
  day is a `--color-primary` filled square with white text and `--radius-sm`
  corners. Disabled days are `--color-text-muted` with no hover.
- Keyboard: arrows move by day, PageUp and PageDown by month, Enter selects,
  Esc closes. Focus moves into the grid on open and back to the trigger on
  close.

Dates are entered by picking, never by typing a native date control.

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

A time range is two of these with an en dash between them and the DURATION
readout to the right.

## Date range with quick options

A reporting range ("Oct 9 – Oct 13, 2026") is a clickable blue label, not a
bordered box. It opens a two-column popover: a list of quick options on the
left (This week, Last week, Last 30 days, Custom) and a month grid on the
right. Picking a quick option applies and closes; clicking two days in the
grid sets start and end and applies live. The checked quick option is derived
from the applied range, so "Custom" lights up whenever the dates do not match
a preset.

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
- **Read-only** keeps the text colour and shows `--input-border-color-readonly`
  (`#f9f9f9`, nearly invisible) so the value reads as text, not as a control.
- **Disabled** is `--input-bg-disabled` (`#f9f9f9`) fill with
  `--input-color-disabled` (`#444444`) text and `cursor: not-allowed`. Not
  reduced opacity. The disabled "No Period" field in the Edit Session modal
  is the reference. A select that is being bypassed (the program selector
  while "Show Entire District" is on) adds diagonal grey hatching so it reads
  as "ignored", not merely "off".

## Layout

- Single column by default. Modal forms are 560px wide; a two-column row is
  for short related fields (start and end, first and last name).
- Control widths follow content: a time is 6em, a date 12ch, a ratio select
  the full column. Do not stretch a short control to the column width to make
  the grid look even.
- Labels never sit to the left of controls; the top-label layout is what
  lets fields line up in rows.
- Group long forms into cards with an `h3` title; the Define Tutoring Patterns
  card in `dashboard_schedule.png` is the shape.

## Do and don't

Do

- Label every control, above it, in Title Case.
- Keep placeholders italic and beige; they are hints, not labels.
- Use the painted select, date and time pickers everywhere.

Don't

- Don't use native `<select>`, `<input type="date">` or `title=`.
- Don't fade disabled controls; fill them.
- Don't mark required fields when they are the majority.
- Don't validate while the user is still typing.
