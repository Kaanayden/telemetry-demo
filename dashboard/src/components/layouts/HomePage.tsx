
"use client"

import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HomePageProps } from '@/utils/interfaces'
import ServiceFlow from '@/components/layouts/ReactFlow/ServiceFlow'
import { Separator } from "@/components/ui/separator"


// Mock data for servers and their relations
const servers = [
  { id: 'server1', name: 'Web Server', status: 'online' },
  { id: 'server2', name: 'Database Server', status: 'online' },
  { id: 'server3', name: 'Cache Server', status: 'offline' },
  { id: 'server4', name: 'Auth Server', status: 'online' },
]

const relations = [
  { source: 'server1', target: 'server2' },
  { source: 'server1', target: 'server3' },
  { source: 'server2', target: 'server4' },
  { source: 'server3', target: 'server4' },
]



export default function HomePage({ services, uniqueRelations }: HomePageProps) {
  const [expandedServers, setExpandedServers] = useState(true)
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-lg text-center text-gray-100 hover:bg-gray-700 pointer-events-none"
          >

            Active Microservices
          </Button>
        <Separator/>
            <ScrollArea className="h-[calc(100vh-100px)] py-4">
              {services.allServices.map((service) => (
                
                <div key={String(service.ServiceName)} className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
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
      <div className="flex-1 p-6 w-full min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">Telemetry Dashboard</h1>
        <div className="flex w-full h-full">

              <ServiceFlow services={services} uniqueRelations={uniqueRelations} />



        </div>
      </div>
      {/* Right sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-100 hover:bg-gray-700"
          >
            {expandedServers ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
            Microservices
          </Button>
          {expandedServers && (
            <ScrollArea className="h-[calc(100vh-100px)]">
              {servers.map((server) => (
                <div key={server.id} className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                  <Server className="mr-2 text-gray-400" />
                  <span>{server.name}</span>
                  {server.status === 'online' ? (
                    <CheckCircle className="ml-auto text-green-400" />
                  ) : (
                    <AlertCircle className="ml-auto text-red-400" />
                  )}
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}