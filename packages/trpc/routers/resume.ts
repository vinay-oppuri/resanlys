import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"
import { resumes } from "@workspace/db"
import { inngest } from "@workspace/inngest/client";

export const resumeRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                fileUrl: z.string().url(),
                fileName: z.string(),
                fileType: z.enum(["pdf", "doc", "docx"]),
                fileSize: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [resume] = await ctx.db
                .insert(resumes)
                .values({
                    id: crypto.randomUUID(),
                    userId: ctx.auth.session.userId,
                    fileUrl: input.fileUrl,
                    fileName: input.fileName,
                    fileType: input.fileType,
                    fileSize: input.fileSize,
                    status: "uploaded",
                    createdAt: new Date(),
                })
                .returning();

            if (!resume) {
                throw new Error("Failed to create resume");
            }

            // 🔥 Trigger background processing
            try {
                await inngest.send({
                    name: "resume/uploaded",
                    data: {
                        resumeId: resume.id,
                        fileUrl: input.fileUrl // Pass directly for optimization
                    }
                });
            } catch (error) {
                console.error("Failed to trigger background processing:", error);
                // We don't throw here to allow the upload to succeed even if processing trigger fails
            }

            return resume;
        }),

})