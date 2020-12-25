import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { DrawType, TaggingData, RectJson, EllipseJson, PolygonJson, CircleJson, DotJson, NoneJson } from './types';
export * from './types';
export declare type ToolOption = {
    name: string;
    type: DrawType;
    multiple?: boolean;
};
export declare type TaggingMasterOptions = {
    canvasId: string;
    tools?: Array<ToolOption>;
};
export declare class TaggingMaster {
    canvas: Canvas;
    private _currentToolName;
    private _currentImgObject;
    private _tools;
    private readonly _width;
    private readonly _height;
    private readonly _borderWidth;
    private readonly _enableTagging;
    private readonly _taggingHandel;
    private readonly _viewMode;
    constructor(options: TaggingMasterOptions);
    getTools(): ToolOption[];
    isViewMode(): boolean;
    resetTools(tools: ToolOption[]): void;
    private _init;
    private _disableSelectGroup;
    private _bindTaggingHandle;
    private _bindPanzoomHandle;
    loadImage(url: string): Promise<fabric.Image>;
    setTool(toolName: string): void;
    getCurrentToolName(): string;
    loadFromTaggingData(taggingData: TaggingData): Promise<void>;
    getTaggingData(): (RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson)[];
    showAll(): void;
    hideAll(): void;
    show(name: string): void;
    hide(name: string): void;
}
