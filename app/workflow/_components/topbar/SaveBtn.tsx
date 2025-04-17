"use client";

import { UpdateWorkflows } from '@/actions/workflows/updateWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

function SaveBtn({workflowId}:{workflowId:string}) {
    const { toObject } = useReactFlow();

    const saveMutation = useMutation({
        mutationFn:UpdateWorkflows,
        onSuccess: () => {
            toast.success("Flow saved successfully",{id:"save-workflow"});
        },
        onError: ()=>{
            toast.error("Error saving flow",{id:"save-workflow"});
        },
    });

    return (
        <Button variant={"outline"} className='flex items-center gap-2'
            disabled={saveMutation.isPending}
            onClick={() => {
                const workflowDefinition = JSON.stringify(toObject());
                toast.loading("Saving flow...",{id:"save-workflow"});
                saveMutation.mutate({
                    id:workflowId,
                    definition: workflowDefinition,
                });
            }} >
            <CheckIcon size={16} className='stroke-green-400' />
            Save
        </Button>
    )
}

export default SaveBtn