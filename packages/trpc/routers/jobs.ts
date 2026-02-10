import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db, jobs as jobsTable } from "@workspace/db"
import { inngest } from "@workspace/inngest/client";
import { eq, desc } from "drizzle-orm";

export const jobsRouter = createTRPCRouter({

    // CREATE JOB
    create: protectedProcedure
        .input(
            z.object({
                resumeId: z.string(),
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
                        jobDescription: input.description,
                    }
                })
            } catch (error) {
                console.error("Failed to trigger background processing:", error);
            }

            return job;
        }),


    // GET JOB ENHANCE SUGGESTIONS
    getEnhanceSuggestions: protectedProcedure
        .input(
            z.object({
                resumeId: z.string()
            })
        )
        .query(async ({ input }) => {
            const [suggestions] = await db
                .select({ enhancedData: jobsTable.enhancedData })
                .from(jobsTable)
                .where(eq(jobsTable.resumeId, input.resumeId))
                .limit(1);

            if (!suggestions) {
                throw new Error("Failed to get enhance suggestions");
            }

            return suggestions;
        }),

    // GET LATEST JOB
    getLatestJob: protectedProcedure
        .query(async ({ ctx }) => {
            const [job] = await ctx.db
                .select()
                .from(jobsTable)
                .where(eq(jobsTable.userId, ctx.auth.session.userId))
                .orderBy(desc(jobsTable.createdAt))
                .limit(1);

            return job;
        })

})
