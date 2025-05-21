"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule({ id }: { id: string }) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        await prisma.workflow.update({
            where: { id, userId },
            data: {
                cron: null,
                nextRunAt: null,
            }
        })
    } catch (error: any) {
        console.error("Error removing workflow schedule:", error.message);
        throw new Error("Failed to remove workflow schedule");
    }

    revalidatePath("/workflows");
}