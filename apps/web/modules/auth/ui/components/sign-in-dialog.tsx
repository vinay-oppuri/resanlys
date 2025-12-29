"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { NeonButton } from "@workspace/ui/components/ui/neon-button"
import { Button } from "@workspace/ui/components/button"
import { ChevronRight, Loader2 } from "lucide-react"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { useState } from "react"
import { signIn, useSession } from "@workspace/auth/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import LoaderOne from "@workspace/ui/components/ui/loader-one"

interface SignInDialogProps {
    title: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

const SignInDialog = ({
    title,
    open,
    onOpenChange,
    className,
}: SignInDialogProps) => {
    const { data: session } = useSession()
    const router = useRouter()

    const [providerLoading, setProviderLoading] = useState<"google" | "github" | null>(null)
    const [redirecting, setRedirecting] = useState(false)

    const handleMainClick = () => {
        if (session) {
            setRedirecting(true)
            router.push("/dashboard")
            return
        }
        onOpenChange?.(true)
    }

    const onSocial = async (provider: "google" | "github") => {
        setProviderLoading(provider)
        await signIn.social({
            provider,
            callbackURL: "/dashboard",
        })
    }

    if (redirecting) {
        return <div className="w-32 md:mr-4"><LoaderOne /></div>
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <NeonButton
                    size="lg"
                    onClick={handleMainClick}
                    className={cn(
                        "rounded-full text-sm md:text-base text-foreground/90 font-serif flex items-center gap-2 font-medium cursor-pointer shadow-lg shadow-indigo-500/20",
                        className
                    )}
                >
                    {title}
                    <ChevronRight className="hidden md:flex w-4 h-4 animate-pulse" />
                </NeonButton>
            </DialogTrigger>

            <DialogContent className="max-w-80 p-0 py-4 bg-background/80 backdrop-blur-md">
                <div className="p-6 space-y-6">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold">
                            Welcome back
                        </DialogTitle>
                        <DialogDescription>
                            Sign in to access your dashboard
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <Button
                            variant="outline"
                            className="h-12 rounded-full"
                            onClick={() => onSocial("google")}
                            disabled={!!providerLoading}
                        >
                            {providerLoading === "google" ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <FaGoogle className="mr-2 h-5 w-5" />
                            )}
                            Continue with Google
                        </Button>

                        <Button
                            variant="outline"
                            className="h-12 rounded-full"
                            onClick={() => onSocial("github")}
                            disabled={!!providerLoading}
                        >
                            {providerLoading === "github" ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <FaGithub className="mr-2 h-5 w-5" />
                            )}
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-blue-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog