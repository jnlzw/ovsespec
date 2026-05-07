## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OvseSpec instructions using a marker system.
#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** prompt the user with "Which AI tools do you use?" using a multi-select menu
- **AND** list every available tool with a checkbox:
  - Claude Code (creates or refreshes CLAUDE.md and slash commands)
  - Cursor (creates or refreshes `.cursor/commands/*` slash commands)
  - OpenCode (creates or refreshes `.opencode/command/ovsespec-*.md` slash commands)
  - Windsurf (creates or refreshes `.windsurf/workflows/ovsespec-*.md` workflows)
  - Kilo Code (creates or refreshes `.kilocode/workflows/ovsespec-*.md` workflows)
  - Codex (creates or refreshes global prompts at `~/.codex/prompts/ovsespec-*.md`)
  - AGENTS.md standard (creates or refreshes AGENTS.md with OvseSpec markers)
- **AND** show "(already configured)" beside tools whose managed files exist so users understand selections will refresh content
- **AND** treat disabled tools as "coming soon" and keep them unselectable
- **AND** allow confirming with Enter after selecting one or more tools

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/ovsespec/proposal.md`, `.claude/commands/ovsespec/apply.md`, and `.claude/commands/ovsespec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/ovsespec-proposal.md`, `.cursor/commands/ovsespec-apply.md`, and `.cursor/commands/ovsespec-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/command/ovsespec-proposal.md`, `.opencode/command/ovsespec-apply.md`, and `.opencode/command/ovsespec-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/ovsespec-proposal.md`, `.windsurf/workflows/ovsespec-apply.md`, and `.windsurf/workflows/ovsespec-archive.md`
- **AND** populate each file from shared templates (wrapped in OvseSpec markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/ovsespec-proposal.md`, `.kilocode/workflows/ovsespec-apply.md`, and `.kilocode/workflows/ovsespec-archive.md`
- **AND** populate each file from shared templates (wrapped in OvseSpec markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/ovsespec-proposal.md`, `~/.codex/prompts/ovsespec-apply.md`, and `~/.codex/prompts/ovsespec-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in OvseSpec markers so `ovsespec update` can refresh the prompts without touching surrounding custom notes
