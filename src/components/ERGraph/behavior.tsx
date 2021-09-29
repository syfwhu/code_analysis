const isInBBox = (point, bbox) => {
  const { x, y } = point;
  const { minX, minY, maxX, maxY } = bbox;
  return x < maxX && x > minX && y > minY && y < maxY;
};

function Behavior(Graphin, itemHeight, customOffset) {
  Graphin.registerBehavior('dice-er-scroll', {
    getDefaultCfg() {
      return {
        multiple: true,
      };
    },
    getEvents() {
      return {
        itemHeight,
        wheel: 'scorll',
        click: 'click',
        'node:mousemove': 'move',
      };
    },
    scorll(e) {
      e.preventDefault();
      const { graph } = this;
      const nodes = graph.getNodes().filter((n) => {
        const bbox = n.getBBox();

        return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox);
      });

      const x = e.deltaX || e.movementX;
      let y = e.deltaY || e.movementY;
      if (!y && navigator.userAgent.indexOf('Firefox') > -1) y = (-e.wheelDelta * 125) / 3;

      if (nodes) {
        nodes.forEach((node) => {
          const model = node.getModel();
          if (model.attrs.length < 2) {
            return;
          }
          const idx = model.startIndex || 0;
          let startX = model.startX || 0.5;
          let startIndex = idx + y * 0.02;
          startX -= x;
          if (startIndex < 0) {
            startIndex = 0;
          }
          if (startX > 0) {
            startX = 0;
          }
          if (startIndex > model.attrs.length - 4) {
            startIndex = model.attrs.length - 4;
          }
          graph.update(node, {
            startIndex,
            startX,
          });
        });
      }
    },
    click(e) {
      const { graph } = this;
      const { y } = e;
      const item = e.item;
      const shape = e.shape;
      if (!item) {
        return;
      }
      const model = item.getModel();

      if (shape.get('name') === 'collapse') {
        graph.updateItem(item, {
          collapsed: true,
          size: [300, 50],
        });
        setTimeout(() => graph.layout(), 100);
      } else if (shape.get('name') === 'expand') {
        graph.updateItem(item, {
          collapsed: false,
          size: [300, 80 + customOffset],
        });
        setTimeout(() => graph.layout(), 100);
      }
    },
    move(e) {
      const name = e.shape.get('name');
      const item = e.item;

      if (name && name.startsWith('item')) {
        this.graph.updateItem(item, {
          selectedIndex: Number(name.split('-')[1]),
        });
      } else {
        this.graph.updateItem(item, {
          selectedIndex: NaN,
        });
      }
    },
  });
}

export default Behavior;
