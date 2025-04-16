import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
    "NO_ENTRY_POINT",
    "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type: FlowToExecutionPlanValidationError;
        invalidElements?: AppNodeMissingInputs[];
    };
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {

    const entryPoint = nodes.find((n) => TaskRegistry[n.data.type].isEntryPoint);
    if (!entryPoint) {
        return{
            error: {
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
            },
        }
    }

    const inputsWithErrors: AppNodeMissingInputs[] = [];
    const planned = new Set<string>();

    const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
    if (invalidInputs.length > 0) {
        inputsWithErrors.push({
            nodeId: entryPoint.id,
            inputs: invalidInputs,
        });
    }

    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entryPoint],
        },
    ];
    planned.add(entryPoint.id);

    for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
        for(const currentNode of nodes){
            if(planned.has(currentNode.id)) continue;

            const invalidInputs = getInvalidInputs(currentNode,edges,planned);
            if(invalidInputs.length > 0){
                const incomers = getIncomers(currentNode, nodes, edges);
                if(incomers.every((incomer) => planned.has(incomer.id))){
                    console.error("Invalid inputs", currentNode.id, invalidInputs);
                    inputsWithErrors.push({
                        nodeId: currentNode.id,
                        inputs: invalidInputs,
                    });
                }else {
                    continue;
                }
            }

            nextPhase.nodes.push(currentNode);
            
        }
        for(const node of nextPhase.nodes){
            planned.add(node.id);
        }

        executionPlan.push(nextPhase);


    }

    if(inputsWithErrors.length > 0){
        return {
            error: {
                type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
                invalidElements: inputsWithErrors,
            }
        }
    }

    return { executionPlan };

}


function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;
    for(const input of inputs){
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if(inputValueProvided){
            //this input is fine
            continue;
        }
        //If a value is not provided by the user then we need to check if there is an output from another node that is connected to this input
        const incomingEdges = edges.filter((edge) => edge.target === node.id );  //&& edge.source !== node.id
        const inputLinkedToOutput = incomingEdges.find((edge)=> edge.targetHandle === input.name);

        const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

        if(requiredInputProvidedByVisitedOutput){
            //this input is required and we have a valid value for it provided by a task that is already planned
            continue;
        }else if(!input.required){
            //this input is not required but there is a output linked to it then we need to be sure that the output is already planned
            if(!inputLinkedToOutput) continue;
            if(inputLinkedToOutput && planned.has(inputLinkedToOutput.source)){
                //the output is providing a value to the input
                continue;
            }
            
        }

        invalidInputs.push(input.name);
    }

    return invalidInputs;

}

function getIncomers(node:AppNode, nodes: AppNode[], edges: Edge[]){
    if(!node.id){
        return [];
    }
    const incomersIds = new Set();
    edges.forEach((edge) => {
      if (edge.target === node.id) {
        incomersIds.add(edge.source);
      }
    });
  
    return nodes.filter((n) => incomersIds.has(n.id));
  };

