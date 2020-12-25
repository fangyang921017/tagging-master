import { fabric } from 'fabric';
import { BaseObjectImpl } from './BaseObjectImpl';
import { IEvent, Point } from 'fabric/fabric-impl';
import { DotJson } from '.';

export const dotCommonOptions = {
  radius: 5,
  fill: 'red',
  stroke: '#333333',
  strokeWidth: 1,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true,
  originX: 'center',
  originY: 'center'
}

export class DotImpl extends BaseObjectImpl {
  public mousedown (e: IEvent) {
    const mouseEvent = e.e as MouseEvent;
    if (mouseEvent.ctrlKey === true) return;
    if (!e.target || e.target.type !== 'image') return

    const { x, y } = this.taggingMaster.canvas.getPointer(e.e);

    this.taggingMaster.canvas.add(new fabric.Circle({
      name: 'dot:' + this.name,
      left: x,
      top: y,
      ...dotCommonOptions
    }));
  };

  public mousemove () {}

  public mouseup () {}

  public loadJson (
    item: DotJson,
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

    points.forEach(p => {
      const po = new fabric.Circle({
        name: 'dot:' + this.name,
        left: p.x,
        top: p.y,
        ...dotCommonOptions
      })

      if (isViewMode) {
        po.set('selectable', false);
        po.set('hoverCursor', 'default')
      }

      this.taggingMaster.canvas.add(po);
    })
  }
}
