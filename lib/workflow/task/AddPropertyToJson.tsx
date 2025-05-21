import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, FileJson2Icon, DatabaseIcon } from "lucide-react";

export const AddPropertyToJsonTask = {
    type: TaskType.ADD_PROPERTY_TO_JSON,
    label: "Added Property to JSON ",
    icon: (props:LucideProps) => (<DatabaseIcon className="stroke-orange-500" {...props}/>),
    isEntryPoint: false,
    credits: 1,
    inputs:[
        {
            name:"JSON",
            type:TaskParamType.STRING,
            required:true,
        },
        {
            name:"Property Name",
            type:TaskParamType.STRING,
            required:true,
        },
        {
            name:"Property Value",
            type:TaskParamType.STRING,
            required:true,
        },
    ] as const,
    outputs:[
        {
            name: "Updated JSON",
            type: TaskParamType.STRING,
        },
    ]as const,
}satisfies WorkflowTask;