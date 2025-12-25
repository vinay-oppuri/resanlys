
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar"
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden">
                <DashboardSidebar />
                <main className="flex-1 flex flex-col h-full p-3 md:pl-0 overflow-hidden">
                    <div className="flex-1 rounded-xl bg-sidebar overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <DashboardNavbar />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
export default Layout