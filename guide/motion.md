---
title: Motion
order: 50
summary: Four durations, three curves, opacity and transform only, reduced motion as a fade, and loading states that never lie.
---

Motion in Saga products is felt, not watched: 90 to 300ms, one small set of curves,
and only `opacity` and `transform` moving. The values are dash's and are unchanged
(DS-014); the interactive reference is
[prototypes.wootdev.com/motion/motion-language](https://prototypes.wootdev.com/motion/motion-language).

## Tokens

| Token | Value | Use it for |
|---|---|---|
| `--motion-instant` | `90ms` | Hover and press feedback: button fill, row highlight, card lift |
| `--motion-fast` | `150ms` | Menus, tooltips, popovers, small pops |
| `--motion-base` | `210ms` | Dialogs, panels, expand and collapse, list entrances, reorders |
| `--motion-slow` | `300ms` | One bespoke moment per app (dash: the left-nav mode swap) |
| `--motion-fade` | `120ms` | The reduced-motion fallback. Never zeroed |
| `--motion-stagger` | `32ms` | Per-item delay in a list entrance; capped at 6 items |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Almost everything: things arriving decelerate |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | The bespoke moment |

There is no overshoot curve. The motion prototype tried one for the nav indicator and
it is not adopted (DS-031); a Chromebook drops frames on the bounce and it reads as
playful on a tool for schools.

`--transition-fast` and `--transition-normal` are deprecated composites (duration plus
`ease`); they cannot feed `animation-duration` or a different curve. New code writes
the tokens above.

## Rules

1. **Timing comes from tokens.** No duration literal in a `transition` or `animation`,
   and no inline `style="transition: …"`: an inline style can never see the
   reduced-motion media query.
2. **Animate `opacity` and `transform` only.** Not `height`, `box-shadow`,
   `background-position`, `width`, `top`. The one exception is the expand pattern.
3. **Reduced motion is a swap, not a strip.** Under `prefers-reduced-motion: reduce` the
   tokens zero every movement duration and keep `--motion-fade`. A component that
   moves swaps its travel for an opacity fade; a looping animation stops and holds a
   visible state. Do not add per-component media queries for timing.
4. **Never gate focus or actionability on an animation.** A dialog is focusable the
   frame it mounts; a menu item is clickable before its entrance ends.
5. **Never tear down on `animationend` alone.** Under reduced motion the animation does
   not run and the event never fires. Pair it with a timer.
6. **One token set per page.** Two menus cannot animate differently because there is
   one place to look.

```css
.menu {
  transition: opacity var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
}
```

## Named patterns

Each pattern has a Svelte factory in `@saga-ed/dash-core-ui/motion` and an equivalent
CSS class for vanilla pages (DS-030). The factory is the reference; the CSS below is
what a prototype or Connect writes.

| Pattern | Motion | Duration | Factory |
|---|---|---|---|
| Pop-in | opacity, `scale(.96) → 1`, 4px rise, from the trigger's corner | `--motion-fast` | `in:popIn={{ origin: 'top right' }}` |
| Overlay panel | opacity, `scale(.98) → 1`, 8px rise; backdrop fades with it | `--motion-base` | `in:overlayPanel` on panel and scrim |
| Expand | height via Svelte `slide` (the layout exception) | `--motion-base` | `transition:expand` on an `{#if}` body |
| List item | opacity, 6px rise, delay `min(index, 6) × --motion-stagger` | `--motion-base` | `in:listItem={{ index }}` |
| FLIP reorder | translate only, from old box to new; an item that did not move costs nothing | `--motion-base` | `animate:flipItem` on a keyed `{#each}` |
| Press | `translateY(1px)` on `:active`, fill change on hover | `--motion-instant` | plain CSS |

```css
/* Pop-in: menus, popovers, the notification panel */
.pop-in { transform-origin: top right; animation: pop-in var(--motion-fast) var(--ease-out) both; }
@keyframes pop-in { from { opacity: 0; transform: scale(.96) translateY(-4px); } to { opacity: 1; transform: none; } }

/* Overlay panel: put .overlay-in on the dialog and the scrim; the scrim only sees the opacity */
.overlay-in { animation: overlay-in var(--motion-base) var(--ease-out) both; }
@keyframes overlay-in { from { opacity: 0; transform: scale(.98) translateY(8px); } to { opacity: 1; transform: none; } }

/* List entrance: set --i per item, capped at 6 by the author */
.list-in { animation: list-in var(--motion-base) var(--ease-out) both; animation-delay: calc(min(var(--i, 0), 6) * var(--motion-stagger)); }
@keyframes list-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* Reduced motion: the swap. Travel goes, a fade on the floor token stays. */
@media (prefers-reduced-motion: reduce) {
  .pop-in, .overlay-in, .list-in { animation-name: fade-in; animation-duration: var(--motion-fade); }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
}
```

The stagger cap is 6 for a reason: a roster of 55 rows with an uncapped 32ms stagger
takes 1.8s to settle and becomes a light show. After item 6 everything arrives
together.

Prefer intro-only. An exit animation keeps the node in the DOM through the outro, and a
test (or a fast user) that closes a menu and acts on the next thing races it. Exits
that do exist use `--ease-in` and are shorter than their intro.

Expand is the one pattern that animates layout, and it is bounded by `--motion-base`.
Under reduced motion it is instant (duration 0), not a fade: there is nothing to fade
between. FLIP is the same: the element is in both frames, so it snaps.

## Loading states

The rules exist because each was broken at least once in dash.

1. **No data for this key → skeleton.** First load, and any re-key to a different list
   (program switch, role tab, far date step). The old rows cannot describe the new
   list, so holding them dimmed under a new header is stale content, not a hold.
2. **Re-cut of the same list → hold and dim.** Search, sort, filter, group: keep the
   rows, set `aria-busy="true"`, fade to `opacity: .6` on `--motion-fast`.
3. **Same-key refetch → nothing.** The rows update in place.
4. **Never render an empty state you cannot yet know.** "No students" while the query
   is in flight is a lie, and the user believes it. The skeleton branch comes first.
5. **Never act on placeholder data.** A deep-link resolver or auto-open treats
   placeholder data as still loading.

Skeleton rules:
- Shape-match the real chrome: the grid's columns at the grid's row height, the card
  grid with the right number of cards, the section band and slugs. The swap to real
  content must cause no layout shift.
- The container is `role="status" aria-live="polite" aria-busy="true"` with a visually
  hidden label that says what is loading ("Loading roster…"). Bars are `aria-hidden`.
- Bars are `--color-bg-tertiary`, `--radius-xs`, and pulse by opacity (`.42 → .85`,
  about 1.2s). Under reduced motion the pulse stops and holds at `.6`. Never a
  background-position shimmer; it repaints every frame.

```html
<div class="saga-skeleton" role="status" aria-live="polite" aria-busy="true">
  <span class="sr-only">Loading roster…</span>
  <div class="saga-skeleton__bar" aria-hidden="true" style="width: 60%"></div>
  <div class="saga-skeleton__bar" aria-hidden="true" style="width: 80%"></div>
</div>
```

In a TanStack Query app the gate is `isFetching && !data`, never `isPending`: a
disabled query is pending forever and pins a permanent skeleton. Read the flags in one
top-level derived value on the root element (`data-loading="skeleton|holding|ready"`)
so they are tracked from first paint; the attribute doubles as a test hook.

## Ambient motion

Changes the system makes on its own (a session starts, a card appears, the bell
badge increments) are announced, not performed: the new item uses the list entrance,
a changed value gets a short `--color-primary` ring at `opacity` that fades on
`--motion-base`, and nothing else on the page moves. If a user is mid-interaction,
the change waits. Polling updates (every 20s in dash) never animate at all.

## Anti-patterns

| Smell | Why | Instead |
|---|---|---|
| `transition: all .15s` | Invisible to the reduce block; animates layout by accident | Named properties on tokens |
| `style="transition: …"` inline | Can never see a media query | A stylesheet rule |
| `height` or `max-height` tween | Layout every frame | `expand`, or opacity |
| `box-shadow` tween | Repaints | A second element with the shadow, fading by opacity |
| Background-position shimmer | Repaints every frame | Opacity pulse |
| Bounce or overshoot curve | Dropped frames, wrong tone | `--ease-out` |
| `animation-duration: 0.001ms !important` on `*` | Delays survive; items pop in at their old time | Token swap; if you must blanket, zero the delays too |
| Skeleton on `isPending` | Disabled query pins it forever | `isFetching && !data` |
| Empty-state copy while `!data` | A false empty | Skeleton branch first |
| Staggering more than 6 items | A light show | Cap the index |
| `out:` on surfaces tests close synchronously | DOM removal is delayed | Intro only |
| Bare Svelte `animate:flip` | Literal, distance-derived duration | `animate:flipItem` |
| Focus set in `animationend` | Never fires under reduce | Focus on mount |
