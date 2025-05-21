import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, BrainIcon } from "lucide-react";

export const ExtractDataWithAiTask = {
    type: TaskType.EXTRACT_DATA_WITH_AI,
    label: "Extract Data with AI",
    icon: (props:LucideProps) => (<BrainIcon className="stroke-rose-500" {...props}/>),
    isEntryPoint: false,
    credits: 4,
    inputs:[
        {
            name:"Content",
            type:TaskParamType.STRING,
            required:true,
        },
        {
            name:"Credential",
            type:TaskParamType.CREDENTIAL,
            required:true,
        },
        {
            name:"Prompt",
            type:TaskParamType.STRING,
            required:true,
            variant:"textarea",
        },
    ] as const,
    outputs:[
        {
            name: "Extracted Data",
            type: TaskParamType.STRING,
        },
    ]as const,
}satisfies WorkflowTask;