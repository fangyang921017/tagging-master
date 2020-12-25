import { Point, IEvent } from 'fabric/fabric-impl';
import { BaseObjectImpl } from './BaseObjectImpl';

export abstract class DragObjectImpl extends BaseObjectImpl {
  protected mouseFrom = { x: 0, y: 0 };
  protected mouseTo = { x: 0, y: 0 };
  protected isDrawing = false;

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
      this.mouseTo = this.taggingMaster.canvas.getPointer(mouseEvent);
      const left = this.mouseTo.x > this.mouseFrom.x ? this.mouseFrom.x : this.mouseTo.x;
      const top = this.mouseTo.y > this.mouseFrom.y ? this.mouseFrom.y : this.mouseTo.y;
      const width = Math.abs(this.mouseTo.x - this.mouseFrom.x);
      const height = Math.abs(this.mouseTo.y - this.mouseFrom.y);
      // 如果画出来的图形大小规格小于 10*10 取消绘制
      // if (width < 10 || height < 10) return;
      this.draw(left, top, width, height, { ...this.mouseFrom } as Point, { ...this.mouseTo } as Point);
    }
  }

  public mouseup () {
    this.isDrawing = false;
  }

  public abstract draw (left: number, top: number, width: number, height: number, mouseFrom?: Point, mouseTo?: Point): void
}
