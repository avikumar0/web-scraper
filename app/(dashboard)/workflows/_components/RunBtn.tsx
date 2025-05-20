"use client";

import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

export default function RunBtn({ workflowId }: { workflowId: string }) {
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => toast.success("Workflow Execution started successfully", { id: workflowId }),
        onError: (error) => {
            toast.error("Something went Wrong", {
                id: workflowId
            });
        },
    })
    return (
        <Button variant={'outline'} size={"sm"} disabled={mutation.isPending} className="flex items-center gap-2" onClick={() => {
            toast.loading("Scheduling workflow execution", { id: workflowId });
            mutation.mutate({
                workflowId,
            })
        }}>
            <PlayIcon size={16} className='stroke-orange-500' />
            Run
        </Button> 
  )
}
