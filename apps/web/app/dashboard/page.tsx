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
            // TODO: upload file to storage and get url
            const fileUrl = "https://example.com/resume.pdf"
            await uploadResume.mutateAsync({
                fileUrl,
            })
        } catch (error) {
            console.log(error)
            alert("Something went wrong")
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