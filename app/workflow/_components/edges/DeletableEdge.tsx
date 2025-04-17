"use client";

import { Button } from "@/components/ui/button";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from "@xyflow/react";

export default function DeleteableEdge(props: EdgeProps) {
    const [edgePath, labelX, lableY] = getSmoothStepPath(props);
    const {setEdges} = useReactFlow();
    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={props.markerEnd}
                style={props.style}
            />
            <EdgeLabelRenderer>
                <div style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%) translate(${labelX}px, ${lableY}px)`,
                    pointerEvents: "all",
                }}
                >
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="w-5 h-5 border cursor-pointer leading leading-none hover:shadow-lg rounded-full text-xs"
                        onClick={() => {
                            setEdges((eds) => eds.filter((e) => e.id !== props.id));
                        }}
                    >
                        x
                    </Button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}