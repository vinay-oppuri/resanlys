"use client"

import {
    BriefcaseIcon,
    FileTextIcon,
    SettingsIcon,
    TrendingUpIcon,
    LayoutDashboardIcon,
    Sun,
    Moon
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Logo } from "@/components/common/logo"

const DashboardSidebar = () => {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const navitems = [
        { href: "/dashboard", name: "Overview", icon: LayoutDashboardIcon },
        { href: "/dashboard/resumes", name: "My Resumes", icon: FileTextIcon },
        { href: "/dashboard/jobs", name: "Job Matches", icon: BriefcaseIcon },
        { href: "/dashboard/analytics", name: "Analytics", icon: TrendingUpIcon },
        { href: "/dashboard/settings", name: "Settings", icon: SettingsIcon },
    ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="mx-auto pb-4">
                <Link href="/" className="flex items-center z-50 px-2">
                    <Logo className="drop-shadow-sm h-12 w-auto" width={180} height={45} />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <div className="px-2 mb-4 group-data-[collapsible=icon]:hidden">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            Main Menu
                        </p>
                    </div>
                    <SidebarMenu className="gap-1">
                        {navitems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "h-10 rounded-md px-3 text-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
                                        pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                                    )}
                                    isActive={pathname === item.href}
                                    tooltip={item.name}
                                >
                                    <Link href={item.href} className="flex items-center gap-3">
                                        <item.icon className="size-5 shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem className="border-t border-foreground/10 pt-4">
                        <SidebarMenuButton
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="h-10 flex items-center justify-between gap-3 rounded-md px-3 transition-colors"
                            tooltip="theme toggle"
                        >
                            <div>Theme</div>
                            {theme === "dark" ? <Sun className="size-5 hover:text-yellow-500/90 shrink-0" /> : <Moon className="size-5 hover:text-blue-500/90 shrink-0" />}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar