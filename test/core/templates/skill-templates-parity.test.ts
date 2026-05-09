import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOvsxApplyCommandTemplate,
  getOvsxArchiveCommandTemplate,
  getOvsxBulkArchiveCommandTemplate,
  getOvsxContinueCommandTemplate,
  getOvsxExploreCommandTemplate,
  getOvsxFfCommandTemplate,
  getOvsxNewCommandTemplate,
  getOvsxOnboardCommandTemplate,
  getOvsxPaasTestDeployCommandTemplate,
  getOvsxSyncCommandTemplate,
  getOvsxProposeCommandTemplate,
  getOvsxProposeSkillTemplate,
  getOvsxVerifyCommandTemplate,
  getPaasTestDeploySkillTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '26b89eebe246d5cc07622a8f1dba1986d4d7ad20d64922967f72b198629c4bca',
  getNewChangeSkillTemplate: '47dee4d6ab4cedcc88d6af9c9ffce526fbd48582c242be019e57c3184a313883',
  getContinueChangeSkillTemplate: 'eb65c1671a096a85da62db2024d4b3e08c96a8b3d690558d38bccf2ffe5a936a',
  getApplyChangeSkillTemplate: '8133a6292bdf856b918791b9a6e5d0a5fb5c235ad939aff851381278cc92c065',
  getFfChangeSkillTemplate: '6ed37ce42987f67c574037a167b1ac91aa7a34965ec8ee21ac1e07573c52095b',
  getSyncSpecsSkillTemplate: '0b4eb9e8a520836182244157db50cba489e08a8863e7e1328ef8797bd6f9d58b',
  getOnboardSkillTemplate: '3ffa424f6d9c0fe1f4a54050e4069f5994ee1dc2d189746362c5d4b63667f70f',
  getOvsxExploreCommandTemplate: '69aeeb36e6ac7b71fc075106b07cdd0c41d9772cd1510b0a2d6e0a00efc6426c',
  getOvsxNewCommandTemplate: '1122d6eeed607883c33c68f3a444c14dd5afd415f9e2bf529a1b7b62a56b852a',
  getOvsxContinueCommandTemplate: 'a77fd1b94c4dc5c7acf31d62c8bcd9252fa0f1299edf70e84146a04d80bd9bd5',
  getOvsxApplyCommandTemplate: 'f0081cd460d49a73d82dc4a14bfd6681ead09adf870694303b5ee596875e4196',
  getOvsxFfCommandTemplate: 'ff276752f9ea35444b9de4f1efc68ab30e13a4927e60ca5381bacd37e7245c54',
  getArchiveChangeSkillTemplate: 'ff0bebc7c3e7f82634fa738be217af4289ea6030bd264f7cbe2105bc7a9b3892',
  getBulkArchiveChangeSkillTemplate: 'bee6161eedc05f4737e2625dae6845bf462a1b56b8e534ef1c7f1ab9dbada323',
  getOvsxSyncCommandTemplate: '169e6df7106b9a888b2c11f0b7b19de74b3f20c66af4a37bf8ed173119b7c90d',
  getVerifyChangeSkillTemplate: '5985873f822e0de4d5fbe66010c25e32fb1f3c584aa4bddd8b41cfbe878c325a',
  getOvsxArchiveCommandTemplate: '88fea293c206df2dd37c97de91f30363eb04f53a95beacaf5686b007f1136041',
  getOvsxOnboardCommandTemplate: '2d77c77ae1493a22ba6d5a5daae4ceb0dc10834ef0bba785d1a6da25a3b20c47',
  getOvsxBulkArchiveCommandTemplate: '3e166d832330ebcc97cdca053ca6456fff79a372949dcae0faa889370b33a97d',
  getOvsxVerifyCommandTemplate: '87f53867f4e783b7a91758593d8637145ffa48cea98b749298e6551eacc08eee',
  getOvsxProposeSkillTemplate: '519bb3bc4da0eb8f2d92e47295d57c3ab895035ea67c689ae4f9b8fb6ecc61db',
  getOvsxProposeCommandTemplate: '62ff8368c64ab0817257c7fa004f66e7fc3831b0ea623cebbc95b8adf405936c',
  getPaasTestDeploySkillTemplate: '6fb430bf63ca1aa7f3bfa848418aa3122de2260d2bd3485ccc67a23500130fe9',
  getOvsxPaasTestDeployCommandTemplate: '291743c69939c6d7c8c19506deebeb8484bf996f1bd66de1a1f74aa0d3a720c2',
  getFeedbackSkillTemplate: '99faf4b968e497afdc1ac250192a9e7254239a0c3c790bda6a4b4a499e19d2ab',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'ovsespec-explore': 'a4ab13246aab310c330a285bf65302e1e5c79fd33a3ee6fa6c486a4f609c6e62',
  'ovsespec-new-change': 'a3b171e6e0d08f061b25276ab72222f001a660c7d6a6199d65f96dcf79fb815e',
  'ovsespec-continue-change': '2fe6e8d8d90712f11993105a1a6c445661f909e2a39bd69e20c5787c2be88f51',
  'ovsespec-apply-change': '4225a660b374f0ce1051f262bfd49a37681654fdb9a2796307413c41c0dc47f4',
  'ovsespec-ff-change': '03c7f0a051b91280da393afbf0261267432bb08f5f95fe28fc1dc86299d64245',
  'ovsespec-sync-specs': '6ef7bd6d16a8bfd66dd2434d0e4db6867a28650d07ef3648ca0cb5a6aa89add8',
  'ovsespec-archive-change': '95cd3f1d9e888ec29726fcf087c267d4a571a8f529624c7676504015b49866c0',
  'ovsespec-bulk-archive-change': '3a20835abe49f51e4a916084dd508cf300b8ae8242a909d0906a34f65481d5e4',
  'ovsespec-verify-change': '7d8e1f38d3ffa2be9a9d65fe8e153bc561201493bfec373900fe8e0683f4cfcd',
  'ovsespec-onboard': 'bef3f6c7bf17b4e24c25254a94d9e0b62c7b5a34b46fb9b6ea831c327dbbdbb0',
  'ovsespec-propose': 'eaf4b5ed4656295ae6fef2579545dd6b741ee74c4dce5464b8ad46fe7d9b3ddf',
  'ovsespec-paas-test-deploy': 'be95c74e0a5a0b8c5e211d0fa117e9e802ef9198779abd26679a8f74dc3bba0c',
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function readSpecDrivenTemplate(fileName: string): string {
  return readFileSync(new URL(`../../../schemas/spec-driven/templates/${fileName}`, import.meta.url), 'utf8');
}

describe('skill templates split parity', () => {
  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getOvsxExploreCommandTemplate,
      getOvsxNewCommandTemplate,
      getOvsxContinueCommandTemplate,
      getOvsxApplyCommandTemplate,
      getOvsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOvsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOvsxArchiveCommandTemplate,
      getOvsxOnboardCommandTemplate,
      getOvsxBulkArchiveCommandTemplate,
      getOvsxVerifyCommandTemplate,
      getOvsxProposeSkillTemplate,
      getOvsxProposeCommandTemplate,
      getPaasTestDeploySkillTemplate,
      getOvsxPaasTestDeployCommandTemplate,
      getFeedbackSkillTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    // Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
    // deployed via generateSkillContent, while feedback is covered in function payload parity.
    const skillFactories: Array<[string, () => SkillTemplate]> = [
      ['ovsespec-explore', getExploreSkillTemplate],
      ['ovsespec-new-change', getNewChangeSkillTemplate],
      ['ovsespec-continue-change', getContinueChangeSkillTemplate],
      ['ovsespec-apply-change', getApplyChangeSkillTemplate],
      ['ovsespec-ff-change', getFfChangeSkillTemplate],
      ['ovsespec-sync-specs', getSyncSpecsSkillTemplate],
      ['ovsespec-archive-change', getArchiveChangeSkillTemplate],
      ['ovsespec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['ovsespec-verify-change', getVerifyChangeSkillTemplate],
      ['ovsespec-onboard', getOnboardSkillTemplate],
      ['ovsespec-propose', getOvsxProposeSkillTemplate],
      ['ovsespec-paas-test-deploy', getPaasTestDeploySkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });

  it('keeps conditional API/YAPI workflow semantics explicit', () => {
    const propose = getOvsxProposeCommandTemplate().content;
    const apply = getOvsxApplyCommandTemplate().content;
    const sync = getOvsxSyncCommandTemplate().content;
    const paasDeploy = getOvsxPaasTestDeployCommandTemplate().content;

    expect(propose).toContain('仅当变更新增或修改 public API');
    expect(propose).toContain('生成的长期产物默认主要使用中文');
    expect(propose).not.toContain('owner、reviewer、acceptance、rollback、handoff');
    expect(propose).toContain('method + path');
    expect(propose).toContain('YAPI create/update、Mock/advmock、audit');
    expect(propose).toContain('design.md 只在确有设计决策需要时额外创建');
    expect(propose).toContain('其他情况不要提 PaaS');

    expect(apply).toContain('source of truth');
    expect(apply).toContain('必须创建 YAPI 接口');
    expect(apply).toContain('YAPI Mock 数据是 API 实现完成条件的一部分');
    expect(apply).toContain('重新拉取 advmock list 验证生效');

    expect(sync).toContain('再次执行 YAPI sync');
    expect(sync).toContain('核对 YAPI 与代码/spec 是否一致');
    expect(sync).toContain('advmock 是否覆盖默认成功响应和 spec 指定场景');
    expect(sync).toContain('unknown/TBD');

    expect(paasDeploy).toContain('这个 workflow 保持独立');
    expect(paasDeploy).toContain('获得用户确认后才执行会改变环境状态的 deploy 操作');
    expect(paasDeploy).toContain('不能自动 archive');
  });

  it('keeps spec-driven artifact templates lean by default', () => {
    const proposal = readSpecDrivenTemplate('proposal.md');
    const design = readSpecDrivenTemplate('design.md');
    const tasks = readSpecDrivenTemplate('tasks.md');

    expect(proposal).toContain('## Impact');
    expect(proposal).not.toContain('## Team Coordination');
    expect(proposal).not.toContain('## API / YAPI Contracts');

    expect(design).toContain('## Migration Plan');
    expect(design).not.toContain('## Team Workflow');
    expect(design).not.toContain('## API / YAPI Contract Plan');
    expect(design).toContain('## Open Questions');

    expect(tasks).not.toContain('## 0. Coordination / Contracts');
    expect(tasks).not.toContain('YAPI create/update');
    expect(tasks).not.toContain('Mock/advmock');
    expect(tasks).toContain('## 1. <!-- Task Group Name -->');
  });
});
