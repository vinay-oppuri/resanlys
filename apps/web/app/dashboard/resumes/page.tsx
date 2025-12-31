import { ResumesPageErrorStata, ResumesPageLoadingState, ResumesPageView } from "@/modules/resumes/views/resumes-page-view"
import { HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const Page = () => {

    return (
        <HydrationBoundary state={null}>
            <Suspense fallback={<ResumesPageLoadingState />}>
                <ErrorBoundary fallback={<ResumesPageErrorStata />}>
                    <ResumesPageView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}
export default Page