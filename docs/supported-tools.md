# Supported Tools

OvseSpec works with many AI coding assistants. When you run `ovsespec init`, OvseSpec configures selected tools using your active profile/workflow selection and delivery mode.

## How It Works

For each selected tool, OvseSpec can install:

1. **Skills** (if delivery includes skills): `.../skills/ovsespec-*/SKILL.md`
2. **Commands** (if delivery includes commands): tool-specific `ovsx-*` command files

By default, OvseSpec uses the `core` profile, which includes:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

You can enable expanded workflows (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `ovsespec config profile`, then run `ovsespec update`.

## Tool Directory Reference

| Tool (ID) | Skills path pattern | Command path pattern |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/ovsespec-*/SKILL.md` | `.amazonq/prompts/ovsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/ovsespec-*/SKILL.md` | `.agent/workflows/ovsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/ovsespec-*/SKILL.md` | `.augment/commands/ovsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/ovsespec-*/SKILL.md` | `.bob/commands/ovsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/ovsespec-*/SKILL.md` | `.claude/commands/ovsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/ovsespec-*/SKILL.md` | `.clinerules/workflows/ovsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/ovsespec-*/SKILL.md` | `.codebuddy/commands/ovsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/ovsespec-*/SKILL.md` | `$CODEX_HOME/prompts/ovsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/ovsespec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/ovsespec-*` invocations) |
| Continue (`continue`) | `.continue/skills/ovsespec-*/SKILL.md` | `.continue/prompts/ovsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/ovsespec-*/SKILL.md` | `.cospec/ovsespec/commands/ovsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/ovsespec-*/SKILL.md` | `.crush/commands/ovsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/ovsespec-*/SKILL.md` | `.cursor/commands/ovsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/ovsespec-*/SKILL.md` | `.factory/commands/ovsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/ovsespec-*/SKILL.md` | `.gemini/commands/ovsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/ovsespec-*/SKILL.md` | `.github/prompts/ovsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/ovsespec-*/SKILL.md` | `.iflow/commands/ovsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/ovsespec-*/SKILL.md` | `.junie/commands/ovsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/ovsespec-*/SKILL.md` | `.kilocode/workflows/ovsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/ovsespec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/skill:ovsespec-*` invocations) |
| Kiro (`kiro`) | `.kiro/skills/ovsespec-*/SKILL.md` | `.kiro/prompts/ovsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/ovsespec-*/SKILL.md` | `.lingma/commands/ovsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/ovsespec-*/SKILL.md` | `.opencode/commands/ovsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/ovsespec-*/SKILL.md` | `.pi/prompts/ovsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/ovsespec-*/SKILL.md` | `.qoder/commands/ovsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/ovsespec-*/SKILL.md` | `.qwen/commands/ovsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/ovsespec-*/SKILL.md` | `.roo/commands/ovsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/ovsespec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/ovsespec-*` invocations) |
| Windsurf (`windsurf`) | `.windsurf/skills/ovsespec-*/SKILL.md` | `.windsurf/workflows/ovsx-<id>.md` |

\* Codex commands are installed in the global Codex home (`$CODEX_HOME/prompts/` if set, otherwise `~/.codex/prompts/`), not your project directory.

\*\* GitHub Copilot prompt files are recognized as custom slash commands in IDE extensions (VS Code, JetBrains, Visual Studio). Copilot CLI does not currently consume `.github/prompts/*.prompt.md` directly.

## Non-Interactive Setup

For CI/CD or scripted setup, use `--tools` (and optionally `--profile`):

```bash
# Configure specific tools
ovsespec init --tools claude,cursor

# Configure all supported tools
ovsespec init --tools all

# Skip tool configuration
ovsespec init --tools none

# Override profile for this init run
ovsespec init --profile core
```

**Available tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-Dependent Installation

OvseSpec installs workflow artifacts based on selected workflows:

- **Core profile (default):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Custom selection:** any subset of all workflow IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In other words, skill/command counts are profile-dependent and delivery-dependent, not fixed.

## Generated Skill Names

When selected by profile/workflow config, OvseSpec generates these skills:

- `ovsespec-propose`
- `ovsespec-explore`
- `ovsespec-new-change`
- `ovsespec-continue-change`
- `ovsespec-apply-change`
- `ovsespec-ff-change`
- `ovsespec-sync-specs`
- `ovsespec-archive-change`
- `ovsespec-bulk-archive-change`
- `ovsespec-verify-change`
- `ovsespec-onboard`

See [Commands](commands.md) for command behavior and [CLI](cli.md) for `init`/`update` options.

## Related

- [CLI Reference](cli.md) — Terminal commands
- [Commands](commands.md) — Slash commands and skills
- [Getting Started](getting-started.md) — First-time setup
