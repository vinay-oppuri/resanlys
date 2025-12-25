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
import { Card, CardContent } from "@workspace/ui/components/card"
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

    // const onSocial = (provider: 'github' | 'google') => {
    //     setError(null)
    //     setPending(true)

    //     signIn.social({
    //         provider: provider,
    //         callbackURL: '/dashboard'
    //     }, {
    //         onSuccess: () => {
    //             setPending(false)
    //         },
    //         onError: ({ error }) => {
    //             setError(error.message)
    //             setPending(false)
    //         }
    //     })
    // }

    return (
        <div className="flex min-h-150 w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 mx-auto">
            {/* Form Side */}
            <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8 lg:p-16 relative z-10 bg-white dark:bg-zinc-900">
                <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                            Welcome back
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
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
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="elon@example.com"
                                                className="h-11 bg-gray-50/50 dark:bg-zinc-800/50 dark:border-zinc-700"
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
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="h-11 bg-gray-50/50 dark:bg-zinc-800/50 dark:border-zinc-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!!error && (
                                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/20">
                                    <OctagonAlertIcon className="h-4 w-4" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}

                            <Button
                                disabled={pending}
                                type="submit"
                                className="h-11 w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-medium"
                            >
                                {pending ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a>
                </p>
            </div>

            {/* Visual Side */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-zinc-900 text-white md:flex">
                <div className="absolute inset-0 bg-linear-to-br from-violet-600 via-indigo-600 to-blue-600 opacity-90" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Abstract Shapes */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-400 opacity-20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center gap-6 p-10 text-center">
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/20 shadow-2xl">
                        <Image src="/logo.svg" alt="Logo" width={80} height={80} className="drop-shadow-lg" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                            Meet.AI
                        </h2>
                        <p className="text-indigo-100 text-lg">
                            The intelligent platform for your Resume Analysis needs.
                        </p>
                    </div>
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