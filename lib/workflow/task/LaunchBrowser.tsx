import { TaskType } from "@/types/task";
import { LucideProps, GlobeIcon } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props:LucideProps) => (<GlobeIcon className="stroke-pink-500" {...props}/>),
    isEntryPoint: true,
}