import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, GlobeIcon, CodeIcon } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Get Html from page",
    icon: (props:LucideProps) => (<CodeIcon className="stroke-rose-500" {...props}/>),
    isEntryPoint: false,
    credits: 2,
    inputs:[
        {
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,
            required:true,
        },
    ],
    outputs:[
        {
            name: "Html",
            type: TaskParamType.STRING,
        },
        {
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,
        },
    ],
}satisfies WorkflowTask;