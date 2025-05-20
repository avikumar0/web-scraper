"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string,{
        success: number;
        failed: number;
    }>

export async function GetWorkflowExecutionStats(period:Period){
    const {userId} = auth();
    if(!userId){
        throw new Error("User not authenticated");
    }
    const dateRange = PeriodToDateRange(period);
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
        },
    });

    const dateformat = "yyyy-MM-dd";

    const stats : Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    }).map((date) => format(date, dateformat)).reduce((acc, date) => {
        acc[date] = {
            success: 0,
            failed: 0,
        };
        return acc;
    },{} as any);

    executions.forEach((execution) => {
        const date = format(execution.startedAt!, dateformat);
        if(execution.status === WorkflowExecutionStatus.COMPLETED){
            stats[date].success++;
        }
        else if(execution.status === WorkflowExecutionStatus.FAILED){
            stats[date].failed++;
        }

    });

    const result = Object.entries(stats).map(([date, infos]) => ({
        date,
        ...infos,
    }));
    

    return result;
}