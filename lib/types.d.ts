import { IEvent } from 'fabric/fabric-impl';
export declare enum DrawType {
    None = "",
    Rect = "rect",
    Polygon = "polygon",
    Ellipse = "ellipse",
    Circle = "circle",
    Dot = "dot"
}
export declare type MouseEventType = 'mousedown' | 'mousemove' | 'mouseup';
export declare abstract class IbaseObjectImpl {
    abstract mousedown(e: IEvent): void;
    abstract mousemove(e: IEvent): void;
    abstract mouseup(e: IEvent): void;
    abstract clear(): void;
}
export interface RectJson {
    name: string;
    type: DrawType.Rect;
    position: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}
export interface PolygonJson {
    name: string;
    type: DrawType.Polygon;
    position: {
        points: [number, number][];
    };
}
export interface CircleJson {
    name: string;
    type: DrawType.Circle;
    position: {
        cx: number;
        cy: number;
        r: number;
    };
}
export interface EllipseJson {
    name: string;
    type: DrawType.Ellipse;
    position: {
        cx: number;
        cy: number;
        rx: number;
        ry: number;
    };
}
export interface DotJson {
    name: string;
    type: DrawType.Dot;
    position: {
        points: [number, number][];
    };
}
export interface NoneJson {
    name: string;
    type: DrawType.None;
    position: {};
}
export interface TaggingData {
    imgUrl: string;
    tagObjects: Array<RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson>;
}
