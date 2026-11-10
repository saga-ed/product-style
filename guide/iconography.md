---
title: Iconography
order: 150
summary: Material Symbols Rounded at weight 400, outlined when large and filled below 24px or on dark; the exceptions, how prototypes and apps get icons, the size and color rules, the brand marks, and a table of the icons Saga uses most.
---

Saga icons are **Material Symbols Rounded**. One rule picks the variant, from
the size the icon renders at and the surface it sits on (DS-154):

| Where the icon sits | Variant | Why |
|---|---|---|
| **24px and larger** on a light surface: top-bar buttons, section markers, empty states | weight **400, outlined** | at this size the outline reads clearly and stays quiet |
| **Under 24px**, or on a **dark surface** (the nav, Connect's header and tiles): inline in buttons, row actions, chips, nav items | **filled**, weight **500** | a thin outline breaks up when small or light-on-dark; the filled shape holds |

Line glyphs have no filled shape (chevron, more, search, close, menu,
download, add, drag handle), so the small tier just makes them heavier. Fill
also marks state at any size: the current nav item, a selected toggle, a
muted microphone.

This replaced Material Symbols Light (DS-063), which made prototypes look
thinner than the product.

## Exceptions

- **Info is always outlined**, at every size. A filled info disc is too dark
  and pulls attention from the content it explains.
- **Sentiment faces are always outlined** (`sentiment-satisfied`,
  `sentiment-neutral`, `sentiment-dissatisfied`, `mood`). The outline is the
  classic smiley.
- **A carefully designed UI may choose a variant on purpose**, such as a
  heavier glyph in a dense toolbar or an outline where a fill reads as a
  status. Write the reason next to the icon in the app's icon list. qboard's
  whiteboard tool icons are hand-picked this way and sit outside this rule.
- **Another set only when Material Symbols lacks a glyph or draws it badly**.
  For example, Connect uses Fluent's prohibited microphone and camera. Add it
  to the app's icon list with a one-line reason, never inline.

## Using icons in a prototype

Add the web component once in `<head>` (the starter already does):

```html
<script src="https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js"></script>
```

Then name icons from the `material-symbols:` set (weight 400). Small and
on-dark icons take the filled `-rounded` form. Large icons take
`-outline-rounded`:

```html
<button class="saga-btn saga-btn--secondary"><iconify-icon icon="material-symbols:edit-rounded"></iconify-icon> Edit</button>
<iconify-icon icon="material-symbols:info-outline-rounded"></iconify-icon>           <!-- info: always outlined -->
<iconify-icon class="saga-icon saga-icon--lg" icon="material-symbols:notifications-outline-rounded"></iconify-icon>
```

Iconify carries only weights 300 and 400, so a prototype's small icons are
filled at 400 rather than 500. That is close enough for a mock. Browse the
set at `https://icon-sets.iconify.design/material-symbols/`.

Decorative icons (one that repeats the label beside it) get
`aria-hidden="true"`. An icon that is the whole control gets its meaning from
the button's `aria-label`, never from the icon.

## Using icons in an app

Icons come from a **curated icon package**, never from SVG paths pasted into
a component. The package is a typed list of names. A build step fills it from
`@material-symbols/svg-400` and `@material-symbols/svg-500` (Apache-2.0: every
icon, every weight, filled and outlined), and each entry carries its large
and small form plus any exception with its reason. A call site names the icon
and its size, never a weight or a fill:

```svelte
<Icon name="edit" />              <!-- inline: filled, 500 -->
<Icon name="info" />              <!-- inline, but info stays outlined -->
<Icon name="notifications" size="lg" />   <!-- 24px+: outlined, 400 -->
```

Two sets exist. Connect has `cv3-icons` in qboard. Dashboards and reports
share `@saga-ed/ui-icons` from product-ui-components, with `<Icon>` in
ui-svelte. Until `@saga-ed/ui-icons` ships, saga-dash's `@saga-ed/dash-icons`
plays that role: `XIcon` is the old Light cut, and `XBoldIcon` is weight 400.

## Size

Icons are sized in em so they follow the text they sit with.

| Size | Value | Tier | Where |
|---|---|---|---|
| Inline | `1.2em` | small (about 19px) | next to a label: buttons, nav links, table row actions, chips |
| Large | `2em` | large | top-bar buttons, section markers, option-card icons, empty states |
| Extra large | `3em` | large | a hero mark, a modal illustration |

The glyph is vertically centred on the text's x-height (the dashboard nudges
it up by `0.075em`). Set the size on the icon's container with `font-size`
rather than on the icon itself, so a button's icon and text scale together.
Weight comes from the set and the size rule, and is never faked with a CSS
stroke.

## Color

Icons take `currentColor` and nothing else. The parent's text color decides:

- In a button, the icon is the button's text color (white on primary, blue
  on quiet, `--color-text` on secondary).
- In the nav, `--nav-text` at 70% opacity, full white on hover and on the
  active pill.
- In a table row action, `--color-text-dark`.
- In a date trigger or search box, `--color-text-secondary`: it is an
  affordance, not an action.
- Status icons use the status color: `--color-warning` triangle,
  `--color-success` check, `--color-danger` for a destructive remove.
- The one exception is the Add disc, which is always `--color-primary` so it
  reads as the brand's add glyph wherever it appears (see
  [buttons](buttons.md#the-add-pattern)).

Never two-tone icons, never teal icons on white (teal fails contrast), never
an icon as the only carrier of a status (pair it with a label or chip).

## Brand marks

Five marks live in `assets/brand/`. They are artwork, not icons: do not
recolor them with `currentColor`, do not restroke them, and keep their
proportions.

| File | What it is | Use |
|---|---|---|
| `saga-logo-white.png` | the white "saga" logotype with the S mark | the nav logo band on navy; 34px tall |
| `saga-s-for-light-bgs.svg` | the S mark: navy, teal, lime and pink quadrants | favicon, loading screens, a small signature on white |
| `saga-s-for-dark-bgs.svg` | the same mark with white in place of navy | the S alone on navy or a photo |
| `saga-leaf-grow.svg` | a stroked two-leaf sprout | the "grow" marker: areas to improve, in coaching feedback and timelines |
| `saga-math-f-of-x.svg` | an f(x) in parentheses | the math subject glyph; next to a subject chip or on a math-only page |

The **heart** is the glow marker ("glows and grows" in coaching): use
`favorite` (filled at inline size, per the size rule) in `--saga-pink`, next to
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

One icon per meaning. Use these names with the size rule above: a large icon
takes `<name>-outline-rounded`, and a small or on-dark icon takes
`<name>-rounded`. Line glyphs (marked *line*) have one form, `<name>-rounded`
or the bare name. "edit" is the pencil; "edit-square" is not used.

| Meaning | Material Symbols name | Notes |
|---|---|---|
| Info | `info` | **always outlined**; the tooltip info trigger |
| Warning | `warning` | amber attention |
| Error | `error` | `--color-danger` |
| Success | `check-circle` | complete; `check` (*line*) for a bare check |
| Close | `close` (*line*) | modal ✕, chip remove |
| More | `more-vert` (*line*) | kebab menu trigger; `more-horiz` for a horizontal row |
| Chevron | `chevron-right`, `chevron-left`, `expand-more` (*line*) | pagination, month paging, disclosure |
| Search | `search` (*line*) | search boxes, top bar search |
| Download | `download` (*line*) | Download roster, export |
| Upload | `upload` (*line*) | Upload roster |
| Edit | `edit` | table row pencil, inline rename |
| Delete | `delete` | the trash can in list rows |
| Menu | `menu` (*line*) | hamburger |
| Add | `add-circle` | the Add disc, always `--color-primary`; `add` (*line*) for a plain plus |
| Remove | `remove` (*line*) | the minus for decrementing |
| Lock | `lock` | locked row; `lock-open` for unlocked |
| Calendar | `calendar-month` | date trigger, Sessions nav |
| Clock | `schedule` | times, durations |
| Timer | `timer` | countdowns |
| Person | `person` | a tutor or student |
| Group | `group` | Rosters nav, pods |
| Dashboard | `dashboard` | Dashboard nav |
| Reports | `bar-chart` (*line*) | Reports nav |
| Surveys | `assignment-turned-in` | Surveys nav |
| Settings | `settings` | configure, gear |
| Notifications | `notifications` | the bell |
| Filter | `filter-list` (*line*) | "+ Filter" |
| Copy | `content-copy` | copy link, duplicate |
| Drag handle | `drag-indicator` (*line*) | reorder rows |
| Visibility | `visibility` | observe, preview; `visibility-off` to hide |
| Play | `play-arrow` | video, "test the chime" |
| Send | `send` | push to all, submit |
| Lightbulb | `lightbulb` | an insight or reflection |
| Bookmark | `bookmark` | saved items |
| Heart | `favorite` | glow marker, `--saga-pink` |
| Leaf | `eco` | grow marker when the brand SVG is not available |
| Sentiment | `sentiment-satisfied`, `sentiment-neutral`, `sentiment-dissatisfied`, `mood` | **always outlined**: the classic smiley |

When a needed icon is missing from this list, pick the Material Symbols glyph,
check both its forms at the sizes it will render, add it here, and add it to
the app's icon list.

## Do and don't

Do

- Use one set, Material Symbols Rounded, at the variant the size rule picks.
- Keep info and the sentiment faces outlined.
- Size with `font-size` on the parent; color with `color`.
- Give every icon-only control an `aria-label` and a tooltip.
- Name icons through the app's icon package, and write the reason beside any
  exception.

Don't

- Don't use the Light (300) cut. It reads thin against product text.
- Don't paste SVG paths into a component, or hand-draw a stroke icon that the
  set already has.
- Don't mix in another set without an entry and a reason in the icon list.
- Don't recolor the brand marks or use the S as a generic icon.
- Don't use emoji as icons; they render differently on every platform.
- Don't rely on an icon alone to say "error" or "done".
