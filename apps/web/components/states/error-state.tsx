import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
    compact?: boolean;
}

const ErrorState = ({
    title = "Something went wrong",
    message = "We encountered an error while processing your request.",
    onRetry,
    className,
    compact = false
}: ErrorStateProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10",
                compact ? "p-4 gap-2" : "gap-4 min-h-[300px]",
                className
            )}
        >
            <div className={cn(
                "rounded-full bg-red-100 p-3 dark:bg-red-900/20",
                compact && "p-2"
            )}>
                <AlertTriangle className={cn(
                    "text-red-600 dark:text-red-400",
                    compact ? "h-5 w-5" : "h-8 w-8"
                )} />
            </div>

            <div className="space-y-1">
                <h3 className={cn(
                    "font-semibold text-red-900 dark:text-red-300",
                    compact ? "text-sm" : "text-lg"
                )}>
                    {title}
                </h3>
                <p className={cn(
                    "text-muted-foreground max-w-sm mx-auto",
                    compact ? "text-xs" : "text-sm"
                )}>
                    {message}
                </p>
            </div>

            {onRetry && (
                <Button
                    variant="outline"
                    onClick={onRetry}
                    className="mt-2 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    size={compact ? "sm" : "default"}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    )
}

export default ErrorState
