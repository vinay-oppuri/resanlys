import { 
    Button, 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@workspace/ui/components"
import { FileUp, BriefcaseBusiness, Sparkles, Info } from "lucide-react"

export const Instructions = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className="flex items-center justify-center">
                <Button
                    variant="outline"
                    className="fixed z-50 top-18 md:top-24 right-0 md:right-3 rounded-full rounded-r-none border-r-0 bg-background! backdrop-blur-md gap-1.5 pl-3 pr-6"
                >
                    <Info className="size-3 md:size-4 text-yellow-500 animate-pulse" />
                    <div className="text-xs md:text-sm text-yellow-500/80 font-medium uppercase tracking-wider">INSTRUCTIONS</div>
                </Button>
            </SheetTrigger>
            
            <SheetContent className="z-100 p-4 md:p-6 py-2! md:py-4! bg-background/60 backdrop-blur-sm sm:max-w-md">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-lg md:text-xl">How it works</SheetTitle>
                    <SheetDescription className="text-xs md:text-sm text-muted-foreground">
                        Follow these three simple steps to optimize your resume for your target role.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-8">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex h-8 md:h-10 w-8 md:w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <FileUp className="size-4 md:size-5" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs md:text-sm font-semibold leading-none">1. Upload your Resume</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Upload your current CV in PDF or DOCX format. We extract the text to understand your experience.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex h-8 md:h-10 w-8 md:w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <BriefcaseBusiness className="size-4 md:size-5" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs md:text-sm font-semibold leading-none">2. Add Job Context</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Paste the job description or details of the role you are targeting. This helps us tailor the feedback.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex h-8 md:h-10 w-8 md:w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Sparkles className="size-4 md:size-5" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs md:text-sm font-semibold leading-none">3. Generate Analysis</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Click the <span className="font-medium text-foreground">"Get Suggestions"</span> button. AI will analyze the gap between your resume and the job requirements.
                            </p>
                        </div>
                    </div>

                    {/* Pro Tip Box */}
                    <div className="mt-4 rounded-lg border bg-muted/50 p-2 md:p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Info className="h-4 w-4" />
                            Pro Tip
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            For best results, ensure your resume text is selectable and the job description includes the "Responsibilities" and "Requirements" sections.
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}