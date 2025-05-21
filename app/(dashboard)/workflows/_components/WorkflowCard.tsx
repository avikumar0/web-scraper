"use client";

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow';
import { Workflow } from '@prisma/client';
import { ChevronRight, ClockIcon, CoinsIcon, CornerDownRight, FileTextIcon, MoreVerticalIcon, MoveRight, PlayIcon, ShuffleIcon, Trash, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/TooltipWrapper';
import DeleteWorkflowDialog from './DeleteWorkflowDialog';
import RunBtn from './RunBtn';
import SchedulerDialog from './SchedulerDialog';
import { Badge } from '@/components/ui/badge';
import ExecutionStatusIndicater, { ExecutionStatusLabel } from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicater';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import DuplicateWorkflowDialog from './DuplicateWorkflowDialog';


const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary',
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card'>
      <CardContent className='p-4 flex items-center justify-between h-[100px]'>
        <div className='flex items-center justify-end space-x-3'>
          <div className={cn("w-10 flex h-10 rounded-full justify-center items-center ", statusColors[workflow.status as WorkflowStatus])}>
            {isDraft ? <FileTextIcon className='h-5 w-5 ' /> : <PlayIcon className='h-5 w-5 text-white' />}
          </div>
          <div>
            <h3 className="text-muted-foreground flex items-center text-base font-bold ">
              <TooltipWrapper content={workflow.description} >
                <Link href={`/workflow/editor/${workflow.id}`} className='flex items-center hover:underline'>
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {
                isDraft && (
                  <span className='text-xs ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full'>Draft</span>
                )
              }
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection isDraft={isDraft} creditsCost={workflow.creditsCost} workflowId={workflow.id} cron={workflow.cron} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link href={`/workflow/editor/${workflow.id}`} className={cn(buttonVariants({
            variant: 'outline',
            size: 'sm',
          }), "flex items-center gap-2")}>
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
        </div>
      </CardContent>
      <LastDetails workflow={workflow} />
    </Card>
  )
}

function WorkflowActions({ workflowName, workflowId }: { workflowName: string, workflowId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName} workflowId={workflowId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} size="sm" >
            <TooltipWrapper content={"More Actions"}>
              <div className='flex items-center justify-center w-full h-full'>
                <MoreVerticalIcon size={16} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex items-center text-destructive gap-2'
            onSelect={() => setShowDeleteDialog(prev => !prev)}>

            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function ScheduleSection({ isDraft, creditsCost, workflowId, cron }: { isDraft?: boolean, creditsCost?: number, workflowId: string, cron: string | null }) {
  if (isDraft) return null;
  return (
    <div className='flex items-center gap-2'>
      <CornerDownRight className='text-muted-foreground w-4 h-4' />
      <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
      <MoveRight className='text-muted-foreground w-4 h-4' />
      <TooltipWrapper content="Credit Consumption for full run" >
        <div className="flex items-center gap-3">
          <Badge className='text-muted-foreground space-x-2 rounded-sm' variant={'outline'}>
            <CoinsIcon className=' w-4 h-4' />
            <span className='text-sm'>{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

function LastDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  if (isDraft) return null;
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, 'UTC', "HH:mm");
  return (
    <div className='flex bg-primary/5 px-4 py-1 text-muted-foreground justify-between items-center'>
      <div className='flex items-center text-sm gap-2'>
        {lastRunAt && (
          <Link href={`/workflow/runs/${workflow.id}/${lastRunId}`} className='flex items-center gap-2 group'>
            <span>Last RunAt : </span>
            <ExecutionStatusIndicater status={lastRunStatus as WorkflowExecutionStatus} />
            <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
            <span>{formattedStartedAt}</span>
            <ChevronRight size={16} className='group-hover:translate-x-0 transition -translate-x-[2px]' />
          </Link>
        )}
        {!lastRunAt && (
          <p className='text-sm text-muted-foreground'>No runs yet</p>
        )}
      </div>
      {nextRunAt && (
        <div className='flex items-center text-sm gap-2'>
          <ClockIcon size={12} />
          <span>Next RunAt</span>
          <span>{nextSchedule}</span>
          <span className='text-xs text-muted-foreground'>({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  )
}

export default WorkflowCard


