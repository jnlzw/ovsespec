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

4. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have CRITICAL, WARNING, or SUGGESTION issues.

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
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

8. **Generate Verification Report**

   **Summary Scorecard**:
   \`\`\`
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   \`\`\`

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"`,
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

4. 建立三个维度的校验报告：
   - **完整性**：任务完成度、spec 覆盖度
   - **正确性**：requirement 和 scenario 是否有实现证据
   - **一致性**：实现是否符合 design 和项目模式

5. 校验完整性：
   - 读取 tasks，统计 \`- [ ]\` 和 \`- [x]\`。
   - 读取 delta specs，提取 requirements。
   - 对未完成任务或看不到实现证据的 requirement 记录 CRITICAL。

6. 校验正确性：
   - 搜索代码和测试，寻找每个 requirement/scenario 的实现证据。
   - 如果实现可能偏离 spec，记录 WARNING，并给出具体文件引用。

7. 校验一致性：
   - 如果存在 design，检查关键决策是否被实现遵守。
   - 检查新代码是否明显偏离项目模式。
   - 对不确定但有价值的问题记录 SUGGESTION。

**输出格式**

用中文输出 markdown 报告：

\`\`\`
## 校验报告：<change-name>

### 摘要
| 维度 | 状态 |
| --- | --- |
| 完整性 | X/Y 个任务，N 个 requirements |
| 正确性 | M/N 个 requirements 已覆盖 |
| 一致性 | 已遵守 / 有问题 |

### CRITICAL
- <必须归档前处理的问题，带具体建议>

### WARNING
- <建议处理的问题，带文件引用>

### SUGGESTION
- <可选改进>

### 最终评估
<是否可以归档，以及原因>
\`\`\`

**护栏**
- 不确定时优先降低严重级别，不要制造误报。
- 每个问题都要有具体建议。
- 有文件证据时使用 \`file.ts:123\` 格式引用。
- 如果某类产物不存在，说明跳过了哪些检查以及原因。
- 不要输出模糊建议，例如“考虑再审查一下”。`
    };
}
//# sourceMappingURL=verify-change.js.map