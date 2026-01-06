import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"
import { db, resumes, jobs, compiled_resumes } from "@workspace/db"
import { inngest } from "@workspace/inngest/client";
import { and, desc, eq, sql } from "drizzle-orm";

export const resumeRouter = createTRPCRouter({

    //CREATE RESUME
    create: protectedProcedure
        .input(
            z.object({
                fileName: z.string(),
                fileType: z.enum(["pdf", "doc", "docx"]),
                fileSize: z.number(),
                rawText: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [resume] = await ctx.db
                .insert(resumes)
                .values({
                    id: crypto.randomUUID(),
                    userId: ctx.auth.session.userId,
                    fileName: input.fileName,
                    fileType: input.fileType,
                    fileSize: input.fileSize,
                    rawText: input.rawText,
                    status: "uploaded",
                    createdAt: new Date(),
                })
                .returning();

            if (!resume) {
                throw new Error("Failed to create resume");
            }

            // Inngest background job
            try {
                await inngest.send({
                    name: "resume/uploaded",
                    data: {
                        resumeId: resume.id,
                        rawText: input.rawText
                    }
                });
            } catch (error) {
                console.error("Failed to trigger background processing:", error);
            }

            return resume;
        }),


    // GET USER RESUMES
    getUserResumes: protectedProcedure
        .query(async ({ ctx }) => {
            const getResumes = await db
                .select({
                    id: resumes.id,
                    userId: resumes.userId,
                    fileName: resumes.fileName,
                    fileType: resumes.fileType,
                    fileSize: resumes.fileSize,
                    rawText: resumes.rawText,
                    status: resumes.status,
                    createdAt: resumes.createdAt,
                    latexSource: resumes.latexSource,
                    hasEnhancedData: sql<boolean>`EXISTS (SELECT 1 FROM ${jobs} WHERE ${jobs.resumeId} = ${resumes.id} AND ${jobs.enhancedData} IS NOT NULL)`
                })
                .from(resumes)
                .where(eq(resumes.userId, ctx.auth.session.userId))
                .orderBy(desc(resumes.createdAt));

            return { getResumes }
        }),


    // GET PENDING RESUMES
    getPendingResumes: protectedProcedure
        .query(async ({ ctx }) => {
            const getPendingResumes = await db
                .select()
                .from(resumes)
                .where(and(eq(resumes.userId, ctx.auth.session.userId), eq(resumes.status, "pending")))
                .orderBy(desc(resumes.createdAt));

            return { getPendingResumes }
        }),


    // GET ANALYZED RESUMES
    getAnalyzedResumes: protectedProcedure
        .query(async ({ ctx }) => {
            const getAnalyzedResumes = await db
                .select()
                .from(resumes)
                .where(and(eq(resumes.userId, ctx.auth.session.userId), eq(resumes.status, "analyzed")))
                .orderBy(desc(resumes.createdAt));

            return { getAnalyzedResumes }

        }),


    // GET LATEX FROM JSONS
    // getLatex: protectedProcedure
    //     .input(
    //         z.object({
    //             id: z.string(),
    //         })
    //     )
    //     .query(async ({ctx, input}) => {
    //         const latexCode = await db
    //             .select(resumes.parsedData)
    //             .from(resumes)
    //             .where(
    //                 and(eq(resumes.userId, ctx.auth.session.userId), eq(resumes.id, input.id))
    //             )
    //     }),

    // UPDATE RESUME SOURCE
    updateSource: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                latexSource: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [updatedResume] = await ctx.db
                .update(resumes)
                .set({
                    latexSource: input.latexSource,
                    updatedAt: new Date(),
                })
                .where(and(eq(resumes.id, input.id), eq(resumes.userId, ctx.auth.session.userId)))
                .returning();

            return updatedResume;
        }),

    // GET COMPILED PDF
    getCompiledPDF: protectedProcedure
        .input(z.object({ resumeId: z.string() }))
        .query(async ({ ctx, input }) => {
            const [compiled] = await db
                .select()
                .from(compiled_resumes)
                .where(eq(compiled_resumes.resumeId, input.resumeId));

            return compiled || null;
        }),

})