export function getVerifyChangeSkillTemplate() {
    return {
        name: 'ovsespec-verify-change',
        description: 'Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.',
        instructions: `Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`ovsespec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   \`\`\`bash
   ovsespec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   \`\`\`bash
   ovsespec instructions apply --change "<name>" --json
   \`\`\`

   This returns the change directory and \`contextFiles\` (artifact ID -> array of concrete file paths). Read all available artifacts from \`contextFiles\`.

4. **Initialize verification result**

   Keep verification output short and actionable. Track only:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence only when design.md exists

   Use only CRITICAL or WARNING by default. Do not add suggestions unless they point to a concrete file or missing test.

5. **Verify Completeness**

   **Task Completion**:
   - If \`contextFiles.tasks\` exists, read every file path in it
   - Parse checkboxes: \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in \`ovsespec/changes/<name>/specs/\`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

6. **Verify Correctness**

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

7. **Verify Coherence**

   **Design Adherence**:
   - If \`contextFiles.design\` exists:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Only report significant pattern deviations that can break maintainability or behavior.
   - Do not nitpick style or create generic improvement suggestions.

8. **Generate Verification Result**

   Output a compact result, not a long audit document:
   \`\`\`
   ## Verification: <change-name>

   Result: pass / blocked / pass with warnings
   Checked: tasks X/Y, requirements M/N, scenarios P/Q

   Critical:
   - <must fix before archive, with file reference>

   Warnings:
   - <specific issue, with file reference>

   Skipped:
   - <check skipped because artifact/tooling was absent>
   \`\`\`

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer not reporting it. If the uncertainty matters, report a WARNING with exact missing evidence.
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use concise markdown with:
- One result line
- Counts for tasks, requirements, and scenarios
- Grouped lists for CRITICAL/WARNING only
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"
- Do not write a separate verification file unless the user explicitly asks`,
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
export function getOvsxVerifyCommandTemplate() {
    return {
        name: 'OVSX: Verify',
        description: '归档前校验实现是否匹配变更产物',
        category: 'Workflow',
        tags: ['workflow', 'verify'],
        content: `校验实现是否匹配变更产物，包括 specs、tasks 和 design。

保留原命令意图：归档前做实现一致性检查，输出可操作的问题清单。不要直接修复，除非用户明确要求进入实现。

**输入**：可以指定变更名，例如 \`/ovsx:verify add-auth\`。如果省略，先从上下文推断；如果不明确，必须让用户选择。

**步骤**

1. 如果没有明确变更名，运行 \`ovsespec list --json\`，让用户选择。不要猜测。
2. 检查状态：
   \`\`\`bash
   ovsespec status --change "<name>" --json
   \`\`\`
3. 获取 apply 上下文并读取所有可用产物：
   \`\`\`bash
   ovsespec instructions apply --change "<name>" --json
   \`\`\`

4. 建立简洁校验结果：
   - **完整性**：任务完成度、spec 覆盖度
   - **正确性**：requirement 和 scenario 是否有实现证据
   - **一致性**：仅在 design.md 存在时检查关键设计是否被违反

5. 校验完整性：
   - 读取 tasks，统计 \`- [ ]\` 和 \`- [x]\`。
   - 读取 delta specs，提取 requirements。
   - 对未完成任务或看不到实现证据的 requirement 记录 CRITICAL。

6. 校验正确性：
   - 搜索代码和测试，寻找每个 requirement/scenario 的实现证据。
   - 如果实现可能偏离 spec，记录 WARNING，并给出具体文件引用。

7. 校验一致性：
   - 如果存在 design，检查关键决策是否被实现遵守。
   - 只记录会影响行为、可维护性或契约的一致性问题；不要输出泛泛风格建议。

**输出格式**

用中文输出简洁 markdown 结果，不写独立校验文档：

\`\`\`
## 校验结果：<change-name>

结论：pass / blocked / pass with warnings
检查：tasks X/Y，requirements M/N，scenarios P/Q

### CRITICAL
- <必须归档前处理的问题，带具体建议>

### WARNING
- <建议处理的问题，带文件引用>

### Skipped
- <因为产物或工具缺失而跳过的检查>
\`\`\`

**护栏**
- 不确定时优先降低严重级别，不要制造误报。
- 每个问题都要有具体建议。
- 有文件证据时使用 \`file.ts:123\` 格式引用。
- 如果某类产物不存在，说明跳过了哪些检查以及原因。
- 不要输出模糊建议，例如“考虑再审查一下”。
- 不要生成新的 md 文件，除非用户明确要求。`
    };
}
//# sourceMappingURL=verify-change.js.map