"use client";

import { cn } from '@/lib/utils';
import React from 'react'

function NodeCard({ children, nodeId, isSelected }: { children: React.ReactNode, nodeId: string, isSelected: boolean }) {
    return (
        <div className={cn('rounded-md border bg-background p-2 border-separate cursor-pointer w-[420px] text-xs flex flex-col', isSelected && 'border-primary')}>{children}</div>
    )
}

export default NodeCard
