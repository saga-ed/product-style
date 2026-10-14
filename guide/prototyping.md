---
title: Prototyping
order: 90
summary: How to build a single-file HTML prototype on this system, mark what is not real, ask for a decision, and hand it to an engineer.
---

Prototypes are single HTML files in the `prototypes` repo; a push deploys them to
`prototypes.wootdev.com` and a PR gets `pr-N.prototypes.wootdev.com`. They are how a
product manager tests an idea in an afternoon and how an engineer later knows what to
build. A prototype on this system looks like the product because it uses the same
tokens, not because somebody matched the colours by eye.

## The public-site rule

`prototypes.wootdev.com` is public. Everything in a prototype is invented:

- No real student, tutor or staff names. No real district or school names. No real
  module text, video or transcripts. No screenshots of production.
- Invented data looks plausible: "Aaliyah L", "sbx28-s21", "Demo Program 08/17",
  "Saga SC Sandbox 28" are the shapes dash's own sandbox uses. Avoid names that are
  obviously fake ("Test Test") because reviewers stop reading.
- A prototype that needs a realistic volume (a 55-row roster) generates it in a few
  lines of JS at load rather than pasting an export.

## Violet means "not proposed UI"

Anything violet on a prototype is a note to the reader, never part of the design
(DS-023). `base.css` ships the convention: `.ptag` for an inline tag, `.standin` for a
placeholder block, and the `--proto`, `--proto-wash`, `--proto-ink`, `--proto-line`
tokens for anything custom.

```html
<h3>All Periods <span class="ptag">v2: drag handle moves here</span></h3>
<div class="standin">Real chart renders here; see ai_insights_scatterplot.png</div>
```

Use it for: open questions, "this is where the real thing goes", version notes,
anything a reviewer must not mistake for a proposal. Do not use violet in the design
itself; `#6c4fc7` is not a Saga colour, which is the point.

## Link or inline the tokens

Two ways to get the system into a single file (DS-035). Link when the page lives on
the prototypes site; inline when it must stand alone.

Linked (default for `prototypes` repo files):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://style.wootdev.com/css/tokens.css">
<link rel="stylesheet" href="https://style.wootdev.com/css/base.css">
<link rel="stylesheet" href="https://style.wootdev.com/css/components.css">
```

The page tracks the system: when a token changes, every linked prototype changes with
it, which is what you want for something that is only ever viewed live.

Inlined (a Claude artifact, an attachment, a file opened from disk, a page that must
look the same in a year): paste the contents of `tokens.css`, `base.css` and the parts
of `components.css` you use into a `<style>` block, in that order, with the first line
of the block saying which commit they came from:

```html
<style>
/* saga product-style tokens.css + base.css @ <sha>, https://style.wootdev.com */
:root { … }
</style>
```

Either way, the prototype's own CSS comes after, references tokens only, and never
redefines a `--saga-*` or `--color-*` value. A prototype that needs a colour the system
lacks defines a `--proto-*` or a page-local `--x-*` variable and says so in a `.ptag`.

## The starter template

`starter/saga-starter.html` is the file to copy. Its shape, top to bottom:

1. A header comment: the three rules above (public site, violet, Copy preferences), the
   token source and commit, and a "delete what you don't need" line.
2. `<head>`: viewport meta, the three Google Fonts tags, the three stylesheet links,
   then an empty `<style>` for the prototype's own CSS with a comment marking where
   the system ends and "Your prototype" begins.
3. The shell: `.saga-nav` (logo, program selector as a `.saga-select`, five nav items
   with one active, district footer) and `.saga-topbar` (h1 page title, clock, two
   icon buttons, a badge). Both are real markup, so a prototype of a page looks like a
   page in the product.
4. A content area with the `24px` gutter holding one of each common thing: a
   `.saga-tabs` strip, an action row with a primary and two secondary `.saga-btn`s,
   a `.stat-grid` of three `.saga-card--stat`s, a `.saga-card` with an h3 and a
   `.saga-table`, and a `.saga-field` with an input.
5. A `.ptag` and a `.standin` in place, so the convention is visible on first open.
6. At the bottom, a commented-out "Copy preferences" block ready to uncomment.
7. No JavaScript except the clock and the Copy preferences helper.

It is a page, not a kit: open it, delete the parts you are not changing, build in the
space that remains. The file is deliberately short enough to read in one screen of a
text editor.

## Copy preferences

A decision board is a prototype whose job is to get an answer. Nathan's convention
(`design_system/*.html` in the prototypes repo): a sticky control panel on the left
changes the proposal live, the staged scenes on the right show it in context, and a
"Copy preferences" button serialises the current choices to text the reviewer pastes
onto the GitHub issue.

```html
<aside class="panel">
  <h4>Proposal</h4>
  <div class="saga-field">
    <label class="saga-label">Button radius</label>
    <input class="saga-input" type="range" min="4" max="8" step="2" data-pref="radius" value="6">
  </div>
  <label class="saga-checkbox"><input type="checkbox" data-pref="flatModalButtons" checked> Modal buttons are flat</label>
  <button class="saga-btn saga-btn--primary" id="copy">Copy preferences</button>
  <p class="saga-help" id="copied" hidden>Copied. Paste it on the issue.</p>
</aside>
<script>
  const prefs = () => Object.fromEntries([...document.querySelectorAll('[data-pref]')]
    .map(el => [el.dataset.pref, el.type === 'checkbox' ? el.checked : el.value]));
  document.querySelectorAll('[data-pref]').forEach(el => el.addEventListener('input', () => {
    document.documentElement.style.setProperty('--btn-radius', prefs().radius + 'px');
  }));
  document.getElementById('copy').onclick = async () => {
    await navigator.clipboard.writeText('```json\n' + JSON.stringify(prefs(), null, 2) + '\n```');
    document.getElementById('copied').hidden = false;
  };
</script>
```

Rules for a board:
- Every control maps to one token or one rule, named the way the guide names it, so
  the pasted answer reads as an implementation note.
- Offer an "existing / proposed" switch so the reviewer sees what changes.
- Show the WCAG ratio next to any colour control (the button board computes it live).
- The default state of the board is the recommendation. A reviewer who copies without
  touching anything has approved the proposal.

## Handing it to an engineer

The tokens map 1:1. `--color-primary` in the prototype is `--color-primary` in
dash's `tokens.css`, Connect's `--cv3-*` aliases and coach's `--color-*` resolve to the
same hex, so an engineer picks up the file and reads the design off the CSS, not off a
screenshot.

| Prototype | Svelte (dash core-ui) | Vanilla (Connect) |
|---|---|---|
| `.saga-btn` | `StandardButton` | `.saga-btn` from components.css |
| `.saga-card` | `SagaCard` | `.saga-card` |
| `.saga-input`, `.saga-select` | `SagaInput`, `SelectMenu` | native + classes |
| `.saga-tabs` | `Tabs` | `.saga-tabs` |
| `.saga-modal` + `.saga-scrim` | `Modal`, `ConfirmDialog` | `util/modal.ts` (`showModal`) |
| `.saga-toast` | `showToast` from `@saga-ed/dash-core-ui/toast` | `util/toast.ts` |
| `.saga-skeleton` | `Skeleton`, `SkeletonList` | `.saga-skeleton` |
| `.pop-in`, `.overlay-in`, `.list-in` | `popIn`, `overlayPanel`, `listItem` | the CSS classes |
| `.ptag`, `.standin` | delete | delete |

What the engineer does:

1. Reads the header comment for the questions the prototype left open, and the
   `.ptag`s for the answers.
2. Replaces each `.saga-*` block with the matching component; the props are the
   modifiers (`--primary` becomes `variant="primary"`).
3. Moves any page-local `--x-*` variable into the app's Tier 3 alias layer, or files a
   ledger entry if it is really a missing token.
4. Deletes every violet thing.
5. Links the prototype URL from the PR so reviewers can compare.

What the engineer does not do: copy the prototype's CSS. If the prototype needed a rule
the system lacks, that is a gap in the system, not a thing to paste.

## Checklist before opening the PR

- Montserrat loads (the page does not fall back to Arial on a cold cache).
- No hex literals in the page's own `<style>`; tokens only.
- Invented content throughout; search the file for `@saga.org` and real surnames.
- Violet on every open question and stand-in; no violet in the design.
- Focus ring visible when tabbing; `data-text-size="larger"` does not break it.
- The file is self-describing: someone opening it cold knows what is being proposed
  and what is not.
