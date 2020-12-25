import { BaseObjectImpl } from './BaseObjectImpl';
import { IEvent } from 'fabric/fabric-impl';
import { DotJson } from '.';
export declare const dotCommonOptions: {
    radius: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    lockRotation: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockUniScaling: boolean;
    originX: string;
    originY: string;
};
export declare class DotImpl extends BaseObjectImpl {
    mousedown(e: IEvent): void;
    mousemove(): void;
    mouseup(): void;
    loadJson(item: DotJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
}
