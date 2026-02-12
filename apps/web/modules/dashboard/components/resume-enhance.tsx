"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import LoaderOne from "@workspace/ui/components/ui/loader-one"
import { useTRPC } from "@workspace/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components"
import { Upload } from "lucide-react"


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
    const [jobDescription, setJobDescription] = useState<string>("")
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")
    const [uploadedJobFileName, setUploadedJobFileName] = useState<string>("")
    const [isExtractingJobDescription, setIsExtractingJobDescription] = useState(false)

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

    const handleJobDescriptionFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const normalizedFileType = normalizeFileType(file.type, file.name)
        if (!normalizedFileType) {
            toast.error("Unsupported file type. Please upload a PDF, DOC, or DOCX.")
            event.target.value = ""
            return
        }

        setIsExtractingJobDescription(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const uploadRes = await fetch("/api/extract-text", { method: "POST", body: formData })
            if (!uploadRes.ok) {
                const errData = await uploadRes.json().catch(() => ({}))
                throw new Error(errData?.message || "Failed to extract text")
            }

            const { text } = await uploadRes.json()
            if (typeof text !== "string" || !text.trim()) {
                throw new Error("No readable text found in the uploaded file")
            }

            setJobDescription(text)
            setUploadedJobFileName(file.name)
            toast.success("Job description extracted successfully")
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Failed to extract text")
        } finally {
            setIsExtractingJobDescription(false)
            event.target.value = ""
        }
    }

    const handleSaveJob = async () => {
        const trimmedJobDescription = jobDescription.trim()
        if (!selectedResumeId || !trimmedJobDescription) {
            toast.error("Please add a job description and select a resume")
            return
        }

        await uploadJob.mutateAsync({
            resumeId: selectedResumeId,
            description: trimmedJobDescription
        })
        setJobDescription("")
        setSelectedResumeId("")
        setUploadedJobFileName("")
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-4 md:p-6 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl space-y-8 animate-in slide-in-from-right-8 duration-700 ease-out ring-1 ring-white/10">
            <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Job Details</h2>
                <p className="text-muted-foreground text-sm font-medium">Upload or paste the job description you are targeting to get tailored insights.</p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 ml-1">Select Resume</label>
                    <Select value={selectedResumeId} onValueChange={(value) => setSelectedResumeId(value)}>
                        <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select a resume" />
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
                <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80 ml-1">Upload Job Description (Optional)</label>
                        <div className="flex flex-row items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/50 text-muted-foreground p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 truncate text-xs md:text-sm font-medium px-2">
                                {isExtractingJobDescription
                                    ? "Extracting text from file..."
                                    : uploadedJobFileName || "No file selected"}
                            </div>
                            <div className="shrink-0">
                                <label
                                    htmlFor="job-description-upload"
                                    className={`inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 text-xs md:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${uploadJob.isPending || isExtractingJobDescription ? "pointer-events-none opacity-50" : ""}`}
                                    aria-label="Upload job description file"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isExtractingJobDescription ? "Extracting..." : "Choose File"}
                                </label>
                                <input
                                    id="job-description-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleJobDescriptionFileChange}
                                    disabled={uploadJob.isPending || isExtractingJobDescription}
                                    className="sr-only"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80 ml-1">Job Description</label>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here or edit uploaded content..."
                            className="min-h-31 resize-y px-4 text-sm md:text-md bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 focus:scale-[1.005] focus:ring-4 focus:ring-primary/10 rounded-md leading-relaxed"
                        />
                    </div>
                </div>


                <Button
                    onClick={handleSaveJob}
                    disabled={!selectedResumeId || !jobDescription.trim() || uploadJob.isPending || isExtractingJobDescription}
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

const normalizeFileType = (mimeType?: string, fileName?: string): "pdf" | "doc" | "docx" | null => {
    switch (mimeType) {
        case "application/pdf":
            return "pdf"
        case "application/msword":
            return "doc"
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx"
        default:
            break
    }

    const name = (fileName ?? "").toLowerCase()
    const ext = name.includes(".") ? name.split(".").pop() : ""
    if (ext === "pdf" || ext === "doc" || ext === "docx") {
        return ext
    }

    return null
}
