import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export async function HandleCheckoutSessionCompleted(event:Stripe.Checkout.Session){
    if(!event.metadata){
        throw new Error("No metadata found in event");
    }
    const { userId, packId } = event.metadata;
    if(!userId ){
        throw new Error("No userId found in metadata");
    }
    if(!packId ){
        throw new Error("No packId found in metadata");
    }
    const purchasedPack = getCreditsPack(packId as PackId);
    if(!purchasedPack){
        throw new Error("No purchased pack found");
    }

    await prisma.userBalance.upsert({
        where:{userId},
        create:{
            userId,
            credits: purchasedPack.credits,
        },
        update:{
            credits:{
                increment: purchasedPack.credits,
            },
        },
    });

    await prisma.userPurchase.create({
        data:{
            userId,
            stripeId: event.id,
            description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
            amount: event.amount_total!,
            currency: event.currency!,
        }
    })
}