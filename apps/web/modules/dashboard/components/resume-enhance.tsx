"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import LoaderOne from "@workspace/ui/components/ui/loader-one"
import { useTRPC } from "@workspace/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components"
import { set } from "zod"


interface ResumeEnhanceProps {
    resumes: any[]
}

export interface EnhancedData {
    missing_keywords: string[];
    weak_or_underrepresented_skills: (string | { skill: string; suggestion: string })[];
    bullet_point_improvements: { original: string; improved: string }[];
    section_level_suggestions: string[];
    overall_match_feedback: string;
}

export const ResumeEnhance = ({ resumes }: ResumeEnhanceProps) => {
    const trpc = useTRPC()
    const [isMounted, setIsMounted] = useState(false)
    const [jobTitle, setJobTitle] = useState<string>("")
    const [jobDescription, setJobDescription] = useState<string>("")
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const uploadJob = useMutation(trpc.jobs.create.mutationOptions({
        onSuccess: () => {
            toast.success("Job details uploaded successfully")
            // window.location.reload() // Removed reload as it might interfere with analysis flow
        },
        onError: () => {
            toast.error("Failed to upload job")
        }
    }))

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
        setJobTitle("")
        setJobDescription("")
        setSelectedResumeId("")
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-4 md:p-6 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl space-y-8 animate-in slide-in-from-right-8 duration-700 ease-out ring-1 ring-white/10">
            <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Job Details</h2>
                <p className="text-muted-foreground text-sm font-medium">Paste the job description you are targeting to get tailored insights.</p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Select Resume</label>
                    <Select onValueChange={(value) => setSelectedResumeId(value)}>
                        <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder=".pdf, .doc, .docx" />
                        </SelectTrigger>
                        <SelectContent>
                            {resumes.map((resume) => (
                                <SelectItem key={resume.id} value={resume.id}>
                                    {resume.fileName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Job Title</label>
                    <Input
                        placeholder="e.g. Senior Frontend Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="h-10 px-4 text-sm md:text-md bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 focus:scale-[1.005] focus:ring-4 focus:ring-primary/10 rounded-md"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Job Description</label>
                    <Textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        className="min-h-31 resize-y px-4 text-sm md:text-md bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 focus:scale-[1.005] focus:ring-4 focus:ring-primary/10 rounded-md leading-relaxed"
                    />
                </div>

                <Button
                    onClick={handleSaveJob}
                    disabled={!selectedResumeId || !jobTitle || !jobDescription || uploadJob.isPending}
                    className="w-full h-10 gap-2 text-sm md:text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
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