"use client"

import { Button } from "@workspace/ui/components/button"
import { useTRPC } from "@workspace/trpc/client"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Upload, FileText, CheckCircle, Clock, Plus, Loader2 } from "lucide-react"
import ErrorState from "@/components/states/error-state"
import LoadingState from "@/components/states/loading-state"

export const DashboardView = () => {
    const trpc = useTRPC()
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const { data: resumesData, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions())
    const resumes = resumesData?.getResumes || []

    // Upload mutation
    const uploadResume = useMutation(trpc.resume.create.mutationOptions({
        onSuccess: () => {
            alert("Resume uploaded successfully! It is now being analyzed.")
            window.location.reload()
        },
        onError: (err) => {
            alert("Upload failed: " + err.message)
        }
    }))

    const handleUpload = async () => {
        if (!file) return alert("Please select a file")
        setUploading(true)

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });

            if (!uploadRes.ok) throw new Error("Failed to upload file");

            const { url: fileUrl } = await uploadRes.json();

            const fileTypeMap: Record<string, "pdf" | "doc" | "docx"> = {
                "application/pdf": "pdf",
                "application/msword": "doc",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
            };

            await uploadResume.mutateAsync({
                fileUrl,
                fileName: file.name,
                fileType: fileTypeMap[file.type] ?? "pdf",
                fileSize: file.size,
            })
        } catch (error) {
            console.error(error)
            alert("Something went wrong: " + (error instanceof Error ? error.message : "Unknown error"))
        } finally {
            setUploading(false)
            setFile(null)
        }
    }

    // Calculated Stats
    const { data: pendingResumesData } = useQuery(trpc.resume.getPendingResumes.queryOptions())
    const { data: analyzedResumesData } = useQuery(trpc.resume.getAnalyzedResumes.queryOptions())

    const stats = [
        {
            label: "Total Resumes",
            value: resumes.length.toString(),
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Analyzed",
            value: (analyzedResumesData?.getAnalyzedResumes?.length || 0).toString(),
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            label: "Pending Processing",
            value: (pendingResumesData?.getPendingResumes?.length || 0).toString(),
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
    ]

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area: Upload */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-10 rounded-2xl bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-rose-500/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group hover:border-primary/40 transition-colors">

                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="z-10 bg-background/50 p-4 rounded-full backdrop-blur-sm">
                            <Upload className="size-10 text-primary" />
                        </div>

                        <div className="z-10 space-y-2 max-w-md">
                            <h2 className="text-2xl font-semibold text-foreground">Upload and Store Resume</h2>
                            <p className="text-muted-foreground">
                                Upload your PDF resume to safe storage. We will process it for future analysis.
                            </p>
                        </div>

                        <div className="z-10 flex flex-col items-center gap-3 w-full max-w-xs">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-foreground cursor-pointer w-full text-center"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            <Button size="lg" className="w-full font-semibold shadow-lg shadow-primary/20" onClick={handleUpload} disabled={!file || uploading}>
                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                {uploading ? "Uploading..." : "Save to Library"}
                            </Button>
                        </div>
                    </div>

                    {/* Recent Resumes List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-semibold">Saved Resumes</h3>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center p-8 text-muted-foreground">Loading resumes...</div>
                        ) : resumes?.length === 0 ? (
                            <div className="text-center p-8 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground">
                                No resumes found. Upload one to get started.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {resumes?.map((resume: any) => (
                                    <div key={resume.id} className="group p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/20 backdrop-blur-sm transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                                <FileText className="size-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{resume.fileName}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="size-3" />
                                                    <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{(resume.fileSize ? resume.fileSize / 1024 : 0).toFixed(0)} KB</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {resume.status === 'completed' && (
                                                <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20 flex items-center gap-1.5">
                                                    <CheckCircle className="size-3" /> Ready
                                                </span>
                                            )}
                                            {resume.status === 'processing' && (
                                                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20 flex items-center gap-1.5">
                                                    <Loader2 className="size-3 animate-spin" /> Processing
                                                </span>
                                            )}
                                            {resume.status === 'uploaded' && (
                                                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                                                    Uploaded
                                                </span>
                                            )}

                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Tip */}
                <div className="space-y-6">
                    <div className="bg-linear-to-b from-primary/5 to-transparent rounded-2xl p-6 border border-primary/10">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            Status Updates
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            When you upload a resume, it is processed in the background. The status will update from 'Uploaded' to 'Processing' to 'Ready'.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const DasboardLoadingState = () => {
    <LoadingState
        message="Please wait while we load your data"
    />
}

export const DasboardErrorState = () => {
    <ErrorState
        title="Something went wrong"
        message="Please try again later"
    />
}