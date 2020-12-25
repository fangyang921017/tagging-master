import { IEvent } from 'fabric/fabric-impl';
import { BaseObjectImpl } from './BaseObjectImpl';
import { PolygonJson } from '.';
export declare const polygonCommonOptions: {
    stroke: string;
    fill: string;
    strokeWidth: number;
    opacity: number;
    hasBorders: boolean;
    hasControls: boolean;
    lockRotation: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockUniScaling: boolean;
};
export declare class PolygonImpl extends BaseObjectImpl {
    private activeLine;
    private pointArray;
    private lineArray;
    mousedown(e: IEvent): void;
    mousemove(e: IEvent): void;
    mouseup(): void;
    addPoint(e: IEvent): void;
    generatePolygon(): void;
    loadJson(item: PolygonJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
}
