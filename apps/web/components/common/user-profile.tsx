"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
    LogOut,
    Settings,
    CreditCard,
    User,
    Monitor,
    Sparkles
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { authClient } from "@workspace/auth/client" // Import authClient directly
import { useRouter } from "next/navigation"

const UserProfile = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession(); // Use the hook from the client instance
    const user = session?.user;

    const onSignOut = async () => {
        try {
            await authClient.signOut()
            router.push("/")
        } catch (err) {
            console.error("Sign-out failed:", err);
        }
    }

    // Get initials for fallback
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-9 border-2 border-foreground/20 transition-all duration-300 group-hover:ring-primary/20 group-hover:scale-105">
                    <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/5 text-xs font-semibold text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 bg-black/40 backdrop-blur-xl border-white/10 p-2 shadow-2xl"
                align="end"
                sideOffset={8}
            >
                <div className="flex items-center gap-3 p-2 mb-1 rounded-xl bg-white/5 border border-white/5">
                    <Avatar className="size-10 border border-white/10">
                        <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate text-foreground/90">
                            {user?.name || "Guest User"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate font-light">
                            {user?.email || "guest@example.com"}
                        </span>
                    </div>
                </div>

                <div className="my-1 px-2 py-1.5 flex items-center justify-between rounded-lg bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-primary animate-pulse" />
                        <span className="text-xs font-medium text-primary">Pro Plan</span>
                    </div>
                    <span className="text-[10px] text-primary/70 font-medium">Upgrade</span>
                </div>

                <DropdownMenuSeparator className="bg-white/5 my-1" />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-3 p-2.5 focus:bg-white/5 focus:text-primary transition-colors cursor-pointer rounded-lg">
                        <User className="size-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 p-2.5 focus:bg-white/5 focus:text-primary transition-colors cursor-pointer rounded-lg">
                        <Monitor className="size-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 p-2.5 focus:bg-white/5 focus:text-primary transition-colors cursor-pointer rounded-lg">
                        <CreditCard className="size-4" />
                        <span>Billing & Plans</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 p-2.5 focus:bg-white/5 focus:text-primary transition-colors cursor-pointer rounded-lg">
                        <Settings className="size-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-white/5 my-1" />

                <DropdownMenuItem
                    onClick={onSignOut}
                    className="gap-3 p-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer rounded-lg"
                >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile