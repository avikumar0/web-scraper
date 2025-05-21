
import { LucideIcon } from 'lucide-react';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import ReactCountWrapper from '@/components/ReactCountWrapper';
  

interface Props {
    title  : string;
    value  : number;
    icon : LucideIcon;
}

export default function StatsCard(props: Props) {
  return (
    <Card className='relative overflow-hidden h-full'>
        <CardHeader className='flex pb-2'> 
            <CardTitle >
                {props.title}
                <props.icon size={120} className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10" />
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl text-primary font-bold">
                <ReactCountWrapper value={props.value} />
            </div>
        </CardContent>

    </Card>
  )
}
