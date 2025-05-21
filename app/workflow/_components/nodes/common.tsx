import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType,string> = {
    BROWSER_INSTANCE: "!bg-sky-500",
    STRING: "!bg-amber-500",
    SELECT: "!bg-rose-500",
    CREDENTIAL: "!bg-teal-500",
}