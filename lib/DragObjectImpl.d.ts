import { Point, IEvent } from 'fabric/fabric-impl';
import { BaseObjectImpl } from './BaseObjectImpl';
export declare abstract class DragObjectImpl extends BaseObjectImpl {
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
    abstract draw(left: number, top: number, width: number, height: number, mouseFrom?: Point, mouseTo?: Point): void;
}
