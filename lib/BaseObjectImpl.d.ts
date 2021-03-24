import { IbaseObject, TaggingMaster } from '.';
import { Object as ImplObject, IEvent } from 'fabric/fabric-impl';
import { GraphicJson } from './types';
export declare abstract class BaseObjectImpl implements IbaseObject {
    protected implObject: ImplObject | null;
    protected implObjectForDots: ImplObject[];
    protected implObjectForMultiRects: ImplObject[];
    protected taggingMaster: TaggingMaster;
    protected name: string;
    constructor(taggingMaster: TaggingMaster, name: string);
    abstract mousedown(e: IEvent): void;
    abstract mousemove(e: IEvent): void;
    abstract mouseup(e: IEvent): void;
    abstract loadJson(json: GraphicJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
    clear(): void;
}
