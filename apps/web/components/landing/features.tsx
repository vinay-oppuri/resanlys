import {
    BrainCircuit,
    Target,
    Sparkles,
    FileText,
    Search,
    TrendingUp
} from "lucide-react"

const features = [
    {
        title: "AI-Powered Analysis",
        description: "Get instant, deep insights into your resume's strengths and weaknesses using advanced LLMs.",
        icon: <BrainCircuit className="w-6 h-6" />,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
    },
    {
        title: "ATS Optimization",
        description: "Ensure your resume passes Applicant Tracking Systems with our intelligent keyword matching.",
        icon: <Target className="w-6 h-6" />,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
    },
    {
        title: "Smart Suggestions",
        description: "Receive actionable, context-aware suggestions to improve your bullet points and summaries.",
        icon: <Sparkles className="w-6 h-6" />,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Job Matching",
        description: "Find the perfect roles based on your skills and experience with our job recommendation engine.",
        icon: <Search className="w-6 h-6" />,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
    {
        title: "Career Growth",
        description: "Track your improvements and get a career roadmap tailored to your goals.",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Instant PDF Parsing",
        description: "Upload your resume in seconds. We handle the complex formatting so you don't have to.",
        icon: <FileText className="w-6 h-6" />,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    }
]

export const Features = () => {
    return (
        <section id="features" className="py-12 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70 mb-4 tracking-tight">
                        Supercharge Your Resume
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground">
                        Our AI-driven tools help you stand out from the competition and land your dream job faster.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-row md:flex-col gap-4 md:gap-0 group relative p-4 md:p-8 rounded-3xl border border-white/5 bg-white/5 dark:bg-white/2 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                        >
                            <div className={`w-12 h-12 p-3 md:p-0 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent group-hover:ring-white/10 transition-all duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
