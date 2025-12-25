"use client"

import {
    BriefcaseIcon,
    FileTextIcon,
    HomeIcon,
    SettingsIcon,
    TrendingUpIcon,
    LayoutDashboardIcon,
    LogOut,
    PlusCircle,
    Sun,
    Moon
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
// import { useTheme } from "next-themes" // Theme toggle moved to header/settings if needed, or kept here.
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

const DashboardSidebar = () => {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    const navitems = [
        { href: "/dashboard", name: "Overview", icon: LayoutDashboardIcon },
        { href: "/dashboard/resumes", name: "My Resumes", icon: FileTextIcon },
        { href: "/dashboard/jobs", name: "Job Matches", icon: BriefcaseIcon },
        { href: "/dashboard/analytics", name: "Analytics", icon: TrendingUpIcon },
        { href: "/dashboard/settings", name: "Settings", icon: SettingsIcon },
    ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pb-4">
                <Link href="/" className="flex items-center gap-3 px-2 py-4 group-data-[collapsible=icon]:justify-center">
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 via-purple-500 to-rose-500 text-white font-bold text-lg shadow-md">
                        R
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80 group-data-[collapsible=icon]:hidden">
                        ResAnlys
                    </span>
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
                                        "h-10 rounded-lg px-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
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
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={cn("h-10 flex items-center justify-between gap-3 rounded-lg px-3 bg-foreground/10 transition-colors",
                                theme === "dark" ? "hover:text-background hover:bg-yellow-500" : "hover:text-background hover:bg-blue-500"
                            )}
                            tooltip="theme toggle"
                        >
                            <div>Theme</div>
                            {theme === "dark" ? <Sun className="size-5 shrink-0" /> : <Moon className="size-5 shrink-0" />}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar