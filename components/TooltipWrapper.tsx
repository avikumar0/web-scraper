"Use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';


interface Props{
    children: React.ReactNode
    content: React.ReactNode
    side?: 'left' | 'right' | 'top' | 'bottom'

}

function TooltipWrapper(props: Props) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {props.children}
            </TooltipTrigger>
            <TooltipContent side={props.side}>
                {props.content}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipWrapper