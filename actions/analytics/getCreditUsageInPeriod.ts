"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, {
    success: number;
    failed: number;
}>

const { COMPLETED, FAILED } = ExecutionPhaseStatus;

export async function GetCreditUsageInPeriod(period: Period) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const dateRange = PeriodToDateRange(period);
    const executionPhases = await prisma.executionPhase.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED],
            },
        },
    });

    const dateformat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    }).map((date) => format(date, dateformat)).reduce((acc, date) => {
        acc[date] = {
            success: 0,
            failed: 0,
        };
        return acc;
    }, {} as any);

    executionPhases.forEach((phase) => {
        const date = format(phase.startedAt!, dateformat);
        if (phase.status === COMPLETED) {
            stats[date].success += phase.creditsConsumed || 0;
        }
        else if (phase.status === FAILED) {
            stats[date].failed += phase.creditsConsumed || 0;
        }

    });

    const result = Object.entries(stats).map(([date, infos]) => ({
        date,
        ...infos,
    }));


    return result;
}