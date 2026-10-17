---
title: Saga product style
order: 0
summary: One look and feel for every Saga product, in a form that people and AI tools can build from directly.
---

## What this is for

Saga Education builds tools for high-impact tutoring in schools: scheduling,
staffing, rostering, attendance, assessment and reporting for tutoring
programs, plus Saga Connect for the tutoring session itself and Saga Coach
for training tutors. [Products and users](/guide/products-users/) says more
about who uses them and what that asks of a screen.

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
guide. Product repos get the CSS (and `tokens.ts` for canvas and JS code)
from the `@saga-ed/product-style` package on CodeArtifact, not from a copy.

## Start here

- Building a prototype or a one-off page: download the [starter template](/starter/saga-starter.html). It links the system's CSS from this site; the [offline copy](/starter/saga-starter-offline.html) inlines it so the file opens with no network. Either drops into the prototypes repo as is.
- Building inside a product repo: the three CSS files or the Svelte library come from the package, then read [Shell and navigation](/guide/shell-navigation/) and the chapter for what you are building.
- Working with an AI assistant: point it at [`/CLAUDE.md`](/CLAUDE.md) (the same text is in `AGENTS.md`). It says which layer to use and which rules are not negotiable. Tools that take one document get [`/agent-bundle.md`](/agent-bundle.md), and [`/llms.txt`](/llms.txt) indexes everything. Every chapter is also published as Markdown; use the "View as Markdown" link on any page.
- Choosing a value: every color, size and duration has a token name. Search [`tokens.css`](/css/tokens.css) for the semantic name first (`--color-primary`, `--space-md`) and only then the primitive (`--saga-blue`).

## When the guide is wrong

It will be. Every judgement call is numbered in the [decisions ledger](/decisions/); open an issue on [saga-ed/product-style](https://github.com/saga-ed/product-style/issues) that names the entry, and the fix lands in the tokens, the guide and the component layer together.
