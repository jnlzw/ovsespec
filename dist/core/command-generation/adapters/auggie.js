/**
 * Auggie (Augment CLI) Command Adapter
 *
 * Formats commands for Auggie following its frontmatter specification.
 */
import path from 'path';
/**
 * Auggie adapter for command generation.
 * File path: .augment/commands/ovsx-<id>.md
 * Frontmatter: description, argument-hint
 */
export const auggieAdapter = {
    toolId: 'auggie',
    getFilePath(commandId) {
        return path.join('.augment', 'commands', `ovsx-${commandId}.md`);
    },
    formatFile(content) {
        return `---
description: ${content.description}
argument-hint: command arguments
---

${content.body}
`;
    },
};
//# sourceMappingURL=auggie.js.map