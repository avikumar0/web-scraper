import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, GlobeIcon } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props:LucideProps) => (<GlobeIcon className="stroke-pink-500" {...props}/>),
    isEntryPoint: true,
    credits: 5,
    inputs:[
        {
            name:"Website URL",
            type:TaskParamType.STRING,
            helperText:"eg. https://www.google.com",
            hideHandle:true,
            required:true,
        },
    ]as const,
    outputs:[
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE,
        },
    ]as const,
} satisfies WorkflowTask;