"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import LoaderOne from "@workspace/ui/components/ui/loader-one"
import { useTRPC } from "@workspace/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"


interface ResumeEnhanceProps {
    resumes: any[]
    selectedResumeId?: string
    onResumeSelect?: (id: string) => void
}

export interface EnhancedData {
    missing_keywords: string[];
    weak_or_underrepresented_skills: (string | { skill: string; suggestion: string })[];
    bullet_point_improvements: { original: string; improved: string }[];
    section_level_suggestions: string[];
    overall_match_feedback: string;
}

export const ResumeEnhance = ({ resumes, selectedResumeId: propSelectedId, onResumeSelect }: ResumeEnhanceProps) => {
    const trpc = useTRPC()
    const [isMounted, setIsMounted] = useState(false)
    const [jobTitle, setJobTitle] = useState<string>("")
    const [jobDescription, setJobDescription] = useState<string>("")
    const [internalSelectedId, setInternalSelectedId] = useState<string>("")
    const [viewAnalysisOpen, setViewAnalysisOpen] = useState(false)

    // Use prop if available, otherwise internal state
    const selectedResumeId = propSelectedId !== undefined ? propSelectedId : internalSelectedId

    const handleResumeSelect = (id: string) => {
        setInternalSelectedId(id)
        if (onResumeSelect) {
            onResumeSelect(id)
        }
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const uploadJob = useMutation(trpc.jobs.create.mutationOptions({
        onSuccess: () => {
            toast.success("Job uploaded successfully")
            // window.location.reload() // Removed reload as it might interfere with analysis flow
        },
        onError: () => {
            toast.error("Failed to upload job")
        }
    }))

    // Query for analysis data when dialog is open
    const { data: analysisData, isLoading: isLoadingAnalysis, refetch: refetchAnalysis } = useQuery({
        ...trpc.jobs.getEnhanceSuggestions.queryOptions({
            resumeId: selectedResumeId || ""
        }),
        enabled: viewAnalysisOpen && !!selectedResumeId
    })

    const handleSaveJob = async () => {
        if (!selectedResumeId || !jobTitle || !jobDescription) {
            toast.error("Please fill all fields and select a resume")
            return
        }

        await uploadJob.mutateAsync({
            resumeId: selectedResumeId,
            title: jobTitle,
            description: jobDescription
        })
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl space-y-8 animate-in slide-in-from-right-8 duration-700 ease-out ring-1 ring-white/10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Job Details</h2>
                <p className="text-muted-foreground text-sm font-medium">Paste the job description you are targeting to get tailored insights.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Job Title</label>
                    <Input
                        placeholder="e.g. Senior Frontend Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="h-12 px-4 bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 focus:scale-[1.005] focus:ring-4 focus:ring-primary/10 rounded-xl"
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Job Description</label>
                    <Textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        className="min-h-[200px] resize-y p-4 bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 focus:scale-[1.005] focus:ring-4 focus:ring-primary/10 rounded-xl leading-relaxed"
                    />
                </div>

                <Button
                    onClick={handleSaveJob}
                    disabled={!selectedResumeId || !jobTitle || !jobDescription || uploadJob.isPending}
                    className="w-full h-12 gap-2 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
                    variant="default"
                >
                    {uploadJob.isPending ? (
                        <>
                            <LoaderOne />
                            Analyzing Context...
                        </>
                    ) : (
                        "Save Job Context"
                    )}
                </Button>
            </div>
        </div>
    )
}