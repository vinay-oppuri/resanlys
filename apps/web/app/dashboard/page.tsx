import { HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import LoadingState from "@/components/states/loading-state"
import ErrorState from "@/components/states/error-state"
import { DashboardView } from "@/modules/dashboard/views/dashboard-view"
import { auth } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return redirect("/sign-in")

    return (
        <HydrationBoundary state={null}>
            <Suspense fallback={<LoadingState />}>
                <ErrorBoundary fallback={<ErrorState />}>
                    <DashboardView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}
export default Page