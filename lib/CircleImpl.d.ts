import { CircleJson } from './types';
import { Point } from 'fabric/fabric-impl';
import { DragObjectImpl } from './DragObjectImpl';
export declare const circleCommonOptions: {
    strokeWidth: number;
    stroke: string;
    fill: string;
    originX: string;
    originY: string;
    lockUniScaling: boolean;
    hasBorders: boolean;
    hasControls: boolean;
    lockRotation: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
};
export declare class CircleImpl extends DragObjectImpl {
    draw(_: number, _1: number, width: number, height: number, mouseFrom: Point): void;
    loadJson(item: CircleJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
}
