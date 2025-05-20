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
import { ChartColumnStackedIcon, Layers2Icon } from 'lucide-react';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { GetCreditUsageInPeriod } from '@/actions/analytics/getCreditUsageInPeriod';


type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;
const chartConfig = {
    success: {
        label: "Successful Phase Credits",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        label: "Failed Phase Credits",
        color: "hsl(var(--chart-1))"
    }
}

export default function CreditUsageChart({ data, title, description }: { data: ChartData, title: string, description: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
                    <ChartColumnStackedIcon className='w-6 h-6' />
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className='max-h-[200px] w-full' config={chartConfig}>
                    <BarChart
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
                        <Bar
                            dataKey={"success"}
                            fillOpacity={0.8}
                            radius={[0, 0, 4, 4]}
                            fill='var(--color-success)'
                            stroke='var(--color-success)'
                            stackId={"a"}
                        />
                        <Bar
                            dataKey={"failed"}
                            fillOpacity={0.8}
                            radius={[4, 4, 0, 0]}
                            fill='var(--color-failed)'
                            stroke='var(--color-failed)'
                            stackId={"a"}
                        />

                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
