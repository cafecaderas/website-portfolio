@AGENTS.md

# Cafe Caderas — agent entry point

The repository's documentation is the source of truth. This file points at it; it deliberately
holds no duplicated copy of what those documents own.

**Read before touching the relevant area:**

| Before you… | Read |
|---|---|
| Touch engines, shaders, canvases, or design tokens | [docs/architecture.md](docs/architecture.md) |
| Touch `lib/content/` or the project schema | [docs/content-model.md](docs/content-model.md) |
| Ask "why is it like this?" | [docs/decisions.md](docs/decisions.md) |
| Branch, commit, open a PR, or merge | [docs/development-workflow.md](docs/development-workflow.md) |
| Wonder what the rules of engagement are | [docs/ai-workflow.md](docs/ai-workflow.md) |

**Standing rules** (the full versions live in the docs above):

- The design system is locked — re-parameterize via existing CSS custom properties in
  `app/globals.css`; don't invent new ones.
- The Technology rule: no new dependency without a real requirement. Three.js is the one
  sanctioned exception and stays contained to `components/three/`.
- Anything reading the engines per-frame goes through `components/three/signal-frame.ts` — never
  call `getInteractionEnergy`/`getAudioBands` directly from a new canvas.
- No lorem ipsum. Placeholder content is concrete and swap-ready.
- When requirements change, update the owning document *before* changing the build.

# End-of-session version control

When the user signals they're wrapping up a work session ("let's finish", "end of session", "ready
to commit everything"), the repo has a named routine for it: the `/end-of-session` slash command,
defined at `.claude/commands/end-of-session.md`.

Invoke it rather than reconstructing the process from scratch. In short, it: surveys the diff →
groups changes into logical commits (confirming the split, or following grouping instructions
passed as arguments) → splits any file whose diff mixes concerns via precise content-level
reconstruction rather than whole-file staging → runs `tsc --noEmit` / `lint` / `build` before
pushing → commits each group → pushes → opens a PR with `gh` → watches CI → merges only once every
check is green, using this repo's merge-commit style → returns to `main` and pulls → cuts and
pushes the next `design#` branch → reports a tight summary.

Invoking the command counts as authorization for its push/PR/merge steps. It must never bypass a
failing check to force a merge through (no `--admin`, no `--no-verify`, no force-push) — on red CI
it stops and reports.
