"use client";

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import SaveBtn from './SaveBtn';
import ExecuteBtn from './ExecuteBtn';

interface Props {
    title: string;
    subtitle?: string;
    workflowId: string;
    hideButtons?: boolean;
}

function Topbar({ title, subtitle, workflowId, hideButtons = false }: Props) {
    const router = useRouter();
    return (
        <header className="flex p-2 border-b-2 border-separate justify-between
            sticky top-0 bg-background z-10 w-full">
            <div className="flex gap-1 flex-1">
                <TooltipWrapper content="Back">
                    <Button variant={'ghost'} size={'icon'} onClick={() => router.back()} >
                        <ChevronLeft size={20} />
                    </Button>
                </TooltipWrapper>
                <div>
                    <p className="font-bold truncate text-ellipsis">{title}</p>
                    {subtitle && <p className="text-xs text-muted-foreground text-ellipsis truncate">{subtitle}</p>}
                </div>
            </div>
            <div className="flex gap-1 flex-1 justify-end ">
                {hideButtons === false && (
                    <>
                        <ExecuteBtn workflowId={workflowId} />
                        <SaveBtn workflowId={workflowId} />
                    </>
                )}

            </div>
        </header>
    )
}

export default Topbar