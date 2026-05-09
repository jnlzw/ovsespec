export function getNewChangeSkillTemplate() {
    return {
        name: 'ovsespec-new-change',
        description: 'Start a new OvseSpec change using the experimental artifact workflow. Use when the user wants to create a new feature, fix, or modification with a structured step-by-step approach.',
        instructions: `Start a new change using the experimental artifact-driven approach.

**Input**: The user's request should include a change name (kebab-case) OR a description of what they want to build.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → \`add-user-auth\`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Determine the workflow schema**

   Use the default schema (omit \`--schema\`) unless the user explicitly requests a different workflow.

   **Use a different schema only if the user mentions:**
   - A specific schema name → use \`--schema <name>\`
   - "show workflows" or "what workflows" → run \`ovsespec schemas --json\` and let them choose

   **Otherwise**: Omit \`--schema\` to use the default.

3. **Create the change directory**
   \`\`\`bash
   ovsespec new change "<name>"
   \`\`\`
   Add \`--schema <name>\` only if the user requested a specific workflow.
   This creates a scaffolded change at \`ovsespec/changes/<name>/\` with the selected schema.

4. **Show the artifact status**
   \`\`\`bash
   ovsespec status --change "<name>"
   \`\`\`
   This shows which artifacts need to be created and which are ready (dependencies satisfied).

5. **Get instructions for the first artifact**
   The first artifact depends on the schema (e.g., \`proposal\` for spec-driven).
   Check the status output to find the first artifact with status "ready".
   \`\`\`bash
   ovsespec instructions <first-artifact-id> --change "<name>"
   \`\`\`
   This outputs the template and context for creating the first artifact.

6. **STOP and wait for user direction**

**Output**

After completing the steps, summarize:
- Change name
- Schema/workflow being used and its artifact sequence
- Current status (0/N artifacts complete)
- The template for the first artifact
- Prompt: "Ready to create the first artifact? Just describe what this change is about and I'll draft it, or ask me to continue."

**Guardrails**
- Do NOT create any artifacts yet - just show the instructions
- Do NOT advance beyond showing the first artifact template
- If the name is invalid (not kebab-case), ask for a valid name
- If a change with that name already exists, suggest continuing that change instead
- Pass --schema if using a non-default workflow`,
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
export function getOvsxNewCommandTemplate() {
    return {
        name: 'OVSX: New',
        description: '创建新的变更骨架，并展示第一个可创建产物的说明',
        category: 'Workflow',
        tags: ['workflow', 'artifacts'],
        content: `创建一个新的 OvseSpec 变更骨架，但不生成任何产物。

保留原命令意图：只创建 change，并展示当前 schema 下第一个可创建产物的说明。不要越过边界直接写 planning artifacts。

**输入**：\`/ovsx:new\` 后面可以是 kebab-case 变更名，也可以是用户想构建或修复的描述。

**步骤**

1. 如果没有输入，使用 **AskUserQuestion tool** 询问用户想做什么，并从描述中推导 kebab-case 变更名。
2. 选择 schema。除非用户明确指定 schema，否则使用默认 schema，不传 \`--schema\`。
3. 创建变更：

   \`\`\`bash
   ovsespec new change "<name>"
   \`\`\`

   仅当用户明确要求特定 schema 时添加 \`--schema <name>\`。

4. 展示产物状态：

   \`\`\`bash
   ovsespec status --change "<name>"
   \`\`\`

5. 找到第一个 \`ready\` 产物，并展示其说明：

   \`\`\`bash
   ovsespec instructions <first-artifact-id> --change "<name>"
   \`\`\`

6. 停止，等待用户下一步指令。

**输出**

用中文总结：
- 变更名和目录
- 使用的 schema/workflow
- 当前产物进度
- 第一个可创建产物的模板或说明
- 提示：“准备创建第一个产物时，运行 \`/ovsx:continue\`。”

**护栏**
- 不要创建任何产物。
- 不要推进到第一个产物说明之后。
- 变更名不合法时要求用户提供合法 kebab-case 名称。
- 同名变更已存在时，建议改用 \`/ovsx:continue\`。
- 只有用户明确要求非默认 schema 时才传 \`--schema\`。`
    };
}
//# sourceMappingURL=new-change.js.map