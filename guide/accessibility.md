---
title: Accessibility
order: 60
summary: WCAG 2.1 AA, one focus ring, the text-size and high-contrast root attributes, reduced motion, semantics, tooltips, and color as never the only signal.
---

Saga products target **WCAG 2.1 AA**. School districts procure against it, and
Connect already ships a compliance matrix. The rules here are the ones that make the
baseline hold without per-component effort: a global ring, root attributes that the
tokens respond to, and a short list of habits.

## Focus

One ring, everywhere, never overridden (DS-006):

```css
:focus-visible { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset); }
:focus:not(:focus-visible) { outline: none; }
```

`2px` `--color-primary`, `2px` outside the element, on `:focus-visible` only so a mouse
click does not ring a button. `base.css` ships it; a component does not restate it.

Do:
- Let the ring sit outside the element. If a container clips it, give the container
  `padding` or `overflow: visible`, do not move the ring inside.
- Keep the ring on controls with their own focus look (inputs turn their border blue
  as well; the ring still draws).

Don't:
- `outline: none` anywhere. Not on `:focus`, not on `button`, not "because the
  design has a border change".
- Replace the ring with a `box-shadow`. Shadows do not survive high contrast and
  forced-colors mode.
- Invent a second ring color for dark chrome. On navy the blue ring is 2.2:1 against
  navy, which is below the 3:1 UI threshold; the nav therefore sets
  `--focus-ring-color: var(--white)` locally (DS-033), a token override, not a new ring.

## Text size

Users pick a text size in the app's display options; the app writes it as a root
attribute and the type ladder follows (DS-020):

```html
<html data-text-size="large">   <!-- 1.3× -->
<html data-text-size="larger">  <!-- 1.7× -->
```

Because the preference multiplies `--base-font-size`, a wide screen whose root is
already 19px still gets a real bump. Everything sized in `rem` or `em` scales; the
pixel spacing ladder and the shell frame do not, so a nav item at 1.7× must still fit
in a `240px` nav. Verify at `larger`: nothing clips, no label escapes its control, the
page still scrolls. That verification is part of the definition of done for any new
screen.

The preference, high contrast and reduced motion live in one "Display options" panel
per app (Connect's is in the bottom bar). New accommodations go there, not in a new
surface. Persist them per browser and apply them before first paint, so there is no
flash of default text.

## Contrast

High contrast is a remap of the semantic tier, and nothing else (DS-021):

```html
<html data-contrast="high">
```

| Token | Default | High contrast |
|---|---|---|
| `--color-text` | `#111827` | `#000000` |
| `--color-text-secondary` | `#6b7280` | `#374151` |
| `--color-text-muted` | `#9ca3af` | `#6b7280` |
| `--color-border` | `#e5e7eb` | `#374151` |
| `--color-border-strong` | `#d9d9d9` | `#000000` |
| `--color-primary` | `#006298` | `#004f7a` |
| `--focus-ring-width` | `2px` | `3px` |
| `--nav-text` | white 70% | white 92% |

The primitives (`--saga-*`) never change, so brand surfaces (nav, chips, the mark)
stay branded. **Anything that hardcodes a hex opts out silently**: it looks right in
the default theme, passes review, and is wrong for exactly the users who need the
setting. That is the whole reason components reference the semantic tier.

The trap Connect found (qboard#694): the remap collapses roles. `--color-border` and
`--color-text` both go very dark, so a surface that uses the border token as a fill
with text on top becomes a dark block with dark text. A fill and its content must come
from a pair that cannot converge: `--color-bg` with `--color-text`,
`--color-primary` with `--color-primary-contrast`. Test every new surface with the
attribute set.

Default-theme contrast numbers are in [Color](color.md#contrast). The short version:
`--color-text-muted` fails for essential text, teal fails for everything, amber and
green fail for small text on white.

## Reduced motion

`prefers-reduced-motion: reduce` zeroes the movement tokens and keeps
`--motion-fade`, so every transition on a token collapses on its own and a component
that moves swaps to a fade (see [Motion](motion.md)). What the author still owns:

- Stop loops: a skeleton pulse or a bell wiggle gets `animation: none` and holds a
  visible state.
- Never tear down on `animationend` alone; pair it with a timer. Connect's reaction
  sprites leaked forever for reduced-motion users because their keyframes never ran.
- Lengthen timed messages: a toast dwells 1.75× longer under reduced motion.
- An app that offers reduced motion as a preference defaults it from the OS query, so
  this is never a rarely taken path.

## Semantic HTML

Native elements first. A `<button>` is keyboard operable, focusable and announced for
free; a `<div onclick>` is none of those until you add `role="button"`, `tabindex="0"`,
an Enter and Space handler, and remember them all next time.

| Thing | Markup |
|---|---|
| Dialog | `role="dialog" aria-modal="true" aria-labelledby` pointing at its heading; focus moves in on open, is trapped, and returns to the trigger on close; Escape closes a dismissible one |
| Tabs | `role="tablist"` > `role="tab" aria-selected aria-controls`; arrow keys move between tabs; the panel is `role="tabpanel"` |
| Menu | trigger has `aria-haspopup` and `aria-expanded` kept in sync; Escape closes and returns focus |
| Toggle | `role="switch" aria-checked`, or a real checkbox |
| Status region | `role="status" aria-live="polite"` for loading labels and toasts; `role="alert"` only for errors that block |
| Current nav item | `aria-current="page"` |
| Table | real `<table>` with `<th scope="col">`; sortable headers are buttons inside the `<th>` with `aria-sort` |
| Icon-only button | `aria-label`; the visible tooltip text must be contained in the name |
| Decoration | `aria-hidden="true"` on sprites, avatar initials beside a name, chevrons |

Every control has an accessible name, and every stateful control exposes its state.
No keyboard traps: Tab always leaves. Visible label text is contained in the
accessible name (2.5.3), so a button that shows "Save" is not named "Submit form".

```html
<button class="saga-btn saga-btn--quiet" aria-label="Edit Aaliyah L" aria-describedby="tip-1">
  <svg aria-hidden="true">…</svg>
</button>
<div class="saga-tooltip" role="tooltip" id="tip-1">Edit</div>
```

## Tooltips

`title` is never the only mechanism (DS-123). Browsers use it as an accessible-name
fallback only when nothing else names the element, screen readers announce it
inconsistently, and it is invisible to keyboard and touch users and in a shared tab.
So an icon-only control gets an `aria-label`, and supplementary description is a
painted tooltip: shown on hover and on focus, dismissed on Escape, `role="tooltip"`
linked by `aria-describedby`, positioned at `--z-tooltip`, popping in on
`--motion-fast`. Adding `title` on top is a harmless extra; it is acceptable as the
whole tooltip only in a prototype or where no tooltip component exists. Dash bans it
outright in CI (`scripts/ensure-no-native-title.js`); that is dash's own ratchet, not
this guide's rule.

A tooltip adds information; it never carries the only copy of something essential.
If the user must know it, put it on the page.

## Color is never the only signal

Every meaning carried by color is also carried by something else:

- Status: an icon (check, triangle, circle-x) and a word, not just a tint.
- Day types: the chip has the label "Regular" or "Advisory" in it.
- Selected option card: the radio is checked, not only the border.
- Sort direction: an arrow glyph in the header, not only a blue label.
- Chart series: shape, pattern or a direct label per series.
- Links in prose: underlined (`base.css` does this), not only blue.
- Required fields: a visible marker or the word, not a red border alone.
- The nav's active item: filled pill plus `aria-current`, plus the page title.

Text contrast and non-text contrast (3:1 for control edges, focus rings and icons that
convey meaning) are both checked. An icon button's glyph is `--color-text-secondary`
(4.8:1) or darker; `--color-text-muted` glyphs are decoration.

## Language and i18n

Internationalisation is opt-in per app (DS-034). Connect ships English and Spanish and
routes every visible string through `t()`; dash is English only. The rule for a
component or prototype is therefore: when the host app has a `t()` function, user
facing copy goes through it, keys are whole phrases (no fragment concatenation), and
`<html lang>` tracks the active locale. When it does not, write plain English and keep
strings in one place per component so they can be lifted later. Never bake copy into
an image or an SVG.

Dates, times and numbers are formatted with `Intl` for the active locale, never by
hand; dash's `<Time>` is the model.

## Checklist for a new screen

- Tab through it once; every control reachable, ring visible, no trap.
- Set `data-text-size="larger"`; nothing clips.
- Set `data-contrast="high"`; no dark-on-dark surface, no color that stayed the same.
- Set the OS to reduce motion; nothing loops, nothing fails to appear.
- Turn off CSS color (grayscale); every status and selection still reads.
- Every icon-only control has a name; every image has `alt` or is hidden.
- Loading shows a labelled skeleton, never a false empty state.
