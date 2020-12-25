import { fabric } from 'fabric';
import { EllipseJson } from './types';
import { Ellipse } from 'fabric/fabric-impl';
import { DragObjectImpl } from './DragObjectImpl';

export const ellipseCommonOptions = {
  strokeWidth: 1, // 笔触宽度
  stroke: 'rgba(255, 123, 0, 1)',
  fill: 'rgba(255, 123, 0, 0.22)',
  hasBorders: true,
  hasControls: false,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true
};

export class EllipseImpl extends DragObjectImpl {
  draw (
    left: number,
    top: number,
    width: number,
    height: number
  ) {
    if (this.implObject) {
      (this.implObject as Ellipse).set({ left, top, rx: width / 2, ry: height / 2 });
      this.taggingMaster.canvas.requestRenderAll();
    } else {
      this.implObject = new fabric.Ellipse({
        name: this.name,
        left,
        top,
        rx: width / 2,
        ry: height / 2,
        ...ellipseCommonOptions
      });
      this.taggingMaster.canvas.add(this.implObject);
    }
  }

  public loadJson (
    item: EllipseJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ) {
    this.implObject = new fabric.Ellipse({
      name: item.name,
      left: offset.offsetLeft + item.position.cx - item.position.rx,
      top: offset.offsetTop + item.position.cy - item.position.ry,
      rx: item.position.rx,
      ry: item.position.ry,
      ...ellipseCommonOptions
    })

    if (isViewMode) {
      this.implObject.set('selectable', false);
      this.implObject.set('hoverCursor', 'default')
    }

    this.taggingMaster.canvas.add(this.implObject);
  }
}
