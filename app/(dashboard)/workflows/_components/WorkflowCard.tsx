"use client";

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkflowStatus } from '@/types/workflow';
import { Workflow } from '@prisma/client';
import { FileTextIcon, MoreVerticalIcon, PlayIcon, ShuffleIcon, Trash, TrashIcon } from 'lucide-react';
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


const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary',
  [WorkflowStatus.ARCHIVED]: 'bg-gray-500',
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30'>
      <CardContent className='p-4 flex items-center justify-between h-[100px]'>
        <div className='flex items-center justify-end space-x-3'>
          <div className={cn("w-10 flex h-10 rounded-full justify-center items-center ", statusColors[workflow.status as WorkflowStatus])}>
            {isDraft ? <FileTextIcon className='h-5 w-5 ' /> : <PlayIcon className='h-5 w-5 text-white' />}
          </div>
          <div>
            <h3 className="text-muted-foreground flex items-center text-base font-bold ">
              <Link href={`/workflow/editor/${workflow.id}`} className='flex items-center hover:underline'>
                {workflow.name}
              </Link>
              {
                isDraft && (
                  <span className='text-xs ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full'>Draft</span>
                )
              }
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/workflow/editor/${workflow.id}`} className={cn(buttonVariants({
            variant: 'outline',
            size: 'sm',
          }), "flex items-center gap-2")}>
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions workflowName={workflow.name} workflowId={workflow.id}/>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkflowActions({workflowName,workflowId}: {workflowName: string,workflowId: string}) {
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

export default WorkflowCard


