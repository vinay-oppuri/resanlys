"use client"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@workspace/trpc/client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useState } from "react"

const Page = () => {
    const trpc = useTRPC()
    const [file, setFile] = useState<File | null>(null)
    const uploadResume = useMutation(trpc.resume.create.mutationOptions({
        onSuccess: () => {
            alert("Resume uploaded successfully")
        }
    }))

    const handleUpload = async () => {
        if (!file) return alert("Please select a file")

        try {
            // Upload file to local storage first
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload file");
            }

            const { url: fileUrl } = await uploadRes.json();

            // Map MIME type to simple extension to match backend Zod schema
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
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1>Upload Resume</h1>
            <Input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button onClick={handleUpload} disabled={!file}>
                Upload
            </Button>
        </div>
    )
}
export default Page