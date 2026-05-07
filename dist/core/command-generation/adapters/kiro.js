/**
 * Kiro Command Adapter
 *
 * Formats commands for Kiro following its .prompt.md specification.
 */
import path from 'path';
/**
 * Kiro adapter for command generation.
 * File path: .kiro/prompts/ovsx-<id>.prompt.md
 * Frontmatter: description
 */
export const kiroAdapter = {
    toolId: 'kiro',
    getFilePath(commandId) {
        return path.join('.kiro', 'prompts', `ovsx-${commandId}.prompt.md`);
    },
    formatFile(content) {
        return `---
description: ${content.description}
---

${content.body}
`;
    },
};
//# sourceMappingURL=kiro.js.map