"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetAvailableCredits() {
    const {userId} = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const balance = await prisma.userBalance.findUnique({
        where: {
            userId: userId,
        },
    });
    if (!balance) {
       return -1;
    }
    return balance.credits;

}