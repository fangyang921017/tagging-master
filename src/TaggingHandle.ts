import { DrawType, MouseEventType, GraphicJson } from './types';
import { BaseObjectImpl } from './BaseObjectImpl';
import { RectImpl } from './RectImpl';
import { PolygonImpl } from './PolygonImpl';
import { EllipseImpl } from './EllipseImpl';
import { CircleImpl } from './CircleImpl';
import { DotImpl } from './DotImpl';
import { NoneImpl } from './NoneImpl';
import { ToolOption, TaggingMaster } from '.';
import { MultiRectImpl } from './MultiRectImpl';

export class TaggingHandle {
  private readonly _taggingImplObjectMap: Map<string, BaseObjectImpl> = new Map();

  private readonly _implClassMap = {
    [DrawType.Rect]: RectImpl,
    [DrawType.Polygon]: PolygonImpl,
    [DrawType.Ellipse]: EllipseImpl,
    [DrawType.Circle]: CircleImpl,
    [DrawType.Dot]: DotImpl,
    [DrawType.MultiRect]: MultiRectImpl,
    [DrawType.None]: NoneImpl
  }

  constructor (private _taggingMaster: TaggingMaster) {
    this._taggingMaster = _taggingMaster
    this._taggingMaster.getTools().forEach(tool => this.addImpl(tool))
  }

  addImpl (tool: ToolOption) {
    const implObj = new this._implClassMap[tool.type](this._taggingMaster, tool.name)
    this._taggingImplObjectMap.set(tool.name, implObj)
  }

  removeImpl (name: string) {
    this._taggingImplObjectMap.delete(name)
  }

  getMouseHandle (currentToolName: string, mouseEventType: MouseEventType) {
    const taggingObject = this._taggingImplObjectMap.get(currentToolName);
    const handle = (taggingObject && taggingObject[mouseEventType]) || (() => {});
    return handle.bind(taggingObject);
  }

  public clearTaggingImplObject () {
    [...this._taggingImplObjectMap.values()].forEach(io => io.clear())
  }

  public loadJson (
    obj: GraphicJson,
    offset: {offsetLeft: number; offsetTop: number}
  ) {
    const taggingImplObj = this._taggingImplObjectMap.get(obj.name);
    if (taggingImplObj) {
      taggingImplObj.loadJson(obj, offset, this._taggingMaster.isViewMode())
    } else {
      (new this._implClassMap[obj.type](this._taggingMaster, obj.name) as BaseObjectImpl)
        .loadJson(obj, offset, this._taggingMaster.isViewMode())
    }

    this._taggingMaster.emit('tagging:finish', obj.name)
  }

  reset () {
    const tools = this._taggingMaster.getTools();
    this.clearTaggingImplObject()
    this._taggingImplObjectMap.clear();
    tools.forEach(tool => {
      this.addImpl(tool)
    })
  }
}
