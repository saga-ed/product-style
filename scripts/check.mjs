// Guards: every var(--x) referenced in css/ is defined in tokens.css or base.css;
// no raw hex colours in components.css; the committed tokens.json / tokens.ts
// match a fresh generation from css/tokens.css (run `npm run build` to refresh).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { generateTokens } from "./tokens.mjs";
const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const read = (f) => readFile(path.join(ROOT, f), "utf8").catch(() => "");
const [tokens, base, components] = await Promise.all(["css/tokens.css", "css/base.css", "css/components.css"].map(read));
const defined = new Set([...(tokens + base + components).matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
let failed = false;
for (const [file, src] of [["css/base.css", base], ["css/components.css", components]]) {
	// var(--x, fallback) is an instance variable set inline (e.g. --value, --c); only bare var(--x) must be defined.
	const used = new Set([...src.matchAll(/var\((--[a-z0-9-]+)\s*\)/g)].map((m) => m[1]));
	const missing = [...used].filter((v) => !defined.has(v));
	if (missing.length) { failed = true; console.error(`${file}: undefined tokens: ${missing.join(", ")}`); }
}
const hex = [...components.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0]);
if (hex.length) { failed = true; console.error(`css/components.css: raw hex colours: ${[...new Set(hex)].join(", ")}`); }
// Generated token files: committed copies must equal a fresh generation.
let generated = 0;
try {
	const pkg = JSON.parse(await read("package.json"));
	const gen = generateTokens(tokens, pkg.version);
	generated = gen.count;
	for (const [file, want] of [["tokens.json", gen.json], ["tokens.ts", gen.ts]]) {
		if ((await read(file)) !== want) { failed = true; console.error(`${file}: out of date with css/tokens.css (or package.json version) — run npm run build`); }
	}
} catch (e) { failed = true; console.error(`tokens: ${e.message}`); }
console.log(failed ? "check: FAILED" : `check: ok (${defined.size} tokens defined, ${generated} generated)`);
process.exit(failed ? 1 : 0);
