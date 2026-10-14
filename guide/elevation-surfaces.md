---
title: Elevation and surfaces
order: 40
summary: The four surface levels, the radius ladder, when a shadow is allowed, borders, scrims, the z-index ladder and scrollbars.
---

Saga is a flat system with one exception: cards and overlays lift off the page, and
nothing else does. A button is painted, not raised. If you can see a shadow, the thing
under it is a container.

## Surfaces

Four levels. Each has a background, a border rule and a shadow, and the three move
together.

| Level | Background | Border | Shadow | Examples |
|---|---|---|---|---|
| Page | `--color-bg` white | none | none | The content area |
| Well | `--color-bg-secondary` `#f9fafb` | none, or `--color-border` above | none | Table header row, modal footer, section band, empty "Add Day Type" slot (dashed border) |
| Card | `--card-bg` white | `--card-border` (1px `--color-border`) | `--card-shadow` (`--shadow-sm`) | Stat cards, content cards, option cards, day-type cards |
| Raised | white | `--color-border` | `--shadow-md`, `--shadow-lg` on hover or drag | A hovered card, a dragged list row, a sticky action bar |
| Overlay | white | `--color-border` | `--shadow-popover`, `--shadow-modal`, `--shadow-toast` | Menus, date pickers, dialogs, toasts |

The page itself is white, not gray (DS-005). Cards therefore need their hairline border
to separate from the page; the shadow alone is too faint, and that is on purpose.
Wells are the only gray surfaces, and they always sit inside something white.

Navy is a surface too: the left nav, the Session Viewer header strip, and the scrim
are `--saga-navy` through the `--nav-*` and `--modal-scrim` tokens. Content on navy is
white or white at 70%; cards never sit on navy.

## Radius

Six steps (DS-011). Smaller things get smaller corners; the ladder below says which.

| Token | Value | Gets it |
|---|---|---|
| `--radius-xs` | `2px` | Checkboxes, skeleton bars, the tab underline ends, tiny status squares |
| `--radius-sm` | `4px` | Small status tags ("Regular" on the Edit Session modal), tooltips, menu items, table-cell badges |
| `--radius-md` | `6px` | Buttons (`--btn-radius`), inputs and selects (`--input-radius`), nav "Exit configuration" box |
| `--radius-lg` | `8px` | Cards (`--card-radius`), modals, popovers, menus, date pickers, toasts, notices |
| `--radius-xl` | `12px` | Hero cards, the video player frame, decision-board panels; rare |
| `--radius-full` | `9999px` | Pills: chips, count badges, active nav item, toggles, avatars, AI Insights skill chips |

Rules of thumb (DS-029):
- A container is 8; a control is 6; a tag is 4; a pill is full.
- A child never has a larger radius than its parent. A pill inside a card is fine (it
  does not touch the edge); a 12px panel inside an 8px card is not.
- A dialog is 8, not 12 or 15: the two legacy modal radii Nathan's surface board found
  (`.75em` and `15px`) both go.
- Buttons at 4px (dash's old `StandardButton`) move to 6.

## Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.05)` | Cards at rest |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,.1)` | Hovered card, raised row, sticky bar |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,.1)` | Dragged item, side panel |
| `--shadow-popover` | `0 8px 24px rgba(0,0,0,.14)` | Menus, selects, date and time pickers |
| `--shadow-modal` | `0 24px 48px rgba(0,0,0,.22)` | Dialogs |
| `--shadow-toast` | `0 6px 18px rgba(0,0,0,.16)` | Toasts |

**Buttons are flat; cards are not** (DS-012). No button, chip, tab, input or toggle
carries a shadow in any state. The modal "Save" with a `0 4px 4px` drop shadow and the
coach card with the same value are both replaced: the button loses it, the card
takes `--shadow-sm` plus a hairline border.

Hover on a card that is itself clickable (a session card, a day-type card) goes from
`--shadow-sm` to `--shadow-md` and the border to `--color-border-hover`, on
`--motion-instant`. A card that is not clickable does not change on hover.

```css
.saga-card { background: var(--card-bg); border: var(--card-border); border-radius: var(--card-radius); box-shadow: var(--card-shadow); padding: var(--card-padding); }
.saga-card[href]:hover, .saga-card.is-clickable:hover { box-shadow: var(--shadow-md); border-color: var(--color-border-hover); }
```

Never animate `box-shadow` (it repaints). If a shadow must fade in, layer a second
element with the shadow and animate its `opacity`.

## Cards

The card contract (DS-015): white, `8px` radius, `1px` `--color-border`, `--shadow-sm`,
`24px` padding. That is the Reports and Program Config cards exactly.

Variants:
- `.saga-card--stat`: adds a `2px` top edge in `--color-primary` (a modifier, not a
  token), a blue `--text-3xl` number, a 600 label and a secondary caption.
- Option card (a radio rendered as a card): `--color-border`; when selected, border
  `--color-primary` and background `--color-primary-light`. The radio itself stays
  visible; the colour is not the only signal.
- Day-type card: a `12px` colour band across the top (`--chip-regular` or
  `--chip-advisory`) above the white body. The band is the only non-white fill a card
  ever has.
- Placeholder slot ("Add Day Type"): `--color-bg-secondary`, `2px` dashed
  `--color-border-hover`, no shadow, centred label in `--color-text-secondary`.

```html
<div class="saga-card saga-card--stat">
  <div class="value">0%</div>
  <div class="label">Completion</div>
  <div class="text-secondary">0 of 55 students</div>
</div>
```

## Borders

- Default hairline: `1px solid var(--color-border)` `#e5e7eb`. Cards, table rows,
  dividers, tab strip rule, the top bar's bottom edge.
- Strong: `--color-border-strong` `#d9d9d9` for inputs and secondary buttons, where the
  edge is the control's whole visible shape.
- Hover: `--color-border-hover` `#d1d5db` on cards and rows; inputs hover to
  `--input-border-color-hover` `#9f9f9f`.
- Focus is never a border change. Focus is the ring (see
  [Accessibility](accessibility.md#focus)); inputs additionally turn their border
  `--color-primary`, but the ring is what makes focus visible.
- Invalid inputs: border `--color-danger` plus an error message; never a red fill.
- On navy, borders are `--nav-border` (white at 38%).
- Half-pixel borders (`.5px`) from the motion prototype are not used; they vanish on
  non-retina Chromebooks.

Dividers between list rows are borders on the row (`border-top` on every row but the
first), not `<hr>` elements.

## Scrims

A scrim sits between the page and anything modal. Two strengths:

| Token | Value | Use |
|---|---|---|
| `--modal-scrim` | `rgba(11,42,74,.4)` | Dialogs, the nav drawer under 1024px |
| `--modal-scrim-strong` | `rgba(11,42,74,.45)` | A confirm dialog stacked over an open dialog |

The scrim is navy, not black (DS-012): black at 40% turns the page muddy, navy keeps it
in the brand. The scrim fades on `--motion-fade` (see [Motion](motion.md)) and clicking
it closes a dismissible dialog but never a destructive confirm.

```html
<div class="saga-scrim"></div>
<div class="saga-modal" role="dialog" aria-modal="true" aria-labelledby="t">…</div>
```

## Layering

The z-index ladder (DS-013). Use the token; never a literal, and never a value between
two rungs.

| Token | Value | What lives here |
|---|---|---|
| `--z-raised` | `1` | A hovered or dragged card lifting above its siblings |
| `--z-sticky` | `100` | Sticky table headers, sticky action bars, the top bar |
| `--z-dropdown` | `200` | Menus, selects, date pickers anchored to a control |
| `--z-overlay` | `1000` | Scrims, the nav drawer, side panels |
| `--z-modal` | `1100` | Dialogs |
| `--z-toast` | `1200` | Toasts (above a dialog, so a save confirmation is seen) |
| `--z-tooltip` | `1300` | Tooltips (above everything, including a toast's own tooltip) |

Each rung is a stacking context owner. A dropdown opened from inside a modal is still
`--z-dropdown`, because it is inside the modal's context; it does not need
`--z-modal + 1`. If you find yourself adding one to a token, the element is in the
wrong parent.

## Scrollbars

Arrow end-caps are hidden everywhere (DS-018). The styled bar is opt-in with
`.saga-scrollbar`: `0.5em` wide, rounded navy thumb with a hairline outline, inset
track shadow, `6px` radius. Use it on the content area, modal bodies and any scrolling
panel; leave native bars on `<textarea>` and iframes.

```html
<div class="roster-scroll saga-scrollbar">…</div>
```

Never hide a scrollbar (`scrollbar-width: none`, `overflow: hidden` on a scrolling
region). A visible thumb is how a keyboard or screen-magnifier user knows there is
more. Scroll regions keep native wheel and keyboard scrolling; no scroll hijacking.
