import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db, jobs as jobsTable } from "@workspace/db"
import { inngest } from "@workspace/inngest/client";



export const jobsRouter = createTRPCRouter({

    // CREATE JOB
    create: protectedProcedure
        .input(
            z.object({
                resumeId: z.string(),
                title: z.string(),
                description: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [job] = await ctx.db
                .insert(jobsTable)
                .values({
                    id: crypto.randomUUID(),
                    userId: ctx.auth.session.userId,
                    resumeId: input.resumeId,
                    title: input.title,
                    description: input.description,
                    createdAt: new Date(),
                })
                .returning();

            if (!job) {
                throw new Error("Failed to create job");
            }

            try {
                await inngest.send({
                    name: "resume/enhance",
                    data: {
                        resumeId: input.resumeId,
                        jobId: job.id,
                        jobTitle: input.title,
                        jobDescription: input.description,
                    }
                })
            } catch (error) {
                console.error("Failed to trigger background processing:", error);
            }

            return job;
        })
})