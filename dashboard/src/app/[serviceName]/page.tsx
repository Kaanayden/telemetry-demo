
import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomePage from '@/components/layouts/HomePage'
import { Services } from '@/utils/interfaces'
import { ReactFlowProvider } from '@xyflow/react'
import ServicePage from '@/components/layouts/ServicePage'



export default async function Home({params}: {params: {serviceName: string}}) {

const { serviceName } = params;

  const metrics = await (await fetch(`http://localhost:3000/api/${serviceName}/metrics?period=5m&since=1`, { cache: 'no-cache' })).json();
  const traces = await (await fetch(`http://localhost:3000/api/${serviceName}/traces?since=15`, { cache: 'no-cache' })).json();
  return (
    <ServicePage serviceName={serviceName} metricData={metrics} traceData={traces}/>
  )

  // 
}