"use client"

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { OctagonAlertIcon } from "lucide-react"
import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from "next/link"
import Image from "next/image"

import { useState } from "react"
import { signIn } from "@workspace/auth/client"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Alert, AlertTitle } from "@workspace/ui/components/alert"
import LoadingState from "@/components/states/loading-state"
import ErrorState from "@/components/states/error-state"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' })
})

export const SignInView = () => {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setPending(true)

        signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/dashboard'
        }, {
            onSuccess: () => {
                setPending(false)
            },
            onError: ({ error }) => {
                setError(error.message)
                setPending(false)
            }
        })
    }

    const onSocial = (provider: 'github' | 'google') => {
        setError(null)
        setPending(true)

        signIn.social({
            provider: provider,
            callbackURL: '/dashboard'
        }, {
            onSuccess: () => {
                setPending(false)
            },
            onError: ({ error }) => {
                setError(error.message)
                setPending(false)
            }
        })
    }

    return (
        <div className="flex min-h-150 w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border/50 mx-auto">
            {/* Form Side */}
            <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-12 relative z-10 bg-card">
                <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="elon@example.com"
                                                className="h-10 bg-muted/30 border-input focus-visible:ring-ring"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="h-10 bg-muted/30 border-input focus-visible:ring-ring"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!!error && (
                                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                                    <OctagonAlertIcon className="h-4 w-4" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}

                            <Button
                                disabled={pending}
                                type="submit"
                                className="h-10 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-indigo-500/20 text-white font-medium border-none"
                            >
                                {pending ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            disabled={pending}
                            onClick={() => onSocial('google')}
                            className="h-10 bg-card hover:bg-muted border-border text-foreground"
                        >
                            <FaGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={pending}
                            onClick={() => onSocial('github')}
                            className="h-10 bg-card hover:bg-muted border-border text-foreground"
                        >
                            <FaGithub className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground/60">
                    By continuing, you agree to our{' '}
                    <a href="#" className="underline hover:text-foreground">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
                </p>
            </div>

            {/* Visual Side */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-background md:flex border-l border-border">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-transparent to-rose-500/20 blur-3xl opacity-50" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Abstract Shapes - Matching HeroGeometric */}
                <div className="absolute top-[20%] left-[-10%] h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
                <div className="absolute bottom-[20%] right-[-10%] h-64 w-64 rounded-full bg-rose-500/30 blur-3xl" />
                <div className="absolute top-[60%] right-[10%] h-32 w-32 rounded-full bg-violet-500/30 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center gap-8 p-10 text-center">
                    <Link href="/">
                        <Image src="/logo.svg" alt="Logo" width={300} height={300} className="drop-shadow-lg" />
                    </Link>
                    <p className="text-muted-foreground text-lg">
                        The intelligent platform for your Resume Analysis needs.
                    </p>
                </div>
            </div>
        </div>
    )
}


export const SignInLoadingState = () => {
    return (
        <LoadingState
            message="Loading..."
            fullScreen
            className="fixed inset-0 z-50"
        />
    )
}


export const SignInErrorState = () => {
    return (
        <ErrorState
            title="Something went wrong"
            message="We encountered an error while processing your request."
        />
    )
}