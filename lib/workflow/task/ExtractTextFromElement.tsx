import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, GlobeIcon, CodeIcon, TextIcon } from "lucide-react";

export const ExtractTextFromElementType = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: "Extract Text from Element",
    icon: (props:LucideProps) => (<TextIcon className="stroke-rose-500" {...props}/>),
    isEntryPoint: false,
    credits: 2,
    inputs:[
        {
            name:"Html",
            type:TaskParamType.STRING,
            required:true,
            variant:"textarea",
        },
        {
            name:"Selector",
            type:TaskParamType.STRING,
            required:true,
        },
    ] as const,
    outputs:[
        {
            name: "Extracted Text",
            type: TaskParamType.STRING,
        },
    ]as const,
}satisfies WorkflowTask;