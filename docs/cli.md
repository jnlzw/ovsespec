# CLI Reference

The OvseSpec CLI (`ovsespec`) provides terminal commands for project setup, validation, status inspection, and management. These commands complement the AI slash commands (like `/ovsx:propose`) documented in [Commands](commands.md).

## Summary

| Category | Commands | Purpose |
|----------|----------|---------|
| **Setup** | `init`, `update` | Initialize and update OvseSpec in your project |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Set up planning across linked repos or folders |
| **Browsing** | `list`, `view`, `show` | Explore changes and specs |
| **Validation** | `validate` | Check changes and specs for issues |
| **Lifecycle** | `archive` | Finalize completed changes |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | Artifact-driven workflow support |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Create and manage custom workflows |
| **Config** | `config` | View and modify settings |
| **Utility** | `feedback`, `completion` | Feedback and shell integration |

---

## Human vs Agent Commands

Most CLI commands are designed for **human use** in a terminal. Some commands also support **agent/script use** via JSON output.

### Human-Only Commands

These commands are interactive and designed for terminal use:

| Command | Purpose |
|---------|---------|
| `ovsespec init` | Initialize project (interactive prompts) |
| `ovsespec view` | Interactive dashboard |
| `ovsespec config edit` | Open config in editor |
| `ovsespec feedback` | Submit feedback via GitHub |
| `ovsespec completion install` | Install shell completions |

### Agent-Compatible Commands

These commands support `--json` output for programmatic use by AI agents and scripts:

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `ovsespec list` | Browse changes/specs | `--json` for structured data |
| `ovsespec show <item>` | Read content | `--json` for parsing |
| `ovsespec validate` | Check for issues | `--all --json` for bulk validation |
| `ovsespec status` | See artifact progress | `--json` for structured status |
| `ovsespec instructions` | Get next steps | `--json` for agent instructions |
| `ovsespec templates` | Find template paths | `--json` for path resolution |
| `ovsespec schemas` | List available schemas | `--json` for schema discovery |
| `ovsespec workspace setup --no-interactive` | Create a workspace with explicit inputs | `--json` for structured setup output |
| `ovsespec workspace list` | Browse known workspaces | `--json` for typed workspace objects |
| `ovsespec workspace link` | Link a repo or folder | `--json` for structured link output |
| `ovsespec workspace relink` | Repair a linked path | `--json` for structured link output |
| `ovsespec workspace doctor` | Check one workspace | `--json` for structured status output |

---

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Show version number |
| `--no-color` | Disable color output |
| `--help`, `-h` | Display help for command |

---

## Setup Commands

### `ovsespec init`

Initialize OvseSpec in your project. Creates the folder structure and configures AI tool integrations.

Default behavior uses global config defaults: profile `core`, delivery `skills`, workflows `propose, explore, apply, sync, archive`.

```
ovsespec init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Target directory (default: current directory) |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configure AI tools non-interactively. Use `all`, `none`, or comma-separated list |
| `--force` | Auto-cleanup legacy files without prompting |
| `--profile <profile>` | Override global profile for this init run (`core` or `custom`) |

`--profile custom` uses whatever workflows are currently selected in global config (`ovsespec config profile`).

**Supported tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Examples:**

```bash
# Interactive initialization
ovsespec init

# Initialize in a specific directory
ovsespec init ./my-project

# Non-interactive: configure for Claude and Cursor
ovsespec init --tools claude,cursor

# Configure for all supported tools
ovsespec init --tools all

# Override profile for this run
ovsespec init --profile core

# Skip prompts and auto-cleanup legacy files
ovsespec init --force
```

**What it creates:**

```
ovsespec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OVSX commands only if delivery includes commands
... (other tool configs)
```

---

### `ovsespec update`

Update OvseSpec instruction files after upgrading the CLI. Re-generates AI tool configuration files using your current global profile, selected workflows, and delivery mode.

```
ovsespec update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Target directory (default: current directory) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Force update even when files are up to date |

**Example:**

```bash
# Update instruction files after npm upgrade
npm update @jn-lzw/ovsespec
ovsespec update
```

---

## Workspace Commands

Workspace commands are under active development and are not ready for use yet. Do not build external automation, integrations, or long-lived workflows on top of this command surface; command behavior, state files, and JSON output can change at any point.

Coordination workspaces are planning homes for work that spans multiple repos or folders. Workspace visibility is not change commitment: link the repos or folders OvseSpec should know about, then create changes when you are ready to plan specific work.

### `ovsespec workspace setup`

Create a workspace in the standard OvseSpec workspace location and link at least one existing repo or folder.

```bash
ovsespec workspace setup [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Workspace name. Names must be kebab-case |
| `--link <path>` | Link an existing repo or folder and infer the link name from the folder name |
| `--link <name>=<path>` | Link an existing repo or folder with an explicit link name |
| `--opener <id>` | Store a preferred opener during non-interactive setup: `codex`, `claude`, `github-copilot`, or `editor` |
| `--no-interactive` | Disable prompts; requires `--name` and at least one `--link` |
| `--json` | Output JSON; requires `--no-interactive` |

**Examples:**

```bash
ovsespec workspace setup
ovsespec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
ovsespec workspace setup --no-interactive --name platform --link /repos/api --opener codex
ovsespec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Interactive setup asks for a preferred opener and stores it in machine-local workspace state. Non-interactive setup stores a preferred opener only when `--opener` is provided; otherwise `workspace open` prompts later in interactive terminals when a supported opener is available, or asks scripts to pass `--agent <tool>` or `--editor`.

### `ovsespec workspace list`

List known OvseSpec workspaces from the local registry.

```bash
ovsespec workspace list [--json]
ovsespec workspace ls [--json]
```

The list shows each workspace location and linked repos or folders. Stale registry records are reported but not changed.

### `ovsespec workspace link`

Record an existing repo or folder for one workspace.

```bash
ovsespec workspace link [name] <path> [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Select a known workspace from the local registry |
| `--json` | Output JSON |
| `--no-interactive` | Disable workspace picker prompts |

**Examples:**

```bash
ovsespec workspace link /repos/api
ovsespec workspace link api-service /repos/api
ovsespec workspace link --workspace platform /repos/platform/apps/checkout
```

The path must already exist. Relative paths are resolved against the command's current directory before OvseSpec stores the verified absolute path in machine-local workspace state. Linked paths can be full repos, packages, services, apps, or folders without repo-local `ovsespec/` state.

### `ovsespec workspace relink`

Repair or change the local path for an existing link.

```bash
ovsespec workspace relink <name> <path> [options]
```

The path must already exist. Relink updates only the machine-local path for the stable link name.

### `ovsespec workspace doctor`

Check what one workspace can resolve on the current machine.

```bash
ovsespec workspace doctor [options]
```

Doctor shows the workspace location, planning path, linked repos or folders, missing paths, repo-local specs paths when present, and suggested fixes. It reports issues only; it does not repair them automatically.

Commands that need one workspace use the current workspace when run from inside a workspace folder or subdirectory. From elsewhere, pass `--workspace <name>`, select from the picker in an interactive terminal, or rely on the only known workspace when exactly one exists. In `--json` or `--no-interactive` mode, ambiguous selection fails with a structured status error and suggests `--workspace <name>`.

JSON responses use typed objects plus `status` arrays. Primary data lives in `workspace`, `workspaces`, or `link`; warnings and errors live in `status`.

### `ovsespec workspace open`

Open a workspace working set through the stored preferred opener, a one-session agent override, or VS Code editor mode.

```bash
ovsespec workspace open [name] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Alias for the positional workspace name |
| `--agent <tool>` | One-session agent override: `codex`, `claude`, or `github-copilot` |
| `--editor` | Open the maintained VS Code workspace file as a normal editor workspace |
| `--no-interactive` | Disable workspace and opener picker prompts |

**Examples:**

```bash
ovsespec workspace open
ovsespec workspace open platform
ovsespec workspace open platform --agent github-copilot
ovsespec workspace open --agent codex
ovsespec workspace open --editor
```

`workspace open` uses the current workspace when run inside one, auto-selects the only known workspace when run elsewhere, and asks the user to choose when multiple workspaces are known. `--agent` and `--editor` do not change the stored preferred opener. Passing both opener overrides is an error; choose either `--agent <tool>` or `--editor`.

OvseSpec maintains `<workspace-name>.code-workspace` at the workspace root for VS Code editor and GitHub Copilot-in-VS-Code opens. That file is machine-local and ignored by default with a specific `<workspace-name>.code-workspace` `.gitignore` entry, so user-authored `*.code-workspace` files remain eligible for tracking.

The maintained VS Code workspace includes the coordination root as `.` plus valid linked repos or folders as additional roots. VS Code displays those entries as a multi-root workspace.

Root workspace open supports exploration and planning across linked repos or folders. Implementation edits should start only after an explicit user request and a normal OvseSpec implementation workflow.

---

## Browsing Commands

### `ovsespec list`

List changes or specs in your project.

```
ovsespec list [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--specs` | List specs instead of changes |
| `--changes` | List changes (default) |
| `--sort <order>` | Sort by `recent` (default) or `name` |
| `--json` | Output as JSON |

**Examples:**

```bash
# List all active changes
ovsespec list

# List all specs
ovsespec list --specs

# JSON output for scripts
ovsespec list --json
```

**Output (text):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `ovsespec view`

Display an interactive dashboard for exploring specs and changes.

```
ovsespec view
```

Opens a terminal-based interface for navigating your project's specifications and changes.

---

### `ovsespec show`

Display details of a change or spec.

```
ovsespec show [item-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Name of change or spec (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--type <type>` | Specify type: `change` or `spec` (auto-detected if unambiguous) |
| `--json` | Output as JSON |
| `--no-interactive` | Disable prompts |

**Change-specific options:**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Show only delta specs (JSON mode) |

**Spec-specific options:**

| Option | Description |
|--------|-------------|
| `--requirements` | Show only requirements, exclude scenarios (JSON mode) |
| `--no-scenarios` | Exclude scenario content (JSON mode) |
| `-r, --requirement <id>` | Show specific requirement by 1-based index (JSON mode) |

**Examples:**

```bash
# Interactive selection
ovsespec show

# Show a specific change
ovsespec show add-dark-mode

# Show a specific spec
ovsespec show auth --type spec

# JSON output for parsing
ovsespec show add-dark-mode --json
```

---

## Validation Commands

### `ovsespec validate`

Validate changes and specs for structural issues.

```
ovsespec validate [item-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Specific item to validate (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | Validate all changes and specs |
| `--changes` | Validate all changes |
| `--specs` | Validate all specs |
| `--type <type>` | Specify type when name is ambiguous: `change` or `spec` |
| `--strict` | Enable strict validation mode |
| `--json` | Output as JSON |
| `--concurrency <n>` | Max parallel validations (default: 6, or `OVSESPEC_CONCURRENCY` env) |
| `--no-interactive` | Disable prompts |

**Examples:**

```bash
# Interactive validation
ovsespec validate

# Validate a specific change
ovsespec validate add-dark-mode

# Validate all changes
ovsespec validate --changes

# Validate everything with JSON output (for CI/scripts)
ovsespec validate --all --json

# Strict validation with increased parallelism
ovsespec validate --all --strict --concurrency 12
```

**Output (text):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Output (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lifecycle Commands

### `ovsespec archive`

Archive a completed change and merge delta specs into main specs.

```
ovsespec archive [change-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Change to archive (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--skip-specs` | Skip spec updates (for infrastructure/tooling/doc-only changes) |
| `--no-validate` | Skip validation (requires confirmation) |

**Examples:**

```bash
# Interactive archive
ovsespec archive

# Archive specific change
ovsespec archive add-dark-mode

# Archive without prompts (CI/scripts)
ovsespec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
ovsespec archive update-ci-config --skip-specs
```

**What it does:**

1. Validates the change (unless `--no-validate`)
2. Prompts for confirmation (unless `--yes`)
3. Merges delta specs into `ovsespec/specs/`
4. Moves change folder to `ovsespec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow Commands

These commands support the artifact-driven OVSX workflow. They're useful for both humans checking progress and agents determining next steps.

### `ovsespec status`

Display artifact completion status for a change.

```
ovsespec status [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Change name (prompts if omitted) |
| `--schema <name>` | Schema override (auto-detected from change's config) |
| `--json` | Output as JSON |

**Examples:**

```bash
# Interactive status check
ovsespec status

# Status for specific change
ovsespec status --change add-dark-mode

# JSON for agent use
ovsespec status --change add-dark-mode --json
```

**Output (text):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/3 artifacts complete

[x] proposal
[x] specs
[ ] tasks
```

**Output (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "ready"}
  ]
}
```

---

### `ovsespec instructions`

Get enriched instructions for creating an artifact or applying tasks. Used by AI agents to understand what to create next.

```
ovsespec instructions [artifact] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `artifact` | No | Artifact ID: `proposal`, `specs`, `design`, `tasks`, or `apply` |

**Options:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Change name (required in non-interactive mode) |
| `--schema <name>` | Schema override |
| `--json` | Output as JSON |

**Special case:** Use `apply` as the artifact to get task implementation instructions.

**Examples:**

```bash
# Get instructions for next artifact
ovsespec instructions --change add-dark-mode

# Get specific artifact instructions
ovsespec instructions design --change add-dark-mode

# Get apply/implementation instructions
ovsespec instructions apply --change add-dark-mode

# JSON for agent consumption
ovsespec instructions design --change add-dark-mode --json
```

**Output includes:**

- Template content for the artifact
- Project context from config
- Content from dependency artifacts
- Per-artifact rules from config

---

### `ovsespec templates`

Show resolved template paths for all artifacts in a schema.

```
ovsespec templates [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schema to inspect (default: `spec-driven`) |
| `--json` | Output as JSON |

**Examples:**

```bash
# Show template paths for default schema
ovsespec templates

# Show templates for custom schema
ovsespec templates --schema my-workflow

# JSON for programmatic use
ovsespec templates --json
```

**Output (text):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.ovsespec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.ovsespec/schemas/spec-driven/templates/specs.md
  tasks     → ~/.ovsespec/schemas/spec-driven/templates/tasks.md
```

---

### `ovsespec schemas`

List available workflow schemas with their descriptions and artifact flows.

```
ovsespec schemas [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

**Example:**

```bash
ovsespec schemas
```

**Output:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema Commands

Commands for creating and managing custom workflow schemas.

### `ovsespec schema init`

Create a new project-local schema.

```
ovsespec schema init <name> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Schema name (kebab-case) |

**Options:**

| Option | Description |
|--------|-------------|
| `--description <text>` | Schema description |
| `--artifacts <list>` | Comma-separated artifact IDs (default: `proposal,specs,tasks`) |
| `--default` | Set as project default schema |
| `--no-default` | Don't prompt to set as default |
| `--force` | Overwrite existing schema |
| `--json` | Output as JSON |

**Examples:**

```bash
# Interactive schema creation
ovsespec schema init research-first

# Non-interactive with specific artifacts
ovsespec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**What it creates:**

```
ovsespec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    └── tasks.md
```

---

### `ovsespec schema fork`

Copy an existing schema to your project for customization.

```
ovsespec schema fork <source> [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | Schema to copy |
| `name` | No | New schema name (default: `<source>-custom`) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing destination |
| `--json` | Output as JSON |

**Example:**

```bash
# Fork the built-in spec-driven schema
ovsespec schema fork spec-driven my-workflow
```

---

### `ovsespec schema validate`

Validate a schema's structure and templates.

```
ovsespec schema validate [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Schema to validate (validates all if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | Show detailed validation steps |
| `--json` | Output as JSON |

**Example:**

```bash
# Validate a specific schema
ovsespec schema validate my-workflow

# Validate all schemas
ovsespec schema validate
```

---

### `ovsespec schema which`

Show where a schema resolves from (useful for debugging precedence).

```
ovsespec schema which [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Schema name |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | List all schemas with their sources |
| `--json` | Output as JSON |

**Example:**

```bash
# Check where a schema comes from
ovsespec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@jn-lzw/ovsespec/schemas/spec-driven
```

**Schema precedence:**

1. Project: `ovsespec/schemas/<name>/`
2. User: `~/.local/share/ovsespec/schemas/<name>/`
3. Package: Built-in schemas

---

## Configuration Commands

### `ovsespec config`

View and modify global OvseSpec configuration.

```
ovsespec config <subcommand> [options]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `path` | Show config file location |
| `list` | Show all current settings |
| `get <key>` | Get a specific value |
| `set <key> <value>` | Set a value |
| `unset <key>` | Remove a key |
| `reset` | Reset to defaults |
| `edit` | Open in `$EDITOR` |
| `profile [preset]` | Configure workflow profile interactively or via preset |

**Examples:**

```bash
# Show config file path
ovsespec config path

# List all settings
ovsespec config list

# Get a specific value
ovsespec config get telemetry.enabled

# Set a value
ovsespec config set telemetry.enabled false

# Set a string value explicitly
ovsespec config set user.name "My Name" --string

# Remove a custom setting
ovsespec config unset user.name

# Reset all configuration
ovsespec config reset --all --yes

# Edit config in your editor
ovsespec config edit

# Configure profile with action-based wizard
ovsespec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
ovsespec config profile core
```

`ovsespec config profile` starts with a current-state summary, then lets you choose:
- Change delivery + workflows
- Change delivery only
- Change workflows only
- Keep current settings (exit)

If you keep current settings, no changes are written and no update prompt is shown.
If there are no config changes but the current project files are out of sync with your global profile/delivery, OvseSpec will show a warning and suggest running `ovsespec update`.
Pressing `Ctrl+C` also cancels the flow cleanly (no stack trace) and exits with code `130`.
In the workflow checklist, `[x]` means the workflow is selected in global config. To apply those selections to project files, run `ovsespec update` (or choose `Apply changes to this project now?` when prompted inside a project).

**Interactive examples:**

```bash
# Delivery-only update
ovsespec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
ovsespec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## Utility Commands

### `ovsespec feedback`

Submit feedback about OvseSpec. Creates a GitHub issue.

```
ovsespec feedback <message> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | Feedback message |

**Options:**

| Option | Description |
|--------|-------------|
| `--body <text>` | Detailed description |

**Requirements:** GitHub CLI (`gh`) must be installed and authenticated.

**Example:**

```bash
ovsespec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `ovsespec completion`

Manage shell completions for the OvseSpec CLI.

```
ovsespec completion <subcommand> [shell]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | Output completion script to stdout |
| `install [shell]` | Install completion for your shell |
| `uninstall [shell]` | Remove installed completions |

**Supported shells:** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

```bash
# Install completions (auto-detects shell)
ovsespec completion install

# Install for specific shell
ovsespec completion install zsh

# Generate script for manual installation
ovsespec completion generate bash > ~/.bash_completion.d/ovsespec

# Uninstall
ovsespec completion uninstall
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (validation failure, missing files, etc.) |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OVSESPEC_TELEMETRY` | Set to `0` to disable telemetry |
| `DO_NOT_TRACK` | Set to `1` to disable telemetry (standard DNT signal) |
| `OVSESPEC_CONCURRENCY` | Default concurrency for bulk validation (default: 6) |
| `EDITOR` or `VISUAL` | Editor for `ovsespec config edit` |
| `NO_COLOR` | Disable color output when set |

---

## Related Documentation

- [Commands](commands.md) - AI slash commands (`/ovsx:propose`, `/ovsx:apply`, etc.)
- [Workflows](workflows.md) - Common patterns and when to use each command
- [Customization](customization.md) - Create custom schemas and templates
- [Getting Started](getting-started.md) - First-time setup guide
