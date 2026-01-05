"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@workspace/trpc/client";
import { EditorView } from "@/components/latex-editor/editor-view";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ResumeEditorPage() {
    const params = useParams();
    const id = params.id as string;
    const trpc = useTRPC();

    const { data, isLoading } = useQuery(trpc.resume.getUserResumes.queryOptions());

    // Find the specific resume from the list (client-side filtering for MVP)
    const resume = data?.getResumes.find((r) => r.id === id);

    const queryClient = useQueryClient();

    const updateSourceMutation = useMutation(trpc.resume.updateSource.mutationOptions({
        onSuccess: () => {
            const { queryKey } = trpc.resume.getUserResumes.queryOptions();
            queryClient.invalidateQueries({ queryKey });
        }
    }));

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!resume) {
        return <div>Resume not found</div>;
    }

    const handleSave = async (source: string) => {
        await updateSourceMutation.mutateAsync({
            id: resume.id,
            latexSource: source,
        });
    };

    return (
        <EditorView
            resumeId={resume.id}
            initialSource={resume.latexSource}
            onSave={handleSave}
        />
    );
}
