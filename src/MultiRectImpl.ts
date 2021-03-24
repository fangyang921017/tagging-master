import { fabric } from 'fabric';
import { BaseObjectImpl } from './BaseObjectImpl';
import { IEvent } from 'fabric/fabric-impl';
import { MultiRectJson } from './types';

export const rectCommonOptions = {
  strokeWidth: 1, // 笔触宽度
  stroke: 'rgba(255, 132, 0, 1)',
  fill: 'rgba(255, 132, 0, 0.22)',
  hasBorders: true,
  hasControls: false,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true
};

export class MultiRectImpl extends BaseObjectImpl {
  protected mouseFrom = { x: 0, y: 0 };
  protected mouseTo = { x: 0, y: 0 };
  protected isDrawing = false;
  protected hasMoved = false;

  public mousedown (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (mouseEvent.ctrlKey === true) return;
    if (!e.target || e.target.type !== 'image') return
    this.isDrawing = true;
    this.mouseFrom = this.taggingMaster.canvas.getPointer(mouseEvent);
  }

  public mousemove (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (mouseEvent.ctrlKey === true) return

    if (this.isDrawing) {
      this.hasMoved = true;
      this.mouseTo = this.taggingMaster.canvas.getPointer(mouseEvent);
      const left = this.mouseTo.x > this.mouseFrom.x ? this.mouseFrom.x : this.mouseTo.x;
      const top = this.mouseTo.y > this.mouseFrom.y ? this.mouseFrom.y : this.mouseTo.y;
      const width = Math.abs(this.mouseTo.x - this.mouseFrom.x);
      const height = Math.abs(this.mouseTo.y - this.mouseFrom.y);
      // 如果画出来的图形大小规格小于 10*10 取消绘制
      // if (width < 10 || height < 10) return;
      this.draw(left, top, width, height);
    }
  }

  public mouseup () {
    if (this.isDrawing && this.hasMoved) {
      this.implObject = null;
      this.taggingMaster.emit('tagging:finish', this.name)
      this.taggingMaster.emit('modified')
    }
    this.isDrawing = false;
    this.hasMoved = false;
  }

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
        name: 'multiRect:' + this.name,
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
    item: MultiRectJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ) {
    item.position.forEach(p => {
      const mr = new fabric.Rect({
        name: 'multiRect:' + item.name,
        width: p.w,
        height: p.h,
        left: offset.offsetLeft + p.x,
        top: offset.offsetTop + p.y,
        ...rectCommonOptions
      })

      if (isViewMode) {
        mr.set('selectable', false);
        mr.set('hoverCursor', 'default')
      }

      this.taggingMaster.canvas.add(mr);
      this.implObjectForMultiRects.push(mr);
    })
  }
}
