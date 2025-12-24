"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon } from "lucide-react"
// import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from "next/link"
import Image from "next/image"

import { useState } from "react"
import { signUp } from "@workspace/auth/client"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Alert, AlertTitle } from "@workspace/ui/components/alert"

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: "Password is required" })
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    })

const Page = () => {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setPending(true)

        signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: '/dashboard'
        }, {
            onSuccess: () => {
                setPending(false)

            },
            onError: ({ error }) => {
                setError(error.message)
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
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="text-center">
                                    <h1 className="text-2xl font-semibold">Let&apos;s get started</h1>
                                    <p className="text-muted-foreground">Create your account</p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Elon Musk" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="elon@example.com" {...field} />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <Button disabled={pending} type="submit" className="w-full">
                                    Sign Up
                                </Button>

                                <div className="relative text-center text-sm">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <span className="relative z-10 px-2 bg-card text-muted-foreground">OR</span>
                                </div>

                                {/* <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => onSocial("google")}
                                    >
                                        <FaGoogle className="text-lg" />
                                        <span className="hidden sm:inline">Google</span>
                                    </Button>
                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => onSocial("github")}
                                    >
                                        <FaGithub className="text-lg" />
                                        <span className="hidden sm:inline">GitHub</span>
                                    </Button>
                                </div> */}

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="underline text-blue-600">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className="relative hidden md:flex flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar gap-y-4">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={1080}
                            height={1080}
                            className="h-32 w-32"
                        />
                        <p className="text-2xl font-semibold text-white">Resanlys</p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:hover:text-primary">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>
        </div>
    )

}
export default Page