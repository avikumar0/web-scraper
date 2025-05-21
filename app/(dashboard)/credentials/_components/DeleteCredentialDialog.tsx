"use client";

import { DeleteCredential } from "@/actions/credentials/deleteCredential";
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
import { XIcon } from "lucide-react";

import React, { useState } from 'react'
import { toast } from "sonner";

interface Props {
   name: string;
}

function DeleteCredentialDialog({ name }: Props) {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const deleteMutation= useMutation({
        mutationFn: DeleteCredential,
        onSuccess:()=>{
            toast.success("Credential deleted successfully", { id: name });
            setConfirmText('');
            // setOpen(false);
        },
        onError:()=>{
            toast.error("Failed to delete credential", { id: name });
        },
    });
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="destructive" size="icon" >
                    <XIcon size={18} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Credential</AlertDialogTitle>    
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to delete this credential ? This action cannot be undone.
                    <div className="flex flex-col py-4 gap-2 ">
                        <p className="">
                            If you are sure, please type <b>{name}</b> to confirm.
                        </p>
                        <Input placeholder="Type the credential name to confirm" value={confirmText} onChange={e => setConfirmText(e.target.value)} />
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=> setConfirmText('')}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={confirmText !== name || deleteMutation.isPending} 
                    onClick={(e)=>{
                        e.stopPropagation();
                        toast.loading("Deleting credential...", { id: name });
                        deleteMutation.mutate(name);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCredentialDialog