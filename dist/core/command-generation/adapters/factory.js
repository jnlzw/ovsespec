/**
 * Factory Droid Command Adapter
 *
 * Formats commands for Factory Droid following its frontmatter specification.
 */
import path from 'path';
/**
 * Factory adapter for command generation.
 * File path: .factory/commands/ovsx-<id>.md
 * Frontmatter: description, argument-hint
 */
export const factoryAdapter = {
    toolId: 'factory',
    getFilePath(commandId) {
        return path.join('.factory', 'commands', `ovsx-${commandId}.md`);
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
//# sourceMappingURL=factory.js.map