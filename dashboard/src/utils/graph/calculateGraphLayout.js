

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY
} from 'd3-force';
import collide from './collide';

const INITIAL_X = 0;
const INITIAL_Y = 0;

function addGraphNeighbours(rootKey, graph, nodeMap, edges) {
  console.log('init graph:', rootKey, graph, nodeMap, edges);
  const keyQueue = [{
    parent: null,
    current: rootKey
  }];

  nodeMap[rootKey].vertices.forEach(value => {
    keyQueue.push({
      parent: rootKey,
      current: value
    }
    );
  });
  while (keyQueue.length > 0) {
    const keyPair = keyQueue.shift();
    const flowNode = nodeMap[keyPair.current];
    const neighbours = flowNode.vertices;
    console.log('current queue node: ', flowNode);
    const RADIUS = 600;

    const startAngle = Math.random() * Math.PI * 2;

    neighbours.forEach((neighbourKey, index) => {
      if (!nodeMap[neighbourKey]) {
        console.log('y positon:', Math.sin(startAngle + (index / neighbours.length) * 2 * Math.PI) * RADIUS);
        const newNode = {
          id: neighbourKey,
          x: flowNode.x + Math.cos(startAngle + (index / neighbours.length) * 2 * Math.PI) * RADIUS,
          y: flowNode.y + Math.sin(startAngle + (index / neighbours.length) * 2 * Math.PI) * RADIUS,
          vertices: graph[neighbourKey].vertices

        };

        const newEdge = {
          id: `e${flowNode.id}-${newNode.id}`,
          source: flowNode.id,
          target: newNode.id

        };

        nodeMap[neighbourKey] = newNode;
        edges.push(newEdge);
        keyQueue.push({

          parent: keyPair.current,
          current: neighbourKey
        });
      }
    });
  }
}

function initializeGraph(graph, rootKey) {
  const rootNode = graph[rootKey];
  const nodeMap = {};
  const edges = [];
  const rootFlowNode = {
    id: rootNode.key,
    x: INITIAL_X,
    y: INITIAL_Y,
    vertices: rootNode.vertices
  };
  nodeMap[rootNode.key] = rootFlowNode;
  addGraphNeighbours(rootNode.key, graph, nodeMap, edges);
  console.log('object values:', nodeMap);
  return { initialFlowNodes: Object.values(nodeMap), initialFlowEdges: edges };
  // to do viewport
}

function calculateInitialGraph(nodes, edges) {
  const layoutNodes = nodes.map(node => ({
    id: node.id,
    x: node.x,
    y: node.y,
    fx: node.fx,
    fy: node.fy
  }));
  const layoutEdges = edges.map(value => ({ ...value }));
  const simulation = forceSimulation()
    .nodes(layoutNodes)
    .force('charge', forceManyBody().strength(-5000))
    .force('x', forceX().x(0).strength(0.02))
    .force('y', forceY().y(0).strength(0.02))
    // .force('xLink', forceX().strength(-1))
    // .force('yLink', forceY().strength(-1))
    .force('collide', collide())
    .force('link',
      forceLink(layoutEdges)
        .id(d => d.id)
        .strength(0.15)
        .distance(250)
    )
    .alphaTarget(0.05)
    .tick(20000)
    .stop();


  return { simulation, layoutNodes, layoutEdges };
}


export function calculateGraphLayout(graph, rootKey) {

  const { initialFlowNodes, initialFlowEdges } = initializeGraph(graph, rootKey);
  const { simulation, layoutNodes } = calculateInitialGraph(initialFlowNodes, initialFlowEdges);

  const simulationJson = {
    nodes: simulation.nodes().map(value => ({ ...value })),
    links: simulation.force('link').links().map(value => ({
      id: value.id,
      source: value.source.id,
      target: value.target.id
    }))
  };
  console.log('simulation nodes:', simulationJson.nodes);
  return { simulationJson, layoutNodes };
}
