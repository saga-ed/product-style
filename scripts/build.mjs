// Build the style site: guide/*.md → dist/guide/<slug>/, css + assets copied,
// showcase pages copied verbatim, starter template generated with inlined CSS.
import { readFile, writeFile, mkdir, readdir, cp, rm, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { marked } from "marked";

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
			html: marked.parse(body),
		});
	}
	pages.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
	return pages;
}

async function layout({ title, summary, nav, content, path: here, buildInfo }) {
	const tpl = await readFile(path.join(ROOT, "site", "layout.html"), "utf8");
	const navHtml = nav
		.map((p) => `<li><a href="/guide/${p.name}/"${p.name === here ? ' aria-current="page"' : ""}>${esc(p.title)}</a></li>`)
		.join("\n");
	return tpl
		.replaceAll("{{title}}", esc(title))
		.replaceAll("{{summary}}", esc(summary || ""))
		.replaceAll("{{nav}}", navHtml)
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
		const html = await layout({ title: p.title, summary: p.summary, nav, content: p.html, path: p.name, buildInfo });
		await writeFile(path.join(out, "index.html"), html);
	}
	// Ledger page (decisions.md is excluded from nav ordering by name but rendered)
	const ledger = pages.find((p) => p.name === "decisions");
	if (ledger) {
		await mkdir(path.join(DIST, "decisions"), { recursive: true });
		await writeFile(path.join(DIST, "decisions", "index.html"), await layout({ ...ledger, nav, content: ledger.html, path: "decisions", buildInfo }));
	}
	// Raw markdown for agents, side by side with the rendered page
	await cp(path.join(ROOT, "guide"), path.join(DIST, "guide", "md"), { recursive: true });
	for (const f of ["CLAUDE.md", "AGENTS.md", "README.md"]) {
		try { await cp(path.join(ROOT, f), path.join(DIST, f)); } catch {}
	}

	// Starter template: everything inlined so a prototype is one file.
	const [tokens, base, components] = await Promise.all(
		["tokens.css", "base.css", "components.css"].map((f) => readFile(path.join(ROOT, "css", f), "utf8").catch(() => ""))
	);
	const starterTpl = await readFile(path.join(ROOT, "starter", "saga-starter.template.html"), "utf8");
	const starter = starterTpl
		.replace("/*__TOKENS__*/", tokens.trim())
		.replace("/*__BASE__*/", base.trim())
		.replace("/*__COMPONENTS__*/", components.trim())
		.replace("{{buildInfo}}", buildInfo);
	await writeFile(path.join(ROOT, "starter", "saga-starter.html"), starter);
	await mkdir(path.join(DIST, "starter"), { recursive: true });
	await writeFile(path.join(DIST, "starter", "saga-starter.html"), starter);

	// Soft-404 target
	await writeFile(path.join(DIST, "404.html"), await layout({ title: "Not found", summary: "", nav, content: "<p>That page does not exist. <a href=\"/\">Back to the guide.</a></p>", path: "", buildInfo }));

	console.log(`Built ${pages.length} guide pages → ${DIST}`);
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
