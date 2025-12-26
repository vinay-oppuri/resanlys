"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, ChevronRight } from "lucide-react"
import { NeonButton } from "@workspace/ui/components/ui/neon-button"
import { Button } from "@workspace/ui/components/button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"
import Image from "next/image"

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Dashboard', href: '/sign-in' },
    { label: 'About', href: '/about' },
]

export const Header = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-transparent backdrop-blur-md px-6 md:px-18 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center z-50">
                <Image src="/logo.svg" alt="Logo" width={50} height={50} className="drop-shadow-lg" />
                <NeonButton variant="ghost" className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-500 to-cyan-900 bg-clip-text text-transparent -ml-6">
                    ResAnlys
                </NeonButton>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-full px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                    >
                        {item.label}
                        <span className="absolute bottom-1 left-4 right-4 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
                <SignInDialog title="Get Started" className="px-6 py-2" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-full hover:bg-secondary"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}