import { spawn as nodeSpawn } from 'node:child_process';
import { WorkspaceLocalState, WorkspacePreferredOpener, WorkspaceSharedState, resolveWorkspaceOpenLinks } from '../../core/workspace/index.js';
import { SelectedWorkspace } from './types.js';
export declare const WORKSPACE_OPEN_MINIMAL_PROMPT = "Open this OvseSpec workspace.";
export interface WorkspaceOpenState {
    sharedState: WorkspaceSharedState;
    localState: WorkspaceLocalState;
    codeWorkspacePath: string;
}
export interface WorkspaceOpenLaunchCommand {
    executable: string;
    args: string[];
    cwd: string;
    openerLabel: string;
}
export type WorkspaceOpenSpawn = typeof nodeSpawn;
export interface WorkspaceOpenLaunchOptions {
    spawn?: WorkspaceOpenSpawn;
    isExecutableAvailable?: (executable: string) => boolean;
}
export declare function readWorkspaceOpenState(selected: SelectedWorkspace): Promise<WorkspaceOpenState>;
export declare function buildWorkspaceOpenLaunchCommand(opener: WorkspacePreferredOpener, workspaceRoot: string, codeWorkspacePath: string, linkedPaths: string[]): WorkspaceOpenLaunchCommand;
export declare function assertWorkspaceOpenerAvailable(opener: WorkspacePreferredOpener, codeWorkspacePath: string, isExecutableAvailable?: (executable: string) => boolean): void;
export declare function buildWorkspaceOpenCommandForState(opener: WorkspacePreferredOpener, workspaceRoot: string, state: WorkspaceOpenState): Promise<{
    command: WorkspaceOpenLaunchCommand;
    skipped: Awaited<ReturnType<typeof resolveWorkspaceOpenLinks>>['skipped'];
}>;
export declare function launchWorkspaceOpenCommand(command: WorkspaceOpenLaunchCommand, options?: WorkspaceOpenLaunchOptions): Promise<void>;
//# sourceMappingURL=open.d.ts.map