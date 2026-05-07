# Update Agent Instruction File Name - Tasks

## 1. Rename Instruction File
- [x] Rename `ovsespec/README.md` to `ovsespec/AGENTS.md`
- [x] Update root references to new path

## 2. Update Templates
- [x] Rename `src/core/templates/readme-template.ts` to `agents-template.ts`
- [x] Update exported constant from `readmeTemplate` to `agentsTemplate`

## 3. Adjust CLI Commands
- [x] Modify `ovsespec init` to generate `AGENTS.md`
- [x] Update `ovsespec update` to refresh `AGENTS.md`
- [x] Ensure CLAUDE.md markers link to `@ovsespec/AGENTS.md`

## 4. Update Specifications
- [x] Modify `cli-init` spec to reference `AGENTS.md`
- [x] Modify `cli-update` spec to reference `AGENTS.md`
- [x] Modify `ovsespec-conventions` spec to include `AGENTS.md` in project structure

## 5. Validation
- [x] `pnpm test`
