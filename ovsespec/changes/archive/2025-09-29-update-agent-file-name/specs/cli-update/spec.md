## MODIFIED Requirements

### Requirement: Update Behavior
The update command SHALL update OvseSpec instruction files to the latest templates in a team-friendly manner.

#### Scenario: Running update command
- **WHEN** a user runs `ovsespec update`
- **THEN** replace `ovsespec/AGENTS.md` with the latest template

### Requirement: File Handling
The update command SHALL handle file updates in a predictable and safe manner.

#### Scenario: Updating files
- **WHEN** updating files
- **THEN** completely replace `ovsespec/AGENTS.md` with the latest template

### Requirement: Core Files Always Updated
The update command SHALL always update the core OvseSpec files and display an ASCII-safe success message.

#### Scenario: Successful update
- **WHEN** the update completes successfully
- **THEN** replace `ovsespec/AGENTS.md` with the latest template
