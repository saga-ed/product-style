// Type declarations for tokens.ts (generated from css/tokens.css by scripts/build.mjs).
// Hand-written and deliberately generic so a token rename never breaks a build
// at the type level; the runtime object is the source of truth.

/** Every `:root` custom property in css/tokens.css, keyed by name without the
 *  leading `--`, with every `var()` reference resolved to a literal. */
export declare const tokens: Readonly<Record<string, string>>;

/** Tier 1 brand primitives (`--saga-*`), keyed in camelCase without the
 *  `saga-` prefix: `saga.blue`, `saga.blueDark`, `saga.navy`, `saga.teal`, … */
export declare const saga: Readonly<Record<string, string>>;

/** The categorical chart series, `--chart-1` … `--chart-8` in order. */
export declare const chart: readonly string[];
