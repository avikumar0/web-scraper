"use client";

import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Layers2Icon } from 'lucide-react';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';


type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;
const chartConfig = {
    success: {
        label: "Success",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        label: "Failed",
        color: "hsl(var(--chart-1))"
    }
}

export default function ExecutionStatusChart({ data }: { data: ChartData }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
                    <Layers2Icon className='w-6 h-6' />
                    Workflow Execution Status
                </CardTitle>
                <CardDescription>
                    Daily Number of Successfull and Failed workflow executions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className='max-h-[200px] w-full' config={chartConfig}>
                    <AreaChart
                        data={data}
                        height={200}
                        accessibilityLayer
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={"date"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
                        <Area
                            dataKey={"success"}
                            min={0}
                            type={"natural"}
                            fillOpacity={0.6}
                            fill='var(--color-success)'
                            stroke='var(--color-success)'
                            stackId={"a"}
                        />
                        <Area
                            dataKey={"failed"}
                            min={0}
                            type={"natural"}
                            fillOpacity={0.6}
                            fill='var(--color-failed)'
                            stroke='var(--color-failed)'
                            stackId={"a"}
                        />
                        
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
