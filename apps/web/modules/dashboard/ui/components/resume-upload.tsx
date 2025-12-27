"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Upload, Plus, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
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

            await uploadResume.mutateAsync({
                fileName: fileName,
                fileType: fileType as "pdf",
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
        <div className="p-10 rounded-2xl bg-background border-2 border-primary/20 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group hover:border-primary/40 transition-colors">
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
                    accept=".pdf"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-foreground cursor-pointer w-full text-center"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <Button size="lg" className="w-full font-semibold shadow-lg shadow-primary/20" onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    {uploading ? "Uploading..." : "Save to Library"}
                </Button>
            </div>
        </div>
    )
}
