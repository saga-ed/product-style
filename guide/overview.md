---
title: Saga product style
order: 0
summary: One look and feel for every Saga product, in a form that people and AI tools can build from directly.
---

## What Saga builds

Saga Education runs high-dosage math tutoring in public schools. The products
this guide covers are the tools around that tutoring:

- **The dashboard** (saga-dash): where program coordinators, site leads and
  district admins configure programs, build tutoring schedules and pods,
  manage rosters, take attendance, and read reports and surveys. Form-heavy,
  table-heavy, used all day on a laptop.
- **Saga Connect**: the live tutoring room with a shared whiteboard, video,
  chat and activities. Used by tutors and students on laptops and tablets,
  often in a noisy classroom.
- **Coach**: tutor training and observation, built around video, rubrics
  (the QTF skills) and AI-generated insights about a session.
- **Admin consoles and prototypes**: internal tools for support staff, and
  the public prototypes site where product ideas are tried before they are
  built.

Everything here is used by educators who are busy and not here for the
software. Pages should be calm, scannable and quick to act on.

## The look, in one paragraph

A navy left nav and a white content area. One blue for every action, link and
selected state; teal only as an accent; clay for destructive actions; amber
for warnings. Montserrat throughout, 15px on a laptop, larger on wide
screens. Content lives in white cards with hairline borders and soft shadows,
or in dense tables with a gray header row. Buttons are flat. Motion is short
and only on opacity and position. See the [component showcase](/showcase/)
for all of it rendered from the real CSS.

## How it is layered

| Layer | What it is | Where |
|---|---|---|
| Guide | The rules, in words and examples. Framework-free. | This site, `guide/*.md` |
| Tokens | CSS custom properties: color, type, spacing, radius, elevation, motion. | [`/css/tokens.css`](/css/tokens.css) |
| Base | Resets, root sizing, type rhythm, focus, scrollbars. | [`/css/base.css`](/css/base.css) |
| Components (vanilla) | Plain CSS classes (`.saga-btn`, `.saga-card`, `.saga-modal`, …) that any HTML can use with no build. | [`/css/components.css`](/css/components.css), [showcase](/showcase/) |
| Components (Svelte 5) | `@saga-ed/ui-svelte`, built on the same tokens, for product repos. | private: `saga-ed/product-ui-components` |

Use the highest layer your project can take. A product repo uses the Svelte
library; a prototype uses the vanilla classes; a comp uses the tokens and the
guide.

## Start here

- Building a prototype or a one-off page: download the [starter template](/starter/saga-starter.html). It links the system's CSS from this site; the [offline copy](/starter/saga-starter-offline.html) inlines it so the file opens with no network. Either drops into the prototypes repo as is.
- Building inside a product repo: the three CSS files or the Svelte library come from the package, then read [Shell and navigation](/guide/shell-navigation/) and the chapter for what you are building.
- Working with an AI assistant: point it at [`/CLAUDE.md`](/CLAUDE.md) (the same text is in `AGENTS.md`). It says which layer to use and which rules are not negotiable.
- Choosing a value: every color, size and duration has a token name. Search [`tokens.css`](/css/tokens.css) for the semantic name first (`--color-primary`, `--space-md`) and only then the primitive (`--saga-blue`).

## When the guide is wrong

It will be. Every judgement call is numbered in the [decisions ledger](/decisions/); open an issue on [saga-ed/product-style](https://github.com/saga-ed/product-style/issues) that names the entry, and the fix lands in the tokens, the guide and the component layer together.
