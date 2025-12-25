import { SignUpView, SignUpErrorState, SignUpLoadingState } from "@/modules/auth/ui/views/sign-up-view"
import { HydrationBoundary } from "@tanstack/react-query"
import { auth } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session) {
        return redirect("/dashboard")
    }

    return (
        <HydrationBoundary state={null}>
            <Suspense fallback={<SignUpLoadingState />}>
                <ErrorBoundary fallback={<SignUpErrorState />}>
                    <SignUpView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}
export default Page