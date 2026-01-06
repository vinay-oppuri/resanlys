
import DashboardNavbar from "@/modules/dashboard/components/dashboard-navbar"
import DashboardSidebar from "@/modules/dashboard/components/dashboard-sidebar"
import { DashboardBottomNav } from "@/modules/dashboard/components/dashboard-bottom-nav"
import { SidebarProvider } from "@workspace/ui/components"
import { Instructions } from "@/components/common/instructions"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden relative">
                <DashboardSidebar />
                {/* <Instructions /> */}
                <main className="flex-1 flex flex-col h-full p-0 md:p-3 md:pl-1 overflow-hidden">
                    <div className="flex-1 md:rounded-3xl bg-sidebar border border-foreground/10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <DashboardNavbar />
                        {children}
                    </div>
                </main>
                <DashboardBottomNav />
            </div>
        </SidebarProvider>
    )
}
export default Layout