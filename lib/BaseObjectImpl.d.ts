import { IbaseObjectImpl, TaggingMaster, RectJson, EllipseJson, PolygonJson, CircleJson, DotJson, NoneJson } from '.';
import { Object as ImplObject, IEvent } from 'fabric/fabric-impl';
export declare abstract class BaseObjectImpl implements IbaseObjectImpl {
    protected implObject: ImplObject | null;
    protected taggingMaster: TaggingMaster;
    protected name: string;
    constructor(taggingMaster: TaggingMaster, name: string);
    abstract mousedown(e: IEvent): void;
    abstract mousemove(e: IEvent): void;
    abstract mouseup(e: IEvent): void;
    abstract loadJson(json: RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
    clear(): void;
}
