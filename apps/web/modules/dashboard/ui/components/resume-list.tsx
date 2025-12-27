import { FileText, Clock, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import LoaderOne from "@workspace/ui/components/ui/loader-one"

interface ResumeListProps {
    resumes: any[]
    isLoading: boolean
}

export const ResumeList = ({ resumes, isLoading }: ResumeListProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-semibold">Saved Resumes</h3>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <LoaderOne />
                </div>
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
    )
}
