"use client";

import { Workflow } from '@prisma/client';
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from './nodes/NodeComponent';
import { number } from 'zod';
import { AppNode } from '@/types/appNode';
import DeleteableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeleteableEdge,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2,
}

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });

    } catch (error) { }
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData('application/reactflow');
    if (!taskType || typeof taskType === undefined) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));

    if (!connection.targetHandle) return;
    //Remove the input value if is present on connection
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!targetNode) return;
    const nodeInputs = targetNode.data.inputs;
    updateNodeData(targetNode.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: "",
      }
    });

  }, [setEdges, nodes, updateNodeData]);

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    if (connection.source == connection.target) return false;
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!sourceNode || !targetNode) return false;

    const sourceTask = TaskRegistry[sourceNode.data.type];
    const targetTask = TaskRegistry[targetNode.data.type];
    const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
    const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);

    if (input?.type !== output?.type) {
      console.error("Invalid connection: Type Mismatch");
      return false;
    }


    //Prevent loop
    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }

    };

    const detectedCycle = hasCycle(targetNode);
    return !detectedCycle;

  }, [nodes, edges]);

  return (
    <main className='h-full w-full'>
      <ReactFlow
        edges={edges}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}

      >
        <Controls position='top-left' fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
