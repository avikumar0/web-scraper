"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({ id, cron }: { id: string, cron: string }) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        // Changed from parser.parseExpression to CronExpressionParser.parse
        // Replaced 'utc: true' with 'tz: "UTC"' as per the breaking changes
        const interval = CronExpressionParser.parse(cron, { tz: "UTC" });
        
         await prisma.workflow.update({
            where: { id, userId },
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
            }
        })

    } catch (error: any) {
        console.error("Error parsing cron expression:", error.message);
        throw new Error("Invalid cron expression");
    }

    revalidatePath("/workflows");
}
