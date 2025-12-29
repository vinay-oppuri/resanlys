import { FileText, CheckCircle, Clock } from "lucide-react"

interface DashboardStatsProps {
    totalResumes: number
    analyzedCount: number
    pendingCount: number
    isLoading: boolean
}

export const DashboardStats = ({ totalResumes, analyzedCount, pendingCount, isLoading }: DashboardStatsProps) => {
    const stats = [
        {
            label: "Total Resumes",
            value: totalResumes.toString(),
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Analyzed",
            value: analyzedCount.toString(),
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            label: "Pending Processing",
            value: pendingCount.toString(),
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="group relative overflow-hidden p-3 md:p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
                        <stat.icon className="h-24 w-24 -mr-8 -mt-8" />
                    </div>

                    <div className="relative flex flex-row gap-4">
                        <div className={`w-fit p-3 my-auto rounded-xl bg-linear-to-br ${stat.bg} ${stat.color} bg-opacity-10`}>
                            <stat.icon className="size-6" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                                {isLoading ? (
                                    <span className="animate-pulse bg-muted h-8 w-16 block rounded"></span>
                                ) : (
                                    stat.value
                                )}
                            </h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
