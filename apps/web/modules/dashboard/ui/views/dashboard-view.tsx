"use client"

import { useState } from "react"
import { useTRPC } from "@workspace/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { DashboardStats } from "../components/dashboard-stats"
import { ResumeUpload } from "../components/resume-upload"
import { ResumeEnhance } from "../components/resume-enhance"
import { ResumeList } from "../components/resume-list"

export const DashboardView = () => {
    const trpc = useTRPC()
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")

    const { data: resumesData, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions())
    const resumes = resumesData?.getResumes || []

    // Calculated Stats
    const { data: pendingResumesData } = useQuery(trpc.resume.getPendingResumes.queryOptions())
    const { data: analyzedResumesData } = useQuery(trpc.resume.getAnalyzedResumes.queryOptions())

    return (
        <div className="min-h-screen w-full bg-background/50">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-5 md:space-y-10">

                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-lg">
                        Manage your resumes and get AI-powered insights.
                    </p>
                </div>

                {/* Stats Section */}
                <DashboardStats
                    totalResumes={resumes.length}
                    analyzedCount={analyzedResumesData?.getAnalyzedResumes?.length || 0}
                    pendingCount={pendingResumesData?.getPendingResumes?.length || 0}
                    isLoading={isLoading}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Upload & Latest List */}
                    <div className="lg:col-span-7 space-y-8">
                        <ResumeUpload />
                        <ResumeList
                            resumes={resumes}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Right Column: Job Context & Actions */}
                    <div className="lg:col-span-5 sticky top-8">
                        <ResumeEnhance
                            resumes={resumes}
                            selectedResumeId={selectedResumeId}
                            onResumeSelect={setSelectedResumeId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}