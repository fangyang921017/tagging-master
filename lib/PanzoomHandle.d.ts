import { IEvent } from 'fabric/fabric-impl';
import { TaggingMaster } from '.';
export declare class PanzoomHandle {
    private readonly _canvas;
    private _isDragging;
    private _lastPosition;
    constructor(taggingMaster: TaggingMaster);
    private _resetCoords;
    mousedown(e: IEvent): void;
    mousemove(e: IEvent): void;
    mouseup(): void;
    mousewheel(e: IEvent): void;
}
