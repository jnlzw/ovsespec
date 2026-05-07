/**
 * CoStrict Command Adapter
 *
 * Formats commands for CoStrict following its frontmatter specification.
 */
import path from 'path';
/**
 * CoStrict adapter for command generation.
 * File path: .cospec/ovsespec/commands/ovsx-<id>.md
 * Frontmatter: description, argument-hint
 */
export const costrictAdapter = {
    toolId: 'costrict',
    getFilePath(commandId) {
        return path.join('.cospec', 'ovsespec', 'commands', `ovsx-${commandId}.md`);
    },
    formatFile(content) {
        return `---
description: "${content.description}"
argument-hint: command arguments
---

${content.body}
`;
    },
};
//# sourceMappingURL=costrict.js.map