## MODIFIED Requirements
### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with OvseSpec-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside ovsespec/)
- **AND** populate the managed block with a short stub that points teammates to `@/ovsespec/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside ovsespec/)
- **AND** populate the managed block with a short stub that points teammates to `@/ovsespec/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside ovsespec/)
- **AND** populate the managed block with a short stub that points teammates to `@/ovsespec/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `ovsespec/AGENTS.md`:
```markdown
<!-- OVSESPEC:START -->
# OvseSpec Instructions

This project uses OvseSpec to manage AI assistant workflows.

- Full guidance lives in '@/ovsespec/AGENTS.md'.
- Keep this managed block so 'ovsespec update' can refresh the instructions.
<!-- OVSESPEC:END -->
```

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/ovsespec/proposal.md`, `.claude/commands/ovsespec/apply.md`, and `.claude/commands/ovsespec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for CodeBuddy Code
- **WHEN** the user selects CodeBuddy Code during initialization
- **THEN** create `.codebuddy/commands/ovsespec/proposal.md`, `.codebuddy/commands/ovsespec/apply.md`, and `.codebuddy/commands/ovsespec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OvseSpec workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/ovsespec-proposal.md`, `.clinerules/ovsespec-apply.md`, and `.clinerules/ovsespec-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
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
