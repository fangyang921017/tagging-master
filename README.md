# tagging-master

用于图片标注
- 支持绘制 矩形（Rect）、多边形（Polygon）、圆形（Circle）、椭圆形（Ellipse）、点（Dot）；后续考虑支持更多图形。
- 支持放大缩小画布、平移画布

![demo](/example/demo.png)

### 安装
```
npm i tagging-master
```

### 使用
```html
<div style="height:600px">
  <canvas id="canvas"></canvas>
</div>
```

```javascript
// js
import { TaggingMaster } from 'tagging-master'

const options = {
  canvasId: 'canvas',
  tools: [
    {
      name: 'uuid1';
      type: 'rect';
    },
    {
      name: 'uuid2';
      type: 'polygon';
    },
    ...
  ]
}

const tm = new TaggingMaster(options);

tm.loadImage(imageUrl);

tgm.setTool('uuid1') //在图片上画矩形
tgm.setTool('uuid2') //在图片上画多边形

```

### options: TaggingMasterOptions
```ts
enum DrawType {
  Rect = 'rect',
  Polygon = 'polygon',
  Ellipse = 'ellipse',
  Circle = 'circle',
  Dot = 'dot'
}

type ToolOption = {
  name: string;
  type: DrawType;
  multiple?: boolean;
}

type TaggingMasterOptions = {
  canvasId: string;
  tools?: Array<ToolOption>;
}
```

### 方法

resetTools(tools: ToolOption[]): void; // 重置并替换所有标注工具

loadImage(url: string): Promise; // 加载图片

setTool(toolName: string): void; // 设置工具、设置后可以画图

loadFromTaggingData(taggingData: TaggingData): Promise<void>; // 加载标记数据

getTaggingData(): (RectJson | EllipseJson | PolygonJson | CircleJson | DotJson | NoneJson)[]; // 获取标记数据

showAll(): void; // 显示当前所有标记图形

hideAll(): void; // 隐藏当前所有标记图形

show(name: string): void; // 显示指定标记图形

hide(name: string): void; // 显示指定标记图形

zoomOut(): void; // 缩小画布

zoomIn(): void; // 放大画布

### 事件

tm.on('eventName', () => {console.log('触发了eventName 事件')}) 

事件名
- 'tagging:finish' 完成一个标注图形后触发


### license

MIT