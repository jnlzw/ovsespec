/**
 * Static template strings for Bash completion scripts.
 * These are Bash-specific helper functions that never change.
 */

export const BASH_DYNAMIC_HELPERS = `# Dynamic completion helpers

_ovsespec_complete_changes() {
  local changes
  changes=$(ovsespec __complete changes 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$changes" -- "$cur"))
}

_ovsespec_complete_specs() {
  local specs
  specs=$(ovsespec __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$specs" -- "$cur"))
}

_ovsespec_complete_items() {
  local items
  items=$(ovsespec __complete changes 2>/dev/null | cut -f1; ovsespec __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$items" -- "$cur"))
}

_ovsespec_complete_schemas() {
  local schemas
  schemas=$(ovsespec __complete schemas 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$schemas" -- "$cur"))
}`;
