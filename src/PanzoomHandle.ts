import { Canvas, IEvent, Point } from 'fabric/fabric-impl';
import { TaggingMaster } from '.';
import { isWindows, isMac } from './utils';

export class PanzoomHandle {
  private readonly _canvas: Canvas;
  private _isDragging = false;
  private _lastPosition = { x: 0, y: 0 };
  private _centerPositon = { x: 0, y: 0 }

  constructor (taggingMaster: TaggingMaster) {
    this._canvas = taggingMaster.canvas;
    this._centerPositon.x = this._canvas.getWidth() / 2;
    this._centerPositon.y = this._canvas.getHeight() / 2;
    this._canvas.on('after:render', () => {
      this._resetCoords();
    });

    const keyBoardHandle = {
      isFirst: true,
      keyDown: (e: KeyboardEvent) => {
        if (keyBoardHandle.isFirst) {
          if (e.ctrlKey === true || e.metaKey === true) {
            if (this._canvas) {
              this._canvas.setCursor('grab')
            }
          }
        }
        keyBoardHandle.isFirst = false;
      },
      keyUp: (e: KeyboardEvent) => {
        if (this._canvas) {
          this._canvas.setCursor('')
          keyBoardHandle.isFirst = true;
        }
      }
    }

    document.addEventListener('keydown', keyBoardHandle.keyDown);
    document.addEventListener('keyup', keyBoardHandle.keyUp)

    // 平移和缩放
    this._canvas.on('mouse:down', this.mousedown.bind(this));
    this._canvas.on('mouse:move', this.mousemove.bind(this));
    this._canvas.on('mouse:up', this.mouseup.bind(this));
    this._canvas.on('mouse:wheel', this.mousewheel.bind(this));
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

  _isPressCtrlOrMetaKey (e: MouseEvent) {
    return (isWindows() === true && e.ctrlKey === true) ||
    (isMac() === true && e.metaKey === true)
  }

  mousedown (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (this._isPressCtrlOrMetaKey(mouseEvent)) {
      this._canvas.setCursor('grabbing')
      this._isDragging = true;
      this._canvas.selection = false;
      this._lastPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    }
  }

  mousemove (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;

    if (this._isPressCtrlOrMetaKey(mouseEvent)) {
      this._canvas.setCursor('grab')
    }

    if (this._isDragging) {
      const vpt = this._canvas.viewportTransform!;
      vpt[4] += mouseEvent.clientX - this._lastPosition.x;
      vpt[5] += mouseEvent.clientY - this._lastPosition.y;
      this._canvas.requestRenderAll();
      this._lastPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      this._canvas.setCursor('grabbing')
    }
  }

  mouseup () {
    this._canvas.setViewportTransform(this._canvas.viewportTransform!);
    if (this._isDragging) {
      this._canvas.setCursor('grab')
      this._isDragging = false;
    }
    this._canvas.selection = true;
  }

  mousewheel (e: IEvent) {
    const mouseWheelEvent = e.e as WheelEvent;
    if (this._isPressCtrlOrMetaKey(mouseWheelEvent)) {
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

  zoomOut () {
    let zoom = this._canvas.getZoom();
    zoom *= 0.85;
    zoom = zoom > 4 ? 4 : zoom < 0.24 ? 0.25 : zoom;
    this._canvas.zoomToPoint(
      this._centerPositon as Point,
      zoom
    );
  }

  zoomIn () {
    let zoom = this._canvas.getZoom();
    zoom *= 1.15;
    zoom = zoom > 4 ? 4 : zoom < 0.24 ? 0.25 : zoom;
    this._canvas.zoomToPoint(
      this._centerPositon as Point,
      zoom
    );
  }
}
