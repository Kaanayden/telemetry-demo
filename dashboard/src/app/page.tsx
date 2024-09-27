
import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomePage from '@/components/layouts/HomePage'
import { Services } from '@/utils/interfaces'
import { ReactFlowProvider } from '@xyflow/react'

export default async function Home() {

  const services: Services = await (await fetch(`http://localhost:${process.env.PORT}/api/services?since=5`, { cache: 'no-cache' })).json();
  const relations = await (await fetch(`http://localhost:${process.env.PORT}/api/services/unique-relations-duration`)).json();
  return (
    <ReactFlowProvider>
      <HomePage services={services} uniqueRelations={relations.relations} />
    </ReactFlowProvider>
  )

  // 
}