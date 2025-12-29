"use client"

import { useEffect, useState } from "react"
import { NeonButton } from "@workspace/ui/components/ui/neon-button"
import { HeroGeometric } from "@workspace/ui/components/ui/shape-landing-hero"
import { Header } from "@/components/common/header"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/common/footer"
import LoadingState from "@/components/states/loading-state"
import ErrorState from "@/components/states/error-state"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"

import { HowItWorks } from "../components/how-it-works"
import { CtaSection } from "../components/cta-section"

export const HomeView = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <Header />
      <HeroGeometric
        badge="AI-Powered Career Growth"
        title1="Upload resume Analyze it"
        title2="Get Suggestions"
        description="Unlock your career potential with our advanced AI. Analyze your resume, match with dream jobs, and get personalized improvement tips to stand out from the crowd."
      >
        <div className="flex flex-col md:flex-row items-center gap-4 px-4 mt-8 not-md:w-full">
          <SignInDialog title="Analyse Your Resume" className="h-10 px-8 bg-blue-500/20 backdrop-blur-sm rounded-lg not-md:w-full justify-center" />

          <NeonButton
            size="lg"
            className="rounded-lg not-md:w-full h-10 px-8 flex items-center justify-center text-sm md:text-base text-foreground/90 font-serif cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            See how it works
          </NeonButton>
        </div>
      </HeroGeometric>

      <Features />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </>
  )
}


export const HomeViewLoading = () => {
  return (
    <LoadingState
      message="Loading"
    />
  )
}

export const HomeViewError = () => {
  return (
    <ErrorState
      title="Something went wrong"
      message="Please try again later"
    />
  )
}