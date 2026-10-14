# Saga product style — instructions for AI assistants

You are building UI for Saga Education. This repo is the source of truth for
how Saga products look. Read this file, then the chapters you need.

## Pick the layer

| You are producing | Use |
|---|---|
| A single HTML file (prototype, mock, demo, Claude artifact) | Start from `starter/saga-starter.html` (links the CSS from style.wootdev.com; `saga-starter-offline.html` inlines it). Use the `.saga-*` classes. |
| A page in a Svelte 5 product repo (saga-dash, coach, staff-admin) | `@saga-ed/ui-svelte` from `saga-ed/product-ui-components`, plus the tokens. Never raw hex or px. |
| Vanilla JS/TS app (Saga Connect) | Tokens + `components.css`; the app keeps its own `--cv3-*` alias layer. |
| A comp or design description | Quote tokens by name (`--color-primary`, `--space-md`), not values. |

## Non-negotiable rules

- Color: `--color-primary` (`#006298`) is the only action color. Teal `#1ececa` is decorative only and never carries white text. Danger is clay `#991a21`; warning and attention are amber. Never pink `#ff595a` for errors.
- Type: Montserrat only. Root 15px, 17px at ≥1400, 19px at ≥1800. Body 400, emphasis 500, h1/h3 and buttons 600, h2 400.
- Every color, spacing, radius, shadow and duration is a `var(--token)` from `css/tokens.css`. If a token is missing, use the nearest one and say so; do not invent a value.
- One focus ring (`:focus-visible`, 2px blue). Never override it per component.
- Tooltips and names: icon-only controls need `aria-label`; extra description is a painted tooltip tied with `aria-describedby`. `title=` alone is not a tooltip (invisible to keyboard and touch, inconsistently announced).
- Native `<select>` and `<input type="date">` when the shoe fits: short, plain option lists and single dates. Switch to the painted `.saga-select` listbox or `.saga-datepicker` when you need search, groups, multi-select, day annotations or ranges. (saga-dash's own CI bans the native forms outright; that is its ratchet, not this guide's rule.)
- Buttons are flat (no shadow), 6px radius, one primary per view. Modal footers: Cancel then Save on the right; Delete alone, in danger style.
- Motion only on opacity and transform, timings from `--motion-*`, reduced motion swaps movement for a fade.
- Public prototypes contain invented data only. Anything violet (`.ptag`, `.standin`) is prototype chrome, not proposed UI.
- Accessibility target is WCAG 2.1 AA. Semantic HTML first; `aria-*` only to fill gaps. Icon-only buttons need `aria-label`.

## Where to read

- `guide/overview.md` then the chapter for what you are building:
  `color`, `typography`, `spacing-layout`, `elevation-surfaces`, `motion`,
  `accessibility`, `shell-navigation`, `buttons`, `forms-inputs`,
  `tables-data`, `modals-toasts-notices`, `iconography`, `voice-writing`,
  `prototyping`.
- `guide/decisions.md` lists every judgement call with an id (`DS-nnn`). If a
  rule here conflicts with code you find in a product repo, the ledger wins
  unless the entry is marked `overturned`.
- Rendered: https://style.wootdev.com (same content, with the showcase). Each chapter is also at `https://style.wootdev.com/guide/md/<name>.md`; `/agent-bundle.md` is everything in one file; `/llms.txt` is the index.

## Editing this repo

- `css/tokens.css` is the canon. Change a value only with a ledger entry.
- `css/components.css` references tokens only; `npm run check` fails on raw hex or undefined tokens.
- `npm run build` renders `guide/*.md` to `dist/` and regenerates `starter/saga-starter.html`. Commit the regenerated starter.
- Chapters are Markdown with `title`, `order`, `summary` frontmatter. Heading text becomes the anchor id.
- Showcase pages in `site/showcase/` are plain HTML that link the real CSS; they are the visual test of the component layer.
