# Saga product style

The public design guide, CSS design tokens, and framework-free component layer
for Saga Education's products. Rendered at **https://style.wootdev.com**.

- **Humans:** read the site. Start with the overview, then the chapter for what you are building.
- **AI assistants:** read [`CLAUDE.md`](CLAUDE.md) (or `AGENTS.md`, identical).
- **Prototypes:** download [`starter/saga-starter.html`](starter/saga-starter.html). Everything is inlined; the file opens from disk.
- **Apps:** install `@saga-ed/product-style` (below) for the CSS and the JS token constants, or use the Svelte 5 library in the private `saga-ed/product-ui-components` repo.

## Layout

```
guide/          Markdown chapters (the source of truth) + decisions.md ledger
css/            tokens.css · base.css · components.css
tokens.json     generated: every :root token, raw + resolved value + section
tokens.ts       generated: the same as JS constants (tokens, saga, chart); tokens.d.ts
assets/brand/   Saga marks
site/           page layout, site.css, showcase/*.html
starter/        generated single-file starter template
scripts/        build.mjs (site + starter + tokens.*), check.mjs (token guards), tokens.mjs
infra/          Amplify + GitHub OIDC SAM stacks (see infra/OPS.md)
.github/        ci.yml (PRs), deploy-main / pr-preview (site), publish-package.yml
```

## Use it in an app

The package `@saga-ed/product-style` is published to Saga's CodeArtifact
registry (`@saga-ed` scope, `saga_js` repository). With the scope configured
in your repo's `.npmrc` and a CodeArtifact token in `~/.npmrc` (the usual
`aws codeartifact login --tool npm` or the repo's CI setup action):

```bash
npm i @saga-ed/product-style      # or pnpm add
```

CSS: import the three layers in the app's global stylesheet, tokens first.
Product repos take `tokens.css` from the package rather than carrying a
copy; an app keeps its own alias file for app-only tokens.

```css
@import '@saga-ed/product-style/css/tokens.css';
@import '@saga-ed/product-style/css/base.css';        /* optional: resets, root sizing, type rhythm */
@import '@saga-ed/product-style/css/components.css';  /* optional: the .saga-* classes */
```

JS and canvas code that cannot read CSS (chart series, canvas fills):

```ts
import { saga, chart, tokens } from '@saga-ed/product-style';
saga.blue        // '#006298'   Tier 1 primitives, camelCase
chart[0]         // '#006298'   --chart-1 … --chart-8 in order
tokens['color-danger']  // '#991a21'  any :root token, resolved
```

`tokens.json` (same data with the raw `var()` value and the section each
token came from) is also exported, and served at
https://style.wootdev.com/tokens.json.

### Releasing a version

1. Bump `version` in `package.json` in a PR, run `npm run build` (the
   generated `tokens.json` carries the version) and commit the result. CI
   fails if the generated files are stale.
2. Merge to `main`.
3. Actions → **Publish package to CodeArtifact** → Run workflow from `main`
   with `dry_run: true`; read the tarball listing in the job output.
4. Run it again with `dry_run: false`. Publishing an existing version is
   skipped, not overwritten: bump again.

The workflow assumes `ProductStylePublishRole` in the prod account (trust
pinned to `main`); see `infra/OPS.md` for the stack and the
`AWS_PUBLISH_ROLE_ARN` variable.

## Develop

```bash
npm install
npm run build      # → dist/; regenerates tokens.json, tokens.ts, starter/*.html
npm run check      # undefined tokens, raw hex in components.css, generated files current
npm run serve      # local preview on :8920
npm pack --dry-run # what the package would ship
```

`tokens.json`, `tokens.ts` and the two starter files are generated and
committed; CI (`ci.yml`) rebuilds and fails on a diff.

Push to `main` deploys; a non-draft PR gets `pr-N.style.wootdev.com`.

## Changing the system

Values live in `css/tokens.css`. Every judgement call has an id in
`guide/decisions.md`; a change that alters how something looks gets a new
entry or amends one. Chapters, tokens and the component layer change
together in one PR so the site never documents something the CSS does not do.
