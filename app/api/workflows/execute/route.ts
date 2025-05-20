import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { CronExpressionParser } from "cron-parser";

function isValidToken(token: string) {
    const API_SECRET = process.env.API_SECRET;
    if (!API_SECRET) {
        return false;
    }
    try {
        const isValid = timingSafeEqual(Buffer.from(token), Buffer.from(API_SECRET));
        return isValid;
    } catch (error) {
        return false;
    }
}

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!isValidToken(token)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId") as string;
    if (!workflowId) {
        return Response.json({ error: "Bad Request" }, { status: 400 });
    }

    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
    });

    if (!workflow) {
        return Response.json({ error: "Not Found" }, { status: 404 });
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;

    if (!executionPlan) {
        return Response.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
        const cron = CronExpressionParser.parse(workflow.cron!, { tz: "UTC" });
        const nextRun = cron.next().toDate();
        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId: workflow.userId,
                definition: workflow.definition,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionTrigger.CRON,
                phases: {
                    create: executionPlan.flatMap((phase) => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId: workflow.userId,
                                status: ExecutionPhaseStatus.CREATED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label,
                            };
                        });
                    }),
                },
            },
        });

        await ExecuteWorkflow(execution.id, nextRun);
        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error parsing cron expression:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });

    }



}