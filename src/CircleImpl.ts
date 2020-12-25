import { fabric } from 'fabric';
import { CircleJson } from './types';
import { Point, Circle } from 'fabric/fabric-impl';
import { DragObjectImpl } from './DragObjectImpl';

export const circleCommonOptions = {
  strokeWidth: 1, // 笔触宽度
  stroke: 'rgba(255, 0, 0, 1)',
  fill: 'rgba(255, 0, 0, 0.22)',
  originX: 'center',
  originY: 'center',
  lockUniScaling: true,
  hasBorders: true,
  hasControls: false,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true
};

export class CircleImpl extends DragObjectImpl {
  draw (
    _: number,
    _1: number,
    width: number,
    height: number,
    mouseFrom: Point
  ) {
    const left = mouseFrom.x;
    const top = mouseFrom.y;
    const radius = Math.sqrt(width ** 2 + height ** 2)
    if (this.implObject) {
      (this.implObject as Circle).set({ left, top, radius });
      this.taggingMaster.canvas.requestRenderAll();
    } else {
      this.implObject = new fabric.Circle({ name: this.name, left, top, radius, ...circleCommonOptions });
      this.taggingMaster.canvas.add(this.implObject);
    }
  }

  public loadJson (
    item: CircleJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ) {
    this.implObject = new fabric.Circle({
      name: item.name,
      left: offset.offsetLeft + item.position.cx,
      top: offset.offsetTop + item.position.cy,
      radius: item.position.r,
      ...circleCommonOptions
    })

    if (isViewMode) {
      this.implObject.set('selectable', false);
      this.implObject.set('hoverCursor', 'default')
    }

    this.taggingMaster.canvas.add(this.implObject);
  }
}
