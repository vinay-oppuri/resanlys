import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@workspace/trpc/client"
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Textarea, toast } from "@workspace/ui/components"
import LoaderOne from "@workspace/ui/components/ui/loader-one"
import { useState } from "react"

interface JobDetailsDialogProps {
    resumeId: string
}

export const JobDetailsDialog = ({ resumeId }: JobDetailsDialogProps) => {
    const [jobDescription, setJobDescription] = useState<string>("")

    const trpc = useTRPC()
    const { mutateAsync: uploadJob, isPending } = useMutation(trpc.jobs.create.mutationOptions({
        onSuccess: () => {
            toast.success("Job uploaded successfully")
        },
        onError: () => {
            toast.error("Failed to upload job")
        }
    }))

    const handleSaveJob = () => {
        if (!resumeId || !jobDescription) {
            toast.error("Please add a job description")
            return
        }
        uploadJob({
            resumeId: resumeId,
            description: jobDescription,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Enter Job Details</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-lg md:text-2xl font-semibold">Job Details</DialogTitle>
                <DialogDescription className="text-sm md:text-base">
                    Paste the job description you are targeting to get tailored insights.
                </DialogDescription>
                <div className="space-y-6">
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
                        disabled={!resumeId || !jobDescription || isPending}
                        className="w-full h-10 gap-2 text-sm md:text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
                        variant="default"
                    >
                        {isPending ? (
                            <>
                                <LoaderOne />
                                Analyzing Context...
                            </>
                        ) : (
                            "Save Job Context"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
