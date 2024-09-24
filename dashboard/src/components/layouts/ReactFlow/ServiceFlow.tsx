"use client";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  BackgroundVariant,
  Background,
  ConnectionMode,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { Services, UniqueRelation } from "@/utils/interfaces";
import ServiceNode from "./ServiceNode";
import { calculateGraphLayout } from "@/utils/graph/calculateGraphLayout";
import { calculateEdgeHandle } from "@/utils/graph/calculateEdgeHandle";

import "./flow.css";
import { calculateGraphLayoutServer } from "@/app/actions";

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const snapGrid = [20, 20];

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };



const nodeTypes = {
  serviceNode: ServiceNode,
};




export default function ServiceFlow(props: { services: Services, uniqueRelations: UniqueRelation[]
  nodes: any, edges: any
  setNodes: any, setEdges: any


 }) {


  const {nodes, edges, setNodes, setEdges} = props;


  const [bgColor] = useState(initBgColor);
  console.log("relation icinde:", props.uniqueRelations)


  const initializeGraph = async () => {

    const newNodes = props.services.activeServices.map((service) => ({
      id: service.ServiceName,
      type: 'serviceNode',
      data: { service },
      position: { x: Math.random() * 100, y: Math.random() * 100 },
    }));


    const initialEdges = props.uniqueRelations.map((relation) => {
      
      return({
      id: `${relation.from_service}-${relation.to_service}`,
      source: relation.from_service,
      target: relation.to_service,
      type: 'bezier',
      markerEnd: {
        type: 'arrowclosed',
        width: 16,
        height: 16,
      },
    })
  });

    const graph = {}
    newNodes.forEach((node) => {
      graph[node.id] = {
        key: node.id,
        vertices: initialEdges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => edge.source === node.id ? edge.target : edge.source),
        data: node.data
      }
    });

    console.log("graph", graph)

    const { simulationJson, layoutNodes } = await calculateGraphLayoutServer(graph, newNodes[0].id);

    console.log("simulationJson", simulationJson, layoutNodes)
    console.log("newNodes", newNodes, layoutNodes)

    const formattedNodes = simulationJson.nodes.map((node) => {
      return {
        id: node.id,
        type: 'serviceNode',
        data: { service: graph[node.id].data.service },
        position: { x: node.x, y: node.y },
        deletable: false,
      }

    })

    console.log("diff:", formattedNodes, newNodes)


    const newGraph = {}
    formattedNodes.forEach((node) => {
      newGraph[node.id] = node;
    });


    const newEdges = props.uniqueRelations.map((relation) => {
      const {sourceHandle, targetHandle} = calculateEdgeHandle(
      
        newGraph[relation.from_service].position.x, 
       newGraph[relation.from_service].position.y, 
       newGraph[relation.to_service].position.x, 
       newGraph[relation.to_service].position.y, 
      );

      return({
      id: `${relation.from_service}-${relation.to_service}`,
      source: relation.from_service,
      sourceHandle: sourceHandle,
      target: relation.to_service,
      targetHandle: targetHandle,
      type: 'bezier',
      markerEnd: {
        type: 'arrowclosed',
        width: 12,
        height: 12,
        color: '#4bf712',
      },
      deletable: false,
      focusable: false,
      selectable: true, 
      //animated: props.uniqueRelations.filter( (value) => (value.from_service === relation.from_service && value.to_service === relation.to_service) || (value.from_service === relation.to_service && value.to_service === relation.from_service)  ).length > 1 ? false : true,
      animated: true,
    })
  });

  console.log("newEdges", newEdges)

    setNodes(formattedNodes);
    setEdges(newEdges);


  }

  useEffect(() => {
    initializeGraph();
  }, []);

  return (

    <ReactFlow
      nodes={nodes}
      edges={edges}
      style={{ background: bgColor }}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      defaultViewport={defaultViewport}
      fitView
      connectionMode={ConnectionMode.Loose}
    >
      <Background variant={BackgroundVariant.Dots} />
      <div className="text-black">
        <Controls />
      </div>
    </ReactFlow>

  )
}