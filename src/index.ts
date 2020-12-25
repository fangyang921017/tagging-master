import { fabric } from 'fabric';
import { Canvas, Image, Polygon, Circle, IEvent } from 'fabric/fabric-impl';
import {
  DrawType,
  TaggingData,
  RectJson,
  EllipseJson,
  PolygonJson,
  CircleJson,
  DotJson,
  NoneJson
} from './types';
import { TaggingHandle } from './TaggingHandle';
import { PanzoomHandle } from './PanzoomHandle';
import { EventBus } from './EventBus';
export * from './types';

export type ToolOption = {
  name: string;
  type: DrawType;
  multiple?: boolean;
}

export type TaggingMasterOptions = {
  canvasId: string;
  tools?: Array<ToolOption>;
}

export class TaggingMaster extends EventBus {
  canvas: Canvas;
  private _currentToolName = '';
  private _currentImgObject: Image | null = null;
  private _panzoomHandle: PanzoomHandle | null = null;
  private _tools: ToolOption[];
  private readonly _width: number;
  private readonly _height: number;
  private readonly _borderWidth = 1;
  private readonly _enableTagging: boolean;
  private readonly _taggingHandel: TaggingHandle;
  private readonly _viewMode: boolean;

  constructor (options: TaggingMasterOptions) {
    super()
    const { canvasId, tools } = options;
    this._enableTagging = !!tools;
    this._tools = tools || [];
    this._viewMode = !this._tools.length;
    const canvasWrap = document.getElementById(canvasId);
    if (!canvasWrap) {
      throw new Error('当前文档不存在id为' + canvasId + '的canvas元素');
    }
    const canvasParentElement = canvasWrap.parentElement;
    if (!canvasParentElement) { throw new Error('请将canvas放置在一个htmlElement容易内'); }
    const { width, height } = canvasParentElement.getBoundingClientRect();
    this._width = width;
    this._height = height;
    this.canvas = new fabric.Canvas(canvasId, {
      selection: this._enableTagging,
      selectionColor: 'rgba(0,0,0,0.05)',
      width: this._width - this._borderWidth * 2,
      height: this._height - this._borderWidth * 2
    });
    this._taggingHandel = new TaggingHandle(this);

    // if (this._enableTagging) {
    //   this._init();
    // }
    this._init()
  }

  getTools () {
    return this._tools
  }

  isViewMode () {
    return this._viewMode
  }

  resetTools (tools: ToolOption[]) {
    this._tools = tools;
    if (this._taggingHandel) {
      this._taggingHandel.reset()
    }
  }

  private _init () {
    if (!this._viewMode) {
      this._bindTaggingHandle();
    }
    this._bindPanzoomHandle();
    this._disableSelectGroup()
  }

  private _disableSelectGroup () {
    this.canvas.on('selection:created', (e: IEvent) => {
      if (e.target!.type === 'activeSelection') {
        this.canvas.discardActiveObject();
      }
    })
  }

  private _bindTaggingHandle () {
    // 标注
    this.canvas.on('mouse:down', e => {
      this._taggingHandel!.getMouseHandle(this._currentToolName, 'mousedown')(e);
    });

    let moveCount = 0;
    this.canvas.on('mouse:move', e => {
      if (moveCount++ % 2) return; // 减少事件触发次数，优化性能
      this._taggingHandel!.getMouseHandle(this._currentToolName, 'mousemove')(e);
    });
    this.canvas.on('mouse:up', e => {
      this._taggingHandel!.getMouseHandle(this._currentToolName, 'mouseup')(e);
    });
  }

  private _bindPanzoomHandle () {
    this._panzoomHandle = new PanzoomHandle(this);
  }

  // 缩小
  zoomOut () {
    if (this._panzoomHandle) {
      this._panzoomHandle.zoomOut()
    }
  }

  // 放大
  zoomIn () {
    if (this._panzoomHandle) {
      this._panzoomHandle.zoomIn()
    }
  }

  loadImage (url: string) {
    this.canvas.clear();
    this._taggingHandel.clearTaggingImplObject()
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    return new Promise<Image>((resolve, reject) => {
      fabric.Image.fromURL(
        url,
        oImg => {
          this._currentImgObject = oImg;
          if (oImg.height === 0 && oImg.width === 0) { reject(new Error('img load error')); }
          oImg.set(
            'left',
            (this._width - this._borderWidth * 2 - oImg.getElement().width) / 2
          );
          oImg.set(
            'top',
            (this._height - this._borderWidth * 2 - oImg.getElement().height) / 2
          );
          this.canvas.add(oImg);
          resolve(oImg);
        },
        {
          selectable: false,
          hoverCursor: 'default'
        }
      );
    });
  }

  setTool (toolName: string) {
    this._currentToolName = toolName
  }

  getCurrentToolName () {
    return this._currentToolName
  }

  async loadFromTaggingData (taggingData: TaggingData) {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    this.canvas.clear();
    this._currentImgObject = await this.loadImage(taggingData.imgUrl);
    const imgLeft = this._currentImgObject!.get('left')!;
    const imgTop = this._currentImgObject!.get('top')!;

    const temp = this.canvas.renderOnAddRemove
    this.canvas.renderOnAddRemove = false

    taggingData.tagObjects.forEach(item => {
      this._taggingHandel.loadJson(item, { offsetLeft: imgLeft, offsetTop: imgTop })
    });

    this.canvas.renderAll();
    this.canvas.renderOnAddRemove = temp;
  }

  getTaggingData () {
    const taggingData: Array<RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson> = [];

    const objects = this.canvas.getObjects();
    const imgLeft = this._currentImgObject!.get('left')!;
    const imgTop = this._currentImgObject!.get('top')!;

    const dots: fabric.Object[] = [];
    const others: fabric.Object[] = [];

    objects.forEach(o => {
      if (o.name && o.name!.startsWith('dot:')) {
        dots.push(o)
      } else {
        others.push(o)
      }
    })

    // 点
    const points = dots.map(
      dot => [dot.left! - imgLeft, dot.top! - imgTop] as [number, number]
    )
    points.length && taggingData.push({
      name: dots[0].name?.slice(4) || '',
      type: DrawType.Dot,
      position: {
        points
      }
    })

    // 其他
    others.forEach(obj => {
      const { scaleX, scaleY } = obj.getObjectScaling()

      switch (obj.type) {
        case DrawType.Rect:
          taggingData.push({
            name: obj.name || '',
            type: DrawType.Rect,
            position: {
              x: obj.get('left')! - imgLeft,
              y: obj.get('top')! - imgTop,
              w: obj.get('width')! * scaleX,
              h: obj.get('height')! * scaleY!
            }
          });
          break;
        case DrawType.Ellipse:
          taggingData.push({
            name: obj.name || '',
            type: DrawType.Ellipse,
            position: {
              rx: obj.get('width')! * scaleX / 2,
              ry: obj.get('height')! * scaleY / 2,
              cx: obj.get('left')! - imgLeft + obj.get('width')! * scaleX / 2,
              cy: obj.get('top')! - imgTop + obj.get('height')! * scaleY / 2
            }
          });
          break;
        case DrawType.Polygon:
          {
            const offset = {
              x: obj.left! - obj.get('data').initLeft,
              y: obj.top! - obj.get('data').initTop
            }
            taggingData.push({
              name: obj.name || '',
              type: DrawType.Polygon,
              position: {
                points: (obj as Polygon)
                  .get('points')!
                  .map(point => [point.x - imgLeft + offset.x, point.y - imgTop + offset.y])
              }
            });
          }
          break;
        case DrawType.Circle:
          taggingData.push({
            name: obj.name || '',
            type: DrawType.Circle,
            position: {
              cx: obj.get('left')! - imgLeft,
              cy: obj.get('top')! - imgTop,
              r: (obj as Circle).radius!
            }
          })
          break;
        case DrawType.None:
          taggingData.push({
            name: obj.name || '',
            type: DrawType.None,
            position: {}
          })
          break;
        default:
          break;
      }
    });

    return taggingData;
  }

  showAll () {
    this.canvas.getObjects().forEach(o => {
      o.type !== 'image' && o.set('visible', true)
    })
    this.canvas.requestRenderAll()
  }

  hideAll () {
    this.canvas.getObjects().forEach(o => {
      o.type !== 'image' && o.set('visible', false)
    })
    this.canvas.requestRenderAll()
  }

  show (name: string) {
    this.canvas.getObjects().forEach(o => {
      if (
        o.name === name ||
        (o.name && o.name.slice(4) === name) // dot: 应该比对
      ) {
        o.set('visible', true)
      }
    })

    this.canvas.requestRenderAll()
  }

  hide (name: string) {
    this.canvas.getObjects().forEach(o => {
      if (
        o.name === name ||
        (o.name && o.name.slice(4) === name) // dot: 应该比对
      ) {
        o.set('visible', false)
      }
    })
    this.canvas.requestRenderAll()
  }
}
