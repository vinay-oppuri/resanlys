"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { useTRPC } from "@workspace/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"


interface ResumeEnhanceProps {
    resumes: any[] // Using any[] for now as per original code implicit type, but could be typed better if we have the type
}

export const ResumeEnhance = ({ resumes }: ResumeEnhanceProps) => {
    const trpc = useTRPC()
    const [jobTitle, setJobTitle] = useState<string>("")
    const [jobDescription, setJobDescription] = useState<string>("")
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")

    const uploadJob = useMutation(trpc.jobs.create.mutationOptions({
        onSuccess: () => {
            toast("Job uploaded successfully")
            window.location.reload()
        },
        onError: () => {
            toast("Failed to upload job")
        }
    }))

    const onSubmit = async () => {
        if(!selectedResumeId || !jobTitle || !jobDescription) {
            toast("Please fill all fields")
            return
        }

        await uploadJob.mutateAsync({
            resumeId: selectedResumeId,
            title: jobTitle,
            description: jobDescription
        })
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl font-semibold text-foreground">Enhance Resume</h1>
                <p className="text-muted-foreground">Select a resume and job description to enhance</p>
            </div>
            <Select onValueChange={setSelectedResumeId}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Resume" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {resumes.map((resume) => (
                            <SelectItem key={resume.id} value={resume.id}>
                                {resume.fileName}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
            />
            <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description"
                className="h-40"
            />
            <Button
                onClick={onSubmit}
                disabled={!selectedResumeId || !jobTitle || !jobDescription}
            >
                Enhance
            </Button>
        </div>
    )
}
