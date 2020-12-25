import { fabric } from 'fabric';
import { RectJson } from './types';
import { DragObjectImpl } from './DragObjectImpl';

export const rectCommonOptions = {
  strokeWidth: 1, // 笔触宽度
  stroke: 'rgba(0, 132, 255, 1)',
  fill: 'rgba(0, 132, 255, 0.22)',
  hasBorders: true,
  hasControls: false,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true
};

export class RectImpl extends DragObjectImpl {
  draw (
    left: number,
    top: number,
    width: number,
    height: number
  ) {
    if (this.implObject) {
      this.implObject.set({ left, top, width, height });
      this.taggingMaster.canvas.requestRenderAll();
    } else {
      this.implObject = new fabric.Rect({
        name: this.name,
        left,
        top,
        width,
        height,
        ...rectCommonOptions
      });
      this.taggingMaster.canvas.add(this.implObject);
    }
  }

  public loadJson (
    item: RectJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ) {
    this.implObject = new fabric.Rect({
      name: item.name,
      width: item.position.w,
      height: item.position.h,
      left: offset.offsetLeft + item.position.x,
      top: offset.offsetTop + item.position.y,
      ...rectCommonOptions
    });

    if (isViewMode) {
      this.implObject.set('selectable', false);
      this.implObject.set('hoverCursor', 'default')
    }

    this.taggingMaster.canvas.add(this.implObject);
  }
}
