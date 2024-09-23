
import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomePage from '@/components/layouts/HomePage'
import { Services } from '@/utils/interfaces'

export default async function Home() {

  const services : Services = await (await fetch('http://localhost:3000/api/services?since=5')).json();
  const relations = await (await fetch('http://localhost:3000/api/services/unique-relations', )).json();
  return (
    <HomePage services={services} uniqueRelations={relations.relations}/>
  )

  // 
}