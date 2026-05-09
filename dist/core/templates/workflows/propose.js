const PROPOSE_INSTRUCTIONS = `创建一个新的 OvseSpec 变更，并一次性生成进入实现前所需的计划产物。

保留原命令意图：用户描述想做什么，你负责创建 change，并按当前 schema 生成满足 \`apply.requires\` 的产物。默认 spec-driven 流程生成 proposal、specs、tasks；design.md 只在确有设计决策需要时额外创建。

默认会创建这些产物：
- proposal.md：做什么、为什么做
- specs/<capability>/spec.md：需求变化
- tasks.md：实现步骤

按需创建：
- design.md：仅当存在跨模块架构决策、外部依赖、数据模型/迁移、安全/性能风险，或实现前必须先记录技术取舍时创建

生成的长期产物默认主要使用中文书写；代码标识、API path、字段名、错误码、枚举、命令、文件路径、YAPI 字段和 schema 固定标题可以保留原文。只有用户明确要求英文或当前 schema/template 有强制语言要求时，才偏离这个默认约定。

准备实现时，运行 /ovsx:apply

---

**输入**：\`/ovsx:propose\` 后面的参数可以是 kebab-case 变更名，也可以是用户想构建或修复的自然语言描述。

**条件触发规则**

- API/YAPI：仅当变更新增或修改 public API、Controller、route、DTO、request/response schema、错误包装或 YAPI advmock 期望时，才在 proposal.md 和 tasks.md 加入 API/YAPI 内容。没有接口新增或变更时，不要添加 API/YAPI 章节、占位符或任务。
- API/YAPI 清单包含：\`method + path\`、\`program_name\`、\`service_id\`、\`interface_id\`、分类、Controller/handler、DTO、request/response、错误包装、Mock/advmock 场景、同步状态或阻塞项。
- 如果新接口还没有 \`interface_id\`，明确写 \`interface_id: new/unknown\`，并在 tasks.md 加入“创建 YAPI 接口、写入 Mock/advmock、回读 audit”的 checkbox。
- PaaS：仅当用户要求部署验证、任务明确依赖测试环境，或当前变更需要上线前环境验证时，才在 tasks.md 写入触发 \`/ovsx:paas-test-deploy\` 的前置条件和验证口径；其他情况不要提 PaaS。
- design.md：仅当满足上面的按需条件时创建。小型实现、文案、配置、测试或局部 bugfix 默认不创建 design.md。
- 不要把机器本地绝对路径写入长期产物，除非用户明确要求。优先使用仓库名、包名、模块名、服务名或相对路径。

**步骤**

1. **确认目标**

   如果没有明确输入，使用 **AskUserQuestion tool**（开放问题，不提供预设选项）询问：
   > “你想做哪个变更？请描述要构建、修复或调整的内容。”

   从用户描述中推导 kebab-case 变更名，例如 “add user authentication” -> \`add-user-auth\`。

   **重要**：在理解用户目标前不要继续。

2. **创建变更目录**

   \`\`\`bash
   ovsespec new change "<name>"
   \`\`\`

   这会在 \`ovsespec/changes/<name>/\` 下创建带 \`.ovsespec.yaml\` 的变更骨架。

3. **获取产物顺序**

   \`\`\`bash
   ovsespec status --change "<name>" --json
   \`\`\`

   解析 JSON，读取：
   - \`applyRequires\`：实现前必须完成的产物 ID，例如 \`["tasks"]\`
   - \`artifacts\`：所有产物的状态和依赖关系

4. **按依赖顺序生成产物，直到实现就绪**

   使用 **TodoWrite tool** 跟踪产物生成进度。

   在生成 tasks.md 前先判断是否需要额外 design.md。需要时，先在 \`ovsespec/changes/<name>/design.md\` 写入简洁设计记录；不需要时不要创建空文件或占位文件。

   按依赖顺序循环处理所有 ready 状态的产物：

   a. 对每个 \`ready\` 产物：
      - 获取说明：
        \`\`\`bash
        ovsespec instructions <artifact-id> --change "<name>" --json
        \`\`\`
      - instructions JSON 包含：
        - \`context\`：项目背景，作为约束使用，不要复制到输出文件
        - \`rules\`：产物规则，作为约束使用，不要复制到输出文件
        - \`template\`：输出文件结构
        - \`instruction\`：当前 schema 对该产物的具体指导
        - \`outputPath\`：要写入的路径
        - \`dependencies\`：需要读取的已完成依赖产物
      - 读取所有已完成依赖产物作为上下文。
      - 如果当前产物是 tasks.md，且本次已按需创建 design.md，也读取 design.md 作为额外上下文。
      - 按 \`template\` 结构创建产物文件。
      - 遵守 \`context\` 和 \`rules\`，但不要把这些块原样写进文件。
      - 只有 API/YAPI 触发条件成立时，才在 proposal.md 写目标接口清单，在 tasks.md 写实现、测试、YAPI create/update、Mock/advmock、audit 的 checkbox。
      - PaaS test deploy 不自动并入 apply；只有满足 PaaS 触发条件时，才在 tasks.md 中写清楚触发 \`/ovsx:paas-test-deploy\` 的前置条件和验证口径。
      - 简短汇报：\`Created <artifact-id>\`。

   b. 每创建一个产物后，重新运行：
      \`\`\`bash
      ovsespec status --change "<name>" --json
      \`\`\`
      当 \`applyRequires\` 中的全部产物都为 \`done\` 时停止。

   c. 如果产物需要用户输入或关键边界不清楚，使用 **AskUserQuestion tool** 澄清，然后继续。

5. **展示最终状态**

   \`\`\`bash
   ovsespec status --change "<name>"
   \`\`\`

**输出**

完成后用中文总结：
- 变更名和位置
- 已创建的产物及简要说明
- 如适用，列出 API/YAPI 摘要：\`method + path\`、\`service_id/interface_id\`、Mock/advmock 场景、sync/audit 阻塞项
- 如果创建了 design.md，说明触发原因
- 当前状态：“所有实现前产物已完成，可以开始实现。”
- 提示：“运行 \`/ovsx:apply\` 或直接让我实现，开始处理任务。”

**产物生成准则**

- 遵循 \`ovsespec instructions\` 返回的 \`instruction\` 字段。
- schema 定义产物应该包含什么，就按 schema 写。
- 生成新产物前必须读取依赖产物。
- 使用 \`template\` 作为文件结构，并填充实际内容。
- 保留原有 proposal/specs/tasks 的语义；不要把产物改成会议纪要或项目管理文档。
- 不满足触发条件时，不要添加 API/YAPI、PaaS 或 design.md 占位内容。
- **重要**：\`context\` 和 \`rules\` 是给你的约束，不是产物内容。
  - 不要把 \`<context>\`、\`<rules>\`、\`<project_context>\` 块复制进输出文件。
  - 它们指导你写什么，但不应该出现在最终文件中。

**护栏**

- 创建 schema 的 \`apply.requires\` 定义的所有实现前产物。
- 始终先读依赖产物，再写新产物。
- 对关键业务、契约或迁移边界不明确的地方要询问，不要臆测。
- API/YAPI 信息不完整时，必须在产物中保留 unknown/TBD 和待确认项，不能把缺口藏在对话里。
- 涉及 API 新增或变更的 change 必须在 tasks.md 中包含 YAPI create/update、Mock/advmock 和 audit/一致性核对任务；不涉及接口变更时不要添加这些任务。
- 如果同名变更已存在，询问用户是继续该变更还是创建新变更。
- 写完每个产物后确认文件存在，再继续下一个。`;
export function getOvsxProposeSkillTemplate() {
    return {
        name: 'ovsespec-propose',
        description: '创建新的 OvseSpec 变更，并一次生成实现前所需产物；API/YAPI、PaaS 和 design.md 按条件触发。',
        instructions: PROPOSE_INSTRUCTIONS,
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
export function getOvsxProposeCommandTemplate() {
    return {
        name: 'OVSX: Propose',
        description: '创建新变更并一次生成 proposal、specs、tasks；API/YAPI、PaaS 和 design.md 按条件触发',
        category: 'Workflow',
        tags: ['workflow', 'artifacts', 'proposal'],
        content: PROPOSE_INSTRUCTIONS,
    };
}
//# sourceMappingURL=propose.js.map