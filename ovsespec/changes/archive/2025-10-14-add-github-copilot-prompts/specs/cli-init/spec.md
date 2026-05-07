## MODIFIED Requirements

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
- **THEN** create `.opencode/commands/ovsespec-proposal.md`, `.opencode/commands/ovsespec-apply.md`, and `.opencode/commands/ovsespec-archive.md`
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

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/ovsespec-proposal.prompt.md`, `.github/prompts/ovsespec-apply.prompt.md`, and `.github/prompts/ovsespec-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with OvseSpec markers so `ovsespec update` can refresh the content
- **AND** each template includes instructions for the relevant OvseSpec workflow stage
