# tagging mster

用于图片标注、支持绘制 矩形（Rect）、多边形（Polygon）、圆形（Circle）、椭圆形（Ellipse）、点（Dot）；后续考虑支持更多图形。

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