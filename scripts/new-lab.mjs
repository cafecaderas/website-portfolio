#!/usr/bin/env node
// Scaffolds a new LAB entry in lib/content/projects.ts from a short prompt.
// Plain Node, no dependency — asks only for what a lab entry needs to feel
// alive; slug is derived, index is computed at read time (not stored), so
// there's nothing here to keep in sync as entries get added or reordered.
// See AGENTS.md's "no new dependency without a real requirement."

import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS_PATH = path.join(__dirname, "..", "lib", "content", "projects.ts");
const LAB_MARKER = "// ---------- LAB ----------";

const TAGS = ["code", "editing", "audio", "video", "animation", "design", "3d", "ux-ui", "crm", "cms", "api", "ai", "photo"];

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const source = await readFile(PROJECTS_PATH, "utf8");
  const existingSlugs = new Set([...source.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => rl.question(q);

  try {
    let title = "";
    let slug = "";
    while (!title.trim() || !slug || existingSlugs.has(slug)) {
      title = await ask("Title: ");
      slug = toSlug(title);
      if (title.trim() && existingSlugs.has(slug)) {
        console.log(`"${slug}" already exists — pick a different title.`);
        title = "";
      }
    }

    const description = await ask("One-line description: ");

    let tags = [];
    while (tags.length === 0) {
      const raw = await ask(`Tags, comma-separated (${TAGS.join(", ")}): `);
      const candidates = raw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      tags = candidates.filter((t) => TAGS.includes(t));
      const unknown = candidates.filter((t) => !TAGS.includes(t));
      if (unknown.length > 0) console.log(`Not a known tag, skipped: ${unknown.join(", ")}`);
      if (tags.length === 0) console.log("Need at least one valid tag.");
    }

    const status = (await ask("Status word (e.g. RUNNING, WEIRD, SHIPPED): ")).trim().toUpperCase();
    const meta = (await ask("Meta readout — a version, a duration (Enter to skip): ")).trim();
    const liveAnswer = (await ask("Live? (y/N): ")).trim().toLowerCase();
    const live = liveAnswer === "y" || liveAnswer === "yes";

    const date = String(new Date().getFullYear());

    const coreLines = [
      `      slug: "${slug}",`,
      `      title: "${title.trim()}",`,
      `      date: "${date}",`,
      `      section: "lab",`,
      `      tags: [${tags.map((t) => `"${t}"`).join(", ")}],`,
      `      description: "${description.trim()}",`,
    ];
    if (meta) coreLines.push(`      meta: "${meta}",`);
    coreLines.push(`      status: "${status}",`);
    coreLines.push(`      live: ${live},`);

    const entry = ["  {", "    core: {", ...coreLines, "    },", "    body: [],", "  },"].join("\n");

    const markerIndex = source.indexOf(LAB_MARKER);
    if (markerIndex === -1) throw new Error(`Could not find "${LAB_MARKER}" in ${PROJECTS_PATH}`);
    const closeIndex = source.indexOf("\n];", markerIndex);
    if (closeIndex === -1) throw new Error(`Could not find the array's closing "];" after ${LAB_MARKER}`);

    const updated = `${source.slice(0, closeIndex)}\n${entry}${source.slice(closeIndex)}`;
    await writeFile(PROJECTS_PATH, updated, "utf8");

    await execFileAsync("npx", ["eslint", "--fix", PROJECTS_PATH]).catch(() => {
      // Non-fatal — the entry is already valid TS without the fix pass.
    });

    console.log(`Added ${title.trim()} (${slug}).`);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
