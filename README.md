# Saga product style

The public design guide, CSS design tokens, and framework-free component layer
for Saga Education's products. Rendered at **https://style.wootdev.com**.

- **Humans:** read the site. Start with the overview, then the chapter for what you are building.
- **AI assistants:** read [`CLAUDE.md`](CLAUDE.md) (or `AGENTS.md`, identical).
- **Prototypes:** download [`starter/saga-starter.html`](starter/saga-starter.html). Everything is inlined; the file opens from disk.
- **Apps:** link `css/tokens.css`, `css/base.css`, `css/components.css`, or use the Svelte 5 library in the private `saga-ed/product-ui-components` repo.

## Layout

```
guide/          Markdown chapters (the source of truth) + decisions.md ledger
css/            tokens.css · base.css · components.css
assets/brand/   Saga marks
site/           page layout, site.css, showcase/*.html
starter/        generated single-file starter template
scripts/        build.mjs (site + starter), check.mjs (token guards)
infra/          Amplify + GitHub OIDC SAM stacks (see infra/OPS.md)
```

## Develop

```bash
npm install
npm run build      # → dist/
npm run check      # undefined tokens, raw hex in components.css
npm run serve      # local preview on :8920
```

Push to `main` deploys; a non-draft PR gets `pr-N.style.wootdev.com`.

## Changing the system

Values live in `css/tokens.css`. Every judgement call has an id in
`guide/decisions.md`; a change that alters how something looks gets a new
entry or amends one. Chapters, tokens and the component layer change
together in one PR so the site never documents something the CSS does not do.
