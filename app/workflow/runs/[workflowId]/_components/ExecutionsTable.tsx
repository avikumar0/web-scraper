"use client";

import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DatesToDurationString } from '@/lib/helper/dates';
import { Badge } from '@/components/ui/badge';
import ExecutionStatusIndicater from './ExecutionStatusIndicater';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { CoinsIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';


type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export default function ExecutionsTable({ workflowId, initialData }: { workflowId: string, initialData: InitialDataType }) {
    const router = useRouter();
    const query = useQuery({
        queryKey: ['executions', workflowId],
        initialData,
        queryFn: () => GetWorkflowExecutions(workflowId),
        refetchInterval: 5000,
    });
    return (
        <div className="rounded-lg shadow-md border overflow-auto">
            <Table className='h-full'>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        <TableHead className=''>ID</TableHead>
                        <TableHead className=''>Status</TableHead>
                        <TableHead className=''>Consumed</TableHead>
                        <TableHead className='text-right text-muted-foreground text-xs'>Started At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='overflow-auto h-full gap-2'>
                    {query.data?.map((execution) => {
                        const duration = DatesToDurationString(execution.completedAt, execution.startedAt);
                        const formattedStartedAt = execution.startedAt && formatDistanceToNow(
                            execution.startedAt,{
                                addSuffix: true,
                            }
                        )
                        return (
                            <TableRow key={execution.id} 
                            className='cursor-pointer'
                            onClick={()=>{
                                router.push(`/workflow/runs/${execution.workflowId}/${execution.id}`)
                            }}
                            >
                                <TableCell className='font-bold'>
                                    <div className="flex flex-col ">
                                        <span className="font-semibold">{execution.id}</span>
                                        <div className="text-xs text-muted-foreground">
                                            <span className="">Triggered via</span>
                                            <Badge variant={'outline'} >{execution.trigger}</Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell >
                                    <div className="flex flex-col">
                                        <div className='flex gap-2 items-center'>
                                            <ExecutionStatusIndicater status={execution.status as WorkflowExecutionStatus} />
                                            <span className='font-semibold capitalize'>{execution.status}</span>
                                        </div>
                                        <div className='text-muted-foreground text-xs mx-5'>{duration}</div>
                                    </div>
                                </TableCell>
                                <TableCell >
                                    <div className="flex flex-col">
                                        <div className='flex gap-2 items-center'>
                                            <CoinsIcon size={16} className='text-primary' />
                                            <span className='font-semibold capitalize'>{execution.creditsConsumed}</span>
                                        </div>
                                        <div className='text-muted-foreground text-xs mx-5'>Credits</div>
                                    </div>
                                </TableCell>
                                <TableCell className='text-muted-foreground text-right'>{formattedStartedAt}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
