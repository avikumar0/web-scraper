import { cn } from "@/lib/utils"
import { TaskParam } from "@/types/task"
import { Handle, Position, useEdges } from "@xyflow/react"
import NodeParamField from "./NodeParamField"
import { ColorForHandle } from "./common"
import useFlowValidation from "@/components/hooks/useFlowValidation"

export function NodeInputs({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    )
}

export function NodeInput({ input,nodeId }: { input: TaskParam, nodeId: string }) {
    const { invalidInputs } = useFlowValidation();
    const edges = useEdges();
    const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);
    const hasErrors = invalidInputs.find((node) => node.nodeId === nodeId)?.inputs.some((invalidInputs) => invalidInputs === input.name);
    return (
        <div className={cn("flex justify-start p-3 bg-secondary relative w-full",hasErrors && "bg-destructive/30 ")}>
            <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} /> 
            {
                !input.hideHandle && (
                    <Handle id={input.name} type="target" position={Position.Left}
                        isConnectable={!isConnected}
                        className={cn('!bg-muted-foreground !border-2 !border-background !w-4 !h-4',ColorForHandle[input.type])}
                    />
                )
            }

        </div>
    )
}