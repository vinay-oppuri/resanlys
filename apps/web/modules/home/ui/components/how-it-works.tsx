"use client"

import { Upload, BrainCircuit, Rocket } from "lucide-react"

const steps = [
    {
        title: "Upload Resume",
        description: "Simply drag and drop your PDF resume. We'll instantly parse and secure your data.",
        icon: <Upload className="w-6 h-6 text-indigo-500" />,
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20"
    },
    {
        title: "AI Analysis",
        description: "Our advanced AI engines analyze your experience, skills, and formatting against industry standards.",
        icon: <BrainCircuit className="w-6 h-6 text-rose-500" />,
        bg: "bg-rose-500/10",
        border: "border-rose-500/20"
    },
    {
        title: "Get Hired",
        description: "Receive actionable insights and optimized suggestions to land your dream job faster.",
        icon: <Rocket className="w-6 h-6 text-emerald-500" />,
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    }
]

export const HowItWorks = () => {
    return (
        <section className="py-12 md:py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-md md:text-lg">
                        Three simple steps to supercharge your career.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-linear-to-r from-indigo-500/20 via-rose-500/20 to-emerald-500/20 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className={`w-15 md:w-20 h-15 md:h-20 rounded-2xl ${step.bg} ${step.border} border-2 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                                {step.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                            <p className="text-sm md:text-md text-muted-foreground leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
