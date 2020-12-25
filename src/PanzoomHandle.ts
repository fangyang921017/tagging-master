import { Canvas, IEvent, Point } from 'fabric/fabric-impl';
import { TaggingMaster } from '.';

export class PanzoomHandle {
  private readonly _canvas: Canvas;
  private _isDragging = false;
  private _lastPosition = { x: 0, y: 0 };

  constructor (taggingMaster: TaggingMaster) {
    this._canvas = taggingMaster.canvas;
    this._canvas.on('after:render', () => {
      this._resetCoords();
    });
  }

  // 重新设置所有对象的位置，解决标注完成后进行平移操作会产生标注对象消失的bug
  private _resetCoords () {
    if (this._isDragging) {
      this._canvas.getObjects().forEach(o => {
        if (!o.isOnScreen()) {
          o.setCoords();
        }
      });
    }
  }

  mousedown (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (mouseEvent.ctrlKey === true) {
      this._isDragging = true;
      this._canvas.selection = false;
      this._lastPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    }
  }

  mousemove (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (this._isDragging) {
      const vpt = this._canvas.viewportTransform!;
      vpt[4] += mouseEvent.clientX - this._lastPosition.x;
      vpt[5] += mouseEvent.clientY - this._lastPosition.y;
      this._canvas.requestRenderAll();
      this._lastPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    }
  }

  mouseup () {
    this._canvas.setViewportTransform(this._canvas.viewportTransform!);
    this._isDragging = false;
    this._canvas.selection = true;
  }

  mousewheel (e: IEvent) {
    const mouseWheelEvent = e.e as MouseWheelEvent;
    if (mouseWheelEvent.ctrlKey === true) {
      mouseWheelEvent.preventDefault();
      mouseWheelEvent.stopPropagation();
      const delta = mouseWheelEvent.deltaY;
      let zoom = this._canvas.getZoom();
      zoom *= 0.999 ** delta;
      zoom = zoom > 4 ? 4 : zoom < 0.24 ? 0.25 : zoom;
      this._canvas.zoomToPoint(
        { x: mouseWheelEvent.offsetX, y: mouseWheelEvent.offsetY } as Point,
        zoom
      );
    }
  }
}
