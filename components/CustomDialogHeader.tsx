"use client";

import React from 'react'
import { DialogHeader,DialogTitle } from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Props {
    title?: string;
    subTitle?: string;
    icon?: LucideIcon;

    iconClassname?: string;
    titleClassname?: string;
    subTitleClassname?: string;

}
function CustomDialogHeader(props: Props) {
    const Icon = props.icon;
    return (
        <DialogHeader>
            <DialogTitle>
                <div className="flex flex-col gap-2 mb-2 items-center">
                    {Icon && <Icon size={30} className={cn("stroke-primary", props.iconClassname)} />}
                    {
                        props.title &&(
                            <p className={cn("text-xl text-primary",props.titleClassname)}>
                                {props.title}
                            </p>
                        )
                    }
                    {
                        props.subTitle &&(
                            <p className={cn("text-sm text-muted-foreground",props.subTitleClassname)}>
                                {props.subTitle}
                            </p>
                        )
                    }
                </div>
            </DialogTitle>
            <Separator />
        </DialogHeader>
    )
}

export default CustomDialogHeader