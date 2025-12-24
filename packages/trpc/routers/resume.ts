import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"
import { resumes } from "@workspace/db"

export const resumeRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                fileUrl: z.string().url(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth.session.userId

            const [resume] = await ctx.db
                .insert(resumes)
                .values({
                    id: crypto.randomUUID(),
                    userId,
                    fileUrl: input.fileUrl,
                    createdAt: new Date(),
                })
                .returning()

            return resume
        }),
})