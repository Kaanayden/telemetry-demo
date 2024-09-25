"use client"



import React, { useState, useEffect } from 'react';


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { ResponsiveLine, Serie } from '@nivo/line';
import ChartLine from '@/components/layouts/ChartLine';

interface TraceEvent {
    Timestamp: string[];
    Name: string[];
    Attributes: string[];
}

interface TraceLink {
    TraceId: string[];
    SpanId: string[];
    TraceState: string[];
    Attributes: string[];
}

interface Trace {
    Timestamp: string;
    TraceId: string;
    SpanId: string;
    ParentSpanId: string;
    TraceState: string;
    SpanName: string;
    SpanKind: string;
    ServiceName: string;
    ResourceAttributes: Record<string, string>;
    ScopeName: string;
    ScopeVersion: string;
    SpanAttributes: Record<string, string>;
    Duration: number;
    StatusCode: string;
    StatusMessage: string;
    Events: TraceEvent;
    Links: TraceLink;
}

interface MetricDataPoint {
    interval_start: string;
    avg_process_memory_usage: number;
    avg_system_memory_usage: number;
    avg_system_memory_usage_percent: number;
}

interface ServicePageProps {
    serviceName: string;
    traceData: Trace[];
    metricData: MetricDataPoint[];
}

const ServicePage: React.FC<ServicePageProps> = ({ serviceName, traceData, metricData }) => {
    const [tracesByInstrumentation, setTracesByInstrumentation] = useState<Record<string, Trace[]>>({});
    const [chartData, setChartData] = useState<{ process: Serie[], system: Serie[] }>({ process: [], system: [] });
    console.log("traceData:", traceData)
    useEffect(() => {
        // Categorize traces by instrumentation names
        const categorizedTraces: Record<string, Trace[]> = {};
        traceData.forEach((trace) => {
            const instrumentationName = trace.ScopeName;
            if (!categorizedTraces[instrumentationName]) {
                categorizedTraces[instrumentationName] = [];
            }
            categorizedTraces[instrumentationName].push(trace);
        });
        setTracesByInstrumentation(categorizedTraces);




        // Prepare data for the chart
        const processMemoryUsage: Serie = {
            id: 'Process Memory Usage',
            data: metricData.map((item) => {

                const date = new Date(item.interval_start);
                const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return {
                    x: timeString,
                    y: item.avg_process_memory_usage / 1024 ** 2,
                }
            }),
        };

        const systemMemoryUsage: Serie = {
            id: 'System Memory Usage',
            data: metricData.map((item) => {

                const date = new Date(item.interval_start);
                const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return {
                    x: timeString,
                    y: item.avg_system_memory_usage / 1024 ** 2,
                }
            }),
        };

        setChartData({ process: [processMemoryUsage], system: [systemMemoryUsage] });
    }, [traceData, metricData]);

    return (
        <div className="flex flex-col bg-gray-900 text-gray-100 px-4">
            <h2 className="text-gray-100 text-center items-center py-4 text-2xl">
                "{serviceName}" service
            </h2>
            <div></div>

            <div className="w-full h-full bg-gray-800 rounded-md border border-gray-700">
                <div className="p-4">
                    <div className='flex flex-row items-center justify-between my-4'>

                        <h2 className="text-gray-100 mx-4 text-2xl">
                            Metrics
                        </h2>

                        <Select>
                            <SelectTrigger className="w-[180px] text-white bg-slate-700">
                                <SelectValue className='' placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent className='bg-slate-600' >
                                <SelectGroup >
                                    <SelectItem className='text-white' value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-row items-center justify-around'>

                        <div className="flex flex-col h-64 w-1/2 text-black px-8 items-center justify-center">
                            <span className='text-center font-semibold text-white'>Process Memory Usage</span>
                            <ChartLine chartData={chartData.process} />
                        </div>


                        <div className="flex flex-col h-64 w-1/2 text-black px-8 items-center justify-center">
                            <span className='text-center font-semibold text-white'>System Memory Usage</span>
                            <ChartLine chartData={chartData.system} />
                        </div>
                    </div>

                </div>
            </div>


            <div className="flex-1 w-full h-screen">
                <div className="flex w-full h-full py-4">
                    <div className="w-full h-full bg-gray-800 border border-gray-700 rounded-md">
                        <div className="p-4 mt-4 mb-8">
                            <div className='flex flex-row items-center justify-between'>

                                <h2 className="text-gray-100 mx-4 text-2xl">
                                    Traces
                                </h2>

                                <Select>
                                    <SelectTrigger className="w-[180px] text-white bg-slate-700">
                                        <SelectValue className='' placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-slate-600' >
                                        <SelectGroup >
                                            <SelectItem className='text-white' value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Table>
                                <TableHeader className='select-none pointer-events-none'>
                                    <TableRow>
                                        <TableHead>Instrumentation</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Operation</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Duration (ms)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {traceData.map((trace) => (
                                        <TableRow key={trace.SpanId}>
                                            <TableCell>{trace.ScopeName.replace("@opentelemetry/instrumentation-", "")}</TableCell>
                                            <TableCell>{trace.SpanKind}</TableCell>
                                            <TableCell>{trace.SpanName}</TableCell>
                                            <TableCell>{trace.SpanAttributes['http.url'] || trace.SpanAttributes['url.full']}</TableCell>
                                            <TableCell>{trace.StatusCode}</TableCell>
                                            <TableCell>{trace.Timestamp}</TableCell>
                                            <TableCell>{trace.Duration / 1000000}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;