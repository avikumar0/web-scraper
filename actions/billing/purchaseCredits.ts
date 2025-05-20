"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function PurchaseCredits(packId:PackId){
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const selectedPack = getCreditsPack(packId);
    if (!selectedPack) {
        throw new Error("Invalid pack selected");
    }
    const priceId = selectedPack?.priceId;

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: getAppUrl("/billing"),
        cancel_url: getAppUrl("/billing"),
        billing_address_collection:"required",
        metadata:{
            userId,
            packId,
        },
        line_items: [
            {
                quantity: 1,
                price: selectedPack.priceId,
            },
        ],
    });

    if(!session.url) {
        throw new Error("Unable to create checkout session");
    }

    redirect(session.url);

}