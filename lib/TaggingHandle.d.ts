import { MouseEventType, GraphicJson } from './types';
import { ToolOption, TaggingMaster } from '.';
export declare class TaggingHandle {
    private _taggingMaster;
    private readonly _taggingImplObjectMap;
    private readonly _implClassMap;
    constructor(_taggingMaster: TaggingMaster);
    addImpl(tool: ToolOption): void;
    removeImpl(name: string): void;
    getMouseHandle(currentToolName: string, mouseEventType: MouseEventType): (e: import("fabric/fabric-impl").IEvent) => void;
    clearTaggingImplObject(): void;
    loadJson(obj: GraphicJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }): void;
    reset(): void;
}
