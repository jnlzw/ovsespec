## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OvseSpec instructions based on user selection.

#### Scenario: Prompting for AI tool selection

- **WHEN** run
- **THEN** prompt user to select AI tools to configure:
  - Claude Code (✅ OvseSpec custom slash commands available)
  - Cursor (✅ OvseSpec custom slash commands available)
  - AGENTS.md (works with Codex, Amp, Copilot, …)

### Requirement: AI Tool Configuration Details
The command SHALL properly configure selected AI tools with OvseSpec-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside ovsespec/)

#### Scenario: Configuring AGENTS standard

- **WHEN** the AGENTS.md standard is selected
- **THEN** create or update `AGENTS.md` in the project root directory (not inside ovsespec/)

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with OvseSpec content wrapped in markers:
```markdown
<!-- OVSESPEC:START -->
# OvseSpec Project

This document provides instructions for AI coding assistants on how to use OvseSpec conventions for spec-driven development. Follow these rules precisely when working on OvseSpec-enabled projects.

This project uses OvseSpec for spec-driven development. Specifications are the source of truth.

See @ovsespec/AGENTS.md for detailed conventions and guidelines.
<!-- OVSESPEC:END -->
```

#### Scenario: Creating new AGENTS.md

- **WHEN** AGENTS.md does not exist in the project root
- **THEN** create new file with OvseSpec content wrapped in markers using the same template as CLAUDE.md

#### Scenario: Updating existing CLAUDE.md

- **WHEN** CLAUDE.md already exists
- **THEN** preserve all existing content
- **AND** insert OvseSpec content at the beginning of the file using markers
- **AND** ensure markers don't duplicate if they already exist

#### Scenario: Updating existing AGENTS.md

- **WHEN** AGENTS.md already exists in the project root
- **THEN** preserve all existing content
- **AND** ensure the OvseSpec-managed block at the beginning of the file is refreshed without duplicating markers

#### Scenario: Managing content with markers

- **WHEN** using the marker system
- **THEN** use `<!-- OVSESPEC:START -->` to mark the beginning of managed content
- **AND** use `<!-- OVSESPEC:END -->` to mark the end of managed content
- **AND** allow OvseSpec to update its content without affecting user customizations
- **AND** preserve all content outside the markers intact

WHY use markers:
- Users may have existing CLAUDE.md or AGENTS.md instructions they want to keep
- OvseSpec can update its instructions in future versions
- Clear boundary between OvseSpec-managed and user-managed content
