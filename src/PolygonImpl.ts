import { fabric } from 'fabric';
import { Line, Circle, IEvent, Point } from 'fabric/fabric-impl';
import { BaseObjectImpl } from './BaseObjectImpl';
import { PolygonJson } from '.';

export const polygonCommonOptions = {
  stroke: 'rgba(0, 254, 255, 1)',
  fill: 'rgba(0, 254, 255, 0.22)',
  strokeWidth: 1,
  opacity: 1,
  hasBorders: true,
  hasControls: false,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true
};

export class PolygonImpl extends BaseObjectImpl {
  private activeLine: Line | null = null;
  private pointArray: Circle[]= [];
  private lineArray: Line[]= [];

  mousedown (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    e.target &&
      e.target.type === 'image' &&
      mouseEvent.ctrlKey !== true &&
      this.addPoint(e);
    this.pointArray.length > 2 &&
      e.target &&
      e.target.name === this.pointArray[0].name &&
      this.generatePolygon();
  }

  mousemove (e: IEvent) {
    if (this.activeLine && this.activeLine.name === 'line') {
      const pointer = this.taggingMaster.canvas.getPointer(e.e);
      this.activeLine.set({ x2: pointer.x, y2: pointer.y });
      this.taggingMaster.canvas.requestRenderAll();
    }
  }

  mouseup () {}

  addPoint (e: IEvent) {
    const cirlceName = 'Circle:' + (new Date().getTime() + Math.random() * 100);
    const { x, y } = this.taggingMaster.canvas.getPointer(e.e);
    const isFirstPoint = this.pointArray.length === 0;
    if (isFirstPoint && this.implObject) this.taggingMaster.canvas.remove(this.implObject);

    const circle = new fabric.Circle({
      radius: isFirstPoint ? 5 : 2,
      fill: isFirstPoint ? 'red' : '#ffffff',
      evented: !!isFirstPoint,
      name: cirlceName,
      stroke: '#333333',
      strokeWidth: 1,
      left: x,
      top: y,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      objectCaching: false
    });

    this.activeLine = new fabric.Line([x, y, x, y], {
      strokeWidth: 2,
      fill: '#999999',
      stroke: '#999999',
      name: 'line',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false
    });

    this.pointArray.push(circle);
    this.lineArray.push(this.activeLine);

    this.taggingMaster.canvas.add(circle);
    this.taggingMaster.canvas.add(this.activeLine);
  }

  generatePolygon () {
    const points = this.pointArray.map(point => {
      this.taggingMaster.canvas.remove(point);
      return {
        x: point.left!,
        y: point.top!
      };
    });
    this.lineArray.forEach(line => this.taggingMaster.canvas.remove(line));
    this.implObject && this.taggingMaster.canvas.remove(this.implObject);
    this.activeLine && this.taggingMaster.canvas.remove(this.activeLine);
    this.implObject = new fabric.Polygon(points, {
      name: this.name,
      ...polygonCommonOptions
      // perPixelTargetFind: true
    });
    this.taggingMaster.canvas.add(this.implObject);
    this.implObject.set('data', { initLeft: this.implObject.left, initTop: this.implObject.top })

    this.activeLine = null;
    this.pointArray.length = 0;
    this.lineArray.length = 0;
  }

  public loadJson (
    item: PolygonJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ) {
    const points: Point[] = item.position.points.map(
      point =>
        ({
          x: point[0] + offset.offsetLeft,
          y: point[1] + offset.offsetTop
        } as Point)
    );

    this.implObject = new fabric.Polygon(points, {
      name: item.name,
      ...polygonCommonOptions
    });

    if (isViewMode) {
      this.implObject.set('selectable', false);
      this.implObject.set('hoverCursor', 'default')
    }

    this.taggingMaster.canvas.add(this.implObject);
    this.implObject.set('data', { initLeft: this.implObject.left, initTop: this.implObject.top })
  }
};
