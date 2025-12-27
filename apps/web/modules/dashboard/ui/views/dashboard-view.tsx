"use client"

import { useTRPC } from "@workspace/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { DashboardStats } from "../components/dashboard-stats"
import { ResumeUpload } from "../components/resume-upload"
import { ResumeEnhance } from "../components/resume-enhance"
import { ResumeList } from "../components/resume-list"

export const DashboardView = () => {
    const trpc = useTRPC()

    const { data: resumesData, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions())
    const resumes = resumesData?.getResumes || []

    // Calculated Stats
    const { data: pendingResumesData } = useQuery(trpc.resume.getPendingResumes.queryOptions())
    const { data: analyzedResumesData } = useQuery(trpc.resume.getAnalyzedResumes.queryOptions())

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <DashboardStats
                totalResumes={resumes.length}
                analyzedCount={analyzedResumesData?.getAnalyzedResumes?.length || 0}
                pendingCount={pendingResumesData?.getPendingResumes?.length || 0}
                isLoading={isLoading}
            />

            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResumeUpload />
                    <ResumeEnhance resumes={resumes} />
                </div>

                <ResumeList resumes={resumes} isLoading={isLoading} />
            </div>
        </div>
    )
}