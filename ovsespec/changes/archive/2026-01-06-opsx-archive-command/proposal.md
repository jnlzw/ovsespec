## Why

The experimental workflow (OVSX) provides a schema-driven, artifact-by-artifact approach to creating changes with `/ovsx:new`, `/ovsx:continue`, `/ovsx:ff`, `/ovsx:apply`, and `/ovsx:sync`. However, there's no corresponding archive command to finalize and archive completed changes. Users must currently fall back to the regular `ovsespec archive` command, which doesn't integrate with the OVSX philosophy of agent-driven spec syncing and schema-aware artifact tracking.

## What Changes

- Add `/ovsx:archive` slash command for archiving changes in the experimental workflow
- Use artifact graph to check completion status (schema-aware) instead of just validating proposal + specs
- Prompt for `/ovsx:sync` before archiving instead of programmatically applying specs
- Preserve `.ovsespec.yaml` schema metadata when moving to archive
- Integrate with existing OVSX commands for a cohesive workflow

## Capabilities

### New Capabilities

- `ovsx-archive-skill`: Slash command and skill for archiving completed changes in the experimental workflow. Checks artifact completion via artifact graph, verifies task completion, optionally syncs specs via `/ovsx:sync`, and moves the change to `archive/YYYY-MM-DD-<name>/`.

### Modified Capabilities

(none - this is a new skill that doesn't modify existing specs)

## Impact

- New file: `.claude/commands/ovsx/archive.md`
- New skill definition (generated via `ovsespec artifact-experimental-setup`)
- No changes to existing archive command or other OVSX commands
- Completes the OVSX command suite for full lifecycle management
