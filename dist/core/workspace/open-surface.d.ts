import { WorkspaceLocalState, WorkspaceSharedState } from './foundation.js';
export declare const WORKSPACE_GUIDANCE_START_MARKER = "<!-- OVSESPEC:WORKSPACE-GUIDANCE:START -->";
export declare const WORKSPACE_GUIDANCE_END_MARKER = "<!-- OVSESPEC:WORKSPACE-GUIDANCE:END -->";
export declare const WORKSPACE_GUIDANCE_BODY = "# OvseSpec Workspace Guidance\n\nThis directory is an OvseSpec workspace for planning across linked repos or folders.\n\n- Use `changes/` for workspace-level planning.\n- Linked repos and folders are available for exploration and planning.\n- Repo or folder visibility supports exploration and planning.\n- Make implementation edits after the user explicitly asks for implementation work.\n- Treat linked repos and folders as the implementation homes for their owned code.\n- Use OvseSpec workspace commands instead of hand-editing `.ovsespec-workspace/*.yaml`.";
export interface WorkspaceOpenLink {
    name: string;
    path: string;
}
export interface WorkspaceSkippedOpenLink {
    name: string;
    path: string | null;
    reason: 'missing-local-path' | 'path-missing';
}
export interface WorkspaceOpenSurfaceLinks {
    links: WorkspaceOpenLink[];
    skipped: WorkspaceSkippedOpenLink[];
}
export declare function buildWorkspaceGuidanceBlock(): string;
export declare function applyWorkspaceGuidanceBlock(existingContent: string): string;
export declare function buildWorkspaceCodeWorkspaceContent(links: WorkspaceOpenLink[]): string;
export declare function writeWorkspaceCodeWorkspaceFile(codeWorkspacePath: string, links: WorkspaceOpenLink[]): Promise<void>;
export declare function resolveWorkspaceOpenLinks(sharedState: WorkspaceSharedState, localState: WorkspaceLocalState): Promise<WorkspaceOpenSurfaceLinks>;
export declare function syncWorkspaceOpenSurface(workspaceRoot: string, sharedState: WorkspaceSharedState, localState: WorkspaceLocalState): Promise<WorkspaceOpenSurfaceLinks>;
//# sourceMappingURL=open-surface.d.ts.map