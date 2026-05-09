const ARCHIVE_INSTRUCTIONS = `归档一个已完成的 OvseSpec 变更。

保留原命令意图：检查变更是否适合结束，必要时提示同步 specs，然后把 active change 移动到 archive。归档摘要只记录产物、任务、spec 同步和技术风险状态，不默认生成团队交接字段。

**输入**：可以指定变更名，例如 \`/ovsx:archive add-auth\`。如果省略，先尝试从上下文推断；如果模糊，必须让用户选择。

**归档检查**

- 归档前检查是否还有未完成任务、未同步 specs、发布/迁移/兼容性/数据风险或未处理的接口契约事项。
- 对跨仓或 workspace 变更，确认每个受影响仓库/模块的状态，至少在摘要中说明已完成、跳过、未知或需要人工确认。
- 归档不应该隐藏风险。即使用户选择继续归档，也要把未完成或未确认事项写入最终摘要。
- 不要自动删除或修改 linked repo 中无关内容；归档只移动 OvseSpec change 目录。

**步骤**

1. **选择变更**

   如果没有明确变更名，运行：

   \`\`\`bash
   ovsespec list --json
   \`\`\`

   使用 **AskUserQuestion tool** 让用户选择 active change。
   展示候选时尽量包含 schema 信息。

   **重要**：不要在多个候选之间猜测。

2. **检查产物完成状态**

   运行：

   \`\`\`bash
   ovsespec status --change "<name>" --json
   \`\`\`

   解析：
   - \`schemaName\`
   - \`artifacts\`：每个产物的状态

   如果存在未完成产物：
   - 展示 warning，列出未完成产物。
   - 使用 **AskUserQuestion tool** 确认用户是否仍要归档。
   - 用户确认后才能继续。

3. **检查任务完成状态**

   读取任务文件，通常是 \`tasks.md\`，统计：
   - \`- [ ]\`：未完成任务
   - \`- [x]\`：已完成任务

   如果存在未完成任务：
   - 展示 warning 和数量。
   - 如能识别仓库或模块，附带说明。
   - 使用 **AskUserQuestion tool** 确认是否继续归档。

   如果没有任务文件，可继续，但在摘要中说明没有任务文件可检查。

4. **评估 delta spec 同步状态**

   检查：

   \`\`\`
   ovsespec/changes/<name>/specs/
   \`\`\`

   如果不存在 delta specs，继续归档。

   如果存在 delta specs：
   - 将每个 delta spec 与对应主 spec \`ovsespec/specs/<capability>/spec.md\` 对比。
   - 判断会产生哪些新增、修改、移除、重命名。
   - 汇总影响 capability、消费者、契约、迁移、兼容性或发布风险。
   - 在询问前展示合并摘要。

   **提示选项：**
   - 如果需要同步：\`立即同步（推荐）\`、\`不同步直接归档\`
   - 如果看起来已同步：\`立即归档\`、\`仍然同步\`、\`取消\`

   如果用户选择同步，按 \`ovsespec-sync-specs\` / \`/ovsx:sync\` 的 agent-driven 方式执行同步。同步后继续归档。

5. **执行归档**

   创建 archive 目录：

   \`\`\`bash
   mkdir -p ovsespec/changes/archive
   \`\`\`

   目标目录使用当前日期：

   \`\`\`
   ovsespec/changes/archive/YYYY-MM-DD-<change-name>
   \`\`\`

   如果目标目录已存在：
   - 失败并展示错误。
   - 建议重命名已有 archive、删除重复 archive，或改日再归档。

   如果不存在，移动目录：

   \`\`\`bash
   mv ovsespec/changes/<name> ovsespec/changes/archive/YYYY-MM-DD-<name>
   \`\`\`

6. **展示归档摘要**

   用中文总结：
   - 变更名
   - schema
   - archive 位置
   - specs 同步状态：已同步 / 跳过同步 / 没有 delta specs
   - 任务和产物完成情况
   - 如适用，技术风险摘要：影响仓库/模块、剩余契约风险、发布/迁移/兼容性事项

**成功输出示例**

\`\`\`
## 归档完成

**变更:** <change-name>
**Schema:** <schema-name>
**归档位置:** ovsespec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** 已同步到主 specs
**任务:** 全部完成
**技术风险:** 无未决事项
\`\`\`

**带 warning 的成功输出示例**

\`\`\`
## 归档完成（有 warning）

**变更:** <change-name>
**Schema:** <schema-name>
**归档位置:** ovsespec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** 用户选择跳过同步

**Warnings:**
- 仍有 2 个未完成产物
- 仍有 3 个未完成任务
- Delta spec 未同步
- 仍有发布/迁移/契约事项待确认
\`\`\`

**目标已存在时输出示例**

\`\`\`
## 归档失败

**变更:** <change-name>
**目标:** ovsespec/changes/archive/YYYY-MM-DD-<name>/

目标归档目录已存在。

可选处理：
1. 重命名已有归档目录
2. 如果确认重复，删除已有归档目录
3. 改日再归档
\`\`\`

**护栏**

- 没有明确变更名时必须让用户选择。
- 使用 \`ovsespec status --json\` 检查产物完成状态。
- warning 不一定阻止归档，但必须展示并获得用户确认。
- 移动目录时保留 \`.ovsespec.yaml\`，它会随变更目录一起移动。
- 如果存在 delta specs，必须先做同步评估并展示摘要。
- 如果用户选择同步，使用 \`/ovsx:sync\` 的 agent-driven 合并方式。
- 归档摘要必须清楚说明 specs、任务、产物和技术风险状态。`;
export function getArchiveChangeSkillTemplate() {
    return {
        name: 'ovsespec-archive-change',
        description: '归档已完成的 OvseSpec 变更；检查 specs、任务、产物和技术风险状态。',
        instructions: ARCHIVE_INSTRUCTIONS,
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
export function getOvsxArchiveCommandTemplate() {
    return {
        name: 'OVSX: Archive',
        description: '归档已完成变更，并输出 specs、任务、产物和技术风险状态',
        category: 'Workflow',
        tags: ['workflow', 'archive', 'risk'],
        content: ARCHIVE_INSTRUCTIONS,
    };
}
//# sourceMappingURL=archive-change.js.map