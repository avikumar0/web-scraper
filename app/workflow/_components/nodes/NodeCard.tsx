"use client";

import useFlowValidation from '@/components/hooks/useFlowValidation';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React from 'react'

function NodeCard({ children, nodeId, isSelected }: { children: React.ReactNode, nodeId: string, isSelected: boolean }) {
    const { getNode, setCenter } = useReactFlow();
    const { invalidInputs } = useFlowValidation();
    const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);
    return (
        <div
            onDoubleClick={() => {
                const node = getNode(nodeId);
                if (!node) return;
                const { position, measured } = node;
                if (!measured || !position) return;
                const { width, height } = measured;
                const x = position.x + width! / 2;
                const y = position.y + height! / 2;
                if (x == undefined || y == undefined) return;
                setCenter(x, y, {
                    duration: 500,
                    zoom: 1,
                });
            }}
            className={cn('rounded-md border bg-background p-2 border-separate cursor-pointer w-[420px] text-xs flex flex-col', isSelected && 'border-primary', hasInvalidInputs && "border-destructive border-2")}>{children}</div>
    )
}

export default NodeCard
