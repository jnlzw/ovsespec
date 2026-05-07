export declare const OVSESPEC_DIR_NAME = "ovsespec";
export declare const OVSESPEC_MARKERS: {
    start: string;
    end: string;
};
export interface OvseSpecConfig {
    aiTools: string[];
}
export interface AIToolOption {
    name: string;
    value: string;
    available: boolean;
    successLabel?: string;
    skillsDir?: string;
    detectionPaths?: string[];
}
export declare const AI_TOOLS: AIToolOption[];
//# sourceMappingURL=config.d.ts.map