---
title: Colour
order: 10
summary: The Saga palette, what each colour is for, which pairs pass WCAG, and how to pick a colour without guessing.
---

Saga products are mostly white and navy: white content on a navy left nav, with one
blue for everything you can click. The rest of the palette is loud (teal, pink, lime,
magenta) and is kept for the brand mark, chips and data marks. If a screen looks
colourful, something has gone wrong.

Every value on this page is a token in `css/tokens.css`. Components reference the
semantic tier (`--color-*`) and never a primitive (`--saga-*`) or a hex. The reason is
in [Accessibility](accessibility.md#contrast): high contrast mode remaps the semantic
tier, and a hardcoded hex silently opts out.

## Primitives

Tier 1. Named by what the colour is, not what it does (see DS-001 for the naming
history: Figma called pink "red" and blue "teal").

| Token | Hex | Role | Not for |
|---|---|---|---|
| `--saga-blue` | `#006298` | Primary action, links, active nav, focus ring | Decorative fills, chart series 3+ |
| `--saga-blue-dark` | `#004f7a` | Hover and pressed state of blue | Resting state of anything |
| `--saga-blue-tint` | `#e0f0fa` | Selected row, quiet-button hover, info surfaces | Text |
| `--saga-navy` | `#0b2a4a` | Chrome: left nav, dark header strips, scrims | Buttons, body text |
| `--saga-teal` | `#1ececa` | Accent bar in the nav, Advisory chips, data marks | Text, button fills, anything with white text on it (1.96:1) |
| `--saga-teal-ink` | `#0d7377` | Legible teal: text and pill labels | Large fills |
| `--saga-teal-tint` | `#d4f5f4` | Teal-tinted surface behind teal-ink text | Text |
| `--saga-clay` | `#991a21` | Danger, destructive, Regular day-type chip | Emphasis, headings |
| `--saga-pink` | `#ff595a` | Brand mark, chart series, Glows heart icon | Errors, warnings, buttons |
| `--saga-green` | `#20912d` | Success, affirmative actions | Brand mark |
| `--saga-lime` | `#6ed34b` | Brand mark, chart series | Success state, text (1.89:1) |
| `--saga-light-green` | `#a7e163` | Brand mark tints, chart series | Text |
| `--saga-orange` | `#ffad00` | Chart series, Groups warning triangle | Warning text (1.87:1 on white) |
| `--saga-dark-orange` | `#d14600` | "Changed / overridden" marker, bell badge | General warnings |
| `--saga-yellow` | `#f9e547` | Chart series only | Warnings, text (1.29:1) |
| `--saga-magenta` | `#bb16a3` | QTF rubric, AI Insights single-series data | Buttons in new work |
| `--saga-coral` | `#ffa38b` | Chart series, brand tints | Status |
| `--saga-beige` / `-dark` | `#d6d1ca` / `#a59c94` | Placeholder text (dark), warm dividers | Body text |
| `--saga-warm-gray` | `#6e6259` | Legacy warm secondary text | New work (use `--color-text-secondary`) |
| `--saga-light-gray` | `#f3f4f4` | Legacy surface | New work (use `--color-bg-tertiary`) |

## Neutrals

The cool gray ramp (`--gray-50` to `--gray-900`, DS-002) is what text, borders and
surfaces are built from. Use it through these semantic names:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#ffffff` | Page and card background |
| `--color-bg-secondary` | `#f9fafb` | Table header rows, modal footers, section wells |
| `--color-bg-tertiary` | `#f3f4f6` | Neutral chips, hover on list rows, skeleton bars |
| `--color-border` | `#e5e7eb` | Hairline borders on cards, rows, dividers |
| `--color-border-hover` | `#d1d5db` | Border of a hovered card or row |
| `--color-border-strong` | `#d9d9d9` | Inputs and secondary buttons |
| `--color-text` | `#111827` | Body text, headings |
| `--color-text-secondary` | `#6b7280` | Captions, helper text, table meta |
| `--color-text-muted` | `#9ca3af` | Timestamps, counts, anything a user can lose without harm |
| `--color-text-disabled` | `#707070` | Disabled control labels (never faded by opacity) |
| `--color-text-dark` | `#444444` | Tab labels and dense table cells |
| `--color-text-inverse` | `#ffffff` | Text on navy, blue, clay |

The legacy flat grays (`--color-gray-darker` to `--color-gray-lighter`) exist so dash
keeps rendering. New work does not write them.

## Semantic layer

Brand roles (DS-003):

| Token | Resolves to | Meaning |
|---|---|---|
| `--color-primary` | blue | The one action colour: primary buttons, links, active tab, active nav pill, focus ring |
| `--color-primary-hover` | blue-dark | Hover and pressed |
| `--color-primary-light` | blue-tint | Selected and quiet-hover surfaces |
| `--color-accent` | teal | Decorative only |
| `--color-teal` | teal-ink | Teal you can read |
| `--color-secondary` | gray-500 | Quiet controls and secondary text |

Chips (DS-019): `--chip-regular` is clay, `--chip-advisory` is teal, `--chip-neutral-bg`
is gray-100 with `--chip-neutral-text`. A teal chip carries navy or dark text
(7.4:1), never white.

## Status

One red, and it is clay. Pink is never a status colour (DS-004).

| Status | Foreground | Background | Border | Use |
|---|---|---|---|---|
| Success | `--color-success` `#20912d` | `--color-success-bg` `#eaf5ec` | `--color-success-border` | Saved, complete, healthy |
| Warning | `--color-warning` `#d97706` | `--color-warning-bg` `#fff8e1` | `--color-warning-border` | Something to check before continuing; icon, edge and border only |
| Warning, filled | `--color-warning-strong` `#b45309` (white text on it) | | | The one amber a filled control may use: the caution confirm button, a status-filled attendance mark (DS-112) |
| Danger | `--color-danger` `#991a21` | `--color-danger-bg` `#fdecea` | `--color-danger-border` | Errors, destructive confirms |
| Notice | `--color-notice` (blue) | `--color-notice-bg` `#eef4fb` | `--color-notice-border` | Informational; use sparingly |
| Attention | `--color-attention` `#b45309` | `--color-attention-bg` `#fdf1de` | | Needs action in content (the Groups step's triangle) |
| Positive | `--color-positive-fg` `#2c6e49` | `--color-positive-bg` `#eef4ec` | `--color-positive-border` | Calm good-news surfaces (not a confirmation) |

Inside a notice, toast or banner, the status colour goes on the icon, the left edge and
the badge. The body copy stays `--color-text` (DS-025): amber `#d97706` on white is
3.2:1, which is enough for an icon or a border but not for a sentence. Amber text
uses `--color-attention` (5.0:1).

## Contrast

WCAG 2.1 AA: 4.5:1 for text under 24px (or under 18.66px bold), 3:1 for large text, icons
and control borders. Ratios below are computed from the token values.

| Foreground on white | Ratio | Verdict |
|---|---|---|
| `--color-text` `#111827` | 17.7:1 | AAA |
| `--color-text-dark` `#444444` | 9.7:1 | AAA |
| `--color-text-secondary` `#6b7280` | 4.8:1 | AA (4.4:1 on `--color-bg-tertiary`, so keep it off gray-100) |
| `--color-text-muted` `#9ca3af` | 2.5:1 | Fails. Decorative text only |
| `--color-text-disabled` `#707070` | 5.0:1 | AA |
| `--color-primary` `#006298` | 6.6:1 | AA (links, blue text) |
| `--saga-navy` `#0b2a4a` | 14.5:1 | AAA |
| `--saga-teal` `#1ececa` | **1.96:1** | **Fails.** Never text, never a fill under white text |
| `--color-teal` `#0d7377` | 5.6:1 | AA |
| `--color-danger` `#991a21` | 8.3:1 | AAA |
| `--color-success` `#20912d` | 4.1:1 | Large text and icons only |
| `--color-warning` `#d97706` | 3.2:1 | Icons and borders only |
| `--color-attention` `#b45309` | 5.0:1 | AA |
| `--saga-magenta` `#bb16a3` | 5.6:1 | AA |
| `--saga-pink` `#ff595a` | 3.1:1 | Large text and marks only |
| `--saga-orange` / `--saga-yellow` / `--saga-lime` | 1.3 to 1.9:1 | Fills and marks only, with dark text or none |

| White text on a fill | Ratio | Verdict |
|---|---|---|
| navy `#0b2a4a` | 14.5:1 | AAA (nav, header strips) |
| blue `#006298` | 6.6:1 | AA (primary button) |
| clay `#991a21` | 8.3:1 | AAA (danger button) |
| magenta `#bb16a3` | 5.6:1 | AA |
| green `#20912d` | 4.1:1 | Below AA for 15px text; see TOKEN REQUEST in DS-025 |
| teal `#1ececa` | 1.96:1 | Fails. The teal "Continue" in Configure Period is the bug (DS-003) |
| amber `#d97706`, pink `#ff595a`, orange `#ffad00` | 1.9 to 3.2:1 | Fails. Dark text on these, or no text |
| strong amber `#b45309` | 4.6:1 | AA. The amber for white-on-amber fills (`--color-warning-strong`) |

Status text on its tint: danger 7.3:1, notice 5.9:1, positive 5.5:1, teal-ink on
teal-tint 4.9:1, blue on `--color-primary-light` 5.6:1 all pass. Success on its tint is
3.7:1 and warning on its tint is 3.0:1: labels and icons only.

Nav text is white at 70% on navy (about 7.8:1). The 45% muted nav text is roughly
4.0:1 and is reserved for the small uppercase group labels.

## How to pick a colour

Work down the list and stop at the first match.

1. Can the user click it, and is it the main thing to do? `--color-primary`.
2. Is it destructive? `--color-danger`. Is it an affirmative confirm beside a danger
   one? `--color-success`.
3. Is it telling the user something went well, needs checking, or failed? The matching
   status trio, on the icon and edge, body text in `--color-text`.
4. Is it a day type? `--chip-regular` or `--chip-advisory`. Any other category chip is
   `--chip-neutral-*`.
5. Is it chrome (nav, scrim, header strip)? `--saga-navy` through the `--nav-*` tokens.
6. Is it data? See the chart palette below.
7. Is it the brand mark or a favicon? The four-colour S uses blue, teal, pink and lime
   unmodified; nothing else borrows them.
8. Everything else is a neutral.

## Data and chart colours

Chart marks are the one place the loud primitives belong. The AI Insights screens set
the convention: a single-series view colours its marks and the series label in magenta,
and the strategy timeline uses lime, yellow, navy, clay and gray as categorical tracks
(DS-024).

| Series | Token | Resolves to | Hex |
|---|---|---|---|
| 1 | `--chart-1` | `--saga-blue` | `#006298` |
| 2 | `--chart-2` | `--saga-magenta` | `#bb16a3` |
| 3 | `--chart-3` | `--saga-teal-ink` | `#0d7377` |
| 4 | `--chart-4` | `--saga-orange` | `#ffad00` |
| 5 | `--chart-5` | `--saga-pink` | `#ff595a` |
| 6 | `--chart-6` | `--saga-navy` | `#0b2a4a` |
| 7 | `--chart-7` | `--saga-lime` | `#6ed34b` |
| 8 | `--chart-8` | `--saga-coral` | `#ffa38b` |

- A single-series chart may use magenta on its own (the AI Insights convention) or
  blue; a stat card number is blue.
- Averages are `--chart-average` (gray-400); gridlines `--chart-grid`;
  alternating period bands `--chart-band`. The remainder of a bar or ring
  ("not yet") is `--chart-neutral` (`#d9d9d9`). A reference mark or line (a
  target, a threshold) is `--chart-reference` (gray-700, `#374151`): it has
  to stay at least 3:1 over `--chart-neutral` and the gray bands, which
  `--chart-average` does not (about 1.6:1), so the two are not
  interchangeable (DS-111).
- Green, clay and amber in a chart mean good, bad and warning. Do not use them as
  ordinary series colours, and do not use brand colours to mean a status.
- Every series also gets a shape, pattern or direct label; colour is never the only
  difference (see [Accessibility](accessibility.md)).
- Text on a chart (labels, axis values) is `--color-text-secondary` or darker, never the
  series colour unless it passes 4.5:1 (blue and magenta do; teal, orange and pink do not).

## Never

- Never teal text, and never white text on teal, lime, orange, yellow or pink.
- Never pink or dark orange for an error; errors are clay.
- Never yellow `#f9e547` for a warning; warnings are amber `#d97706`.
- Never a hex literal or a `--saga-*` primitive in component CSS. Semantic tokens only.
- Never a second blue. `#1C77C3`, `#0d7d7d` and friends from old prototypes are not
  Saga colours.
- Never fade a disabled control with `opacity`; use `--btn-surface-disabled` and
  `--color-text-disabled`.
- Never add a colour to one screen by editing `tokens.css`. Add a Tier 3 alias in the
  app and log it in the ledger.
