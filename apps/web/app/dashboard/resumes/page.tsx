"use client"

import { ResumeList } from "@/modules/dashboard/components/resume-list"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@workspace/trpc/client"


const Page = () => {
    const trpc = useTRPC()
    const { data: resumesData, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions())
    const resumes = resumesData?.getResumes || []

    return (
        <div className="p-4">
            <ResumeList resumes={resumes} isLoading={isLoading} />
        </div>
    )

}
export default Page