import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, GlobeIcon, CodeIcon, TextIcon, MousePointerClick, ArrowUpIcon } from "lucide-react";

export const ScrollToElementTask = {
    type: TaskType.SCROLL_TO_ELEMENT,
    label: "Scroll to Element ",
    icon: (props:LucideProps) => (<ArrowUpIcon className="stroke-orange-500" {...props}/>),
    isEntryPoint: false,
    credits: 1,
    inputs:[
        {
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,
            required:true,
        },
        {
            name:"Selector",
            type:TaskParamType.STRING,
            required:true,
        },
    ] as const,
    outputs:[
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
        },
    ]as const,
}satisfies WorkflowTask;