
"use client"

import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HomePageProps } from '@/utils/interfaces'
import ServiceFlow from '@/components/layouts/ReactFlow/ServiceFlow'
import { Separator } from "@/components/ui/separator"
import { useEdgesState, useNodes, useNodesData, useNodesState, useReactFlow } from '@xyflow/react'
import { ChatModal } from './ChatModal'


export default function HomePage({ services, uniqueRelations }: HomePageProps) {

  console.log("uniqueRelations:", uniqueRelations)
  const [expandedServers, setExpandedServers] = useState(true)
  const [selectedNode, setSelectedNode] = useState(null)

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  console.log("node test:", nodes)

  const handleServiceClick = (service) => {
    console.log(service.ServiceName)
  }
  
  const handleHoverOn = (service) => {

    const newNodes = nodes.map((node) => {
   
      if (node.id === service.ServiceName) {
        console.log("hovered:", node);
        return {
          ...node,
          className: 'listHover',
        }
      } else {
        return {
          ...node,
          className: '',
        }
      }
    });

    setNodes(newNodes)

  }
  
  const handleHoverOff = (service) => {
    const newNodes = nodes.map((node) => {
   
      if (node.id === service.ServiceName) {
        console.log("hovered:", node);
        return {
          ...node,
          className: '',
        }
      }
      return node
    });

    setNodes(newNodes)
  }

  return (
    <>
   
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 rounded-md border border-gray-700 my-4">
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full font-semibold justify-start text-lg text-center text-gray-100 hover:bg-gray-700 pointer-events-none"
          >

            Active Microservices
          </Button>
        <Separator className='bg-gray-600'/>
            <ScrollArea className="h-[calc(100vh-100px)] py-4">
              {services.allServices.map((service) => (
                
                <div key={String(service.ServiceName)} className="flex items-center p-2 hover:bg-gray-700 cursor-pointer" 
                onClick={() => handleServiceClick(service)} 
                onMouseEnter={() => handleHoverOn(service)}
                onMouseLeave={() => handleHoverOff(service)}
                >
                  <Server className="mr-2 text-gray-400" />
                  <span>{service.ServiceName}</span>
                  {'online' === 'online' ? (
                    <CheckCircle className="ml-auto text-green-400" />
                  ) : (
                    <AlertCircle className="ml-auto text-red-400" />
                  )}
                </div>
              ))}
            </ScrollArea>
          
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full h-full">
 <div className='px-4 '>
        <Separator className='bg-gray-600'/>
        </div>
        <div className="flex w-full h-full p-4">
          <Card className="w-full h-full bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100 text-center">Service Flow</CardTitle>
            </CardHeader>
            <CardContent className="h-[90%] text-white">

            <ServiceFlow services={services} uniqueRelations={uniqueRelations}
              nodes={nodes} setNodes={setNodes}
              edges={edges} setEdges={setEdges}
              
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}