"use client"

import { PanelLeft, Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { useSidebar } from "@workspace/ui/components/sidebar"
import { Button } from "@workspace/ui/components/button"
import UserProfile from "@/components/common/user-profile"

const DashboardNavbar = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="flex items-center justify-between gap-4 sticky top-0 z-50 py-3 bg-sidebar/50 backdrop-blur-md px-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <PanelLeft className="size-5" />
                </Button>

                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Dashboard</span>
                    <span className="text-muted-foreground/40">/</span>
                    <span>Overview</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative block w-46 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search resumes..."
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background h-9 text-sm rounded-lg transition-all"
                    />
                </div>
                <UserProfile />
            </div>
        </div>
    )
}

export default DashboardNavbar