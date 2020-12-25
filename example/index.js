const tgm = new tm.TaggingMaster({
  canvasId: 'canvas',
  tools: [
    {
      name: 'uuid1',
      type: 'rect',
    },
    {
      name: 'uuid2',
      type: 'polygon'
    },
  ]
})


tgm.loadImage('./aaa.jpg');

tgm.setTool('uuid2')