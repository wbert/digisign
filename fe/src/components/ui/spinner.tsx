import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-screen items-center justify-center", className)}>
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  );
}
