export function getOnboardSkillTemplate() {
    return {
        name: 'ovsespec-onboard',
        description: 'Guided onboarding for OvseSpec - walk through a complete workflow cycle with narration and real codebase work.',
        instructions: getOnboardInstructions(),
        license: 'MIT',
        compatibility: 'Requires ovsespec CLI.',
        metadata: { author: 'ovsespec', version: '1.0' },
    };
}
function getOnboardInstructions() {
    return `Guide the user through their first complete OvseSpec workflow cycle. This is a teaching experience—you'll do real work in their codebase while explaining each step.

---

## Preflight

Before starting, check if the OvseSpec CLI is installed:

\`\`\`bash
# Unix/macOS
ovsespec --version 2>&1 || echo "CLI_NOT_INSTALLED"
# Windows (PowerShell)
# if (Get-Command ovsespec -ErrorAction SilentlyContinue) { ovsespec --version } else { echo "CLI_NOT_INSTALLED" }
\`\`\`

**If CLI not installed:**
> OvseSpec CLI is not installed. Install it first, then come back to \`/ovsx:onboard\`.

Stop here if not installed.

---

## Phase 1: Welcome

Display:

\`\`\`
## Welcome to OvseSpec!

I'll walk you through a complete change cycle—from idea to implementation—using a real task in your codebase. Along the way, you'll learn the workflow by doing it.

**What we'll do:**
1. Pick a small, real task in your codebase
2. Explore the problem briefly
3. Create a change (the container for our work)
4. Build the artifacts: proposal → specs → tasks (design.md only if needed)
5. Implement the tasks
6. Archive the completed change

**Time:** ~15-20 minutes

Let's start by finding something to work on.
\`\`\`

---

## Phase 2: Task Selection

### Codebase Analysis

Scan the codebase for small improvement opportunities. Look for:

1. **TODO/FIXME comments** - Search for \`TODO\`, \`FIXME\`, \`HACK\`, \`XXX\` in code files
2. **Missing error handling** - \`catch\` blocks that swallow errors, risky operations without try-catch
3. **Functions without tests** - Cross-reference \`src/\` with test directories
4. **Type issues** - \`any\` types in TypeScript files (\`: any\`, \`as any\`)
5. **Debug artifacts** - \`console.log\`, \`console.debug\`, \`debugger\` statements in non-debug code
6. **Missing validation** - User input handlers without validation

Also check recent git activity:
\`\`\`bash
# Unix/macOS
git log --oneline -10 2>/dev/null || echo "No git history"
# Windows (PowerShell)
# git log --oneline -10 2>$null; if ($LASTEXITCODE -ne 0) { echo "No git history" }
\`\`\`

### Present Suggestions

From your analysis, present 3-4 specific suggestions:

\`\`\`
## Task Suggestions

Based on scanning your codebase, here are some good starter tasks:

**1. [Most promising task]**
   Location: \`src/path/to/file.ts:42\`
   Scope: ~1-2 files, ~20-30 lines
   Why it's good: [brief reason]

**2. [Second task]**
   Location: \`src/another/file.ts\`
   Scope: ~1 file, ~15 lines
   Why it's good: [brief reason]

**3. [Third task]**
   Location: [location]
   Scope: [estimate]
   Why it's good: [brief reason]

**4. Something else?**
   Tell me what you'd like to work on.

Which task interests you? (Pick a number or describe your own)
\`\`\`

**If nothing found:** Fall back to asking what the user wants to build:
> I didn't find obvious quick wins in your codebase. What's something small you've been meaning to add or fix?

### Scope Guardrail

If the user picks or describes something too large (major feature, multi-day work):

\`\`\`
That's a valuable task, but it's probably larger than ideal for your first OvseSpec run-through.

For learning the workflow, smaller is better—it lets you see the full cycle without getting stuck in implementation details.

**Options:**
1. **Slice it smaller** - What's the smallest useful piece of [their task]? Maybe just [specific slice]?
2. **Pick something else** - One of the other suggestions, or a different small task?
3. **Do it anyway** - If you really want to tackle this, we can. Just know it'll take longer.

What would you prefer?
\`\`\`

Let the user override if they insist—this is a soft guardrail.

---

## Phase 3: Explore Demo

Once a task is selected, briefly demonstrate explore mode:

\`\`\`
Before we create a change, let me quickly show you **explore mode**—it's how you think through problems before committing to a direction.
\`\`\`

Spend 1-2 minutes investigating the relevant code:
- Read the file(s) involved
- Draw a quick ASCII diagram if it helps
- Note any considerations

\`\`\`
## Quick Exploration

[Your brief analysis—what you found, any considerations]

┌─────────────────────────────────────────┐
│   [Optional: ASCII diagram if helpful]  │
└─────────────────────────────────────────┘

Explore mode (\`/ovsx:explore\`) is for this kind of thinking—investigating before implementing. You can use it anytime you need to think through a problem.

Now let's create a change to hold our work.
\`\`\`

**PAUSE** - Wait for user acknowledgment before proceeding.

---

## Phase 4: Create the Change

**EXPLAIN:**
\`\`\`
## Creating a Change

A "change" in OvseSpec is a container for all the thinking and planning around a piece of work. It lives in \`ovsespec/changes/<name>/\` and holds your artifacts—proposal, specs, tasks, plus design.md only when the change needs explicit design decisions.

Let me create one for our task.
\`\`\`

**DO:** Create the change with a derived kebab-case name:
\`\`\`bash
ovsespec new change "<derived-name>"
\`\`\`

**SHOW:**
\`\`\`
Created: \`ovsespec/changes/<name>/\`

The folder structure:
\`\`\`
ovsespec/changes/<name>/
├── proposal.md    ← Why we're doing this (empty, we'll fill it)
├── specs/         ← Detailed requirements (empty)
├── tasks.md       ← Implementation checklist (empty)
└── design.md      ← Optional, only if this task needs design decisions
\`\`\`

Now let's fill in the first artifact—the proposal.
\`\`\`

---

## Phase 5: Proposal

**EXPLAIN:**
\`\`\`
## The Proposal

The proposal captures **why** we're making this change and **what** it involves at a high level. It's the "elevator pitch" for the work.

I'll draft one based on our task.
\`\`\`

**DO:** Draft the proposal content (don't save yet):

\`\`\`
Here's a draft proposal:

---

## Why

[1-2 sentences explaining the problem/opportunity]

## What Changes

[Bullet points of what will be different]

## Capabilities

### New Capabilities
- \`<capability-name>\`: [brief description]

### Modified Capabilities
<!-- If modifying existing behavior -->

## Technical Impact

- \`src/path/to/file.ts\`: [what changes]
- [other files if applicable]

---

Does this capture the intent? I can adjust before we save it.
\`\`\`

**PAUSE** - Wait for user approval/feedback.

After approval, save the proposal:
\`\`\`bash
ovsespec instructions proposal --change "<name>" --json
\`\`\`
Then write the content to \`ovsespec/changes/<name>/proposal.md\`.

\`\`\`
Proposal saved. This is your "why" document—you can always come back and refine it as understanding evolves.

Next up: specs.
\`\`\`

---

## Phase 6: Specs

**EXPLAIN:**
\`\`\`
## Specs

Specs define **what** we're building in precise, testable terms. They use a requirement/scenario format that makes expected behavior crystal clear.

For a small task like this, we might only need one spec file.
\`\`\`

**DO:** Create the spec file:
\`\`\`bash
# Unix/macOS
mkdir -p ovsespec/changes/<name>/specs/<capability-name>
# Windows (PowerShell)
# New-Item -ItemType Directory -Force -Path "ovsespec/changes/<name>/specs/<capability-name>"
\`\`\`

Draft the spec content:

\`\`\`
Here's the spec:

---

## ADDED Requirements

### Requirement: <Name>

<Description of what the system should do>

#### Scenario: <Scenario name>

- **WHEN** <trigger condition>
- **THEN** <expected outcome>
- **AND** <additional outcome if needed>

---

This format—WHEN/THEN/AND—makes requirements testable. You can literally read them as test cases.
\`\`\`

Save to \`ovsespec/changes/<name>/specs/<capability>/spec.md\`.

---

## Phase 7: Optional Design Check

**EXPLAIN:**
\`\`\`
## Design Check

design.md is optional. We create it only when the change needs explicit technical decisions, architecture tradeoffs, external dependencies, migration planning, or security/performance risk analysis.

For this onboarding task, I'll skip design.md unless we identify one of those needs.
\`\`\`

**DO:** Decide whether design.md is needed:

\`\`\`
Design needed: no

Reason: this is a small, local change with no new architecture, dependency, migration, or high-risk technical tradeoff.
\`\`\`

If design is needed, create \`ovsespec/changes/<name>/design.md\` before tasks. Otherwise continue without it.

---

## Phase 8: Tasks

**EXPLAIN:**
\`\`\`
## Tasks

Finally, we break the work into implementation tasks—checkboxes that drive the apply phase.

These should be small, clear, and in logical order.
\`\`\`

**DO:** Generate tasks based on specs and optional design:

\`\`\`
Here are the implementation tasks:

---

## 1. [Category or file]

- [ ] 1.1 [Specific task]
- [ ] 1.2 [Specific task]

## 2. Verify

- [ ] 2.1 [Verification step]

---

Each checkbox becomes a unit of work in the apply phase. Ready to implement?
\`\`\`

**PAUSE** - Wait for user to confirm they're ready to implement.

Save to \`ovsespec/changes/<name>/tasks.md\`.

---

## Phase 9: Apply (Implementation)

**EXPLAIN:**
\`\`\`
## Implementation

Now we implement each task, checking them off as we go. I'll announce each one and occasionally note how the specs informed the approach.
\`\`\`

**DO:** For each task:

1. Announce: "Working on task N: [description]"
2. Implement the change in the codebase
3. Reference specs naturally: "The spec says X, so I'm doing Y"
4. Mark complete in tasks.md: \`- [ ]\` → \`- [x]\`
5. Brief status: "✓ Task N complete"

Keep narration light—don't over-explain every line of code.

After all tasks:

\`\`\`
## Implementation Complete

All tasks done:
- [x] Task 1
- [x] Task 2
- [x] ...

The change is implemented! One more step—let's archive it.
\`\`\`

---

## Phase 10: Archive

**EXPLAIN:**
\`\`\`
## Archiving

When a change is complete, we archive it. This moves it from \`ovsespec/changes/\` to \`ovsespec/changes/archive/YYYY-MM-DD-<name>/\`.

Archived changes become your project's decision history—you can always find them later to understand why something was built a certain way.
\`\`\`

**DO:**
\`\`\`bash
ovsespec archive "<name>"
\`\`\`

**SHOW:**
\`\`\`
Archived to: \`ovsespec/changes/archive/YYYY-MM-DD-<name>/\`

The change is now part of your project's history. The code is in your codebase, the decision record is preserved.
\`\`\`

---

## Phase 11: Recap & Next Steps

\`\`\`
## Congratulations!

You just completed a full OvseSpec cycle:

1. **Explore** - Thought through the problem
2. **New** - Created a change container
3. **Proposal** - Captured WHY
4. **Specs** - Defined WHAT in detail
5. **Design** - Decided HOW
6. **Tasks** - Broke it into steps
7. **Apply** - Implemented the work
8. **Archive** - Preserved the record

This same rhythm works for any size change—a small fix or a major feature.

---

## Command Reference

**Core workflow:**

 | Command           | What it does                               |
 |-------------------|--------------------------------------------|
 | \`/ovsx:propose\` | Create a change and generate all artifacts |
 | \`/ovsx:explore\` | Think through problems before/during work  |
 | \`/ovsx:apply\`   | Implement tasks from a change              |
 | \`/ovsx:archive\` | Archive a completed change                 |

**Additional commands:**

 | Command            | What it does                                             |
 |--------------------|----------------------------------------------------------|
 | \`/ovsx:new\`      | Start a new change, step through artifacts one at a time |
 | \`/ovsx:continue\` | Continue working on an existing change                   |
 | \`/ovsx:ff\`       | Fast-forward: create all artifacts at once               |
 | \`/ovsx:verify\`   | Verify implementation matches artifacts                  |

---

## What's Next?

Try \`/ovsx:propose\` on something you actually want to build. You've got the rhythm now!
\`\`\`

---

## Graceful Exit Handling

### User wants to stop mid-way

If the user says they need to stop, want to pause, or seem disengaged:

\`\`\`
No problem! Your change is saved at \`ovsespec/changes/<name>/\`.

To pick up where we left off later:
- \`/ovsx:continue <name>\` - Resume artifact creation
- \`/ovsx:apply <name>\` - Jump to implementation (if tasks exist)

The work won't be lost. Come back whenever you're ready.
\`\`\`

Exit gracefully without pressure.

### User just wants command reference

If the user says they just want to see the commands or skip the tutorial:

\`\`\`
## OvseSpec Quick Reference

**Core workflow:**

 | Command                  | What it does                               |
 |--------------------------|--------------------------------------------|
 | \`/ovsx:propose <name>\` | Create a change and generate all artifacts |
 | \`/ovsx:explore\`        | Think through problems (no code changes)   |
 | \`/ovsx:apply <name>\`   | Implement tasks                            |
 | \`/ovsx:archive <name>\` | Archive when done                          |

**Additional commands:**

 | Command                   | What it does                        |
 |---------------------------|-------------------------------------|
 | \`/ovsx:new <name>\`      | Start a new change, step by step    |
 | \`/ovsx:continue <name>\` | Continue an existing change         |
 | \`/ovsx:ff <name>\`       | Fast-forward: all artifacts at once |
 | \`/ovsx:verify <name>\`   | Verify implementation               |

Try \`/ovsx:propose\` to start your first change.
\`\`\`

Exit gracefully.

---

## Guardrails

- **Follow the EXPLAIN → DO → SHOW → PAUSE pattern** at key transitions (after explore, after proposal draft, after tasks, after archive)
- **Keep narration light** during implementation—teach without lecturing
- **Don't skip phases** even if the change is small—the goal is teaching the workflow
- **Pause for acknowledgment** at marked points, but don't over-pause
- **Handle exits gracefully**—never pressure the user to continue
- **Use real codebase tasks**—don't simulate or use fake examples
- **Adjust scope gently**—guide toward smaller tasks but respect user choice`;
}
export function getOvsxOnboardCommandTemplate() {
    return {
        name: 'OVSX: Onboard',
        description: '引导用户完成一次 OvseSpec 工作流练习',
        category: 'Workflow',
        tags: ['workflow', 'onboarding', 'tutorial', 'learning'],
        content: `引导用户完成一次 OvseSpec 工作流练习。

保留原命令意图：这不是普通实现命令，而是教学式 walkthrough。你要用真实代码库里的小任务带用户理解从探索、提案、实现到归档的节奏。

**步骤**

1. 检查 OvseSpec CLI 是否可用：
   \`\`\`bash
   ovsespec --version
   \`\`\`

2. 简短说明本次会做什么：选择一个小而真实的任务，创建或查看变更产物，理解任务如何进入实现和归档。

3. 调查代码库，找一个低风险练习任务。不要选择大重构、跨团队高风险变更或需要业务决策的任务。

4. 让用户确认练习任务。用户不同意时，继续找更小的任务或退出。

5. 演示核心命令节奏：
   - \`/ovsx:explore\`：澄清问题，不写代码。
   - \`/ovsx:propose\`：创建变更并生成计划产物。
   - \`/ovsx:apply\`：按 tasks 实现。
   - \`/ovsx:sync\`：需要时同步 delta specs。
   - \`/ovsx:archive\`：完成后归档。

6. 每个阶段都用中文说明当前动作和原因，但不要写冗长教程。用户要跳过讲解时，按用户节奏继续。

7. 如果进入实现，保持改动很小，并在完成后更新任务勾选。

8. 结束时总结：
   - 用户学到了哪些命令
   - 当前练习变更在哪里
   - 已完成什么
   - 后续可以运行哪个命令继续

**护栏**

- onboarding 的目标是教学，不是完成大型功能。
- 使用真实代码库任务，不要编假例子。
- 不要强迫用户继续。
- 任何写代码动作都必须获得用户明确同意。
- 如果用户只想了解流程，可以只讲解和读取文件，不创建或修改代码。`,
    };
}
//# sourceMappingURL=onboard.js.map