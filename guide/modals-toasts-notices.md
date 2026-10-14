---
title: Modals, toasts and notices
order: 140
summary: Overlays and feedback, the modal and confirm dialog, the toast stack, the three-level notice pattern, popover menus, tooltips, and inline impact signals.
---

Saga has one way to interrupt (the modal), one way to inform without
interrupting (the toast), and one shared vocabulary for telling an admin that
an edit reached past the screen (notice, warning, confirmation). This chapter
is the look and the behaviour contract for each; the vanilla primitives in
Saga Connect (`modal.ts`, `toast.ts`, `popover-menu.ts`) and the dashboard's
core-ui components implement the same contract.

## Modal

A modal is a white card on a navy scrim, mounted when open and removed when
closed. The host decides when; the modal only reports a close request.

| Part | Treatment |
|---|---|
| Scrim | `--modal-scrim` (navy at 40%), full viewport, `--z-overlay`; fades in over `--motion-fade` |
| Card | `.saga-modal`: white, `--radius-lg` (8px), `--shadow-modal`, `--z-modal`; enters with `.overlay-in` (98% scale and an 8px rise over `--motion-base`), fade only under reduced motion |
| Sizes | default `640px`; `.saga-modal--confirm` `440px`; `.saga-modal--large` `960px`; `.saga-modal--fullscreen` fills the viewport with no radius. All cap at `100%` width and `92vh` height |
| Position | vertically and horizontally centred in the scrim (`margin: auto`); the body scrolls inside the card so a modal that grows past `92vh` does not jump |
| Header | `.saga-modal__header`: `.saga-modal__title` in `--text-lg` `--weight-semibold` `--color-text`, a quiet ✕ icon button (`.saga-modal__close`) at the right, `--space-md --space-lg` padding, 1px `--color-border` rule below |
| Body | `.saga-modal__body`: `--space-lg` padding, scrolls on its own when tall |
| Footer | `.saga-modal__footer`: `--space-md --space-lg` padding, `--color-bg-secondary` fill with a hairline above; buttons `--space-sm` apart, right-aligned inside `.saga-modal__footer-end` (see [buttons](buttons.md#groups-and-modal-footers)) |

Behaviour, all of it required:

- `role="dialog"`, `aria-modal="true"`, labelled by the title.
- Focus moves into the dialog on open (the primary button, else the first
  control) and returns to the opener on close.
- Tab is trapped inside; Shift+Tab from the first control wraps to the last.
- Esc closes. Clicking the scrim closes. Both are the same as pressing
  Cancel: nothing is saved.
- Enter on the dialog itself activates the primary button, but a danger
  button is never activated by Enter; it must be clicked or tabbed to.
- Body scroll is locked while open.
- One modal at a time. A confirm dialog may sit over a modal (below).

**Multi-step modals** (`dashboard_configure_period.png`) put the step strip
(`.saga-steps > .saga-step`) directly under the header, full width: each step
is a numbered `--space-lg` circle (`.saga-step__num`, counted by CSS when
left empty) and a label. The current step (`aria-current="step"`) has a
`--color-primary` filled circle with a white digit and a 2px blue underline
across its whole segment; completed steps (`data-complete`) show a check in a
`--color-success` circle; future steps are grey on a `--color-bg-secondary`
band (DS-109). The title row reads "Period 2 | Configure Period" with the
subject in blue (`<em>` inside `.saga-modal__title`) and the task in
`--color-text`. The footer holds Cancel and Continue; the last step's primary
says what it does.

Prefer a native `<dialog class="saga-modal">`: `showModal()` gives the scrim
through `::backdrop`, focus trapping and Esc for free. The same classes work on
a `div` inside `.saga-scrim` when the dialog must stay in the page's stacking
context (a framed shell, a prototype scene); then `.saga-scrim--local` covers
the nearest positioned ancestor instead of the viewport.

```html
<dialog class="saga-modal" id="edit-session" aria-labelledby="m1">
  <form method="dialog" style="display: contents">
    <div class="saga-modal__header">
      <h2 class="saga-modal__title" id="m1">Edit Session</h2>
      <button class="saga-btn saga-btn--quiet saga-btn--icon saga-modal__close" aria-label="Close" value="cancel">
        <iconify-icon icon="material-symbols-light:close-rounded"></iconify-icon>
      </button>
    </div>
    <div class="saga-modal__body">...</div>
    <div class="saga-modal__footer">
      <div class="saga-modal__footer-end">
        <button class="saga-btn saga-btn--secondary" value="cancel">Cancel</button>
        <button class="saga-btn saga-btn--primary" value="save">Save</button>
      </div>
    </div>
  </form>
</dialog>
```

## Confirm dialog

A confirm is a small modal (`.saga-modal.saga-modal--confirm`, 440px) with a
question for a title, one short paragraph in `--color-text-secondary`, and
two buttons. It uses `role="alertdialog"`. The safe button (Cancel, Never
mind) is focused on open, not the confirming one.

| Variant | Confirm button | Extra |
|---|---|---|
| Danger | `.saga-btn--danger`, labelled with the verb and noun: "Delete session", "Yes, cancel this session" | default |
| Neutral | `.saga-btn--primary` | for a non-destructive but weighty step |
| Caution | `.saga-btn--caution`: `--color-warning-strong` amber with white text (`--color-warning` itself is 3.2:1 under white, DS-112) | a `--space-xs` `--color-warning-border` top edge on the card; "allowed, but this has consequences" |

When the confirm is about losing things, the body is a **loss ledger**: a
bulleted list naming each thing that will be removed ("Pods in Group 202:
3"), so the admin reads exactly what goes. A confirm mounted inside another
modal scrims only that modal's card, not the whole page: a
`.saga-scrim.saga-scrim--local.saga-scrim--strong` inside the positioned
modal card.

```html
<div class="saga-modal saga-modal--confirm" role="alertdialog" aria-modal="true" aria-labelledby="c1" aria-describedby="c1-body">
  <div class="saga-modal__header"><h2 class="saga-modal__title" id="c1">Delete this session?</h2></div>
  <div class="saga-modal__body"><p class="text-secondary" id="c1-body">Students will lose their place in Pod 6. This cannot be undone.</p></div>
  <div class="saga-modal__footer">
    <div class="saga-modal__footer-end">
      <button class="saga-btn saga-btn--secondary" autofocus>Cancel</button>
      <button class="saga-btn saga-btn--danger">Delete session</button>
    </div>
  </div>
</div>
```

## Toasts

A toast is a short, non-blocking message in a stack at the bottom-right of
the window (`.saga-toast-stack`, `--space-lg` from both edges; DS-115).
It is for things that happened elsewhere or already happened: "Roster
uploaded", "2 students are waiting in Pod 6". It is never a form error and
never a question that needs an answer.

Look:

- `.saga-toast`: a navy `--color-surface-inverse` card, white text at
  `--text-sm` `--weight-medium`, `--radius-md`, `--shadow-toast`, the stack
  up to 26rem wide.
- A 4px (`--space-xs`) colored left edge and no outer border. Variants
  recolor only this edge and the icon: `--success` to `--color-success`,
  `--warning` to `--color-warning`, `--danger` to `--color-danger`; the
  default edge is `--color-accent` teal. The fill stays navy so the stack
  reads as one family (DS-102).
- One row: an optional `.saga-toast__icon` in the edge color, the
  `.saga-toast__msg`, an optional pill `.saga-toast__action` (outlined white),
  then the `.saga-toast__close` ✕ at the end.
- Enters with a `--space-sm` rise over `--motion-base` plus a `--motion-fade`
  fade; leaves (`.is-leaving`) by fading over `--motion-fade`.

Behaviour:

- The stack holds at most **three**. The newest sits closest to the bottom
  edge. A fourth evicts the oldest non-persistent toast; a persistent toast
  is evicted only when all three are persistent.
- Dwell is `3500ms + 50ms per character`, clamped to 4 to 15 seconds, and
  multiplied by **1.75** under reduced motion so slower readers keep it.
- `persistent` disables the timer; the ✕ or an action still closes it.
- A toast shown with the same `key` as one already up replaces it in place.
- The stack is one `role="status"` `aria-live="polite"` region; inserting a
  toast is the announcement. Toasts never steal focus.

```html
<div class="saga-toast-stack" role="status" aria-live="polite">
  <div class="saga-toast saga-toast--success">
    <span class="saga-toast__icon"><iconify-icon icon="material-symbols-light:check-circle-outline-rounded"></iconify-icon></span>
    <span class="saga-toast__msg">Roster uploaded. 55 students added.</span>
    <button class="saga-toast__action">View roster</button>
    <button class="saga-toast__close" aria-label="Dismiss"><iconify-icon icon="material-symbols-light:close-rounded"></iconify-icon></button>
  </div>
</div>
```

Inside a framed shell or a prototype scene the stack is
`.saga-toast-stack--local`, pinned to the frame's corner instead of the
window's.

## Notices, warnings and confirmations

When an action touches something the admin cannot see (a student already in
another pod this period, a tutor in a sibling group, a rotation change that
would wipe another group's pods), the response is one of three levels. The
situation picks the level, not the kind of collision.

| Level | Ask | Looks like | Interrupts | a11y |
|---|---|---|---|---|
| Notice | allowed, usually worth avoiding | bare `.saga-notice` (`--notice` is an accepted alias): `--color-notice-bg` fill, 1px `--color-notice-border`, text `--color-text`, blue family | passive, dismissible | `role="status"`, polite |
| Warning | a real collision they probably did not intend | `.saga-notice--warning`: `--color-warning-bg`, `--color-warning-border`, amber family | prominent, non-blocking, offers a fix | `role="status"`, polite |
| Confirmation | destructive or irreversible | the danger confirm dialog above, in `--color-danger` | blocks until answered | `role="alertdialog"`, focus trapped |

Ask in order: destructive? then confirmation. A collision they did not mean?
then warning. Allowed but avoidable? then notice. When unsure pick the lower
level; escalate only for destruction.

The levels are the modifier: bare (notice), `--warning`, `--danger`,
`--success`, plus `--attention` for a standing problem (below). Inline
notices are anchored next to the thing that was just touched, not in a global
corner: `--radius-md`, `--space-sm --space-md` padding, `--text-sm`, flat (no
shadow; the tint and border are the surface), up to 560px wide, with a ✕
(`.saga-notice__dismiss`) at the right. They carry their response as inline
links (`.saga-notice__action`) in `--color-primary` semibold underline:

- **Remediate in place**: "Maya Ellis is also in another pod this period.
  Remove from Rotation 2?" The scope word is the link.
- **Reveal**: a link that navigates to the off-screen thing.
- **Proceed** and **Cancel** exist only on a confirmation.

Dismissing a notice hides it; it does not resolve the condition, and the same
placement does not re-prompt. Two or more notices about the same subject
collapse into one summary line with a "Review" expander.

```html
<div class="saga-notice saga-notice--warning" role="status">
  <span class="saga-notice__icon"><iconify-icon icon="material-symbols-light:warning-outline-rounded"></iconify-icon></span>
  <div class="saga-notice__body">Maya Ellis is also in another pod this period. <button class="saga-notice__action">Remove from Rotation 2?</button></div>
  <button class="saga-btn saga-btn--quiet saga-btn--icon saga-btn--sm saga-notice__dismiss" aria-label="Dismiss"><iconify-icon icon="material-symbols-light:close-rounded"></iconify-icon></button>
</div>
```

A **standing problem** the admin did not just cause (a pod with no tutor
after a roster sync) is not a toast. It is counted in the notification bell
and shown quietly in its own context when the admin arrives, with an amber
glow on the affected rows.

## Popover menus

A kebab or caret opens an anchored menu (`.saga-popover`): white, 1px
`--color-border`, `--radius-md`, `--shadow-popover`, `--z-dropdown`, 12 to
20rem wide, `--space-xs` vertical padding. Items (`.saga-popover__item`) are
2.25rem rows with an optional 1.2em icon, `--text-sm`, hover
`--color-bg-tertiary`; a danger item (`data-danger`) is `--color-danger` text
with a faint danger wash on hover; a divider (`.saga-popover__divider`) is a
1px `--color-border` rule. The menu prefers bottom-end placement and flips when it would overflow.

Keyboard: focus lands on the menu container (nothing pre-selected), arrows
move, Enter or Space picks, Esc and outside click close, Tab wraps. A
disabled item that the user may still want to understand stays clickable with
`aria-disabled` and explains itself on click.

## Tooltips

Tooltips are painted DOM; `title=` is never the only mechanism (DS-123). A
native tooltip is composited outside the tab and vanishes in a tab share, has
no keyboard path, and its timing cannot be controlled, so `title` may ride
along as a harmless extra but carries the description on its own only in a
prototype or where no tooltip component exists.

- Panel (`.saga-tooltip`): white, 1px `--color-border-strong`,
  `--radius-lg`, `--space-sm` by 10px padding, `--text-sm`, `--shadow-md`,
  `--z-tooltip`, fades in over `--motion-fade`; this is dash's core-ui
  Tooltip (DS-057, DS-120). `.saga-tooltip--filled` uses `--color-primary`
  fill with white text for the info-icon case. `.saga-tooltip--rich` is
  left-aligned and a little wider (20rem) for a two-line hint whose first line
  is a `.saga-tooltip__title` in semibold (a student's full name over their
  pod and period).
- Trigger: hover and keyboard focus both open it; Esc, blur and outside tap
  close it without moving focus. The panel gets `role="tooltip"` and the
  trigger `aria-describedby` while open.
- The **info-icon trigger** is a 16px `info-outline-rounded` glyph in
  `--color-primary` next to a heading ("Define Tutoring Patterns ⓘ"). It is a
  real button with an `aria-label`.
- A truncation tooltip (full name over an ellipsized cell) shows only when
  the text is actually clipped.
- Content is plain text or a small snippet: a sentence, a shortcut, a full
  name. No forms, no links that need a click.

## Inline impact signals

The non-blocking rungs (notice and warning) rendered inline are **impact
signals**. They are the same element as the notice above with one more rule:
the consumer supplies the message and marks its remediation buttons so they
share the link style. A signal that stages a change (the student is removed
when you save, not now) says so and offers Undo in the same line. Save is
held behind a "Review overlaps 2" button until the admin has looked, and the
held button stays focusable so it can explain why.

## Do and don't

Do

- Focus the safe action in a confirm; make the user reach for Delete.
- Keep toasts to one sentence plus one action.
- Anchor notices to the row or chip they are about.

Don't

- Don't open a modal from a modal; use a confirm dialog or a step.
- Don't use a toast for an error the user must fix; put it on the field.
- Don't render every level amber; a notice is blue, a warning amber, a
  confirmation clay.
- Don't use `alert()`, and don't let `title=` be a control's only name or
  only tooltip.
