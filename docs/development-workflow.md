# Development Workflow

> Branches, PRs, CI, environments, and the end-of-session ritual. Who does what (human vs. AI)
> lives in [ai-workflow.md](ai-workflow.md).

## The Change Rule

**When requirements change, update the owning document *before* changing the build.**

This used to read "update this spec" when the README was the single source of truth. It isn't
anymore — the documentation set is, and each file owns its domain:

| Change | Update first |
|---|---|
| Scope, requirements, roadmap | [project-spec.md](project-spec.md) |
| How a system works | [architecture.md](architecture.md) |
| The `Project`/`ContentBlock` schema | [content-model.md](content-model.md) + `lib/content/types.ts` |
| A choice worth remembering later | [decisions.md](decisions.md) |
| Branching, CI, environments | this file |
| Human/AI roles and rules | [ai-workflow.md](ai-workflow.md) |

Append to [decisions.md](decisions.md) rather than rewriting it — superseded entries stay, with a
note pointing at what replaced them.

## Branching

All work happens on a branch; `main` is protected and never committed to directly.

- `design#` for design/feature iterations — the running sequence (`design1` … `design7`).
- Short-lived topic branches (e.g. `ci-setup`) for anything that isn't a design pass.

**`main` is now actually protected, not just documented as such.** Every push to `main` had been allowed straight through until this point — verified by directly testing it (a throwaway push was rejected by GitHub after the rule went on). Current rule: PRs required (`main` included, no admin bypass), the CI check below must pass and the branch must be up to date first, no force-pushes, no deletions. All work happens on separate branches (`design#` for design iterations, short-lived topic branches like `ci-setup` for anything else) and lands via PR.

## CI

**CI** (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `eslint`, and `next build` on every PR into `main` and every push to `main` — the status check the branch protection rule above requires.

`npm run lint` is plain `eslint` with no `--max-warnings`, so warnings don't fail the build —
only errors do.

## End-of-session ritual

Wrapping up a session has a named routine: the `/end-of-session` slash command, defined at
`.claude/commands/end-of-session.md`. It surveys the diff, groups the work into logical commits,
runs `tsc --noEmit` / `lint` / `build` before pushing, opens a PR, watches CI, merges only once
every check is green, then returns to `main` and cuts the next `design#` branch.

It never bypasses a failing check (no `--admin`, no `--no-verify`, no force-push) — on red CI it
stops and reports.

## Ship It

**Environments:** local / staging / production

**Deployment:** Vercel

**Required accounts:** GitHub / Vercel
