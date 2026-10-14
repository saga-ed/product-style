# Decisions ledger

Every judgement call the guide makes where sources disagreed, or where no
source existed. Numbered so a review can overturn one entry without reopening
the rest. "See it" points at the page on https://style.wootdev.com where the
decision is visible. Status: `proposed` until reviewed, then `accepted` or
`overturned → DS-nnn`.

Ranges: DS-001–019 tokens (this file's first author); DS-020–049 foundations
chapters; DS-050–099 pattern chapters; DS-100+ vanilla component layer.

---

### DS-001 — Primitive colour names say what the colour is
Status: proposed · See it: /guide/color#primitives

`--saga-blue` is `#006298`, `--saga-teal` is `#1ececa`, `--saga-pink` is
`#ff595a`, `--saga-clay` is `#991a21`, `--saga-magenta` is `#bb16a3`.
Sources disagreed only on names: Figma/design-tokens call blue
"medium-blue", teal "light-blue", pink "saga-red", magenta "saga-purple";
dash and janus call blue `--color-brand-teal`; several prototypes call blue
`--teal` or `--navy`. The hex values agree everywhere. constellation-bg and
coach's alias layer already use the corrected names.
Alternatives: keep Figma names (perpetuates "red means pink").

### DS-002 — Cool neutral ramp for text, borders and surfaces
Status: proposed · See it: /guide/color#neutrals

Text `#111827`, secondary `#6b7280`, muted `#9ca3af`, border `#e5e7eb`,
surfaces `#f9fafb`/`#f3f4f6` (dash, staff-admin, and 20 of 28 prototypes).
Legacy `#444`/`#707070`/`#9f9f9f`/`#d9d9d9` stay as `--color-gray-*` aliases
for dense tables, tab labels, and input borders. Connect's warm `#dbd6d5`
border and coach's `#444` body text are app-level aliases, not the default.
Alternatives: `#444` body text (legacy, coach); warm grays (Connect).

### DS-003 — Blue is the only action colour; teal is decorative
Status: proposed · See it: /guide/buttons

Primary buttons, links, active nav, focus rings are `--saga-blue`. Teal
`#1ececa` fails WCAG with white text (2.0:1) and is used only for accent
bars, day-type chips and data marks; legible teal text uses `--saga-teal-ink`
(`#0d7377`, 5.6:1). The teal-filled "Continue" in dash's Configure Period
modal is the inconsistency this resolves (Nathan's button-consistency board
reached the same conclusion).

### DS-004 — One danger red (clay); warning and attention are amber
Status: proposed · See it: /guide/color#status

`--color-danger` is clay `#991a21` (dash, Figma `error` alias, Nathan's
board). Pink `#ff595a` is never a status colour (coach's `--color-error` and
Connect's `--cv3-danger` both use it today; both become app-level
migrations). Warning is amber `#d97706` rather than Figma's yellow
`#f9e547`, which is illegible as text. Attention (needs-action) is `#b45309`
on `#fdf1de`, and `#d14600` is reserved for "changed / overridden" and the
bell badge, as dash already does.

### DS-005 — Neutral token names follow dash
Status: proposed · See it: /guide/color#neutrals

`--color-bg/-secondary/-tertiary`, `--color-border/-hover/-strong`,
`--color-text/-secondary/-muted/-disabled/-inverse`. Added `-strong` and
`-inverse`, which every app was inlining.

### DS-006 — One focus ring: 2px blue, 2px offset, `:focus-visible` only
Status: proposed · See it: /guide/accessibility#focus

Dash uses this ring (via `--color-brand-teal`, which is blue). Connect's
spec forbids per-component overrides; the guide adopts that rule. High
contrast widens it to 3px.

### DS-007 — Shell tokens are part of the system
Status: proposed · See it: /guide/shell-navigation

Nav width 240px, navy background, white active pill, 64px fixed-height top
bar, 15px tab labels in `#444` with blue active state. These are dash's
values; coach, Connect and staff-admin each re-implement a navy chrome and
can alias to these.

### DS-008 — Spacing is a 4px ladder: 2/4/8/16/24/32/48/64
Status: proposed · See it: /guide/spacing-layout

Dash's six steps plus `2xs` (2px, hairline gaps) and `3xl` (64px, page
sections). Figma's `xxxs…xxxl` ladder had the same values under other names.

### DS-009 — Montserrat only; one loading recipe per environment
Status: proposed · See it: /guide/typography

Font is Montserrat (every source). Bundled apps use
`@fontsource-variable/montserrat`; single-file prototypes use the Google
Fonts `<link>` with the full variable range and `display=swap`. JetBrains
Mono is the mono face when it is available, with a system fallback; no app
loads it today and the guide does not require it. Weights: 400 body,
500 emphasis, 600 headings and buttons, 700 sparingly. The Figma export has
400/500 labels swapped; the guide uses numeric weights only.

### DS-010 — Root size 15/17/19px at 1400/1800; rem tokens scale with it
Status: proposed · See it: /guide/typography#scale

Dash, legacy saga_style and design-tokens all use these steps, but dash
sets them on `body` while its `--text-*` rem tokens resolve against a 16px
`html`, so `--text-base` is 16px on a 15px page. The guide sets the step
on `html` so `1rem` equals the page's base size and the type ladder scales
with the breakpoints and with the user text-size preference (DS-020).
Connect's 16/14/18 em-based ladder stays as its Tier 3.

### DS-011 — Radius ladder 2/4/6/8/12/full; buttons 6, cards 8, modals 8
Status: proposed · See it: /guide/elevation-surfaces#radius

Dash has 4/6/8; Nathan's boards settled on 6px flat buttons and 8px modal
radius; dash's `--btn-radius: 0.25rem` (~4px) is the outlier and moves to
6px. Added `xs` (2px) and `xl` (12px) for chips and hero cards.

### DS-012 — Shadows mark elevation; buttons are flat
Status: proposed · See it: /guide/elevation-surfaces

`sm` for cards at rest, `md`/`lg` for hover and raised panels, `popover`,
`modal`, `toast` for overlays; scrims are navy at 40%/45%. Modal buttons
are flat (Nathan's board); the coach `0 4px 4px rgba(0,0,0,.25)` card shadow
is replaced by `--shadow-sm` + a hairline border. Cards get a 1px border by
default rather than dash's two-ring glow, which rendered as a blurry edge.

### DS-013 — A z-index ladder exists
Status: proposed · See it: /guide/elevation-surfaces#layering

raised 1 · sticky 100 · dropdown 200 · overlay 1000 · modal 1100 · toast
1200 · tooltip 1300. No source had one; legacy saga_style hardcoded 2, 1,
9999, 99998 and 999999.

### DS-014 — Motion tokens are dash's, unchanged
Status: proposed · See it: /guide/motion

90/150/210/300ms, 120ms fade floor, 32ms stagger, three curves. Reduced
motion zeroes movement and keeps the fade. These are the only motion values
in any current app and the motion prototype used the same numbers.

### DS-015 — Card: white, 8px radius, hairline border, `--shadow-sm`, 24px padding
Status: proposed · See it: /guide/elevation-surfaces#cards

Matches the dash screenshots (Reports, Program Config cards). Stat cards add
a 2px top edge in the primary colour by modifier, not by token.

### DS-016 — Input contract follows the legacy SAGA_INPUT mixin via dash
Status: proposed · See it: /guide/forms-inputs

Border `#d9d9d9`, hover `#9f9f9f`, focus blue, invalid clay, 6px radius,
beige italic placeholder, 2.4rem height. Disabled is light-gray fill with
dark text, never reduced opacity.

### DS-017 — Button contract
Status: proposed · See it: /guide/buttons

Flat; 6px radius; 0.5rem × 1.25rem padding (dash's 2.5rem horizontal
padding was sized for the old wide buttons and is replaced); semibold;
primary blue, secondary white with `#d9d9d9` border, quiet (borderless)
hovers to `--color-primary-light`, danger clay, affirmative green. Magenta,
orange and gray surfaces remain for legacy secondary1–3/gray but are not
recommended for new work.

### DS-018 — Scrollbar: rounded navy thumb, no arrow caps, opt-in thin style
Status: proposed · See it: /guide/elevation-surfaces#scrollbars

Dash hides arrow caps globally; the legacy mixin styled thumb/track as an
opt-in class. The guide keeps both: caps hidden everywhere, `.saga-scrollbar`
for the thin styled bar.

### DS-019 — Day-type chips: Regular = clay, Advisory = teal
Status: proposed · See it: /guide/tables-data#chips

Straight from the dash Schedule and Calendar screens.

### DS-020 — Text-size preference is a root attribute, three steps
Status: proposed · See it: /guide/accessibility#text-size

`data-text-size="large|larger"` on `<html>` scales the root by 1.3/1.7, the
same steps as Connect's a11y panel. Apps opt in by setting the attribute.

### DS-021 — High contrast remaps Tier 2 only
Status: proposed · See it: /guide/accessibility#contrast

`data-contrast="high"` on `<html>` darkens text and borders, widens the
focus ring, and deepens primary. Connect's rule applies: hardcoded hex
silently opts out, so components never hardcode.

### DS-022 — Vertical rhythm: one 16px step between blocks
Status: proposed · See it: /guide/typography#rhythm

h1 2xl/600, h2 xl/400, h3 base/600, h4 small-caps label (new), paragraphs
and lists share a 16px bottom margin, last child zero. From legacy
`text_headers_paragraphs_and_spacing.scss` and dash's layout.

### DS-023 — Violet means "prototype chrome, not proposed UI"
Status: proposed · See it: /guide/prototyping

Nathan's convention from the prototypes repo (`.ptag`, `.standin`,
`--proto` tokens) is adopted into base.css so every prototype gets it for
free.

### DS-024 — Chart series order: blue, magenta, teal, orange, pink, navy, lime, coral
Status: proposed · See it: /guide/color#data-and-chart-colours

The AI Insights screens colour a single series magenta (`#bb16a3`) and the strategy
timeline uses lime, yellow, navy, clay and gray as categorical tracks; no source
defined a multi-series order. The guide fixes one, lets a single-series chart use
magenta or blue, keeps green/clay/amber for good/bad/warning only, and makes
`--gray-400` the reference-line colour. Brand fills (pink, lime, teal) are allowed
only here and in the mark.
Alternatives: the timeline's lime/yellow/navy/clay/gray set as the general order
(three of five fail contrast as labels).

### DS-025 — In a notice, the status colour is on the icon and edge; body text is neutral
Status: proposed · See it: /guide/color#status

Amber `#d97706` on white is 3.2:1 and on `--color-warning-bg` 3.0:1; green `#20912d`
is 4.1:1 on white and 3.7:1 on its tint. Both pass the 3:1 UI threshold and fail 4.5:1
for sentences, so notice, toast and banner copy stays `--color-text` and amber text
uses `--color-attention` (5.0:1). White on the affirmative green button is also 4.1:1.
TOKEN REQUEST: a `--color-success-strong` (about `#1a7a25`, 5.5:1) for filled
affirmative buttons and success text; until then affirmative buttons keep green.
Alternatives: darken `--color-success` itself (changes every success icon).

### DS-026 — Content width caps and the under-1024 drawer
Status: proposed · See it: /guide/spacing-layout#page-layout

Dash data pages are fluid and the screenshots are 1225px wide; no source stated a
cap or a narrow-window behaviour. Data pages stay fluid (tables scroll inside their
card); forms cap at `720px`; prose at `72ch`. Under 1024px the nav becomes an overlay
drawer at `--z-overlay` behind `--modal-scrim`, the gutter drops to `--space-md`, and
there is no phone layout: Saga products run on laptops and Chromebooks.
Alternatives: a global `max-width` (wastes wide monitors on rosters); a collapsed
icon-rail nav (needs icons the guide has not specified).

### DS-027 — Two densities: comfortable 48px rows, dense 37px rows
Status: proposed · See it: /guide/spacing-layout#density

The roster grid is 37px rows in 13px `#444` (dash motion docs and screenshots); the
Schedule period list is about 48px. The guide names both, ties dense to `--text-sm` +
`--color-text-dark` and comfortable to `--text-base`, and makes density a container
class (`.saga-table--dense`), never a global setting.
Alternatives: one density (dash's roster would have to grow 30%).

### DS-028 — Tabular figures on every column of numbers, stat and clock
Status: proposed · See it: /guide/typography#numbers

No source stated it; dash's clock and stat cards use Montserrat's proportional
figures and jiggle on change. `font-variant-numeric: tabular-nums` on numeric cells,
stat values and clocks; numeric columns right-aligned; stat numbers `--text-3xl`/700
in `--color-primary` as the Surveys report shows.

### DS-029 — Radius by element class: container 8, control 6, tag 4, pill full
Status: proposed · See it: /guide/elevation-surfaces#radius

DS-011 fixed the ladder; the screenshots mix pills (tab count badges, Figma skill
chips), 4px tags ("Regular" on Edit Session) and 6px boxes. The guide assigns:
`xs` checkboxes and skeleton bars; `sm` small tags, tooltips, menu items; `md`
buttons and inputs; `lg` cards, modals, popovers, toasts; `xl` hero cards only; `full`
chips, badges, toggles, avatars, the active nav item. A child never has a larger
radius than its parent.

### DS-030 — Named motion patterns have CSS class equivalents for non-Svelte pages
Status: proposed · See it: /guide/motion#named-patterns

dash's `motion.ts` factories are Svelte-only; Connect and prototypes have nothing.
The guide defines `.pop-in`, `.overlay-in`, `.list-in` keyframe classes with the same
geometry (scale .96/4px, scale .98/8px, 6px rise, `min(--i, 6) × --motion-stagger`)
and a single reduced-motion block swapping them to a `--motion-fade` opacity fade.
The Svelte factory remains the reference implementation.

### DS-031 — No overshoot curve
Status: proposed · See it: /guide/motion#tokens

The motion prototype used `cubic-bezier(.34,1.28,.5,1)` for the nav indicator;
dash's tokens never adopted it and the guide does not add it. Three curves only.
Alternatives: add `--ease-overshoot` for the one bespoke moment (dropped frames on
Chromebooks, wrong tone).

### DS-032 — No native `title`; tooltips are a component linked by `aria-describedby`
Status: proposed · See it: /guide/accessibility#tooltips

Dash bans `title` in CI; Connect's a11y spec still recommends `title` on icon-only
buttons alongside `aria-label`. The guide follows dash: `aria-label` names the
control, the tooltip component (`role="tooltip"`, hover and focus, Escape, `--z-tooltip`)
describes it. Connect's native `title`s become an app-level migration.

### DS-033 — The focus ring on navy chrome is white
Status: proposed · See it: /guide/accessibility#focus

`--color-primary` on `--saga-navy` is 2.2:1, under the 3:1 non-text minimum, so the
one-ring rule (DS-006) would be invisible in the left nav. The nav scopes
`--focus-ring-color: var(--white)` (14.5:1); width and offset are unchanged. This is a
token override on a surface, not a second ring.

### DS-034 — i18n is opt-in per app; copy goes through `t()` where one exists
Status: proposed · See it: /guide/accessibility#language-and-i18n

Connect ships English and Spanish through `t()`; dash is English only. Requiring
`t()` everywhere would block every prototype. Rule: when the host app has `t()`,
all visible strings go through it with whole-phrase keys and `<html lang>` tracks the
locale; otherwise plain English kept in one place per component. Dates and numbers
always through `Intl`.

### DS-035 — Prototypes link the hosted CSS; self-contained files inline it with a commit line
Status: proposed · See it: /guide/prototyping#link-or-inline-the-tokens

The prototypes build copies only `.html`, so shared CSS must be an absolute URL. The
guide assumes `https://style.wootdev.com/css/{tokens,base,components}.css` (the host
named in `tokens.css`'s header; DNS is unclaimed today). Files that must stand alone
(artifacts, attachments) inline the three files in order with a first-line comment
naming the commit. Either way the page's own CSS never redefines a system token.
Alternatives: vendor the CSS into the prototypes repo (goes stale silently).

### DS-036 — A legible success green exists for text and button fills
Status: proposed · See it: /guide/color#status

White on `--color-success` (`#20912d`) is 4.08:1, under AA for button text, and
green text on the success tint is 3.7:1. `--color-success-strong` (`#1a7a25`,
5.5:1 on white) is the fill for affirmative buttons and the colour for success
text; `--color-success` stays for icons, edges and large text.

### DS-037 — Tokens added on request from the chapters, not invented in CSS
Status: proposed · See it: /css/tokens.css

`--color-warning-text`, `--nav-exit-bg`/`--nav-exit-border`,
`--nav-status-complete`, `--tab-count-*`, `--input-focus-halo`,
`--chart-1…8`/`--chart-average`/`--chart-band`/`--chart-grid`. Each replaces a
value dash was hardcoding (configure-mode exit box, caution button text, tab
count pills, the time field's inner halo, chart series). Rule going forward: a
chapter or component that needs a value the tokens lack requests a token; it
does not inline one.

### DS-050 — Top bar title is primary blue; the step name is secondary grey
Status: proposed · See it: /guide/shell-navigation#top-bar

Dash renders the program name as an `<h1>` in `--text-2xl` semibold
`--color-primary`; Nathan's boards and legacy saga_style use navy for h1.
The guide keeps blue in the shell (it is in every screenshot and ties the
title to the active nav pill) and leaves navy for the immersive header strip
and for marketing. In configure mode the step name follows in
`--color-text-secondary` with the step badge as the divider, no dot.
Alternatives: navy title (boards).

### DS-051 — Add glyph: the filled blue disc marks an Add action and nothing else
Status: proposed · See it: /guide/buttons#the-add-pattern

Dash uses a white-plus-on-blue disc for Add Student, Add period and Add New
Program, and a plain plus in the dashed Add Day Type tile and "+ Filter".
Nathan's board offered "branded disc for primary Add, plain + for
dense/secondary" versus "plain + everywhere". The guide takes the first:
disc (`add-circle-rounded` in `--color-primary`) on any Add button or link,
plain plus inside dashed placeholder tiles and chips. The disc never
appears on a non-Add action.

### DS-052 — Icon-only buttons carry aria-label plus a painted tooltip; disabled reasons are visible text
Status: proposed · See it: /guide/buttons#icon-only

From the CI guard `ensure-no-native-title.js` and StandardButton's
`ariaDescribedby` note: native `title=` is invisible in a tab share and has
no keyboard path, and a disabled button fires no events a tooltip could use.
So: every icon-only control has an `aria-label` and a Tooltip; a disabled
button's reason is visible text pointed to by `aria-describedby`, or the
button stays enabled with `aria-disabled` and explains on click.

### DS-053 — Segmented toggle: pressed segment is filled primary on a grey track
Status: proposed · See it: /guide/buttons#segmented-toggles

The Surveys report (Overall Summary / Individual Report) shows the pressed
segment as a `--color-primary` fill with white text on a `--color-bg-tertiary`
track. The roster "Show Bulk Actions" toggle is the inverse (filled at rest,
light blue when on). The guide adopts the Surveys form for segmented
controls (`aria-pressed`) and keeps the single mode-toggle button as a
separate pattern that goes `--color-primary-light` while on.

### DS-054 — Modal footer order: Cancel, Save, then Delete isolated by a wider gap
Status: proposed · See it: /guide/buttons#groups-and-modal-footers

The Edit Session modal shows Cancel (secondary), Save (primary), Delete
(danger) right-aligned in that order. Connect's `modal.ts` right-aligns
actions and never auto-activates a danger button on Enter. The guide keeps
the order and adds a `--space-lg` gap before Delete so it cannot be hit when
reaching for Save. Alternatives: Delete at the far left (common elsewhere,
but no Saga screen does it).

### DS-055 — Modal title is `--text-lg` semibold; scrim is 40% navy by default
Status: proposed · See it: /guide/modals-toasts-notices#modal

Dash's Modal uses a 16px / 700 title and a 45% scrim; ConfirmDialog uses
40%; Connect uses `--cv3-text-2xl` / 600 and 55% with a blur. The guide
picks `--text-lg` at `--weight-semibold` (700 is "sparingly" per DS-009) and
`--modal-scrim` (40%) for all overlays, with `--modal-scrim-strong` reserved
for a page-level modal over a busy screen. No backdrop blur.

### DS-056 — Toast variants recolour the accent edge only; the fill stays navy
Status: proposed · See it: /guide/modals-toasts-notices#toasts

Dash and Connect both render a navy toast with a teal left accent, and dash
adds an amber "attention" tone by swapping the border colour. The brief asks
for success / warning / danger modifiers. Rather than introduce green, amber
and red toast fills (which would read as alerts, not toasts), the modifiers
change the accent: `--color-success`, `--nav-attention-bg`, `--color-danger`.
The dwell, stack-of-three, eviction and ×1.75 reduced-motion rules are
copied from the two implementations unchanged.

### DS-057 — Tooltip surface: white, `--color-border-strong` hairline, `--shadow-md`, 8px radius
Status: proposed · See it: /guide/modals-toasts-notices#tooltips

Dash's Tooltip uses a warm `#c6beb8` border and a custom shadow; its filled
variant is blue. The guide maps the border to `--color-border-strong` and the
shadow to `--shadow-md`, keeps the 8px radius and the `--motion-fade`
entrance, and keeps the filled (`--color-primary`) variant for the info-icon
trigger. The tooltip layer is `--z-tooltip`, above modals, per WCAG 1.4.13.

### DS-058 — Status pills are outlined; only day-type chips are filled
Status: proposed · See it: /guide/tables-data#chips

Dash's current status pills vary (a light-blue filled "In Progress" with a
dot; a bordered "Not Started"). The Figma Session Viewer comp uses outlined
pills throughout, with the selected one inverted to a navy fill. The guide
adopts the outlined form for status and the navy inversion for selection,
and keeps the filled clay / teal day-type chips (DS-019) as the only filled
chips.

### DS-059 — Chart series colours: magenta first, then blue, teal, orange; averages grey
Status: **overturned → DS-024** (blue first; both chapters now use the `--chart-1…8` tokens; AI Insights' magenta-first chart is a domain choice, not the default) · See it: /guide/tables-data#charts

The AI Insights scatter uses magenta dots; the Figma comp uses pink dots;
the Coaching wireframe uses black (placeholder). The guide sets the first
series to `--saga-magenta` (legible on white, matches the shipped chart),
then `--color-primary`, `--color-teal`, `--saga-orange`; the group average
line is `--color-text-muted`; alternating group bands are
`--color-bg-tertiary`. Pink stays off charts except as the glow marker.

### DS-060 — Radio selected state is primary blue, not teal
Status: proposed · See it: /guide/forms-inputs#checkbox-radio-toggle

Core-ui's RadioGroup fills the selected radio with `--saga-teal`; the
option-card radios in the Schedule and Configure Period screens are blue.
Teal is decorative only (DS-003), so the guide makes the selected radio, the
checkbox check and the toggle track all `--color-primary`.

### DS-061 — Time ranges: spaced en dash, meridiem once when shared; durations "50m" in tight spaces
Status: proposed · See it: /guide/voice-writing#numbers-dates-and-times

The Schedule list shows "8:00 – 8:50 AM" (spaced dash, AM once); the
Configure Period table shows "9:00 AM – 9:50 AM"; core-ui's `<Time>` renders
a compact "1:05–1:50 PM"; the time picker annotates "30 min" / "1 hr 15 min".
The guide standardises on the spaced en dash with the meridiem once when
both ends share it, compact "50m" / "1h 15m" in cells and readouts, and the
longer "50 min" form only in picker lists. Existing compact `<Time>` output
is a Tier 3 app choice until it is migrated.

### DS-062 — Table header: `--color-bg-tertiary` fill, semibold, one hairline weight
Status: overturned → DS-122 (fill is `--color-bg-secondary`) · See it: /guide/tables-data#data-tables

The roster grid and the Configure Period table agree on a light grey header
and 1px borders; some legacy tables use a 2px rule under the header. The
guide fixes one hairline (`1px --color-border`) for every line in a table
and reserves a 2px rule for the page-tab baseline only.

### DS-063 — Icon set is Material Symbols Light, outlined rounded, via iconify; CDN web component for prototypes
Status: proposed · See it: /guide/iconography

Dash-icons and cv3-icons both generate from `@iconify-json/material-symbols-light`
(cv3 adds a few Fluent, MDI and Iconamoon glyphs for AV controls). The user
agreed on the set; the guide fixes the variant string (`-outline-rounded`
where offered), the `iconify-icon` 2.3.0 CDN tag for single-file
prototypes, the 1.2em / 2em / 3em sizes from `sdt-icon.css`, and
`currentColor` only. The brand marks are artwork and keep their own hexes.

### DS-064 — Required fields are unmarked; optional fields say "(optional)"
Status: proposed · See it: /guide/forms-inputs#required-read-only-disabled

No Saga screen marks required fields with an asterisk, and most fields are
required. The guide makes "required" the default and marks the exception,
with a one-screen rule against mixing the two schemes.

### DS-065 — Sentence case for buttons and headings; Title Case for field labels only
Status: proposed · See it: /guide/voice-writing#casing

The UI writing guide sets this; the current dashboard still ships Title Case
buttons ("Add Student", "Upload Roster", "Show Bulk Actions"). The guide
adopts the writing guide's rule for new work and treats the existing buttons
as a migration, not a precedent.

### DS-100 — Advisory chip text is `--color-text` on teal, not white
Status: proposed · See it: /showcase/cards-tables/#chips

`--chip-advisory` is `--saga-teal` (DS-019), and white on teal is 2.0:1.
Dash renders white anyway; the component layer uses `--color-text` (9.6:1)
so the chip survives the high-contrast remap and the text-size preference.
Regular (clay) keeps white text (7.4:1).
Alternatives: switch the chip fill to `--color-teal` (ink teal) with white
text — rejected because it breaks the calendar's visual match with dash.

### DS-101 — Select is a styled wrapper with a CSS triangle chevron
Status: proposed · See it: /showcase/forms/#select

`.saga-select` wraps either a native `<select>` (appearance:none) or a
`button.saga-select__trigger`; the blue chevron is a border-drawn triangle
on `::after` so it is pure CSS, scales in em and needs no icon font. The
custom listbox (`__menu`, `__option[aria-selected]`, `__search`, `__footer`)
is styled now and wired by JS later; it mirrors dash's program picker.
Alternatives: inline SVG background-image (hardcodes the colour, opts out
of high contrast).

### DS-102 — Toast surface is `--nav-bg` navy with a coloured left edge
Status: proposed · See it: /showcase/overlays/#toasts

Dash's toast is navy with a 2px teal border and 8px left accent; Connect's
is navy-on-navy with a 10px teal rule. The layer keeps navy (the one dark
chrome colour in the system) with a `--space-xs` left edge whose colour is
the tone (`--color-success|warning|danger`, default `--color-accent`), no
outer border, `--radius-md`, `--shadow-toast`. Bottom-right stack per the
brief (dash and Connect both centre bottom). No token names a dark surface
so the toast reads `--nav-bg`; see the token request below.
Alternatives: light toast with coloured border (looks like a notice).

### DS-103 — Nav active pill is `--radius-full`, not `--radius-md`
Status: proposed · See it: /showcase/shell/

The brief said `radius-md`; dash's `.nav-link` and the Rosters screenshot
use a fully rounded pill, and DS-007 calls it "white active pill". The CSS
follows the shipped product. Configure-mode items (`.saga-nav--configure`)
drop to `--radius-sm` as dash's mode-step links do.

### DS-104 — Chips are pills by default, `--square` for day-type markers
Status: proposed · See it: /showcase/cards-tables/#chips

The Figma comp's skill chips and dash's status chips are pills; the
calendar's "Regular / Advisory" markers are 2px-radius rectangles. Default
is `--radius-full`; `.saga-chip--square` gives `--radius-xs` for the
calendar and schedule rows.

### DS-105 — Input border is 1px, not dash's 2px
Status: proposed · See it: /showcase/forms/

DS-016 fixes the colours but not the width. `SagaInput.svelte` uses 2px;
every screenshot (Edit Session, Configure Period, Rosters search) renders a
hairline. 1px keeps the field quiet next to the 2px focus ring.

### DS-106 — Quiet icon buttons are gray; quiet text buttons are blue
Status: proposed · See it: /showcase/buttons/#icon-only

`.saga-btn--quiet` is blue text with a `--color-primary-light` hover (DS-017).
When combined with `--icon` (top bar, table action column) it is
`--color-text-secondary` with a `--color-bg-tertiary` hover, as dash's
TopBar and roster rows render. An icon button that should read as an
action uses `--secondary` or the filled default instead.

### DS-107 — Disabled secondary and dashed buttons keep a white fill
Status: proposed · See it: /showcase/buttons/#states

Disabled is a fill, never opacity (DS-016/017). Filled variants take
`--btn-surface-disabled`; the outlined variants (`--secondary`, `--dashed`)
would lose their shape under a gray fill, so they keep `--color-bg` and
take the disabled colour on the border and text instead.

### DS-108 — Loading buttons keep their size and hide the label
Status: proposed · See it: /showcase/buttons/#states

`[data-loading]` sets the text transparent and draws a 1em ring on
`::after` in the variant's text colour, so the button neither reflows nor
changes colour. The spin runs at `calc(--motion-slow * 3)`; under reduced
motion the ring is static but still visible, which is the intent.

### DS-109 — Steps header numbers from a CSS counter
Status: proposed · See it: /showcase/overlays/#steps

`.saga-step__num` left empty renders `counter(saga-step)`; put a check icon
or digit inside to override. Active is `aria-current="step"` (white
surface, blue 2px bottom edge, blue circle); finished is `data-complete`
(green circle); pending is gray on `--color-bg-secondary`, matching the
Configure Period modal.

---

## Token requests (not added; nearest token used)

- `--color-surface-inverse` (dark surface for toasts and tooltips) — using
  `--nav-bg`. Tooltip and toast both read navy via a shell token.
- `--nav-status-complete` (light green check on navy, dash uses `#9fe0b8`)
  — using `--color-success`, which is low-contrast on navy.
- `--border-width-emphasis` (2px: stat-card top edge, checkbox tick stroke,
  spinner ring, avatar-group ring) — literal `2px` in four places.

### DS-110 — Inverse surface and emphasis border width are tokens
Status: proposed · See it: /css/tokens.css

`--color-surface-inverse` (navy) is the dark surface for toasts and tooltips so
they stop borrowing `--nav-bg`; `--border-width-emphasis` (2px) is the one
non-hairline border (stat-card top edge, checkbox tick, spinner ring, avatar
ring). Configure-mode check marks use `--nav-status-complete`.

### DS-111 — Chart neutral and reference tokens
Status: proposed · See it: /showcase/cards-tables/#charts

`--chart-neutral` (`--gray-legacy-light`, `#d9d9d9`) is the remainder or
"not yet" segment behind a bar or ring; `--chart-reference` (`--gray-700`,
`#374151`) is a target or threshold mark. The two are separate from
`--chart-average` (gray-400) because an average sits on white at 2.5:1,
which is fine for a rule, while a reference mark has to stay 3:1 over the
neutral track and the gray period bands, which gray-400 does not (about
1.6:1). Prototypes were painting both with `--chart-average` or inventing
grays; the gate reports asked for the pair.
Alternatives: one `--chart-muted` for both (fails on the track).

### DS-112 — `--color-warning-strong` for white-on-amber fills
Status: proposed · See it: /showcase/buttons/#variants

`--color-warning` (`#d97706`) under white text is 3.2:1, so the chapter's
amber caution button and the attendance "Tardy" mark could not be built
without a hex. `--color-warning-strong` is `#b45309` (4.6:1 under white,
the same value as `--color-attention` but named for its job as a fill).
`.saga-btn--caution` uses it; `--color-warning` stays the icon, edge and
border amber (DS-004/025).
Alternatives: alias `--color-attention` directly (the attention token is
text-and-icon semantics; a later retune of one should not move the other).

### DS-113 — Pressed buttons: quiet wash for a mode, status fill for a mark
Status: proposed · See it: /showcase/buttons/#pressed-and-status

`.saga-btn[aria-pressed="true"]` is the quiet-hover wash with
`--color-primary` semibold text, which is what buttons.md described for
"Show Bulk Actions" and the CSS lacked. `.saga-btn--status` is the
attendance-style toggle: secondary outline at rest, and pressed it fills from
`--_status` (default `--color-primary`) with white text so a row of marks
reads by meaning. `--_status` is an instance hook, like `--_edge` on toasts;
callers keep it to fills that pass 4.5:1 under white.
Alternatives: one modifier per status (`--present`, `--absent`), rejected as
product vocabulary in a component layer.

### DS-114 — Confirm dialogs are 440px; the default modal is 640px, centred
Status: proposed · See it: /showcase/overlays/#confirm-dialog

`.saga-modal--confirm` is `min(440px, 100%)`, the width the chapter already
named. The chapter's "default 560 / large 900, top-aligned with a 4vh gap"
was the prototype convention; the CSS and showcase ship 640 / 960 and centre
the card in the scrim with `margin: auto`, and a tall modal scrolls its body
inside `92vh` rather than growing, so the jump the top-alignment rule guarded
against does not happen. The chapter now matches the CSS.

### DS-115 — Toast stack is bottom-right (confirming CSS over the chapter)
Status: proposed · See it: /showcase/overlays/#toasts

The chapter said bottom centre with an 8px edge, `--radius-lg`, semibold
text and buttons under the message; DS-102 and the CSS ship bottom-right,
a `--space-xs` (4px) edge, `--radius-md`, medium weight and a one-row layout
with the action pill and ✕ inline. Bottom-right keeps the stack clear of a
modal's footer buttons and of the Session Viewer's centred controls. The
chapter now matches the CSS; `.saga-toast-stack--local` pins the stack to a
frame instead of the window.

### DS-116 — Checkbox and radio fill blue when checked (confirming CSS)
Status: proposed · See it: /showcase/forms/#checkbox-radio-toggle

The chapter described a white box with a blue check and a 2px ring radio at
em sizes; the CSS draws both at `--space-md` with a 1px border and fills them
`--color-primary` with a white mark when checked (DS-060 for the radio). The
filled state survives the high-contrast remap and reads at 16px where a
thin blue check does not. The toggle is 36 × 20px with a `--space-md` knob
inset `--space-2xs`. The chapter now matches the CSS.

### DS-117 — Painted select in product UI; native `<select>` only in prototypes
Status: proposed · See it: /showcase/forms/#select

Product UI renders `.saga-select > .saga-select__trigger` with the
`.saga-select__menu` listbox and never a native `<select>` (the dash CI guard
already enforces this). A native `<select>` inside `.saga-select` keeps the
same box and caret (DS-101) and is acceptable only in a prototype where the
dropdown's behaviour is not the point; it is labelled as a stand-in and
replaced by `SelectMenu` on hand-off. The showcase's primary select demo is
now the painted trigger; the native one is a marked fallback. The option
class works on the `<li>` or a `<button role="option">` inside it, with
`data-active` for the keyboard row and `.is-placeholder` on the trigger.

### DS-118 — Framed shell, local overlays, and the layout helpers
Status: proposed · See it: /showcase/overlays/#confirm-dialog

`.saga-shell--framed` makes the shell fill a positioned parent (height 100%,
`position: relative`, clipped) instead of `100vh`, so a decision-board scene
or a preview can hold a whole dashboard; `.saga-scrim--local` and
`.saga-toast-stack--local` are `position: absolute` so overlays stay inside
that frame. A native `<dialog>` always goes to the top layer, so a framed
scene uses the `div` modal. Alongside: `.saga-grid` (`--2/--3/--4`,
`--stats` auto-fit at 220px with `.stat-grid` as an alias, `--lg` gap),
`.saga-list` row stacks (`--edge` 3px meaning edge from `--_edge`, `--ghost`
dimmed by colour not opacity), `.saga-empty` and `.saga-card--empty`,
`.saga-card__title-row`, `.saga-table tfoot`, `.saga-select--inline/--sm`,
`.saga-notice--notice`, and `.saga-link` — all things the three rebuilt
prototypes had each written by hand.

### DS-119 — Minimal chart primitives: bar, stacked bar, mark, axis, legend
Status: proposed · See it: /showcase/cards-tables/#charts

`.saga-bar` is a 14px `--chart-neutral` track with `--radius-xs`;
`.saga-bar__fill` takes `--value` for width and `--_c` for colour (default
`--chart-1`); `.saga-bar--stacked` lays fills side by side with a hairline
between; `.saga-bar__mark` is a `--chart-reference` tick at `--value`;
`.saga-axis` is the `--text-xs` secondary label row; `.saga-legend` pairs a
10px `--_c` swatch (`--line` for rules) with a label. Enough for completion,
attendance and survey bars without a chart library; anything with axes and
series stays in the app's charting code on the `--chart-*` tokens.

### DS-120 — Tooltip is white by default (dash core-ui); filled variant for emphasis
Status: proposed · See it: /showcase/overlays/#tooltip

The component layer had shipped a navy `--text-xs` bubble on
`--color-surface-inverse`; dash's real core-ui Tooltip is white with a warm
hairline (`#c6beb8`, nearest `--color-border-strong`), 8px radius,
`--shadow-md` and `--text-sm`, with a filled primary variant for the
info-icon trigger, which is what DS-057 and the chapter described. The CSS
now matches: `.saga-tooltip` white and bordered, `.saga-tooltip--filled`
primary blue with white text, `.saga-tooltip--rich` left-aligned with a
semibold `.saga-tooltip__title`. `--color-surface-inverse` (DS-110) remains
the toast surface only.

### DS-121 — Skeletons shimmer (confirming CSS over the chapter)
Status: proposed · See it: /showcase/feedback/#skeleton

tables-data.md said a skeleton pulses opacity and "never a sliding shimmer";
the CSS, the feedback showcase and dash's `Skeleton` all run a slow
left-to-right `--color-border` band over `--color-bg-tertiary`
(`calc(--motion-slow * 5)`), static under reduced motion. The shimmer is
movement on a background position, not opacity, and the chapter's opacity
pulse would have failed the "no fading disabled-looking content" reading of
DS-016. The chapter now matches the CSS.

### DS-122 — Table header fill is `--color-bg-secondary` (overturns DS-062)
Status: proposed · See it: /showcase/cards-tables/#table

DS-062 named `--color-bg-tertiary`; the CSS, the shell showcase and
spacing-layout.md all use `--color-bg-secondary` (`#f9fafb`), one step
lighter, so the header reads as part of the white card rather than a grey
band, and `--color-text-secondary` keeps 4.5:1 on it (it is 4.4:1 on
tertiary, color.md). tables-data.md now matches.
