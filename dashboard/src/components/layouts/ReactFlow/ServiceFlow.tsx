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
import { useState } from "react";
import { Services, UniqueRelation } from "@/utils/interfaces";

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const snapGrid = [20, 20];

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };

const nodeTypes = {
    serviceNode: ServiceNode,
  };
  

import ServiceNode from "./ServiceNode";

export default function ServiceFlow(props : {services: Services, uniqueRelations: UniqueRelation[]}) {

    const [bgColor, setBgColor] = useState(initBgColor);
console.log("relation icinde:", props.uniqueRelations)
    const nodes = props.services.activeServices.map((service) => ({
        id: service.ServiceName,
        type: 'serviceNode',
        data: { service },
        position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      }));

      const edges = props.uniqueRelations.map((relation) => ({
        id: `${relation.from_service}-${relation.to_service}`,
        source: relation.from_service,
        target: relation.to_service,
      }));

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