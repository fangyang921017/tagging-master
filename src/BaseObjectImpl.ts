import { IbaseObject, TaggingMaster, RectJson, EllipseJson, PolygonJson, CircleJson, DotJson, NoneJson } from '.';
import { Object as ImplObject, IEvent } from 'fabric/fabric-impl';

export abstract class BaseObjectImpl implements IbaseObject {
  protected implObject: ImplObject | null;
  protected implObjectForDots: ImplObject[];
  protected taggingMaster: TaggingMaster;
  protected name: string;

  constructor (taggingMaster: TaggingMaster, name: string) {
    this.implObject = null;
    this.implObjectForDots = [];
    this.taggingMaster = taggingMaster
    this.name = name
  }

  public abstract mousedown (e: IEvent): void

  public abstract mousemove (e: IEvent): void

  public abstract mouseup (e: IEvent): void

  public abstract loadJson (
    json: RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson,
    offset: {offsetLeft: number; offsetTop: number},
    isViewMode?: boolean
  ): void

  public clear () {
    if (this.taggingMaster) {
      this.implObjectForDots.forEach(dot => {
        this.taggingMaster.canvas.remove(dot);
      })
      this.implObject && this.taggingMaster.canvas.remove(this.implObject);
      this.implObjectForDots = [];
      this.implObject = null
    }
  }
}
