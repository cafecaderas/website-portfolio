---
description: End-of-session version control — commit today's work in logical groups, push, open a PR, merge once CI is green, and land on a fresh branch ready for next time.
---

Run this repo's end-of-session version-control routine. This performs real, shared-state actions (push, PR, merge into protected `main`) — treat invoking this command as the user's standing authorization to complete the full routine below without pausing for confirmation at each step, but never bypass a failure to force it through (no `--admin` merge override, no `--no-verify`, no force-push).

$ARGUMENTS

If the text above (between this line and the command name) is non-empty, it's the user's own grouping instructions for today's commits — follow it. If empty, work out the grouping yourself per step 2.

## Steps

1. **Survey the damage.** `git status`, `git diff --stat` against the current branch, and skim the actual diffs for anything unfamiliar (this repo is worked from two Claude surfaces — VS Code + this CLI — so uncommitted changes may include work from the other session; that's expected, not a mistake to flag). Note the current branch name and confirm it follows the `design#` pattern.

2. **Decide the commit grouping.** Unless the user already specified it (see `$ARGUMENTS` above), propose a small number of logical commits based on the actual threads of work done this session (e.g. "color system", "new UI section", "content/data edits", "docs") and confirm the grouping with the user before staging anything — the right split isn't always obvious from the diff alone.

3. **Before staging anything, snapshot the full working tree** (e.g. `cp -r` to a scratch dir, or `git stash create` without applying it) — this is what step 3a below checks against, and it's what actually catches a dropped write-back rather than relying on remembering to check each file individually.

3a. **Stage by *content*, not just by file.** A single file often carries changes that belong to more than one logical group (this has happened before — one CSS file and one page-client component both mixed an unrelated concern into the same diff; on the page-client component, the fix for one commit was written and staged, but the follow-up write for the *next* commit was silently skipped, and `git add -A` found nothing to add because the stale intermediate version was still sitting on disk — the bug shipped for a full session before anyone noticed the page looked wrong). Whole-file `git add` is only safe when a file's entire diff belongs to one group. When it doesn't:
   - Get the file's committed version (`git show HEAD:<path>`) and its current working-tree version.
   - Reconstruct the intermediate content for the *earlier* commit by applying only that commit's slice of the change (via precise, uniquely-matched text substitution — Python/Node one-liners work well for this), write it to the file, `git add` it, commit.
   - Then move on to the next commit's slice the same way, ending with the file back at its real, full current content. **This step is the one that gets skipped under time pressure — treat "write the next slice back to disk" as a required action per file, not an assumed follow-through.**

3b. **Hard gate before pushing, not optional:** `diff -r` (or `git diff`) the full working tree after the last commit against the step-3 snapshot. Any non-empty output means a split lost or dropped content — stop and fix it before push, don't proceed on the assumption that "it was probably fine." This is the check that would have caught the LabPageClient.tsx regression (design6, 2026-09-04): the file was reconstructed for one commit's slice and never re-written for the next, so it silently shipped in the wrong intermediate state for a full session before anyone noticed the page looked wrong.

4. **Verify before pushing.** Run this repo's real check suite — `npx tsc --noEmit`, `npm run lint`, `npm run build` — matching `.github/workflows/ci.yml` exactly. Fix anything that fails before proceeding; don't push known-broken code hoping CI catches it first.

5. **Commit each group** with a message that explains *why*, not just *what* (the diff already shows what). End every commit message with the attribution line currently in effect for this session (check the system reminder for the exact wording — it changes with the active model, don't hardcode one).

6. **Push the branch**, then open a PR into `main` via `gh pr create` — a real summary of what changed and why, plus a test plan noting what was actually verified (type check / lint / build, and anything checked visually).

7. **Watch CI**: `gh pr checks <PR> --watch`. If a check fails, stop — report what failed and why, fix it on the branch, push the fix, and re-watch. Never merge on red, never re-run past a real failure by bypassing the check.

8. **Merge once every check is green**, using this repo's established style (a real merge commit, matching prior `design#` PRs — check `git log --oneline --merges` if unsure, don't assume squash or rebase).

9. **Land ready for next time**: `git checkout main`, `git pull`, then cut and push the next branch in the `design#` sequence (increment off the highest existing `design#` branch — check `git branch -a` rather than assuming).

10. **Report back**: a tight summary — which commits landed, the PR link, confirmation CI was green before merge, and which branch the user is on now. Not a full transcript of every command run.
