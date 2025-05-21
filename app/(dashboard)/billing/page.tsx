import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits"
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ReactCountWrapper from "@/components/ReactCountWrapper";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "./_components/CreditUsageChart";
import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import InvoiceBtn from "./_components/InvoiceBtn";


export default function BillingPage() {
    return (
        <div className="mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Billing</h1>
            <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
                <BalanceCard />
            </Suspense>
            <CreditsPurchase />
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <CreditUsageCard />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <TransactionHistoryCard />
            </Suspense>

        </div>
    )
}

async function BalanceCard() {
    const userBalance = await GetAvailableCredits();
    return (
        <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/10 to-background border-primary/20 flex shadow-lg justify-between flex-col">
            <CardContent className="p-6 relative items-center">
                <div className="flex justify-between items-center ">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Available Credits</h3>
                        <p className="text-4xl font-bold text-primary">
                            <ReactCountWrapper value={userBalance} />
                        </p>
                    </div>
                </div>
                <CoinsIcon size={140} className="text-primary opacity-20 absolute bottom-0 right-0" />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                When Your Credit reaches zero you will not be able to run any workflows.
            </CardFooter>
        </Card>
    );
}

async function CreditUsageCard() {
    const period: Period = {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    };
    const data = await GetCreditUsageInPeriod(period);
    return (
        <CreditUsageChart
            data={data}
            title="Credit Usage"
            description="This month credit usage"
        />
    )
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);

}

async function TransactionHistoryCard() {

    const purchases = await GetUserPurchaseHistory();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <ArrowLeftRightIcon className="text-primary h-6 w-6" />
                    Transaction History
                </CardTitle>
                <CardDescription>
                    View your transaction history and download invoices
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {purchases.length === 0 && (
                    <p className="text-muted-foreground">No transactions found</p>
                )}
                {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                        <div>
                            <p className="font-medium">{formatDate(purchase.date)}</p>
                            <p className="text-sm text-muted-foreground">{purchase.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">{formatAmount(purchase.amount,purchase.currency)} </p>
                            <InvoiceBtn id={purchase.id} />
                        </div>
                    </div>
                ))}

            </CardContent>
        </Card>
    )
}

function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount / 100);
}