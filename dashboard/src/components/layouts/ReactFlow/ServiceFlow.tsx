"use client";

import { ReactFlow ,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  BackgroundVariant,
  Background,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { Services, UniqueRelation } from "@/utils/interfaces";
import ServiceNode from "./ServiceNode";
import { calculateGraphLayout } from "@/utils/graph/calculateGraphLayout";

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const snapGrid = [20, 20];

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };

const nodeTypes = {
    serviceNode: ServiceNode,
  };
  



export default function ServiceFlow(props : {services: Services, uniqueRelations: UniqueRelation[]}) {

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [bgColor] = useState(initBgColor);
console.log("relation icinde:", props.uniqueRelations)


      useEffect( () => {
        const newNodes = props.services.activeServices.map((service) => ({
          id: service.ServiceName,
          type: 'serviceNode',
          data: { service },
          position: { x: Math.random() * 100, y: Math.random() * 100 },
        }));
  
        const newEdges = props.uniqueRelations.map((relation) => ({
          id: `${relation.from_service}-${relation.to_service}`,
          source: relation.from_service,
          target: relation.to_service,
        }));

        const graph = {}
        newNodes.forEach((node) => {
          graph[node.id] = {
            key: node.id,
            vertices: newEdges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => edge.source === node.id ? edge.target : edge.source),
            data: node.data
          }
      });

      console.log("graph", graph)

        const {simulationJson, layoutNodes} = calculateGraphLayout(graph, newNodes[0].id);

      console.log("simulationJson", simulationJson, layoutNodes)
      console.log("newNodes", newNodes, layoutNodes)

      const formattedNodes = simulationJson.nodes.map((node) => {
        return {
          id: node.id,
          type: 'serviceNode',
          data: { service: graph[node.id].data.service },
          position: { x: node.x, y: node.y },
        }

      })

      console.log("diff:", formattedNodes, newNodes)

        setNodes(formattedNodes);
        setEdges(newEdges);

      }, [] );

    return(

            <ReactFlow 
             nodes={nodes}
             edges={edges}
             style={{ background: bgColor }}
             nodeTypes={nodeTypes}
             connectionLineStyle={connectionLineStyle}
             snapToGrid={true}
             defaultViewport={defaultViewport}
             fitView
             attributionPosition="bottom-left"
            >
                <Background variant={BackgroundVariant.Dots} />
                <div className="text-black">
                  <Controls />
                  </div>
            </ReactFlow>

    )
}