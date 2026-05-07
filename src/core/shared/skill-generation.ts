/**
 * Skill Generation Utilities
 *
 * Shared utilities for generating skill and command files.
 */

import {
  getExploreSkillTemplate,
  getNewChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getApplyChangeSkillTemplate,
  getFfChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOvsxProposeSkillTemplate,
  getOvsxExploreCommandTemplate,
  getOvsxNewCommandTemplate,
  getOvsxContinueCommandTemplate,
  getOvsxApplyCommandTemplate,
  getOvsxFfCommandTemplate,
  getOvsxSyncCommandTemplate,
  getOvsxArchiveCommandTemplate,
  getOvsxBulkArchiveCommandTemplate,
  getOvsxVerifyCommandTemplate,
  getOvsxOnboardCommandTemplate,
  getOvsxProposeCommandTemplate,
  getPaasTestDeploySkillTemplate,
  getOvsxPaasTestDeployCommandTemplate,
  type SkillTemplate,
} from '../templates/skill-templates.js';
import type { CommandContent } from '../command-generation/index.js';

/**
 * Skill template with directory name and workflow ID mapping.
 */
export interface SkillTemplateEntry {
  template: SkillTemplate;
  dirName: string;
  workflowId: string;
}

/**
 * Command template with ID mapping.
 */
export interface CommandTemplateEntry {
  template: ReturnType<typeof getOvsxExploreCommandTemplate>;
  id: string;
}

/**
 * Gets skill templates with their directory names, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose workflowId is in this array
 */
export function getSkillTemplates(workflowFilter?: readonly string[]): SkillTemplateEntry[] {
  const all: SkillTemplateEntry[] = [
    { template: getExploreSkillTemplate(), dirName: 'ovsespec-explore', workflowId: 'explore' },
    { template: getNewChangeSkillTemplate(), dirName: 'ovsespec-new-change', workflowId: 'new' },
    { template: getContinueChangeSkillTemplate(), dirName: 'ovsespec-continue-change', workflowId: 'continue' },
    { template: getApplyChangeSkillTemplate(), dirName: 'ovsespec-apply-change', workflowId: 'apply' },
    { template: getFfChangeSkillTemplate(), dirName: 'ovsespec-ff-change', workflowId: 'ff' },
    { template: getSyncSpecsSkillTemplate(), dirName: 'ovsespec-sync-specs', workflowId: 'sync' },
    { template: getArchiveChangeSkillTemplate(), dirName: 'ovsespec-archive-change', workflowId: 'archive' },
    { template: getBulkArchiveChangeSkillTemplate(), dirName: 'ovsespec-bulk-archive-change', workflowId: 'bulk-archive' },
    { template: getVerifyChangeSkillTemplate(), dirName: 'ovsespec-verify-change', workflowId: 'verify' },
    { template: getOnboardSkillTemplate(), dirName: 'ovsespec-onboard', workflowId: 'onboard' },
    { template: getOvsxProposeSkillTemplate(), dirName: 'ovsespec-propose', workflowId: 'propose' },
    { template: getPaasTestDeploySkillTemplate(), dirName: 'ovsespec-paas-test-deploy', workflowId: 'paas-test-deploy' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.workflowId));
}

/**
 * Gets command templates with their IDs, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose id is in this array
 */
export function getCommandTemplates(workflowFilter?: readonly string[]): CommandTemplateEntry[] {
  const all: CommandTemplateEntry[] = [
    { template: getOvsxExploreCommandTemplate(), id: 'explore' },
    { template: getOvsxNewCommandTemplate(), id: 'new' },
    { template: getOvsxContinueCommandTemplate(), id: 'continue' },
    { template: getOvsxApplyCommandTemplate(), id: 'apply' },
    { template: getOvsxFfCommandTemplate(), id: 'ff' },
    { template: getOvsxSyncCommandTemplate(), id: 'sync' },
    { template: getOvsxArchiveCommandTemplate(), id: 'archive' },
    { template: getOvsxBulkArchiveCommandTemplate(), id: 'bulk-archive' },
    { template: getOvsxVerifyCommandTemplate(), id: 'verify' },
    { template: getOvsxOnboardCommandTemplate(), id: 'onboard' },
    { template: getOvsxProposeCommandTemplate(), id: 'propose' },
    { template: getOvsxPaasTestDeployCommandTemplate(), id: 'paas-test-deploy' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.id));
}

/**
 * Converts command templates to CommandContent array, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return contents whose id is in this array
 */
export function getCommandContents(workflowFilter?: readonly string[]): CommandContent[] {
  const commandTemplates = getCommandTemplates(workflowFilter);
  return commandTemplates.map(({ template, id }) => ({
    id,
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags,
    body: template.content,
  }));
}

/**
 * Generates skill file content with YAML frontmatter.
 *
 * @param template - The skill template
 * @param generatedByVersion - The OvseSpec version to embed in the file
 * @param transformInstructions - Optional callback to transform the instructions content
 */
export function generateSkillContent(
  template: SkillTemplate,
  generatedByVersion: string,
  transformInstructions?: (instructions: string) => string
): string {
  const instructions = transformInstructions
    ? transformInstructions(template.instructions)
    : template.instructions;

  return `---
name: ${template.name}
description: ${template.description}
license: ${template.license || 'MIT'}
compatibility: ${template.compatibility || 'Requires ovsespec CLI.'}
metadata:
  author: ${template.metadata?.author || 'ovsespec'}
  version: "${template.metadata?.version || '1.0'}"
  generatedBy: "${generatedByVersion}"
---

${instructions}
`;
}
