# AI Workflow

> How humans and AI agents share this repo. Git mechanics live in
> [development-workflow.md](development-workflow.md).

## The team

**Dev Team**

- me = Product Manager
- claude code (this CLI) = ai agent #1
- claude desktop app = ai agent #2
- chat gpt = ai agent #3

More than one agent surface touches this repo, sometimes in the same working tree. Uncommitted or
untracked changes found at the start of a session may belong to another surface rather than being
leftover mistakes — check what they are before assuming ownership, and never discard them without
looking.

## Rules of engagement

**AI CAN:** Experiment with technologies, recommend, research, explain, architect, code, refactor, test, debug, create files, install packages, improve documentation, and test audio visual tools.

**AI MUST ASK BEFORE:** Any decision that touches design, security, or money. Examples include major design-direction changes, security-sensitive changes, deleting important work, spending money, adding significant infrastructure, or other decisions where the human needs to explicitly choose the direction.

## Agent entry points

| File | Role |
|---|---|
| `CLAUDE.md` | Loaded automatically at session start. Points at these docs; holds no duplicated content of its own. |
| `AGENTS.md` | The Next.js-managed block (`BEGIN/END:nextjs-agent-rules`) is rewritten by `next dev` — leave it alone. |
| `.claude/commands/end-of-session.md` | The `/end-of-session` version-control routine. |
| `docs/architecture.md` | Read before touching engines, shaders, or design tokens. |
| `docs/content-model.md` | Read before touching `lib/content/`. |

## Working expectations

- **Ground explanations in this repo's real files** — quote actual code with paths rather than
  inventing simplified examples, and say so explicitly when an example *is* simplified.
- **No lorem ipsum.** Placeholder content should be concrete and swap-ready.
- **No new dependency without a real requirement** — see the Technology rule in
  [architecture.md](architecture.md).
- **Verify before claiming done.** `tsc --noEmit`, `lint`, and `build` are the bar; report failures
  honestly rather than describing intent as outcome.
