"use client"

import { NeonButton } from "@workspace/ui/components/ui/neon-button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"

export const CtaSection = () => {
    return (
        <section className="relative overflow-hidden rounded-3xl mx-4 mb-5 md:mb-10">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 backdrop-blur-3xl -z-10" />

            <div className="container mx-auto rounded-3xl">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-background/50 backdrop-blur-sm p-8 md:p-16 text-center">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-rose-500/5" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-xl md:text-4xl font-bold mb-6 tracking-tight">
                            Ready to Transform Your Resume?
                        </h2>
                        <p className="text-sm md:text-lg text-muted-foreground mb-10 leading-relaxed">
                            Join thousands of job seekers who have successfully landed interviews at top companies using ResAnlys.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 not-md:w-full mx-auto">
                            <SignInDialog title="Get Started for Free" className="h-10 md:h-12 px-8 text-sm md:text-md bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 not-md:w-full justify-center" />

                            <NeonButton
                                variant="ghost"
                                className="font-serif h-10 md:h-12 px-8 text-sm md:text-md rounded-full border border-white/10 hover:bg-white/5 not-md:w-full justify-center"
                            >
                                View Sample Report
                            </NeonButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
