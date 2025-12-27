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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
