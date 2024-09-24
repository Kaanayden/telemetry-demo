



import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomePage from '@/components/layouts/HomePage'
import { MetricData, Services, TraceData } from '@/utils/interfaces'
import { ReactFlowProvider } from '@xyflow/react'



export default async function ServicePage({ serviceName, metrics, traces}: {serviceName: string, metrics: MetricData[], traces: TraceData[]}) {



  const services: Services = await (await fetch('http://localhost:3000/api/services?period=5m&since=1m', { cache: 'no-cache' })).json();
  const relations = await (await fetch('http://localhost:3000/api/services/unique-relations', { cache: 'no-cache' })).json();
  return (
    <div>
    <span>{serviceName}</span>
    
    <span>{JSON.stringify(metrics)}</span>
    <span>{JSON.stringify(traces)}</span>
    </div>
  )

  // 
}