
import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomePage from '@/components/layouts/HomePage'
import { Services } from '@/utils/interfaces'
import { ReactFlowProvider } from '@xyflow/react'
import ServicePage from '@/components/layouts/ServicePage'
import { sinceToPeriod } from '@/utils/periods'



export default async function Home(
  {params, searchParams}: 
  {params: {serviceName: string}, searchParams: {since: string}}
) {

const { serviceName } = params;
const { since } = searchParams;


  const metrics = await (await fetch(`http://localhost:${process.env.PORT}/api/${serviceName}/metrics?period=5m&since=${sinceToPeriod[since] ? since : "1"}`)).json();
  const traces = await (await fetch(`http://localhost:${process.env.PORT}/api/${serviceName}/traces?since=${ sinceToPeriod[since] ? since : "1"}`)).json();
  return (
    <ServicePage since={sinceToPeriod[since] ? since : "1"} serviceName={serviceName} metricData={metrics} traceData={traces}/>
  )

  // 
}