import LoaderOne from "@workspace/ui/components/ui/loader-one"
import { cn } from "@workspace/ui/lib/utils"

interface LoadingStateProps {
    className?: string;
    message?: string;
    fullScreen?: boolean;
}

const LoadingState = ({ className, message = "Loading...", fullScreen = false }: LoadingStateProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 p-8",
                fullScreen ? "fixed inset-0 min-h-screen w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50" : "w-full h-full min-h-[200px]",
                className
            )}
        >
            <LoaderOne />
            {message && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    )
}

export default LoadingState
