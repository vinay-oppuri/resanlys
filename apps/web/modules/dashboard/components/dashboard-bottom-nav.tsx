"use client"

import { LimelightNav } from "@workspace/ui/components"
import { Briefcase, FileText, Home, LayoutDashboard } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function DashboardBottomNav() {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        {
            id: "home",
            label: "Home",
            href: "/",
            icon: <Home />,
        },
        {
            id: "overview",
            label: "Overview",
            href: "/dashboard",
            icon: <LayoutDashboard />,
        },
        {
            id: "resumes",
            label: "Resumes",
            href: "/dashboard/resumes", // Corrected path based on file structure
            icon: <FileText />,
        },
        {
            id: "jobs",
            label: "Jobs",
            href: "/dashboard/jobs",
            icon: <Briefcase />,
        },
    ]

    // Calculate active index based on current path
    const activeIndex = navItems.findIndex((item) => {
        if (item.href === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname?.startsWith(item.href)
    })

    // Prevent hydration mismatch
    if (!mounted) return null

    return (
        <div className="flex md:hidden fixed bottom-2 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <div className="group relative rounded-full p-1 bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl dark:shadow-black/50 transition-all hover:scale-105 hover:bg-background/80">
                {/* Glow effect behind */}
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

                <LimelightNav
                    defaultActiveIndex={activeIndex !== -1 ? activeIndex : 0}
                    className="relative rounded-full w-full border-none bg-transparent shadow-none px-2 h-14"
                    iconContainerClassName="p-2 w-16"
                    iconClassName="w-5 h-5"
                    items={navItems.map((item) => ({
                        id: item.id,
                        label: item.label,
                        icon: item.icon,
                        onClick: () => router.push(item.href),
                    }))}
                />
            </div>
        </div>
    )
}