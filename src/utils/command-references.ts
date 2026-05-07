/**
 * Command Reference Utilities
 *
 * Utilities for transforming command references to tool-specific formats.
 */

/**
 * Transforms colon-based command references to hyphen-based format.
 * Converts `/ovsx:` patterns to `/ovsx-` for tools that use hyphen syntax.
 *
 * @param text - The text containing command references
 * @returns Text with command references transformed to hyphen format
 *
 * @example
 * transformToHyphenCommands('/ovsx:new') // returns '/ovsx-new'
 * transformToHyphenCommands('Use /ovsx:apply to implement') // returns 'Use /ovsx-apply to implement'
 */
export function transformToHyphenCommands(text: string): string {
  return text.replace(/\/ovsx:/g, '/ovsx-');
}
