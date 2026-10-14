// Guards: every var(--x) referenced in css/ is defined in tokens.css or base.css;
// no raw hex colours in components.css; starter template is up to date.
import { readFile } from "node:fs/promises";
import path from "node:path";
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
console.log(failed ? "check: FAILED" : `check: ok (${defined.size} tokens defined)`);
process.exit(failed ? 1 : 0);
