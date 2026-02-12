import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Clock, Loader2, Sparkles, X, Check, TriangleAlertIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@workspace/ui/components/dialog"
import { useTRPC } from "@workspace/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { ResumeAnalysisDisplay } from "./resume-analysis-display"
import { EnhancedData } from "./resume-enhance"
import { cn } from "@workspace/ui/lib/utils"
import { JobDetailsDialog } from "./job-details-dialog"
import Loader from "@workspace/ui/components/ui/loader"

interface ResumeListProps {
    resumes: any[]
    isLoading: boolean
}

export const ResumeList = ({ resumes, isLoading }: ResumeListProps) => {
    const trpc = useTRPC()
    const router = useRouter()
    const [viewingId, setViewingId] = useState<string | null>(null)

    const { data: suggestionsData, isLoading: isLoadingSuggestions } = useQuery({
        ...trpc.jobs.getEnhanceSuggestions.queryOptions({
            resumeId: viewingId || ""
        }),
        enabled: !!viewingId
    })

    const handleGetSuggestions = (resumeId: string) => {
        setViewingId(resumeId)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg md:text-xl font-semibold tracking-tight">Your Library</h3>
                <p className="hidden md:flex items-center gap-1 text-muted-foreground text-xs">
                    <TriangleAlertIcon className="size-3 text-yellow-500 animate-pulse" /> Click on Resume Title to Edit
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-2 md:p-12 space-y-4 rounded-xl border border-dashed text-muted-foreground bg-muted/20">
                    <Loader />
                </div>
            ) : resumes?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-2 md:p-12 text-center rounded-2xl border border-dashed bg-muted/20">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <FileText className="size-8 text-muted-foreground/50" />
                    </div>
                    <h4 className="text-lg font-medium text-foreground">No resumes yet</h4>
                    <p className="text-muted-foreground mt-1 max-w-xs">
                        Upload your first resume to get started with AI analysis.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {resumes?.map((resume: any) => {
                        return (
                            <div
                                key={resume.id}
                                className="group relative flex flex-row items-center justify-between px-3 py-2 md:p-4 rounded-xl border transition-all duration-300 ease-out hover:shadow-lg hover:border-primary/30 hover:scale-[1.01] cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center bg-foreground/10 size-10 h-12 md:size-12 rounded-xl transition-all duration-300 shadow-sm">
                                        <FileText className="size-5 md:size-6" />
                                    </div>
                                    <div className="space-y-2 md:space-y-1">
                                        <p
                                            onClick={() => router.push(`/dashboard/resumes/${resume.id}/editor`)}
                                            className="hover:underline truncate font-semibold transition-colors line-clamp-1 text-md md:text-base tracking-tight cursor-pointer"
                                        >
                                            {resume.fileName.length > 10
                                                ? `${resume.fileName.slice(0, 7)}...`
                                                : resume.fileName
                                            }
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                                                <Clock className="size-3" />
                                                {new Date(resume.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span>{(resume.fileSize ? resume.fileSize / 1024 : 0).toFixed(0)} KB</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row items-center gap-2 md:gap-3 justify-end">
                                    {resume.status === 'processing' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] md:text-xs font-medium border border-amber-500/20 shadow-sm animate-pulse">
                                            <Loader2 className="size-2 md:size-3.5 animate-spin" />
                                            <span>Processing</span>
                                        </span>
                                    )}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-1 text-[10px] md:text-xs text-foreground/90 hover:bg-blue-500/20! backdrop-blur-sm transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleGetSuggestions(resume.id)
                                                }}
                                            >
                                                <Sparkles className="size-3" /> Get Suggestions
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-[95vw] max-w-[95vw] md:w-full md:max-w-5xl lg:max-w-6xl h-[90vh] md:h-[85vh] p-0 gap-0 overflow-hidden flex flex-col border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                                            <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
                                            <div className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                {isLoadingSuggestions ? (
                                                    <div className="flex flex-col items-center justify-center p-2 md:p-12 h-full gap-4">
                                                        <Loader />
                                                        <p className="text-muted-foreground font-medium animate-pulse">Analyzing resume insights...</p>
                                                    </div>
                                                ) : suggestionsData?.enhancedData ? (
                                                    <ResumeAnalysisDisplay data={suggestionsData.enhancedData as unknown as EnhancedData} />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full p-2 md:p-8 text-center space-y-4">
                                                        <div className="p-4 rounded-full bg-muted/50">
                                                            <Sparkles className="size-8 text-muted-foreground/50" />
                                                        </div>
                                                        <p className="text-muted-foreground font-medium">No insights found for this resume.</p>
                                                        <p className="text-red-500/80 font-medium">Save a job description to get insights.</p>
                                                        <JobDetailsDialog resumeId={resume.id} />
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "capitalize px-2.5 py-1 flex items-center justify-center gap-1 shadow-sm border text-[10px] md:text-xs",
                                            resume.status === 'completed' ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                resume.status === 'failed' ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                    "bg-primary/5 text-primary"
                                        )}
                                    >
                                        {resume.status === 'processing' && (
                                            <Loader2 className="size-2 md:size-3 animate-spin" />
                                        )}
                                        {resume.status === 'failed' && (
                                            <X className="size-2 md:size-3" />
                                        )}
                                        {resume.status === 'completed' && (
                                            <Check className="size-2 md:size-3" />
                                        )}
                                        {resume.status}
                                    </Badge>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
