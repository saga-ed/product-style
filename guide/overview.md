---
title: Saga product style
order: 0
summary: One look and feel for every Saga product, in a form that people and AI tools can build from directly.
---

This is the public design guide for Saga Education's products: the dashboard,
Saga Connect, Coach, the admin consoles, and every prototype on the way to
them. It exists so that anyone with an editor or an AI assistant can produce a
screen that looks like it belongs, whether the output is a single HTML file, a
Figma-style comp, or a Svelte page in a product repo.

## How it is layered

| Layer | What it is | Where |
|---|---|---|
| Guide | The rules, in words and examples. Framework-free. | This site, `guide/*.md` |
| Tokens | CSS custom properties: colour, type, spacing, radius, elevation, motion. | [`/css/tokens.css`](/css/tokens.css) |
| Base | Resets, root sizing, type rhythm, focus, scrollbars. | [`/css/base.css`](/css/base.css) |
| Components (vanilla) | Plain CSS classes (`.saga-btn`, `.saga-card`, `.saga-modal`, …) that any HTML can use with no build. | [`/css/components.css`](/css/components.css), [showcase](/showcase/) |
| Components (Svelte 5) | `@saga-ed/ui-svelte`, built on the same tokens, for product repos. | private: `saga-ed/product-ui-components` |

Use the highest layer your project can take. A product repo uses the Svelte
library; a prototype uses the vanilla classes; a comp uses the tokens and the
guide.

## Start here

- Building a prototype or a one-off page: download the [starter template](/starter/saga-starter.html). Everything is inlined, so the file opens from disk and can be dropped into the prototypes repo as is.
- Building inside a product repo: link the three CSS files or install the Svelte library, then read [Shell and navigation](/guide/shell-navigation/) and [Buttons](/guide/buttons/).
- Working with an AI assistant: point it at [`/CLAUDE.md`](/CLAUDE.md) (the same text is in `AGENTS.md`). It tells the assistant which layer to use and which rules are not negotiable.

## The five rules that matter most

1. Blue `#006298` is the only action colour. Teal is decoration, clay is danger, amber is warning.
2. Montserrat, 15px base, stepping to 17 and 19 on wide screens. Nothing else.
3. Colour, spacing and timing come from tokens. A raw hex or a raw `200ms` in component CSS is a bug.
4. One focus ring, everywhere. No native `title` tooltips, no native `<select>`, no native date input in product UI.
5. Buttons are flat. Cards and overlays carry the elevation.

## When the guide is wrong

It will be. Every judgement call is numbered in the [decisions ledger](/decisions/); open an issue on [saga-ed/product-style](https://github.com/saga-ed/product-style/issues) that names the entry, and the fix lands in the tokens, the guide and the component layer together.
