"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Upload, Plus, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import TextType from "@workspace/ui/components/TextType"
import { toast } from "sonner"
import { useTRPC } from "@workspace/trpc/client"

export const ResumeUpload = () => {
    const trpc = useTRPC()
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // Upload mutation
    const uploadResume = useMutation(trpc.resume.create.mutationOptions({
        onSuccess: () => {
            toast("Resume uploaded successfully! It is now being analyzed.")
            window.location.reload()
        },
        onError: (err) => {
            toast("Upload failed: " + err.message)
        }
    }))

    const handleUpload = async () => {
        if (!file) return toast.error("Please select a file")
        setUploading(true)

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/extract-text", { method: "POST", body: formData });

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.message || "Failed to extract text");
            }

            const { text, fileName, fileType, fileSize } = await uploadRes.json();
            const normalizedFileType = normalizeFileType(fileType, fileName);

            if (!normalizedFileType) {
                throw new Error("Unsupported file type. Please upload a PDF, DOC, or DOCX.")
            }

            await uploadResume.mutateAsync({
                fileName: fileName,
                fileType: normalizedFileType,
                fileSize: fileSize,
                rawText: text
            })
        } catch (error) {
            console.error(error)
            alert("Something went wrong: " + (error instanceof Error ? error.message : "Unknown error"))
        } finally {
            setUploading(false)
            setFile(null)
        }
    }

    return (
        <div className="relative group">
            <div className={`
                relative flex flex-col items-center justify-center p-4 md:p-12 text-center
                border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out
                ${uploading
                    ? 'border-primary/50 bg-primary/5 cursor-wait'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                }
            `}>
                <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={uploading || !!file}
                />

                <div className={`
                    p-4 md:mb-4 rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110
                    ${uploading ? 'animate-pulse' : ''}
                `}>
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                    <div className="h-8 flex items-center justify-center">
                        <TextType
                            key={uploading ? 'uploading' : 'idle'}
                            text={uploading ? ["Uploading Resume..."] : ["Upload Resume", "Analyze with AI", "Get Instant Feedback"]}
                            loop={true}
                            cursorCharacter="|"
                            typingSpeed={50}
                            deletingSpeed={30}
                            pauseDuration={2000}
                            className="text-xl font-semibold tracking-tight"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {uploading
                            ? "Please wait while we process your file."
                            : "Click to upload your resume."
                        }
                    </p>
                </div>

                {file && !uploading && (
                    <div className="mt-3 md:mt-6 flex items-center justify-between min-w-75 z-100 gap-4 px-2 py-2 pl-4 bg-background rounded-full border shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-sm font-medium truncate max-w-50">{file.name}</span>
                        <Button size="sm" className="rounded-full px-4 ring-2 ring-primary/20" onClick={(e) => {
                            e.stopPropagation();
                            handleUpload();
                        }}>
                            Upload
                        </Button>
                    </div>
                )}
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
