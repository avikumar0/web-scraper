"use client";
import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases';
import { GetWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhasesTotalCost } from '@/lib/helper/phases';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { ExecutionLog } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import { LogLevel } from '@/types/log';
import PhaseStatusBadge from './PhaseStatusBadge';



type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>
export default function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {

    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ['execution', initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    useEffect(() => {
        //While Running autoselect the current running phase in sidebar
        const phases = query.data?.phases || [];
        if(isRunning){
            const phaseToSelect = phases.toSorted((a,b)=> a.startedAt! > b.startedAt! ? -1 : 1)[0];
            setSelectedPhase(phaseToSelect.id);
            return;
        }
        const phaseToSelect = phases.toSorted((a,b)=> a.completedAt! > b.completedAt! ? -1 : 1)[0];
        setSelectedPhase(phaseToSelect.id);

    },[ query.data?.phases, isRunning,setSelectedPhase]);

    // useEffect(() => {
    //     if (isRunning) {
    //         const runningPhase = query.data?.phases.find(phase => phase.status === ExecutionPhaseStatus.RUNNING);
    //         if (runningPhase) {
    //             setSelectedPhase(runningPhase.id);
    //         }
    //     }
    // }, [isRunning, query.data?.phases]);

    const duration = DatesToDurationString(query.data?.completedAt, query.data?.startedAt);

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

    return (
        <div className='flex w-full h-full'>
            <aside className='flex flex-col flex-grow overflow-hidden w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate'>
                <div className="px-2 py-4">
                    {/* Status Label */}
                    <ExecutionLabel icon={CircleDashedIcon} label="Status" value={query.data?.status} />
                    {/* StartedAt Label */}
                    <ExecutionLabel icon={CalendarIcon}
                        label="Started At"
                        value={
                            <span className='lowercase'>
                                {query.data?.startedAt
                                    ? formatDistanceToNow(new Date(query.data?.startedAt), {
                                        addSuffix: true
                                    }) : "-"}
                            </span>
                        }
                    />
                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Duration"
                        value={duration ? duration : <Loader2Icon className='animate-spin' size={20} />}
                    />
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits Consumed"
                        value={creditsConsumed}
                    />


                </div>
                <Separator />
                <div className='flex justify-center items-center px-4 py-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <WorkflowIcon className='stroke-muted-foreground/80' size={20} />
                        <span className="font-semibold">Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            className='w-full justify-between'
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            onClick={() => {
                                if (isRunning) return;
                                setSelectedPhase(phase.id);
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <Badge variant={"outline"} >
                                    {index + 1}
                                </Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center w-full h-full">
                        <p className="font-bold">Run is in progress , Please Wait</p>
                    </div>
                )}
                {!isRunning && !selectedPhase && (
                    <div className="flex items-center flex-col gap-2 justify-center w-full h-full">
                        <div className="flex flex-col text-center gap-1">
                            <p className="font-bold">No phase selected</p>
                            <p className="text-muted-foreground text-sm">Select a phase to view details</p>
                        </div>
                    </div>
                )}
                {!isRunning && selectedPhase && phaseDetails.data && (
                    <div className="flex flex-col overflow-auto py-4 gap-4 container">
                        <div className="flex gap-2 items-center">
                            <Badge variant={"outline"} className='space-x-4'>
                                <div className='flex items-center gap-1'>
                                    <CoinsIcon className='stroke-muted-foreground' size={18} />
                                    <span>Credits</span>
                                </div>
                                <span>TODO</span>
                            </Badge>
                            <Badge variant={"outline"} className='space-x-4'>
                                <div className='flex items-center gap-1'>
                                    <ClockIcon className='stroke-muted-foreground' size={18} />
                                    <span>Duration</span>
                                </div>
                                <span>{DatesToDurationString(phaseDetails.data.completedAt, phaseDetails.data.startedAt) || "-"}</span>
                            </Badge>
                        </div>
                        <ParameterViewer
                            title="Inputs"
                            subtitle="Inputs used in this phase"
                            paramsJson={phaseDetails.data.inputs}
                        />
                        <ParameterViewer
                            title="Outputs"
                            subtitle="Outputs used in this phase"
                            paramsJson={phaseDetails.data.outputs}
                        />
                        <LogViewer logs={phaseDetails.data.log} />
                    </div>
                )}
            </div>
        </div>
    )
}


function ExecutionLabel({ icon, label, value }: { icon: LucideIcon, label: ReactNode, value: ReactNode }) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className='stroke-muted-foreground/80' size={20} />
                <span>{label}</span>
            </div>
            <div className='font-semibold capitalize flex gap-2 items-center'>
                {value}
            </div>
        </div>
    )
}

function ParameterViewer({ title, subtitle, paramsJson }: { title: string, subtitle: string, paramsJson: string | null }) {
    const params = paramsJson ? JSON.parse(paramsJson) : undefined;
    return (
        <Card>
            <CardHeader className='rounded-lg border-b py-4 rounded-b-none bg-gray-50 dark:bg-background'>
                <CardTitle className='text-base'>{title}</CardTitle>
                <CardDescription className='text-sm text-muted-foreground'>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className='py-4'>
                <div className='flex flex-col gap-2'>
                    {!params || Object.keys(params).length === 0 && (
                        <div className='flex items-center justify-center w-full h-full'>
                            <p className='text-sm text-muted-foreground'>No parameters generated by this phase</p>
                        </div>
                    )}
                    {params && Object.entries(params).map(([key, value]) => (
                        <div key={key} className='flex justify-between items-center space-y-1'>
                            <p className='text-sm text-muted-foreground flex-1 basis-1/3'>{key}</p>
                            <Input readOnly value={value as string} className='flex-1 basis-2/3' />
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
    if (!logs || logs.length === 0) return null;
    return (
        <Card className='w-full'>
            <CardHeader className='rounded-lg border-b py-4 rounded-b-none bg-gray-50 dark:bg-background'>
                <CardTitle className='text-base'>Logs</CardTitle>
                <CardDescription className='text-sm text-muted-foreground'>Logs generated by this phase</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader className='text-muted-foreground text-sm'>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className='text-muted-foreground'>
                                <TableCell
                                    width={190}
                                    className='text-xs p-[2px] pl-4 text-muted-foreground'>
                                    {log.timestamp.toISOString()}
                                </TableCell>
                                <TableCell
                                    width={80}
                                    className={cn("text-xs font-bold uppercase p-[3px] pl-4",
                                        log.logLevel as LogLevel === "error" && "text-destructive",
                                        log.logLevel as LogLevel === "info" && "text-primary",
                                    )} >
                                    {log.logLevel}
                                </TableCell>
                                <TableCell className='text-sm flex-1 p-[3px] pl-4'>{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>

            </CardContent>
        </Card>
    )
}   