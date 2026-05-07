/**
 * Static template strings for PowerShell completion scripts.
 * These are PowerShell-specific helper functions that never change.
 */
export const POWERSHELL_DYNAMIC_HELPERS = `# Dynamic completion helpers

function Get-OvseSpecChanges {
    $output = ovsespec __complete changes 2>$null
    if ($output) {
        $output | ForEach-Object {
            ($_ -split "\\t")[0]
        }
    }
}

function Get-OvseSpecSpecs {
    $output = ovsespec __complete specs 2>$null
    if ($output) {
        $output | ForEach-Object {
            ($_ -split "\\t")[0]
        }
    }
}

function Get-OvseSpecSchemas {
    $output = ovsespec __complete schemas 2>$null
    if ($output) {
        $output | ForEach-Object {
            ($_ -split "\\t")[0]
        }
    }
}
`;
//# sourceMappingURL=powershell-templates.js.map