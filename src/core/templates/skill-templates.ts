/**
 * Agent Skill Templates
 *
 * Compatibility facade that re-exports split workflow template modules.
 */

export type { SkillTemplate, CommandTemplate } from './types.js';

export { getExploreSkillTemplate, getOvsxExploreCommandTemplate } from './workflows/explore.js';
export { getNewChangeSkillTemplate, getOvsxNewCommandTemplate } from './workflows/new-change.js';
export { getContinueChangeSkillTemplate, getOvsxContinueCommandTemplate } from './workflows/continue-change.js';
export { getApplyChangeSkillTemplate, getOvsxApplyCommandTemplate } from './workflows/apply-change.js';
export { getFfChangeSkillTemplate, getOvsxFfCommandTemplate } from './workflows/ff-change.js';
export { getSyncSpecsSkillTemplate, getOvsxSyncCommandTemplate } from './workflows/sync-specs.js';
export { getArchiveChangeSkillTemplate, getOvsxArchiveCommandTemplate } from './workflows/archive-change.js';
export { getBulkArchiveChangeSkillTemplate, getOvsxBulkArchiveCommandTemplate } from './workflows/bulk-archive-change.js';
export { getVerifyChangeSkillTemplate, getOvsxVerifyCommandTemplate } from './workflows/verify-change.js';
export { getOnboardSkillTemplate, getOvsxOnboardCommandTemplate } from './workflows/onboard.js';
export { getOvsxProposeSkillTemplate, getOvsxProposeCommandTemplate } from './workflows/propose.js';
export { getPaasTestDeploySkillTemplate, getOvsxPaasTestDeployCommandTemplate } from './workflows/paas-test-deploy.js';
export { getFeedbackSkillTemplate } from './workflows/feedback.js';
