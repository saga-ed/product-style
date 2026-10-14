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
| Card | white, `--radius-lg` (8px), `--shadow-modal`, `--z-modal`; pops in from 96% scale over `--motion-base` `--ease-emphasized`, fade only under reduced motion |
| Sizes | default `560px`; large `900px`; fullscreen fills the viewport with no radius. All cap at `100%` width and `92vh` height |
| Position | top-aligned with a `4vh` gap, not vertically centred, so a modal that grows does not jump |
| Header | title in `--text-lg` `--weight-semibold` `--color-text`, a quiet ✕ icon button at the right, `16px 22px 12px` padding, 1px `--color-border` rule below |
| Body | `14px 22px 18px` padding, scrolls on its own when tall |
| Footer | right-aligned buttons, `--space-sm` apart, `12px 22px` padding, `--color-bg-secondary` fill with a hairline above (see [buttons](buttons.md#groups-and-modal-footers)) |

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
directly under the header, full width: each step is a numbered 24px circle
and a label. The current step has a `--color-primary` filled circle with
white digit and a 3px blue underline across its whole segment; completed
steps show a check in a blue-ringed circle; future steps are grey on a
`--color-bg-tertiary` band. The title row reads "Period 2 | Configure Period"
with the subject in blue and the task in `--color-text`. The footer holds
Cancel and Continue; the last step's primary says what it does.

```html
<div class="saga-scrim"></div>
<div class="saga-modal" role="dialog" aria-modal="true" aria-labelledby="m1">
  <header class="saga-modal__header">
    <h2 id="m1">Edit Session</h2>
    <button class="saga-btn saga-btn--quiet saga-btn--icon" aria-label="Close">
      <iconify-icon icon="material-symbols-light:close-rounded"></iconify-icon>
    </button>
  </header>
  <div class="saga-modal__body">...</div>
  <footer class="saga-modal__footer">
    <button class="saga-btn saga-btn--secondary">Cancel</button>
    <button class="saga-btn saga-btn--primary">Save</button>
  </footer>
</div>
```

## Confirm dialog

A confirm is a small modal (440px) with a question for a title, one short
paragraph in `--color-text-secondary`, and two buttons. It uses
`role="alertdialog"`. The safe button (Cancel, Never mind) is focused on open,
not the confirming one.

| Variant | Confirm button | Extra |
|---|---|---|
| Danger | `.saga-btn--danger`, labelled with the verb and noun: "Delete session", "Yes, cancel this session" | default |
| Neutral | `.saga-btn--primary` | for a non-destructive but weighty step |
| Caution | an amber button in `--color-warning` with white text | a 4px `--color-warning-border` top edge on the card; "allowed, but this has consequences" |

When the confirm is about losing things, the body is a **loss ledger**: a
bulleted list naming each thing that will be removed ("Pods in Group 202:
3"), so the admin reads exactly what goes. A confirm mounted inside another
modal scrims only that modal's card, not the whole page.

## Toasts

A toast is a short, non-blocking message at the bottom centre of the window.
It is for things that happened elsewhere or already happened: "Roster
uploaded", "2 students are waiting in Pod 6". It is never a form error and
never a question that needs an answer.

Look:

- Navy `--saga-navy` card, white text at `--text-sm` `--weight-semibold`,
  `--radius-lg`, `--shadow-toast`, up to 32em wide.
- A 2px border in `--color-accent` teal thickened to 8px on the left edge.
  The border is fixed pixels so it does not grow with the text-size setting.
  Variants recolour only this accent: `--success` to `--color-success`,
  `--warning` to `--nav-attention-bg` amber, `--danger` to `--color-danger`.
  The fill stays navy so the stack reads as one family.
- A ✕ pinned in the top-right corner of every toast.
- Optional action buttons under the message, right-aligned, pill-shaped:
  outlined white, with the one primary action filled white with navy text.
- Enters with a 12px rise over `--motion-fast`, leaves by fading over
  `--motion-fade`.

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
    Roster uploaded. 55 students added.
    <button class="saga-btn saga-btn--sm">View roster</button>
    <button aria-label="Dismiss">✕</button>
  </div>
</div>
```

## Notices, warnings and confirmations

When an action touches something the admin cannot see (a student already in
another pod this period, a tutor in a sibling group, a rotation change that
would wipe another group's pods), the response is one of three levels. The
situation picks the level, not the kind of collision.

| Level | Ask | Looks like | Interrupts | a11y |
|---|---|---|---|---|
| Notice | allowed, usually worth avoiding | `.saga-notice--notice`: `--color-notice-bg` fill, 1px `--color-notice-border`, text `--color-text`, blue family | passive, dismissible | `role="status"`, polite |
| Warning | a real collision they probably did not intend | `.saga-notice--warning`: `--color-warning-bg`, `--color-warning-border`, amber family | prominent, non-blocking, offers a fix | `role="status"`, polite |
| Confirmation | destructive or irreversible | the danger confirm dialog above, in `--color-danger` | blocks until answered | `role="alertdialog"`, focus trapped |

Ask in order: destructive? then confirmation. A collision they did not mean?
then warning. Allowed but avoidable? then notice. When unsure pick the lower
level; escalate only for destruction.

Inline notices are anchored next to the thing that was just touched, not in a
global corner: `--radius-md`, `8px 12px` padding, `--text-sm`,
`--shadow-toast`, up to 560px wide, with a ✕ at the right. They carry their
response as inline links in `--color-primary` semibold underline:

- **Remediate in place**: "Maya Ellis is also in another pod this period.
  Remove from Rotation 2?" The scope word is the link.
- **Reveal**: a link that navigates to the off-screen thing.
- **Proceed** and **Cancel** exist only on a confirmation.

Dismissing a notice hides it; it does not resolve the condition, and the same
placement does not re-prompt. Two or more notices about the same subject
collapse into one summary line with a "Review" expander.

```html
<div class="saga-notice saga-notice--warning" role="status">
  Maya Ellis is also in another pod this period. <a href="#">Remove from Rotation 2?</a>
  <button aria-label="Dismiss">✕</button>
</div>
```

A **standing problem** the admin did not just cause (a pod with no tutor
after a roster sync) is not a toast. It is counted in the notification bell
and shown quietly in its own context when the admin arrives, with an amber
glow on the affected rows.

## Popover menus

A kebab or caret opens an anchored menu: white, 1px `--color-border`,
`--radius-lg`, `--shadow-popover`, `--z-dropdown`, 180 to 320px wide,
`--space-xs` vertical padding. Items are 36px rows with an optional 20px icon,
`--text-sm`, hover `--color-bg-tertiary`; a danger item is `--color-danger`
text with a faint danger wash on hover; a divider is a 1px `--color-border`
rule. The menu prefers bottom-end placement and flips when it would overflow.

Keyboard: focus lands on the menu container (nothing pre-selected), arrows
move, Enter or Space picks, Esc and outside click close, Tab wraps. A
disabled item that the user may still want to understand stays clickable with
`aria-disabled` and explains itself on click.

## Tooltips

Tooltips are painted DOM, never native `title=`. A native tooltip is composited
outside the tab and vanishes in a tab share, has no keyboard path, and its
timing cannot be controlled.

- Panel: white, 1px `--color-border-strong`, `--radius-lg`, `8px 10px`
  padding, `--text-sm`, `--shadow-md`, `--z-tooltip`, fades in over
  `--motion-fade`. A `filled` variant uses `--color-primary` fill with white
  text for the info-icon case.
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
- Don't use native `title=` or `alert()`.
