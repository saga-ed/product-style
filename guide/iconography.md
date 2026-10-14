---
title: Iconography
order: 150
summary: Material Symbols Light (outlined, rounded) through iconify, the size and colour rules, the brand marks, and a table of the icons Saga uses most.
---

Saga icons are thin, outlined and rounded. The set is **Material Symbols
Light** (the 300-weight cut of Google's Material Symbols), delivered through
iconify so that a single-file prototype, a vanilla app and a Svelte package
all draw the same glyph from the same name. The dashboard's
`@saga-ed/dash-icons` and Connect's `cv3-icons` are both generated from this
set; a prototype can skip the generator and load icons from the CDN.

## Using icons in a prototype

Add the web component once in `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/iconify-icon@2.3.0/dist/iconify-icon.min.js"></script>
```

Then place icons by name. Names are `material-symbols-light:` plus the
Material name, with `-outline` for the hollow form and `-rounded` for soft
corners where the set offers them:

```html
<iconify-icon icon="material-symbols-light:edit-outline-rounded"></iconify-icon>
<iconify-icon icon="material-symbols-light:lock-outline-rounded"></iconify-icon>
<iconify-icon icon="material-symbols-light:add-circle-rounded" style="color: var(--color-primary)"></iconify-icon>
```

The component fetches the SVG on first use and caches it, renders inline, and
sizes to the surrounding `font-size`. Nothing else is required. Browse the
full set at `https://icon-sets.iconify.design/material-symbols-light/`.

In a bundled app, keep a curated list and generate inline SVG components from
`@iconify-json/material-symbols-light` at build time, as the dashboard and
Connect do; the names in the table below are the names to put in that list.

Decorative icons (one that repeats the label beside it) get
`aria-hidden="true"`. An icon that is the whole control gets its meaning from
the button's `aria-label`, never from the icon.

## Size

Icons are sized in em so they follow the text they sit with.

| Size | Value | Where |
|---|---|---|
| Inline | `1.2em` | next to a label: buttons, nav links, table row actions, chips |
| Large | `2em` | section markers, option-card icons, empty states |
| Extra large | `3em` | a hero mark, a modal illustration |

The glyph is vertically centred on the text's x-height (the dashboard nudges
it up by `0.075em`). Set the size on the icon's container with `font-size`
rather than on the icon itself, so a button's icon and text scale together.
Stroke weight comes from the set and is never changed; do not fake a bolder
icon with a CSS stroke.

## Colour

Icons take `currentColor` and nothing else. The parent's text colour decides:

- In a button, the icon is the button's text colour (white on primary, blue
  on quiet, `--color-text` on secondary).
- In the nav, `--nav-text` at 70% opacity, full white on hover and on the
  active pill.
- In a table row action, `--color-text-dark`.
- In a date trigger or search box, `--color-text-secondary`: it is an
  affordance, not an action.
- Status icons use the status colour: `--color-warning` triangle,
  `--color-success` check, `--color-danger` for a destructive remove.
- The one exception is the Add disc, which is always `--color-primary` so it
  reads as the brand's add glyph wherever it appears (see
  [buttons](buttons.md#the-add-pattern)).

Never two-tone icons, never teal icons on white (teal fails contrast), never
an icon as the only carrier of a status (pair it with a label or chip).

## Brand marks

Five marks live in `assets/brand/`. They are artwork, not icons: do not
recolour them with `currentColor`, do not restroke them, and keep their
proportions.

| File | What it is | Use |
|---|---|---|
| `saga-logo-white.png` | the white "saga" logotype with the S mark | the nav logo band on navy; 34px tall |
| `saga-s-for-light-bgs.svg` | the S mark: navy, teal, lime and pink quadrants | favicon, loading screens, a small signature on white |
| `saga-s-for-dark-bgs.svg` | the same mark with white in place of navy | the S alone on navy or a photo |
| `saga-leaf-grow.svg` | a stroked two-leaf sprout | the "grow" marker: areas to improve, in coaching feedback and timelines |
| `saga-math-f-of-x.svg` | an f(x) in parentheses | the math subject glyph; next to a subject chip or on a math-only page |

The **heart** is the glow marker ("glows and grows" in coaching): use
`material-symbols-light:favorite-outline-rounded` in `--saga-pink`, next to
the leaf in `--saga-lime` or `--saga-green`. These two are the only places
pink and lime appear in product UI outside the mark itself.

The S mark's own hexes (`#10cfc9`, `#70d44b`) differ slightly from the
`--saga-teal` and `--saga-lime` tokens. That is intentional: the mark is
fixed artwork from the brand, and the tokens are the product palette. Do not
retune either to match.

Use the S mark alone at 20px or smaller (a favicon, a tab icon). Use the
logotype when there is room for the word. Never stretch, rotate, outline or
place the mark on a busy background.

## Common icons

The dashboard, Connect and the generated icon packages share these. Use the
exact names; "edit" is the pencil, "edit-square" is not used.

| Meaning | Material Symbols Light name | Notes |
|---|---|---|
| Edit | `edit-outline-rounded` | table row pencil, inline rename |
| Lock | `lock-outline-rounded` | locked row; `lock-open-outline-rounded` for unlocked |
| Delete | `delete-outline-rounded` | the trash can in list rows |
| Add | `add-circle-rounded` | the filled Add disc, always `--color-primary`; `add-rounded` for a plain plus |
| Remove | `remove-rounded` | the minus for decrementing |
| Upload | `upload-rounded` | Upload roster |
| Download | `download-rounded` | Download roster |
| Search | `search-rounded` | search boxes, top bar search |
| Calendar | `calendar-month-outline-rounded` | date trigger, Sessions nav |
| Clock | `schedule-outline-rounded` | times, durations |
| Timer | `timer-outline-rounded` | countdowns |
| Person | `person-outline-rounded` | a tutor or student |
| Group | `group-outline-rounded` | Rosters nav, pods |
| Dashboard | `dashboard-outline-rounded` | Dashboard nav |
| Reports | `bar-chart-rounded` | Reports nav |
| Surveys | `assignment-turned-in-outline-rounded` | Surveys nav |
| Settings | `settings-outline-rounded` | configure, gear |
| Info | `info-outline-rounded` | the tooltip info trigger, `--color-primary` |
| Warning | `warning-outline-rounded` | amber attention |
| Check circle | `check-circle-outline-rounded` | complete; `check-rounded` for a bare check |
| Close | `close-rounded` | modal ✕, chip remove |
| Chevron | `chevron-right-rounded`, `chevron-left-rounded`, `expand-more-rounded` | pagination, month paging, disclosure |
| Menu | `menu-rounded` | hamburger |
| Notifications | `notifications-outline-rounded` | the bell |
| Filter | `filter-list-rounded` | "+ Filter" |
| Copy | `content-copy-outline-rounded` | copy link, duplicate |
| Drag handle | `drag-indicator` | reorder rows |
| Visibility | `visibility-outline-rounded` | observe, preview; `visibility-off-outline-rounded` to hide |
| Play | `play-arrow-rounded` | video, "test the chime" |
| More | `more-vert` | kebab menu trigger |
| Send | `send-outline-rounded` | push to all, submit |
| Lightbulb | `lightbulb-outline-rounded` | an insight or reflection |
| Bookmark | `bookmark-outline-rounded` | saved items |
| Heart | `favorite-outline-rounded` | glow marker, `--saga-pink` |
| Leaf | `eco-outline-rounded` | grow marker when the brand SVG is not available |

When a needed icon is missing from this list, pick the Material Symbols Light
glyph whose `-outline-rounded` variant exists, add it here, and add it to the
app's generated list. Do not mix in another set for one icon; a Fluent or
MDI glyph has a different stroke and reads as foreign next to these.

## Do and don't

Do

- Load one set, Material Symbols Light, and use the outlined rounded forms.
- Size with `font-size` on the parent; colour with `color`.
- Give every icon-only control an `aria-label` and a tooltip.

Don't

- Don't use filled glyphs except the Add disc and the selected state of a
  toggle icon (a filled heart once marked).
- Don't recolour the brand marks or use the S as a generic icon.
- Don't use emoji as icons; they render differently on every platform.
- Don't rely on an icon alone to say "error" or "done".
