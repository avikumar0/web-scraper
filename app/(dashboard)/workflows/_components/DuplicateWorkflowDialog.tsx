"use client";
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createWorkflowSchema, createWorkflowSchemaType, duplicateWorkflowSchema, duplicateWorkflowSchemaType } from '@/schema/workflow';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { CreateWorkflow } from '@/actions/workflows/createWorkflow';
import { toast } from 'sonner';
import { DuplicateWorkflow } from '@/actions/workflows/duplicateWorkflow';
import { cn } from '@/lib/utils';

function DuplicateWorkflowDialog({ triggerText, workflowId }: { triggerText?: string, workflowId: string }) {
    const [open, setOpen] = useState(false);

    const form = useForm<duplicateWorkflowSchemaType>({
        resolver: zodResolver(duplicateWorkflowSchema),
        defaultValues: {
            workflowId,
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: DuplicateWorkflow,
        onSuccess: () => {
            toast.success('Workflow Duplicated successfully', { id: "duplicate-workflow" });
            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error('Failed to duplicate workflow', { id: "duplicate-workflow" });
        }
    });

    const onSubmit = useCallback((values: duplicateWorkflowSchemaType) => {
        toast.loading('Duplicating workflow...', { id: "duplicate-workflow" });
        mutate(values);
    }, [mutate]);

    return (
        <Dialog open={open} onOpenChange={(open) => {
            form.reset();
            setOpen(open);
        }}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}
                    className={cn("ml-2 transition-opacity opacity-0 duration-200 group-hover/card:opacity-100")}
                >
                    <CopyIcon className='h-4 w-4 text-muted-foreground' />
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    title='Duplicate Workflow'
                    icon={Layers2Icon}
                />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Name
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a descriptive name for your workflow
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Description
                                            <p className="text-xs text-muted-foreground">(optional)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className='resize-none' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a brief description of your workflow
                                            <br /> This is optional but can help you to remmeber workflow&apos;s purpose
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isPending}>
                                {!isPending && "Proceed"}
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DuplicateWorkflowDialog;