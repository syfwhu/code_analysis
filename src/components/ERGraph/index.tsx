import Graphin, { Behaviors } from '@antv/graphin';
const { DragCanvas, ZoomCanvas, DragNode } = Behaviors;
import { MiniMap } from '@antv/graphin-components';
import behavior from './behavior';
import edge from './edge';
import node from './node';

const itemHeight = 20;
const customOffset = 48;

behavior(Graphin, itemHeight);
edge(Graphin, customOffset);
node(Graphin, itemHeight, customOffset);

const dataTransform = (data: any[]) => {
  const nodes = [];
  const edges = [];
  data.map((node) => {
    nodes.push({
      ...node,
    });
    if (node.attrs) {
      node.attrs.forEach((attr) => {
        if (attr.relation) {
          attr.relation.forEach((relation) => {
            edges.push({
              source: node.id,
              target: relation.nodeId,
              sourceKey: attr.key,
              targetKey: relation.key,
              label: relation.label,
            });
          });
        }
      });
    }
  });

  return {
    nodes,
    edges,
  };
};

const getGraphinOpts = (rawData) => {
  const data = dataTransform(rawData);
  const graph = {
    defaultNode: {
      size: [300, 200],
      type: 'dice-er-box',
      color: '#5B8FF9',
      style: {
        fill: '#9EC9FF',
        lineWidth: 3,
      },
      labelCfg: {
        style: {
          fill: 'black',
          fontSize: 20,
        },
      },
    },
    defaultEdge: {
      type: 'dice-er-edge',
      style: {
        stroke: '#e2e2e2',
        lineWidth: 4,
        endArrow: true,
      },
    },
    modes: {
      default: ['dice-er-scroll', 'drag-node', 'drag-canvas'],
    },
    layout: {
      type: 'graphin-force',
      rankdir: 'LR',
      align: 'UL',
      controlPoints: true,
      nodesepFunc: () => 0.2,
      ranksepFunc: () => 0.5,
    },
    animate: true,
    fitView: true,
    data,
  };

  return graph;
};

function ERGraph(props: any) {
  const { data } = props;
  return (
    <Graphin {...getGraphinOpts(data)}>
      <DragNode />
      <DragCanvas />
      <MiniMap visible />
    </Graphin>
  );
};
export default ERGraph;
