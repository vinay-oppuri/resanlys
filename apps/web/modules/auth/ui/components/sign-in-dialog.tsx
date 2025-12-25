"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { NeonButton } from "@workspace/ui/components/ui/neon-button"
import { Button } from "@workspace/ui/components/button"
import { ChevronRight, Mail, Loader2 } from "lucide-react"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { useState } from "react"
import { signIn } from "@workspace/auth/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SignInDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const SignInDialog = ({ open, onOpenChange }: SignInDialogProps) => {
    const [pending, setPending] = useState<string | null>(null)
    const router = useRouter()

    const onSocial = async (provider: 'github' | 'google') => {
        setPending(provider)
        try {
            await signIn.social({
                provider: provider,
                callbackURL: '/dashboard'
            })
        } catch (error) {
            console.error("Social sign in error:", error)
        } finally {
            setTimeout(() => setPending(null), 1000)
        }
    }

    const handleEmailClick = () => {
        router.push("/sign-in")
        if (onOpenChange) onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <NeonButton
                    variant="default"
                    size="lg"
                    className="rounded-full h-14 px-8 flex items-center gap-2 text-lg font-medium cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                    Analyse Resume
                    <ChevronRight className="w-5 h-5" />
                </NeonButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-80 p-0 overflow-hidden bg-background/80 backdrop-blur-md">
                <div className="p-6 space-y-6">
                    <DialogHeader className="space-y-2 text-center">
                        <DialogTitle className="text-2xl font-bold tracking-tight mx-auto">Welcome back</DialogTitle>
                        <DialogDescription className="text-base mx-auto">
                            Sign in to access your dashboard
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <Button
                            variant="outline"
                            className="h-12 relative rounded-full"
                            onClick={() => onSocial('google')}
                            disabled={!!pending}
                        >
                            {pending === 'google' ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <FaGoogle className="mr-2 h-5 w-5" />
                            )}
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="h-12 relative rounded-full"
                            onClick={() => onSocial('github')}
                            disabled={!!pending}
                        >
                            {pending === 'github' ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <FaGithub className="mr-2 h-5 w-5" />
                            )}
                            Continue with GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background/80 px-2 text-muted-foreground">
                                OR
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Alredy have an account? {" "}
                        <Link href="/sign-in" className="text-blue-700 hover:text-blue-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog