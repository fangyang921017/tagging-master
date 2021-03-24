import { BaseObjectImpl } from './BaseObjectImpl';
import { IEvent } from 'fabric/fabric-impl';
import { MultiRectJson } from './types';
export declare const rectCommonOptions: {
    strokeWidth: number;
    stroke: string;
    fill: string;
    hasBorders: boolean;
    hasControls: boolean;
    lockRotation: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockUniScaling: boolean;
};
export declare class MultiRectImpl extends BaseObjectImpl {
    protected mouseFrom: {
        x: number;
        y: number;
    };
    protected mouseTo: {
        x: number;
        y: number;
    };
    protected isDrawing: boolean;
    protected hasMoved: boolean;
    mousedown(e: IEvent): void;
    mousemove(e: IEvent): void;
    mouseup(): void;
    draw(left: number, top: number, width: number, height: number): void;
    loadJson(item: MultiRectJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
}
