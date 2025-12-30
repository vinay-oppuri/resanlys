"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"
import { Logo } from "@/components/common/logo"
import { useEffect, useState } from "react"

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Dashboard', href: '/sign-in' },
    { label: 'About', href: '/about' },
]

export const Header = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <header className="fixed top-0 left-0 right-0 z-50 grid grid-cols-2 md:grid-cols-3 items-center bg-transparent backdrop-blur-md py-4 px-4 md:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-self-start z-50">
                <Logo className="drop-shadow-sm h-11.5 md:h-14 w-auto" width={180} height={45} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-self-center gap-1 p-1 bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-full px-4">
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
            <div className="flex items-center gap-1 justify-self-end">
                <div className="flex items-center gap-1 md:gap-3">
                    <SignInDialog title="Get Started" className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-lg" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hidden md:flex rounded-full hover:bg-secondary"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden flex items-center gap-4 text-foreground/90">
                    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b md:hidden flex flex-col p-6 gap-4 shadow-2xl animate-in slide-in-from-top-5 duration-200">
                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}