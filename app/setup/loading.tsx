import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";

export default function loading(){
    return(
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Logo fontSize="text-3xl" iconSize={50} />
            <Separator className="max-w-xs" />
            <div className="flex justify-center items-center gap-2">
                <Loader2Icon size={16} className="animate-spin stroke-primary" />
                <p className="text-muted-foreground">Setting Up Your Account</p>
            </div>
        </div>
    )
}