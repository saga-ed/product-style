---
title: Typography
order: 20
summary: Montserrat, how to load it, the rem ladder on a 15/17/19px root, headings, rhythm, numbers and mono.
---

One face, one ladder, one rhythm. Montserrat is the only font in any Saga product
(DS-009). Its wide, geometric letterforms are why Saga screens read as light and open
at modest weights; do not compensate with bold.

## Loading Montserrat

Two recipes, one per environment. Pick the one that matches where the file runs.

Bundled apps (SvelteKit, Vite, anything with `node_modules`):

```bash
pnpm add @fontsource-variable/montserrat
```

```ts
// in the root layout or main.ts, before any component CSS
import '@fontsource-variable/montserrat';
```

The variable package registers the family name `'Montserrat Variable'`, which is the
first entry in `--font-sans`. Only the weights you use are kept by the browser; no
subset configuration is needed.

Single-file prototypes, Claude artifacts, anything served without a build:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

Use exactly this tag. The full variable range costs nothing extra on Google Fonts, and
`display=swap` means the page paints in the system fallback and swaps, rather than
staying blank. A page that loads no font at all renders in Arial and looks like
somebody else's product; it is the most common prototype defect in the inventory.

Mono is `--font-mono`: `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo,
Consolas, monospace`. No app loads JetBrains Mono today and none has to; the system
mono is fine. Load it only when a page is mostly code.

## Scale

The root size steps with the viewport (DS-010) and with the user's text-size preference
(DS-020). `base.css` does the arithmetic:

```css
html { font-size: calc(var(--base-font-size) * var(--text-scale)); }
```

| Viewport | `--base-font-size` | With `data-text-size="large"` (1.3) | `"larger"` (1.7) |
|---|---|---|---|
| under 1400px | `15px` | 19.5px | 25.5px |
| 1400px and up | `17px` | 22.1px | 28.9px |
| 1800px and up | `19px` | 24.7px | 32.3px |

Everything else is in `rem`, so it follows. Set the root on `html`, never on `body`:
dash set it on `body` and its rem ladder quietly resolved against a 16px root, which is
the bug DS-010 fixes.

The ladder, with the pixel size at each root step:

| Token | rem | at 15px | at 17px | at 19px | Use |
|---|---|---|---|---|---|
| `--text-xs` | `0.75rem` | 11.25 | 12.75 | 14.25 | Badges, chip labels, h4 small caps, table meta |
| `--text-sm` | `0.875rem` | 13.1 | 14.9 | 16.6 | Helper text, dense tables, captions, secondary buttons |
| `--text-base` | `1rem` | 15 | 17 | 19 | Body, inputs, buttons, h3 |
| `--text-lg` | `1.125rem` | 16.9 | 19.1 | 21.4 | Card titles, stat labels |
| `--text-xl` | `1.25rem` | 18.75 | 21.25 | 23.75 | h2, section headings |
| `--text-2xl` | `1.5rem` | 22.5 | 25.5 | 28.5 | h1, page title in the top bar |
| `--text-3xl` | `2rem` | 30 | 34 | 38 | Stat card numbers, hero figures |

Shell chrome is the exception: `--tab-font-size` is a fixed `15px` and the top bar is a
fixed `64px`, so the frame does not grow with the content (DS-007).

Line heights: `--leading-tight` (1.25) for headings and stat numbers,
`--leading-normal` (1.375) for UI text and tables, `--leading-relaxed` (1.625) for
paragraphs longer than two lines.

## Weights

| Token | Weight | Use |
|---|---|---|
| `--weight-regular` | 400 | Body, table cells, h2 |
| `--weight-medium` | 500 | Emphasis inside body text, nav items, tab labels |
| `--weight-semibold` | 600 | h1, h3, h4, buttons, card titles, stat labels, column headers |
| `--weight-bold` | 700 | Stat numbers and almost nothing else |

Use numeric weights only. The Figma export has its 400 and 500 labels swapped, so a
weight named "Medium" in a comp may be either.

## Headings

`base.css` styles the four heading levels (DS-022). Use them for structure, not for
size: if you need a smaller h2, you need an h3.

| Level | Size | Weight | Notes |
|---|---|---|---|
| h1 | `--text-2xl` | 600 | One per page. In the shell it is the page title in the top bar, colored `--color-primary` |
| h2 | `--text-xl` | 400 | Section headings. Regular weight is deliberate; the size carries it |
| h3 | `--text-base` | 600 | Card titles, form groups ("Define Tutoring Patterns", "Questions") |
| h4 | `--text-sm` | 600 | Uppercase, `letter-spacing: 0.04em`, `--color-text-secondary`. Field labels, nav group labels ("CONFIGURE"), "DURATION" |

```html
<section class="saga-card">
  <h3>Define Tutoring Patterns</h3>
  <p class="text-secondary">Tutoring periods meet on the same days each week.</p>
</section>
```

Headings are `--color-text`, except the h1 page title (blue) and headings on navy
chrome (white). Never color a heading to decorate it.

## Rhythm

One step. Headings, paragraphs, lists, tables and figures all carry
`margin: 0 0 var(--space-md)` (16px) and the last child in any container drops it.
That is the whole system: a card with a heading, two paragraphs and a table needs no
margin rules of its own.

```html
<div class="saga-card">
  <h3>Roster upload</h3>
  <p>Upload a CSV with one student per row.</p>
  <p>Existing students are matched on Student ID.</p>
  <!-- last child: no bottom margin, card padding does the rest -->
  <table class="saga-table">…</table>
</div>
```

A section break inside long content gets `--space-xl` (32px) above the heading. A
heading never gets extra space below it; the 16px step is already there.

Do:
- Let the container's padding (`--card-padding`, 24px) frame the content.
- Use `--space-sm` (8px) between a label and its control, `--space-md` between fields.

Don't:
- Add `margin-top` to headings to "push them down". Space the block above instead.
- Use `<br>` for spacing.
- Set `line-height: normal`. Pick a token.

## Numbers

Data screens are mostly numbers, and numbers that jiggle as they change are the first
thing a user notices. Any column of figures, any stat card, any clock uses tabular
figures (DS-028):

```css
.saga-table td.num, .saga-card--stat .value, .clock { font-variant-numeric: tabular-nums; }
```

- Right-align numeric columns; left-align text columns; never centre either.
- Stat numbers: `--text-3xl`, 700, `--leading-tight`, `--color-primary`. The label under
  them is `--text-base` 600 and the caption `--text-sm` secondary (see the Surveys
  report cards).
- Durations and ranges use an en dash with spaces stripped: `8:00–8:50 AM`, `30m`.
- Counts in a tab or badge are `--text-xs` 600 on `--color-bg-tertiary`, pill-shaped.

## Mono

`--font-mono` at `0.9em` (base.css sets `code, kbd, pre`), for IDs, keys, file names,
code and anything a user might copy exactly. Student IDs in a roster are a borderline
case: dash renders them in the sans face, and that stays the default; switch to mono
only when the column is meant to be scanned character by character.

Never use mono as a "technical look" for labels or headings. The wireframe style some
comps use is a placeholder, not a design.

## Line length

Prose (help text, notice bodies, empty states, onboarding) wraps at 60 to 80
characters: `max-width: 72ch` on the paragraph or its container. Survey questions in
the Reports screen are a good example at about 70 characters.

UI text (labels, cells, chips) does not wrap by width rules; it truncates with an
ellipsis and exposes the full text in a tooltip, or it wraps naturally inside a sized
column. Never let a label grow a control.

Text on navy chrome (nav items, header strips) is `--text-base` or `15px` and medium
weight; Montserrat at 400 on dark backgrounds reads thin.
