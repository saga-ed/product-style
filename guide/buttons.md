---
title: Buttons
order: 110
summary: One flat button geometry, five intents, and the rules for icons, disabled and loading states, groups, and the Add pattern.
---

A Saga button is flat, `--radius-md` (6px) cornered, semibold, and one of five
intents. Everything else on this page follows from that sentence. The
screenshots show five different blue buttons in the current dashboard
(8px, 6px and 4px corners, three paddings, three weights); the guide collapses
them into one.

## Geometry

| Token | Value |
|---|---|
| `--btn-radius` | `--radius-md` (`6px`) |
| `--btn-padding-y` / `--btn-padding-x` | `0.5rem` / `1.25rem` |
| `--btn-font-weight` | `--weight-semibold` (600) |
| font size | `--text-sm` for the default size, `--text-xs` for `--sm` |
| shadow | none, ever |
| hover | `--btn-surface-primary-hover` for filled; `--btn-surface-quiet-hover` wash for the rest |
| focus | the global ring, `--focus-ring-width` `--focus-ring-color`, offset `--focus-ring-offset` |
| motion | background and colour transition `--motion-fast` `--ease-out` |

Two sizes only. Default is the size in every modal footer and action row.
`--sm` is for dense places: inside a table row, a card corner, a chip.
There is no large button; a hero action is a default button with more room
around it.

## Intents

| Intent | Class | Surface | Text | Border | Use for |
|---|---|---|---|---|---|
| Primary | `.saga-btn--primary` | `--btn-surface-primary` (`#006298`) | `--btn-text-primary` (white) | none | the one main action in a view |
| Secondary | `.saga-btn--secondary` | `--btn-surface-secondary` (white) | `--btn-text-secondary` | 1px `--btn-border-secondary` (`#d9d9d9`) | Cancel, Upload, Download, anything that is not the main action |
| Quiet | `.saga-btn--quiet` | transparent | `--color-primary` | none | inline and icon-only actions, toolbar buttons |
| Danger | `.saga-btn--danger` | `--btn-surface-danger` (clay `#991a21`) | white | none | destructive confirms: Delete, Remove, Cancel session |
| Affirmative | `.saga-btn--affirmative` | `--btn-surface-affirmative` (green `#20912d`) | white | none | rare: a positive terminal action in a flow that also has a danger button |

Quiet hovers to `--btn-surface-quiet-hover` (`--color-primary-light`, the
soft blue). Secondary hovers to the same soft blue when it is an action, and to
`--color-bg-tertiary` grey when it is a neutral surface such as a close button.
Danger hover darkens the clay slightly; never swap to pink.

One primary per view. A modal footer has one; a page action row has one
(usually the Add button); a card has at most one. If two actions feel equally
important, neither is primary.

```html
<button class="saga-btn saga-btn--primary">Save</button>
<button class="saga-btn saga-btn--secondary">Cancel</button>
<button class="saga-btn saga-btn--quiet">Copy link</button>
<button class="saga-btn saga-btn--danger">Delete</button>
<button class="saga-btn saga-btn--secondary saga-btn--sm">Edit</button>
```

## Icon and label

An icon goes before the label, at `1.2em`, with `--space-sm` between them,
inheriting the text colour. The action row on Rosters is the reference:
"Upload Roster" with an upload glyph, "Download Roster" with a download glyph,
both secondary.

```html
<button class="saga-btn saga-btn--secondary">
  <iconify-icon icon="material-symbols-light:upload-rounded"></iconify-icon>
  Upload roster
</button>
```

## Icon-only

An icon-only button has no visible text, so it must carry two things:
an `aria-label` for assistive technology and a tooltip for everyone else
(see [modals-toasts-notices](modals-toasts-notices.md#tooltips)). Never a
native `title=`; it is invisible in a shared tab and unreachable by keyboard.

- Square hit area: 32px for default, 28px for `--sm`; the glyph is 20 to 24px.
- Quiet intent is the default (top bar search, bell, menu; table row pencil
  and lock). Hover is `--color-bg-tertiary`, text `--color-text`.
- A destructive icon-only (a remove ✕ on a chip) is quiet with
  `--color-danger` text and a faint danger wash on hover.

```html
<button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Edit student">
  <iconify-icon icon="material-symbols-light:edit-outline-rounded"></iconify-icon>
</button>
```

## Disabled

Disabled is a fill change, not an opacity change: `--btn-surface-disabled`
(`#d9d9d9`) with `--btn-text-disabled` (`#707070`), no border, no hover,
`cursor: not-allowed`. A faded button looks like a rendering bug; a grey one
looks disabled.

A disabled button fires no pointer or focus events, so a tooltip on it will
not open. When the reason matters ("Save is held until you review 2
overlaps"), put the reason in visible text next to the button and point
`aria-describedby` at it, or keep the button enabled with `aria-disabled="true"`
and explain on click. Disable a button only when nothing the user can do
right now would enable it.

## Loading

A button that has started something it must wait for keeps its width, keeps
its label, and shows a small spinner before the label at `1em`. It is
`aria-disabled="true"` while busy. Do not swap the label for "Saving..."
alone; the width jump is distracting, and the spinner says the same thing.
Buttons never show a progress bar; long work gets a toast.

## Groups and modal footers

Buttons in a row sit `--space-sm` apart. Order is by reading direction toward
the commit: the safe action first, the main action last, so the main action
is at the right end.

A modal footer is right-aligned: **Cancel** (secondary) then **Save**
(primary). When a destructive action also belongs to the modal, it goes last
and is separated from the pair by a wider gap (`--space-lg`) so it cannot be
hit by accident when reaching for Save: `Cancel · Save · · · Delete`. Danger
intent, never primary.

A wizard footer uses Back (secondary) and Continue or Next (primary); the last
step says what it does: "Create program", not "Finish".

```html
<footer class="saga-modal__footer">
  <button class="saga-btn saga-btn--secondary">Cancel</button>
  <button class="saga-btn saga-btn--primary">Save</button>
  <button class="saga-btn saga-btn--danger" style="margin-left: var(--space-lg)">Delete</button>
</footer>
```

## The Add pattern

Adding something is the most common page-level action, so it has a fixed
look: a secondary button whose icon is a **filled blue disc with a white
plus** (`material-symbols-light:add-circle-rounded` in `--color-primary`),
then "Add" plus the noun: "Add Student", "Add period", "Add New Session".
The disc is the brand's add glyph and appears only on an Add action.

Two lighter relatives:

- **Inline add link.** Inside a card, "Add period" is quiet intent (blue text,
  no border) with the same disc. Use it when the thing being added lands in
  the list right below.
- **Dotted outline tertiary.** "Add drop-in student" in the Edit Session modal
  is a `--sm` button with a 1px dashed `--color-primary` border, blue text,
  transparent fill. Use it for an optional, secondary add that should not
  compete with the main one. The "+ Filter" chip on a search bar is the same
  idea at chip size.
- **Dashed placeholder tile.** "Add Day Type" is a whole card-sized dashed
  box with a plain plus and the label centred; use it when the things being
  added are themselves cards.

```html
<button class="saga-btn saga-btn--secondary">
  <iconify-icon icon="material-symbols-light:add-circle-rounded" style="color: var(--color-primary)"></iconify-icon>
  Add student
</button>
<button class="saga-btn saga-btn--quiet">
  <iconify-icon icon="material-symbols-light:add-circle-rounded"></iconify-icon>
  Add period
</button>
```

## Segmented toggles

A segmented toggle picks one of two or three views (Overall Summary /
Individual Report; Month / Week; list / grid). It is one control, not a row of
buttons:

- Container: `--color-bg-tertiary` fill, `--radius-md`, no border, 2px inner
  padding.
- Segment: `--text-sm` semibold, `--color-text-dark`, transparent.
- Pressed segment (`aria-pressed="true"`): `--color-primary` fill, white text,
  `--radius-sm`.
- Exactly one segment is pressed at all times.

```html
<div class="saga-segmented" role="group" aria-label="Report view">
  <button aria-pressed="true">Overall Summary</button>
  <button aria-pressed="false">Individual Report</button>
</div>
```

A toggle that shows or hides a mode ("Show Bulk Actions") is a single
primary button that becomes `--color-primary-light` with blue text while the
mode is on, with `aria-pressed`.

## Do and don't

Do

- Use plain verbs: Save, Delete, Upload, Continue. See
  [voice-writing](voice-writing.md#controls).
- Keep secondary buttons white with the `#d9d9d9` border; that is what reads
  as "button" next to a primary.
- Reach for quiet intent inside cards and rows; filled buttons in a table
  make it shout.

Don't

- No teal fills. Teal (`#1ececa`) fails contrast with white text; the
  teal "Continue" in the Configure Period modal is the one to fix.
- No shadows on buttons. Elevation belongs to cards and overlays.
- No more than one primary per view, and never two primaries side by side.
- No opacity for disabled, no `title=` for icon-only, no pink or orange
  surfaces for new work (the magenta, orange and grey `--btn-surface-*`
  tokens exist only for legacy screens).
