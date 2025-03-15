"use client";

import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

import React, { useState } from 'react'
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
    workflowId: string;
}

function DeleteWorkflowDialog({ open, setOpen, workflowName,workflowId }: Props) {
    const [confirmText, setConfirmText] = useState('');

    const deleteMutation= useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess:()=>{
            toast.success("Workflow deleted successfully", { id: 'delete-workflow' });
            setConfirmText('');
            // setOpen(false);
        },
        onError:()=>{
            toast.error("Failed to delete workflow", { id: 'delete-workflow' });
        },
    })
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workflow</AlertDialogTitle>    
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to delete this workflow? This action cannot be undone.
                    <div className="flex flex-col py-4 gap-2 ">
                        <p className="">
                            If you are sure, please type <b>{workflowName}</b> to confirm.
                        </p>
                        <Input placeholder="Type the workflow name to confirm" value={confirmText} onChange={e => setConfirmText(e.target.value)} />
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=> setConfirmText('')}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={confirmText !== workflowName || deleteMutation.isPending} 
                    onClick={(e)=>{
                        e.stopPropagation();
                        toast.loading("Deleting workflow...", { id: 'delete-workflow' });
                        deleteMutation.mutate(workflowId);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWorkflowDialog