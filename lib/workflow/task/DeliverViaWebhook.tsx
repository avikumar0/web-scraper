import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: "Deliver Via Webhook",
    icon: (props: LucideProps) => (<SendIcon className="stroke-blue-500" {...props} />),
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Target URL",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Body",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [] as const,
} satisfies WorkflowTask;