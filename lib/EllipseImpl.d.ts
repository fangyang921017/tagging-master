import { EllipseJson } from './types';
import { DragObjectImpl } from './DragObjectImpl';
export declare const ellipseCommonOptions: {
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
export declare class EllipseImpl extends DragObjectImpl {
    draw(left: number, top: number, width: number, height: number): void;
    loadJson(item: EllipseJson, offset: {
        offsetLeft: number;
        offsetTop: number;
    }, isViewMode?: boolean): void;
}
