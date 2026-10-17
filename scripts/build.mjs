// Build the style site: guide/*.md → dist/guide/<slug>/, css + assets copied,
// showcase pages copied verbatim, starter template generated with inlined CSS.
import { readFile, writeFile, mkdir, readdir, cp, rm, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { generateTokens } from "./tokens.mjs";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DIST = path.join(ROOT, "dist");
const ZIP = process.argv.includes("--zip");

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function frontmatter(src) {
	const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { meta: {}, body: src };
	const meta = {};
	for (const line of m[1].split("\n")) {
		const i = line.indexOf(":");
		if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
	}
	return { meta, body: src.slice(m[0].length) };
}

// Heading ids = kebab-case of the heading text (the ledger links to these).
const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth, tokens }) {
	const inner = this.parser.parseInline(tokens);
	const id = slug(text);
	return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to ${esc(text)}">#</a></h${depth}>\n`;
};
marked.use({ renderer, gfm: true });

// <code>#rrggbb</code> → a swatch: background is the color, text is white or black by contrast.
function swatchify(html) {
	return html.replace(/<code>(#(?:[0-9a-f]{6}|[0-9a-f]{3}))<\/code>/gi, (_, hex) => {
		let h = hex.slice(1); if (h.length === 3) h = [...h].map((c) => c + c).join("");
		const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
		const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(h.slice(i, i + 2), 16)));
		const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		const fg = (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) ? "#000000" : "#ffffff";
		return `<code class="hex" style="--c:${hex};--fg:${fg}">${hex}</code>`;
	});
}

async function loadGuide() {
	const dir = path.join(ROOT, "guide");
	const files = (await readdir(dir)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
	const pages = [];
	for (const f of files) {
		const src = await readFile(path.join(dir, f), "utf8");
		const { meta, body } = frontmatter(src);
		const name = f.replace(/\.md$/, "");
		pages.push({
			name,
			title: meta.title || name,
			order: Number(meta.order ?? 999),
			summary: meta.summary || "",
			html: swatchify(marked.parse(body)),
		});
	}
	pages.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
	return pages;
}

async function layout({ title, summary, nav, content, path: here, buildInfo, mdPath }) {
	const tpl = await readFile(path.join(ROOT, "site", "layout.html"), "utf8");
	const navHtml = nav
		.map((p) => `<li><a href="/guide/${p.name}/"${p.name === here ? ' aria-current="page"' : ""}>${esc(p.title)}</a></li>`)
		.join("\n");
	const docTitle = title === "Saga product style" ? title : `${title} · Saga product style`;
	return tpl
		.replaceAll("{{docTitle}}", esc(docTitle))
		.replaceAll("{{title}}", esc(title))
		.replaceAll("{{summary}}", esc(summary || ""))
		.replaceAll("{{nav}}", navHtml)
		.replaceAll("{{mdPath}}", mdPath || "")
		.replaceAll("{{content}}", content)
		.replaceAll("{{buildInfo}}", buildInfo);
}

async function buildInfoLine() {
	const branch = process.env.AWS_BRANCH || process.env.GITHUB_REF_NAME || "local";
	const sha = (process.env.GITHUB_SHA || "").slice(0, 7);
	const when = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
	return `${branch}${sha ? " · " + sha : ""} · built ${when}`;
}

async function main() {
	await rm(DIST, { recursive: true, force: true });
	await mkdir(DIST, { recursive: true });
	const buildInfo = await buildInfoLine();

	// Generated token files for JS/canvas consumers (tokens.json, tokens.ts) —
	// committed at the repo root, shipped in the npm package, served by the site.
	// check.mjs fails if the committed copies drift from css/tokens.css.
	const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
	const gen = generateTokens(await readFile(path.join(ROOT, "css", "tokens.css"), "utf8"), pkg.version);
	await writeFile(path.join(ROOT, "tokens.json"), gen.json);
	await writeFile(path.join(ROOT, "tokens.ts"), gen.ts);
	for (const f of ["tokens.json", "tokens.ts", "tokens.d.ts"]) await cp(path.join(ROOT, f), path.join(DIST, f));

	// Static copies
	await cp(path.join(ROOT, "css"), path.join(DIST, "css"), { recursive: true });
	await cp(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });
	await cp(path.join(ROOT, "site", "site.css"), path.join(DIST, "site.css"));
	const showcaseSrc = path.join(ROOT, "site", "showcase");
	try {
		for (const f of await readdir(showcaseSrc)) {
			if (!f.endsWith(".html")) continue;
			const name = f.replace(/\.html$/, "");
			const out = name === "index" ? path.join(DIST, "showcase") : path.join(DIST, "showcase", name);
			await mkdir(out, { recursive: true });
			await cp(path.join(showcaseSrc, f), path.join(out, "index.html"));
		}
	} catch (e) { if (e.code !== "ENOENT") throw e; }

	// Guide pages
	const pages = await loadGuide();
	const nav = pages.filter((p) => p.name !== "overview" && p.name !== "decisions");
	for (const p of pages) {
		if (p.name === "decisions") continue;
		const out = p.name === "overview" ? DIST : path.join(DIST, "guide", p.name);
		await mkdir(out, { recursive: true });
		const html = await layout({ title: p.title, summary: p.summary, nav, content: p.html, path: p.name, buildInfo, mdPath: `/guide/md/${p.name}.md` });
		await writeFile(path.join(out, "index.html"), html);
	}
	// Ledger page (decisions.md is excluded from nav ordering by name but rendered)
	const ledger = pages.find((p) => p.name === "decisions");
	if (ledger) {
		await mkdir(path.join(DIST, "decisions"), { recursive: true });
		await writeFile(path.join(DIST, "decisions", "index.html"), await layout({ ...ledger, nav, content: ledger.html, path: "decisions", buildInfo, mdPath: "/guide/md/decisions.md" }));
	}
	// Raw markdown for agents, side by side with the rendered page
	await cp(path.join(ROOT, "guide"), path.join(DIST, "guide", "md"), { recursive: true });
	for (const f of ["CLAUDE.md", "AGENTS.md", "README.md"]) {
		try { await cp(path.join(ROOT, f), path.join(DIST, f)); } catch {}
	}

	// Starter template: everything inlined so a prototype is one file. Stamped
	// with the package version, not the build time, so the committed copy is
	// reproducible and CI can `git diff --exit-code starter/`.
	const [tokens, base, components] = await Promise.all(
		["tokens.css", "base.css", "components.css"].map((f) => readFile(path.join(ROOT, "css", f), "utf8").catch(() => ""))
	);
	const starterTpl = (await readFile(path.join(ROOT, "starter", "saga-starter.template.html"), "utf8")).replaceAll("{{buildInfo}}", `v${pkg.version}`);
	const linked = starterTpl.replace("<!--__CSS__-->", [
		"<!-- The system's CSS, served from the style site. In a product repo the same",
		"     three files come from the package, not from here. For a copy that opens",
		"     with no network, use saga-starter-offline.html instead. -->",
		'<link rel="stylesheet" href="https://style.wootdev.com/css/tokens.css">',
		'<link rel="stylesheet" href="https://style.wootdev.com/css/base.css">',
		'<link rel="stylesheet" href="https://style.wootdev.com/css/components.css">',
	].join("\n"));
	const offline = starterTpl.replace("<!--__CSS__-->", [
		"<!-- Offline copy: tokens.css, base.css and components.css inlined verbatim so the",
		"     file opens with no network. Do not edit these blocks; regenerate from",
		"     https://style.wootdev.com/starter/saga-starter-offline.html -->",
		`<style id="saga-tokens">\n${tokens.trim()}\n</style>`,
		`<style id="saga-base">\n${base.trim()}\n</style>`,
		`<style id="saga-components">\n${components.trim()}\n</style>`,
	].join("\n"));
	await writeFile(path.join(ROOT, "starter", "saga-starter.html"), linked);
	await writeFile(path.join(ROOT, "starter", "saga-starter-offline.html"), offline);
	await mkdir(path.join(DIST, "starter"), { recursive: true });
	await writeFile(path.join(DIST, "starter", "saga-starter.html"), linked);
	await writeFile(path.join(DIST, "starter", "saga-starter-offline.html"), offline);

	// llms.txt (index for assistants) and agent-bundle.md (everything in one file)
	const SITE = "https://style.wootdev.com";
	const claudeMd = await readFile(path.join(ROOT, "CLAUDE.md"), "utf8");
	const chapterSrc = [];
	for (const p of pages) {
		const raw = await readFile(path.join(ROOT, "guide", `${p.name}.md`), "utf8");
		chapterSrc.push({ ...p, raw: frontmatter(raw).body.trim() });
	}
	const ordered = chapterSrc.filter((p) => p.name !== "decisions");
	const llms = [
		"# Saga product style",
		"",
		"> The public design guide, CSS design tokens and framework-free component layer for Saga Education's products. Build UI that looks like Saga's from these files.",
		"",
		`Start with [CLAUDE.md](${SITE}/CLAUDE.md) (rules and which layer to use), or take everything at once: [agent-bundle.md](${SITE}/agent-bundle.md).`,
		"",
		"## Guide (Markdown)",
		...ordered.map((p) => `- [${p.title}](${SITE}/guide/md/${p.name}.md): ${p.summary}`),
		"",
		"## CSS",
		`- [tokens.css](${SITE}/css/tokens.css): design tokens, two tiers (--saga-* primitives, semantic --color-*, --space-*, --text-*, --radius-*, --shadow-*, --motion-*)`,
		`- [base.css](${SITE}/css/base.css): resets, root sizing, type rhythm, focus, scrollbars`,
		`- [components.css](${SITE}/css/components.css): the .saga-* vanilla component classes`,
		`- [tokens.json](${SITE}/tokens.json): every :root token with its raw and resolved value; [tokens.ts](${SITE}/tokens.ts) is the same as JS constants`,
		"",
		"## Starters and reference",
		`- [saga-starter.html](${SITE}/starter/saga-starter.html): single-file prototype starter that links the CSS above`,
		`- [saga-starter-offline.html](${SITE}/starter/saga-starter-offline.html): the same with the CSS inlined`,
		`- [Decisions ledger](${SITE}/guide/md/decisions.md): every judgement call, numbered DS-nnn`,
		`- [Component showcase](${SITE}/showcase/): every class rendered from the real CSS (HTML)`,
		"",
	].join("\n");
	await writeFile(path.join(DIST, "llms.txt"), llms);
	const bundle = [
		"# Saga product style: agent bundle",
		"",
		`Generated ${buildInfo}. Source: ${SITE}. This file is CLAUDE.md followed by every guide chapter, for tools that take one document. The CSS itself is at ${SITE}/css/tokens.css, base.css and components.css.`,
		"",
		"---",
		"",
		claudeMd.trim(),
		...ordered.flatMap((p) => ["", "---", "", `# ${p.title}`, "", p.summary ? `_${p.summary}_` : "", "", p.raw]),
		"",
	].join("\n");
	await writeFile(path.join(DIST, "agent-bundle.md"), bundle);
	await writeFile(path.join(DIST, "llms-full.txt"), bundle);

	// Soft-404 target
	await writeFile(path.join(DIST, "404.html"), await layout({ title: "Not found", summary: "", nav, content: "<p>That page does not exist. <a href=\"/\">Back to the guide.</a></p>", path: "", buildInfo }));

	console.log(`Built ${pages.length} guide pages, ${gen.count} tokens → ${DIST}`);
	if (ZIP) {
		const archiver = (await import("archiver")).default;
		await new Promise((res, rej) => {
			const out = createWriteStream(path.join(ROOT, "dist.zip"));
			const a = archiver("zip", { zlib: { level: 9 } });
			out.on("close", res); a.on("error", rej);
			a.pipe(out); a.directory(DIST, false); a.finalize();
		});
		console.log("Wrote dist.zip");
	}
}
main().catch((e) => { console.error(e); process.exit(1); });
