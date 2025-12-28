import { EnhancedData } from "./resume-enhance"

interface ResumeAnalysisDisplayProps {
    data: EnhancedData
}

export const ResumeAnalysisDisplay = ({ data }: ResumeAnalysisDisplayProps) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out pb-8">
            <div className="space-y-2 border-b border-border/40 pb-6">
                <h2 className="text-xl md:text-3xl font-bold tracking-tighter">Analysis Report</h2>
                <p className="text-muted-foreground text-md md:text-lg">AI-powered insights to optimize your resume.</p>
            </div>

            {/* Overall Feedback */}
            {data.overall_match_feedback && (
                <div className="p-6 rounded-2xl bg-linear-to-br from-primary/5 to-transparent border border-primary/10 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                        <span className="text-lg md:text-xl">💡</span> Overall Verdict
                    </h3>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
                        {data.overall_match_feedback}
                    </p>
                </div>
            )}

            <div className="space-y-10">
                {/* Missing Keywords */}
                {data.missing_keywords?.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase tracking-widest text-muted-foreground/70 text-xs pl-1">Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2.5">
                            {data.missing_keywords.map((keyword, i) => (
                                <span key={i} className="px-3.5 py-1.5 rounded-full bg-red-500/5 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-default">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weak Skills */}
                {data.weak_or_underrepresented_skills?.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase tracking-widest text-muted-foreground/70 text-xs pl-1">Skills to Strengthen</h3>
                        <div className="flex flex-col gap-3">
                            {data.weak_or_underrepresented_skills.map((item, i) => {
                                const skillName = typeof item === 'string' ? item : item.skill;
                                const suggestion = typeof item === 'string' ? null : item.suggestion;

                                return (
                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-amber-500" />
                                            {skillName}
                                        </span>
                                        {suggestion && <span className="text-xs md:text-sm text-amber-900/70 dark:text-amber-200/70 pl-3.5 italic">{suggestion}</span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Section Level Suggestions */}
            {data.section_level_suggestions?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-widest text-muted-foreground/70 text-xs pl-1">Structural Improvements</h3>
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
                        <ul className="space-y-4 text-xs md:text-sm text-muted-foreground">
                            {data.section_level_suggestions.map((suggestion, i) => (
                                <li key={i} className="flex gap-3 leading-relaxed">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Bullet Point Improvements */}
            {data.bullet_point_improvements?.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-border/40">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight">Suggested Refinements</h3>
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">{data.bullet_point_improvements.length} items</span>
                    </div>
                    <div className="grid gap-6">
                        {data.bullet_point_improvements.map((item, i) => (
                            <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/80 hover:shadow-lg transition-all duration-300 group">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-red-500/70 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                        <span className="bg-red-500/10 p-0.5 rounded">✕</span> ORIGINAL
                                    </span>
                                    <p className="text-xs md:text-sm text-muted-foreground/60 line-through decoration-red-500/30 leading-relaxed font-serif italic pl-2 border-l-2 border-red-500/10">
                                        {item.original}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-green-600/70 dark:text-green-400/70 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                        <span className="bg-green-500/10 p-0.5 rounded">✓</span> IMPROVED
                                    </span>
                                    <p className="text-xs md:text-md font-medium text-foreground leading-relaxed pl-2 border-l-2 border-green-500/20 group-hover:border-green-500/50 transition-colors">
                                        {item.improved}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
