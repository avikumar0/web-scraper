"use client";

import { Card, CardContent } from '@/components/ui/card';
import { WorkflowStatus } from '@/types/workflow';
import { Workflow } from '@prisma/client';
import { FileTextIcon, PlayIcon } from 'lucide-react';
import React from 'react'

function WorkflowCard({workflow}: {workflow: Workflow}) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className='border border-separate shadow-md rounded-lg overflow-hidden hover:shadow-lg dark:shadow-primary/30'>
        <CardContent>
            <div className="">
                {isDraft ? <FileTextIcon className='h-5 w-5 '/> : <PlayIcon className='h-5 w-5 text-white'/>}
            </div>
        </CardContent>
    </Card>
  )
}

export default WorkflowCard