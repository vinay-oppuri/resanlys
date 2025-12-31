"use client"

import ErrorState from "@/components/states/error-state"
import LoadingState from "@/components/states/loading-state"
import { ResumeEnhance } from "@/modules/dashboard/components/resume-enhance"
import { ResumeList } from "@/modules/dashboard/components/resume-list"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@workspace/trpc/client"

export const ResumesPageView = () => {
    const trpc = useTRPC()

    const { data: resumesData, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions())
    const resumes = resumesData?.getResumes || []

    return (
        <div className="max-w-7xl bg-background/50 mx-auto p-4 md:p-8 pb-20 space-y-10">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Resumes
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
                    View and manage your uploaded resumes below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="rounded-xl md:border border-border/40 bg-card/30 backdrop-blur-sm md:p-6 shadow-sm">
                        <ResumeList resumes={resumes} isLoading={isLoading} />
                    </div>
                </div>
                <div className="lg:col-span-4 lg:sticky lg:top-8">
                    <ResumeEnhance resumes={resumes} />
                </div>
            </div>
        </div>
    )

}

export const ResumesPageErrorStata = () => {
    return (
        <ErrorState
            title="Something went wrong"
            message="Please try again later"
        />
    )
}

export const ResumesPageLoadingState = () => {
    return (
        <LoadingState
            message="Please wait while we load your resumes"
        />
    )
}