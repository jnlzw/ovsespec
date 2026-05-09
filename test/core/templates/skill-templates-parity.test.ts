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
  getNewChangeSkillTemplate: 'e4a53e9af3698b3a893782d5070af913facb93709f8c582d21e8cd82d4cef998',
  getContinueChangeSkillTemplate: 'e772528fd4dcf33bdb05f7c62c43584af588f0bb188dfbc4ddbf8397c35ceff5',
  getApplyChangeSkillTemplate: '8f362a7aaea36d9d12118752e7dc0c1713b84d2279726a9963a3070368e4e8ea',
  getFfChangeSkillTemplate: '77da4d3fa6ce07a2c29481376c5630329d3aab104a9cf46f3ee07f74a0b7fa8f',
  getSyncSpecsSkillTemplate: 'a0bffacc156bf43d2ff6f992fb3be48719518ad0899c1a1ea4c9218b90681acb',
  getOnboardSkillTemplate: '4030dacd6a6d3a17706e42b3482db20df3859c539c59c5b23507cda4c55afcc4',
  getOvsxExploreCommandTemplate: '69aeeb36e6ac7b71fc075106b07cdd0c41d9772cd1510b0a2d6e0a00efc6426c',
  getOvsxNewCommandTemplate: '1122d6eeed607883c33c68f3a444c14dd5afd415f9e2bf529a1b7b62a56b852a',
  getOvsxContinueCommandTemplate: '0184d46cfd85827d3d6319d94f26f42c3245309907473b1c1757fb919ab2518d',
  getOvsxApplyCommandTemplate: '4e59175097122d8e1d26f68f229cda48ad9a8ce38f19d09edc983dd507f138fa',
  getOvsxFfCommandTemplate: '41c96db30c562b6165ef7f4e847ff560c89e63101e303ef6743f598742b308c7',
  getArchiveChangeSkillTemplate: '52b4ff16d7da487382e0fb5eb589f195928fb5c66f6af5c121a88ee1c25c7078',
  getBulkArchiveChangeSkillTemplate: 'bee6161eedc05f4737e2625dae6845bf462a1b56b8e534ef1c7f1ab9dbada323',
  getOvsxSyncCommandTemplate: '6db99ce124561f04ad609f982f6da7ca6235642c0a866bf28c84c0019735fc57',
  getVerifyChangeSkillTemplate: '7eba5a1db7354081bce5b7fc89151d7bccf6af70438e8a9e80a297710038fbfb',
  getOvsxArchiveCommandTemplate: '59ded9d5e0f4df4fd4d6785b90e8577899631c3f0d7377f81db4942d69229f90',
  getOvsxOnboardCommandTemplate: '2d77c77ae1493a22ba6d5a5daae4ceb0dc10834ef0bba785d1a6da25a3b20c47',
  getOvsxBulkArchiveCommandTemplate: '3e166d832330ebcc97cdca053ca6456fff79a372949dcae0faa889370b33a97d',
  getOvsxVerifyCommandTemplate: 'f564dba2b6000f660cb0b99382a884de98c65e13344c09b706db51a683531264',
  getOvsxProposeSkillTemplate: '15396108bf688c6d7a0ac0a1f4b5448baf1aefe9aac86c51c3f8b00dc641ef02',
  getOvsxProposeCommandTemplate: '64ee58fd4190bd4c43285bc856f85df41158d88866b6dd763f121ac245c52dde',
  getPaasTestDeploySkillTemplate: '623bd8bce911ad8e8d0bbef96230f42ba48a383a56662ba3047e189930782197',
  getOvsxPaasTestDeployCommandTemplate: 'b1bb9167006bb59cd2be429cb898245701a3092c33ccf0ba5ff66ff0efd24ec4',
  getFeedbackSkillTemplate: '99faf4b968e497afdc1ac250192a9e7254239a0c3c790bda6a4b4a499e19d2ab',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'ovsespec-explore': 'a4ab13246aab310c330a285bf65302e1e5c79fd33a3ee6fa6c486a4f609c6e62',
  'ovsespec-new-change': 'fa7505952a971bfaed903f3a42061f2503d85c4acc784cdd146e5e7d9b9915cb',
  'ovsespec-continue-change': '317b3d3c5cbda8e3b39b56c5cec7abda7b7371dd34df115e7fa3fadd0f5c0e66',
  'ovsespec-apply-change': 'd51a351cdd0ffa0bedc2f626039fc4f80f9fac5a3e8d46ea41aed7798c6ff9f8',
  'ovsespec-ff-change': '79961ef69068b8504749b13c248da213119acef8cfbdbd78f1fd85761987912f',
  'ovsespec-sync-specs': '829fc3f994499040f8396bee741042c2235d6d6204e339eb0b285e6729f24100',
  'ovsespec-archive-change': '189fd3a3e301120c8694bb16659e297ceb84f32992e2412e07c17f96fd08cc86',
  'ovsespec-bulk-archive-change': '3a20835abe49f51e4a916084dd508cf300b8ae8242a909d0906a34f65481d5e4',
  'ovsespec-verify-change': '5524564a3a459bdd0457574a39d0d5541cac6d0636b96d786e4c878b3f978c17',
  'ovsespec-onboard': 'dc731254fb3d0bf3fcad0462d377ea3abd8144b9fe254e47a498672599270428',
  'ovsespec-propose': '4342e99935590cc2fbf54d9a1e39e511d5c7c83e420f2c9a600435e349af05d8',
  'ovsespec-paas-test-deploy': 'fe8ac952659b99379102c6013bfbdbd9b0ee2e2f7608ec4f9785a7491c81a60b',
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
    expect(propose).not.toContain('new/unknown');

    expect(apply).toContain('source of truth');
    expect(apply).toContain('必须创建 YAPI 接口');
    expect(apply).toContain('YAPI Mock 数据是 API 实现完成条件的一部分');
    expect(apply).toContain('重新拉取 advmock list 验证生效');

    expect(sync).toContain('再次执行 YAPI sync');
    expect(sync).toContain('核对 YAPI 与代码/spec 是否一致');
    expect(sync).toContain('advmock 是否覆盖默认成功响应和 spec 指定场景');
    expect(sync).toContain('同步摘要必须保留 API/YAPI 结构化字段的状态');
    expect(sync).toContain('sync_status');
    expect(sync).toContain('audit_status');
    expect(sync).toContain('mock_status');
    expect(sync).toContain('不要输出 `location`、`position` 或本地路径字段');
    expect(sync).toContain('unknown');
    expect(sync).not.toContain('unknown/TBD');
    expect(sync).not.toContain('new/unknown');
    expect(sync).not.toContain('缺字段时只标注具体缺失字段');

    expect(paasDeploy).toContain('这个 workflow 保持独立');
    expect(paasDeploy).toContain('获得用户确认后才执行会改变环境状态的 deploy 操作');
    expect(paasDeploy).toContain('不能自动 archive');
  });

  it('keeps spec-driven artifact templates lean by default', () => {
    const proposal = readSpecDrivenTemplate('proposal.md');
    const design = readSpecDrivenTemplate('design.md');
    const tasks = readSpecDrivenTemplate('tasks.md');

    expect(proposal).toContain('## Technical Impact');
    expect(proposal).toContain('Do not include owner, reviewer, handoff');
    expect(proposal).not.toContain('## Team Coordination');
    expect(proposal).not.toContain('## API / YAPI Contracts');

    expect(design).toContain('## Decision');
    expect(design).toContain('## Approach');
    expect(design).toContain('## Validation');
    expect(design).not.toContain('## Team Workflow');
    expect(design).not.toContain('## API / YAPI Contract Plan');
    expect(design).not.toContain('## Open Questions');
    expect(design).not.toContain('## Migration Plan');

    expect(tasks).not.toContain('## 0. Coordination / Contracts');
    expect(tasks).not.toContain('YAPI create/update');
    expect(tasks).not.toContain('Mock/advmock');
    expect(tasks).toContain('## 1. <!-- Task Group Name -->');
  });
});
