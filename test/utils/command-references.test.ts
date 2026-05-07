import { describe, it, expect } from 'vitest';
import { transformToHyphenCommands } from '../../src/utils/command-references.js';

describe('transformToHyphenCommands', () => {
  describe('basic transformations', () => {
    it('should transform single command reference', () => {
      expect(transformToHyphenCommands('/ovsx:new')).toBe('/ovsx-new');
    });

    it('should transform multiple command references', () => {
      const input = '/ovsx:new and /ovsx:apply';
      const expected = '/ovsx-new and /ovsx-apply';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });

    it('should transform command reference in context', () => {
      const input = 'Use /ovsx:apply to implement tasks';
      const expected = 'Use /ovsx-apply to implement tasks';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });

    it('should handle backtick-quoted commands', () => {
      const input = 'Run `/ovsx:continue` to proceed';
      const expected = 'Run `/ovsx-continue` to proceed';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should return unchanged text with no command references', () => {
      const input = 'This is plain text without commands';
      expect(transformToHyphenCommands(input)).toBe(input);
    });

    it('should return empty string unchanged', () => {
      expect(transformToHyphenCommands('')).toBe('');
    });

    it('should not transform similar but non-matching patterns', () => {
      const input = '/ops:new ovsx: /other:command';
      expect(transformToHyphenCommands(input)).toBe(input);
    });

    it('should handle multiple occurrences on same line', () => {
      const input = '/ovsx:new /ovsx:continue /ovsx:apply';
      const expected = '/ovsx-new /ovsx-continue /ovsx-apply';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('multiline content', () => {
    it('should transform references across multiple lines', () => {
      const input = `Use /ovsx:new to start
Then /ovsx:continue to proceed
Finally /ovsx:apply to implement`;
      const expected = `Use /ovsx-new to start
Then /ovsx-continue to proceed
Finally /ovsx-apply to implement`;
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('all known commands', () => {
    const commands = [
      'new',
      'continue',
      'apply',
      'ff',
      'sync',
      'archive',
      'bulk-archive',
      'verify',
      'explore',
      'onboard',
      'paas-test-deploy',
    ];

    for (const cmd of commands) {
      it(`should transform /ovsx:${cmd}`, () => {
        expect(transformToHyphenCommands(`/ovsx:${cmd}`)).toBe(`/ovsx-${cmd}`);
      });
    }
  });
});
