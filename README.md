# OvseSpec

OvseSpec 是基于 OpenSpec 二次开发的团队版 spec-driven development 工具。它保留原 OpenSpec 的核心原意：先用 proposal / specs / design / tasks 明确变更，再由 AI coding agent 按任务实现、校验、同步和归档。

本项目在原流程上增加了团队协作、YAPI 接口契约、Mock/advmock、PaaS test deploy 和中文工作流指令，适合多人协作的业务研发场景。

## 仓库与包

- GitHub: <https://github.com/jnlzw/ovsespec>
- npm package: `@jn-lzw/ovsespec`
- CLI: `ovsespec`
- Slash commands namespace: `/ovsx:*`

## 安装

要求 Node.js `20.19.0` 或更高版本。

当前可从 GitHub 拉取源码后安装：

```bash
git clone https://github.com/jnlzw/ovsespec.git
cd ovsespec
npm install
npm install -g .
```

发布到 npm registry 后，可使用 npm 包名安装：

```bash
npm install -g @jn-lzw/ovsespec@latest
```

已有本地源码时，直接在仓库目录内安装当前版本：

```bash
npm install -g .
```

验证安装：

```bash
ovsespec --version
```

## 初始化项目

进入你的业务项目目录后执行：

```bash
ovsespec init
```

初始化后会生成 `ovsespec/` 目录、配置文件、schema/templates，并根据你选择的 AI 工具生成对应的 skills。只有显式把 delivery 配成 `both` 或 `commands` 时才会生成 prompt command。

常见命令：

```bash
ovsespec init --tools claude,cursor
ovsespec init --tools all
ovsespec update
ovsespec config profile
```

如果修改了全局 workflow profile，进入项目后执行：

```bash
ovsespec update
```

## 核心工作流

默认团队版核心流程：

```text
/ovsx:propose -> /ovsx:apply -> /ovsx:sync -> /ovsx:archive
```

扩展流程：

```text
/ovsx:explore
/ovsx:new -> /ovsx:continue 或 /ovsx:ff
/ovsx:verify
/ovsx:bulk-archive
/ovsx:onboard
/ovsx:paas-test-deploy
```

## 当前支持的 slash commands

| 命令 | 作用 |
| --- | --- |
| `/ovsx:explore` | 探索想法、调查问题、澄清需求，不直接创建变更。 |
| `/ovsx:propose` | 创建新变更，并生成 proposal、specs、design、tasks；团队场景补充 owner、reviewer、影响范围、迁移、交接和 API/YAPI 计划。 |
| `/ovsx:apply` | 按 tasks 实现变更；实现阶段需要处理新增接口、Mock 数据、YAPI 接口创建/更新和回读 audit。 |
| `/ovsx:sync` | 将 delta specs 同步到主 specs；同步阶段需要再次核对代码、spec、YAPI、Mock/advmock 是否一致。 |
| `/ovsx:archive` | 归档已完成变更；归档前检查 specs、任务、owner、交接、发布风险和契约状态。 |
| `/ovsx:new` | 只创建变更骨架，适合想分步骤补齐 artifact 的场景。 |
| `/ovsx:continue` | 按 artifact 依赖顺序继续创建下一个产物。 |
| `/ovsx:ff` | 一次性创建实现前所需的 planning artifacts。 |
| `/ovsx:verify` | 归档前校验实现是否匹配 proposal/specs/design/tasks。 |
| `/ovsx:bulk-archive` | 批量归档多个已完成变更，并输出冲突、跳过和失败摘要。 |
| `/ovsx:onboard` | 引导式跑通一次 OvseSpec 工作流。 |
| `/ovsx:paas-test-deploy` | 执行团队版 PaaS test deploy，覆盖部署前检查、部署确认、验证、rollback 和交接。 |

## 团队版增强

OvseSpec 的团队版模板会在原 OpenSpec artifact 基础上增加这些信息：

- Team Coordination：owner、reviewer、stakeholder、交接点、并行开发风险。
- API / YAPI Contracts：接口列表、`interface_id`、请求/响应契约、Mock/advmock 状态。
- Team Workflow：评审、测试、发布、rollback、跨仓依赖和消费者影响。
- Coordination / Contracts：归档或同步时保留协作和契约结论。

## YAPI 与 Mock 规则

接口相关变更需要把 YAPI 融入工作流：

- `/ovsx:propose`：识别新增或变更接口；没有 `interface_id` 时标记 `new/unknown`，并在 tasks 中加入创建 YAPI、写入 Mock/advmock、回读 audit 的任务。
- `/ovsx:apply`：实现阶段新增接口时，需要同步创建或更新 YAPI 接口，并补齐 Mock/advmock；不能只实现代码。
- `/ovsx:sync`：同步阶段再次核对 code/spec/YAPI/Mock/advmock 是否一致，发现不一致要继续修正或明确阻塞。
- `/ovsx:archive`：归档前确认接口契约和消费者影响已经处理。

## PaaS test deploy

`/ovsx:paas-test-deploy` 用于测试环境部署流程，重点覆盖：

- 部署前检查：分支、变更、测试、配置、环境。
- 部署执行：明确 deploy command 或 PaaS tool action。
- 部署后验证：接口、日志、监控、关键业务路径。
- rollback：记录 rollback command/path 或准备好的回滚方案。
- 团队交接：owner、验证人、风险和后续事项。

## CLI 常用命令

```bash
ovsespec list
ovsespec show <change-or-spec>
ovsespec validate
ovsespec validate --all --strict
ovsespec archive <change-name>
ovsespec status --change <change-name>
ovsespec templates
ovsespec schemas
ovsespec schema fork spec-driven my-workflow
ovsespec config profile
```

更多说明见：

- [Getting Started](docs/getting-started.md)
- [Commands](docs/commands.md)
- [CLI](docs/cli.md)
- [Workflows](docs/workflows.md)
- [Supported Tools](docs/supported-tools.md)
- [Installation](docs/installation.md)

## 本地开发

```bash
pnpm install
pnpm run build
pnpm test
pnpm run dev:cli
```

打包检查：

```bash
npm pack --dry-run
```

发布到 npm 前需要：

```bash
npm login
npm publish --access public
```

`@jn-lzw/ovsespec` 是 scoped public package，发布账号需要拥有 `@jn-lzw` organization/scope 的发布权限。若 npm 账号开启了 2FA，发布还需要 Authenticator OTP 或带 bypass 2FA 的 granular access token。

## Telemetry

OvseSpec 保留匿名 telemetry 机制，只采集命令名和版本信息，用于了解使用模式；不采集参数、路径、内容或 PII。CI 环境会自动关闭。

关闭方式：

```bash
export OVSESPEC_TELEMETRY=0
export DO_NOT_TRACK=1
```

## License

MIT
