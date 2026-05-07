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
  getContinueChangeSkillTemplate: '8f37b325ffc9857352b1534fe95d5ed4d16534fc88f85eef73efef6a2920f662',
  getApplyChangeSkillTemplate: 'f12de03007fe6488a61c621f4ec8cf9d3a0e9c2c673b5a85bb05ba9f5848dd9f',
  getFfChangeSkillTemplate: '6ed37ce42987f67c574037a167b1ac91aa7a34965ec8ee21ac1e07573c52095b',
  getSyncSpecsSkillTemplate: 'e80aee8c7730e2a83c81c1e3a26ae47d72fb80e5799f3296064788bcf7bbdcb6',
  getOnboardSkillTemplate: 'a8aaac486dffbaeceb589192db7c195beb0e55f332da355518af1c9dadd2ccc7',
  getOvsxExploreCommandTemplate: '69aeeb36e6ac7b71fc075106b07cdd0c41d9772cd1510b0a2d6e0a00efc6426c',
  getOvsxNewCommandTemplate: 'a45e3703fbcac9aa49f2b7410b173f8643bbabc20fc3ff5caaf10c259f8c6cce',
  getOvsxContinueCommandTemplate: 'a77fd1b94c4dc5c7acf31d62c8bcd9252fa0f1299edf70e84146a04d80bd9bd5',
  getOvsxApplyCommandTemplate: '93f4f499b79e7e92554af9cee80c0ab108c0316070a2f022434980ec116cafcb',
  getOvsxFfCommandTemplate: 'cd6d59f343707860eb584c23c1c631332e1df00738eda40d0ba31ed0d79d1c3d',
  getArchiveChangeSkillTemplate: 'ff0bebc7c3e7f82634fa738be217af4289ea6030bd264f7cbe2105bc7a9b3892',
  getBulkArchiveChangeSkillTemplate: 'bee6161eedc05f4737e2625dae6845bf462a1b56b8e534ef1c7f1ab9dbada323',
  getOvsxSyncCommandTemplate: '403e40b6f4643727cc341cb5d1c032e84e937aea78713ca0fbf10f6961f59443',
  getVerifyChangeSkillTemplate: '5985873f822e0de4d5fbe66010c25e32fb1f3c584aa4bddd8b41cfbe878c325a',
  getOvsxArchiveCommandTemplate: '88fea293c206df2dd37c97de91f30363eb04f53a95beacaf5686b007f1136041',
  getOvsxOnboardCommandTemplate: '2d77c77ae1493a22ba6d5a5daae4ceb0dc10834ef0bba785d1a6da25a3b20c47',
  getOvsxBulkArchiveCommandTemplate: '3e166d832330ebcc97cdca053ca6456fff79a372949dcae0faa889370b33a97d',
  getOvsxVerifyCommandTemplate: '87f53867f4e783b7a91758593d8637145ffa48cea98b749298e6551eacc08eee',
  getOvsxProposeSkillTemplate: 'd5ba20fa3bfdc734232e70c5dcb6ab742f929cc4d9bfd790bc412f93268e316b',
  getOvsxProposeCommandTemplate: 'dc30bb644a1592a76b00a90bf0861c3d506b0efced8a43e3c350a7c67a1e1db3',
  getPaasTestDeploySkillTemplate: '6fb430bf63ca1aa7f3bfa848418aa3122de2260d2bd3485ccc67a23500130fe9',
  getOvsxPaasTestDeployCommandTemplate: '291743c69939c6d7c8c19506deebeb8484bf996f1bd66de1a1f74aa0d3a720c2',
  getFeedbackSkillTemplate: '99faf4b968e497afdc1ac250192a9e7254239a0c3c790bda6a4b4a499e19d2ab',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'ovsespec-explore': 'a4ab13246aab310c330a285bf65302e1e5c79fd33a3ee6fa6c486a4f609c6e62',
  'ovsespec-new-change': 'a3b171e6e0d08f061b25276ab72222f001a660c7d6a6199d65f96dcf79fb815e',
  'ovsespec-continue-change': '170ba3d79f79b840ae862a29e26102ff238c1bcbad818e150105abf9234d408c',
  'ovsespec-apply-change': 'e5c198e130b8b632cf44beb4dfbc634370d0996492ea950041c1c0bee539cd59',
  'ovsespec-ff-change': '03c7f0a051b91280da393afbf0261267432bb08f5f95fe28fc1dc86299d64245',
  'ovsespec-sync-specs': '9e23d251ff5e330adb6af7b4dc275f7933f1df9e938fd8995fde0217707d6932',
  'ovsespec-archive-change': '95cd3f1d9e888ec29726fcf087c267d4a571a8f529624c7676504015b49866c0',
  'ovsespec-bulk-archive-change': '3a20835abe49f51e4a916084dd508cf300b8ae8242a909d0906a34f65481d5e4',
  'ovsespec-verify-change': '7d8e1f38d3ffa2be9a9d65fe8e153bc561201493bfec373900fe8e0683f4cfcd',
  'ovsespec-onboard': '330157f612153a68ff1a6712845084169322489dfec2f316e1f94b5cef1d77bd',
  'ovsespec-propose': 'e9a0cafb0064cb95f6be4a2bbef5148e99de2cc6c6536c0cf66a0912bbbae872',
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

  it('keeps team and YAPI workflow semantics explicit', () => {
    const propose = getOvsxProposeCommandTemplate().content;
    const apply = getOvsxApplyCommandTemplate().content;
    const sync = getOvsxSyncCommandTemplate().content;
    const paasDeploy = getOvsxPaasTestDeployCommandTemplate().content;

    expect(propose).toContain('结构化 API/YAPI 清单');
    expect(propose).toContain('owner、reviewer、acceptance、rollback、handoff');
    expect(propose).toContain('method + path');
    expect(propose).toContain('YAPI create/update、Mock/advmock、audit');

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

  it('keeps spec-driven artifact templates ready for team and YAPI fields', () => {
    const proposal = readSpecDrivenTemplate('proposal.md');
    const design = readSpecDrivenTemplate('design.md');
    const tasks = readSpecDrivenTemplate('tasks.md');

    expect(proposal).toContain('## Team Coordination');
    expect(proposal).toContain('## API / YAPI Contracts');
    expect(proposal).toContain('`method + path`');
    expect(proposal).toContain('Mock / advmock');

    expect(design).toContain('## Migration Plan');
    expect(design).toContain('## Team Workflow');
    expect(design).toContain('## API / YAPI Contract Plan');
    expect(design).toContain('## Open Questions');

    expect(tasks).toContain('## 0. Coordination / Contracts');
    expect(tasks).toContain('YAPI create/update');
    expect(tasks).toContain('Mock/advmock');
    expect(tasks).toContain('audit/consistency checks');
  });
});
