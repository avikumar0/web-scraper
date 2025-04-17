import { FlowToExecutionPlan, FlowToExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {
    const { toObject}= useReactFlow();
    const {setInvalidInputs,clearErrors}= useFlowValidation();

    const handleError = useCallback((error:any)=>{
        switch(error.type){
            case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
                toast.error("No entry point found in the workflow. Please add an entry point node.");
                break;
            case FlowToExecutionPlanValidationError.INVALID_INPUTS:
                toast.error("Invalid inputs found in the workflow. Please check the inputs of the nodes.");
                setInvalidInputs(error.invalidElements);
                break;
            default:
                toast.error("An unknown error occurred while generating the execution plan.");
        }
    },[setInvalidInputs]);

    const generateExecutionPlan = useCallback(() => {
        const { nodes, edges, viewport } = toObject();
        const {executionPlan , error} = FlowToExecutionPlan(nodes as AppNode[],edges);

        if(error){
            handleError(error);
            return;
        }
        clearErrors();
        return executionPlan;
    },[toObject,handleError,clearErrors]);

    return generateExecutionPlan;
}

export default useExecutionPlan;