const PAAS_TEST_DEPLOY_INSTRUCTIONS = `执行一次 PaaS test deploy 流程。

这个 workflow 用于把某个已实现或准备验证的 change 部署到 test/staging 类环境，并完成部署前检查、发起部署、验证和回滚准备。它不是 production deploy 命令；除非用户明确说明并确认，否则不要对生产环境执行任何操作。

**输入**：\`/ovsx:paas-test-deploy\` 后面可以包含 change 名、服务名、模块名、环境名、branch、commit、image tag 或用户的自然语言部署目标。

**部署约束**

- 明确 deploy target：workspace、repo、service/app、module、environment、branch/commit、artifact/image 和验证责任人。
- 这个 workflow 保持独立：\`/ovsx:apply\` 可以在 tasks.md 中留下部署验证前置条件，但不能替代本命令静默执行部署。
- 如果涉及 workspace 或多仓，先运行 \`ovsespec workspace list --json\` 和 \`ovsespec workspace doctor --json\` 获取上下文；只操作明确属于本次 deploy scope 的 repo。
- 如果关联 OvseSpec change，读取 \`ovsespec status --change "<name>" --json\` 和相关 artifacts，确认 tasks、design、delta specs、风险和验证点。
- 不要把本机绝对路径写入长期摘要。使用 repo name、workspace link、service name、module name 或 PaaS app name。
- 对配置变更、数据迁移、接口契约、feature flag、灰度规则和回滚路径给出清晰摘要。

**步骤**

1. **确认 deploy scope**

   如果输入不足，使用 **AskUserQuestion tool** 澄清：
   - 要 deploy 哪个 service/app/module？
   - 目标环境是 test、staging 还是其他非生产环境？
   - 使用哪个 branch、commit、artifact 或 image tag？
   - 谁负责确认验证结果？

   如果用户要求 production deploy，必须明确二次确认，并把风险、rollback 和必要授权要求列出来。

2. **关联 change 和 workspace**

   如果用户给了 change 名或上下文能推断 change：

   \`\`\`bash
   ovsespec status --change "<name>" --json
   \`\`\`

   读取相关 artifacts，提取：
   - 影响 repo/module/service
   - 未完成 tasks
   - test deploy 验证要求
   - rollout、migration、rollback 风险

   如果没有明确 change，仍可继续，但输出里要说明“未关联 OvseSpec change”。

3. **部署前检查**

   在目标 repo/module 内做最小必要检查：
   - 检查当前 branch、commit、working tree 是否符合 deploy scope。
   - 查找项目已有 build/test/deploy 文档或脚本，不要发明 PaaS 命令。
   - 如果存在 CI/CD 或 PaaS 配置，读取配置确认 app、environment、cluster、namespace、variables。
   - 如果存在未提交改动、未完成 tasks、缺少验证口径或目标环境不明确，暂停并让用户确认。

4. **生成 deploy plan**

   用中文展示一次确认表：
   - Change / repo / service / environment
   - Branch / commit / artifact / image tag
   - Verifier
   - Preflight checks
   - Deploy command 或 PaaS tool action
   - Smoke tests / health checks / log checks
   - Rollback plan

   获得用户确认后才执行会改变环境状态的 deploy 操作。

5. **执行 test deploy**

   优先使用项目已有的 deploy script、CI/CD trigger、PaaS CLI 或当前环境暴露的 PaaS tools。

   **重要**：
   - 不要伪造部署结果。
   - 找不到可用部署入口时，停止并输出缺失信息。
   - deploy command 带有生产风险或目标环境不清楚时，必须再次确认。
   - 如果需要 secret、token、ticket、授权或 release window，不要绕过，明确说明阻塞点。

6. **验证部署**

   部署后至少完成：
   - 获取 deployment/job 状态。
   - 检查 app health、pod/container 状态、关键 logs 或 PaaS status。
   - 按 change artifacts 或用户要求执行 smoke tests。
   - 记录版本、commit、artifact、环境和验证证据。
   - 如果失败，执行或准备 rollback，并输出失败原因、影响范围和下一步。

7. **更新 change 状态**

   如果关联 change 且 tasks.md 中有 test deploy / verification 相关任务：
   - 只有在部署和验证都成功后，才把对应 task 勾选为 \`- [x]\`。
   - 如果只完成了 deploy 但验证失败，不要勾选完成；记录阻塞点。
   - 不要自动 archive。归档仍由 \`/ovsx:archive\` 完成。

**输出**

用中文输出部署摘要：

\`\`\`
## PaaS Test Deploy Summary

**Change:** <change or none>
**Service:** <service/app>
**Environment:** <test/staging>
**Version:** <branch/commit/artifact/image>
**Verifier:** <person or command that validates the deployment>

### Actions
- <实际执行的 deploy action>

### Verification
- <health/status/log/smoke test 结果>

### Rollback
- <rollback command/path or prepared rollback plan>

### Open Risks
- <剩余风险、阻塞点或下一步>
\`\`\`

**护栏**

- 默认只允许 test/staging 类非生产环境。
- 改变环境状态前必须展示 deploy plan 并获得确认。
- 不要猜 service、environment、cluster、namespace、image tag 或验证责任人。
- 不要使用未确认的本地 dirty working tree 触发部署。
- 不要把 secret、token 或敏感变量写入输出。
- 没有真实部署证据时，不要声称部署成功。
- 部署失败时优先保护环境，说明 rollback 或人工介入路径。
- 这个 workflow 可以更新 tasks，但不能自动 archive。`;
export function getPaasTestDeploySkillTemplate() {
    return {
        name: 'ovsespec-paas-test-deploy',
        description: '执行 PaaS test deploy 流程，覆盖部署前检查、部署确认、验证和 rollback。',
        instructions: PAAS_TEST_DEPLOY_INSTRUCTIONS,
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
export function getOvsxPaasTestDeployCommandTemplate() {
    return {
        name: 'OVSX: PaaS Test Deploy',
        description: '执行 PaaS test deploy，并输出部署、验证、rollback 和风险摘要',
        category: 'Workflow',
        tags: ['workflow', 'paas', 'deploy'],
        content: PAAS_TEST_DEPLOY_INSTRUCTIONS,
    };
}
//# sourceMappingURL=paas-test-deploy.js.map