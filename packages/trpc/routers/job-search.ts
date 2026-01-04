import { z } from "zod";
import { createTRPCRouter, baseProcedure as publicProcedure, protectedProcedure } from "../init";
import { jobSearchService } from "../services/job-search";
import { db, job_cache, jobs as jobsTable } from "@workspace/db";
import { and, eq, gt, desc } from "drizzle-orm";
import { inngest } from "@workspace/inngest/client";

export const jobSearchRouter = createTRPCRouter({
    search: protectedProcedure // Changed to protectedProcedure to get userId
        .input(z.object({
            query: z.string().min(1),
            location: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            const { query, location } = input;
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            // 1. Check Cache
            const cached = await db.query.job_cache.findFirst({
                where: and(
                    eq(job_cache.query, query),
                    eq(job_cache.location, location),
                    gt(job_cache.createdAt, oneHourAgo)
                ),
            });

            if (cached) {
                return { status: "cached", data: cached.data as any[] };
            }

            // 2. Fetch Stored Queries from Latest Job
            let storedQueries: string[] = [];
            try {
                const [latestJob] = await ctx.db
                    .select()
                    .from(jobsTable)
                    .where(eq(jobsTable.userId, ctx.auth.session.userId))
                    .orderBy(desc(jobsTable.createdAt))
                    .limit(1);

                if (latestJob && latestJob.searchQueries) {
                    storedQueries = latestJob.searchQueries as string[];
                }
            } catch (err) {
                console.error("Failed to fetch stored queries:", err);
            }

            // Combine manual query with stored queries
            // Ensure unique set
            const uniqueQueries = Array.from(new Set([query, ...storedQueries]));

            // 3. Trigger Inngest
            await inngest.send({
                name: "app/job.search",
                data: {
                    query, // Primary query for cache key
                    location,
                    queries: uniqueQueries // All queries to fetch
                }
            });

            return { status: "processing", data: [] };
        }),

    getResults: publicProcedure
        .input(z.object({
            query: z.string().min(1),
            location: z.string().min(1),
        }))
        .query(async ({ input }) => {
            const { query, location } = input;
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            const cached = await db.query.job_cache.findFirst({
                where: and(
                    eq(job_cache.query, query),
                    eq(job_cache.location, location),
                    gt(job_cache.createdAt, oneHourAgo)
                ),
            });

            if (cached) {
                return { status: "complete", data: cached.data as any[] };
            }
            return { status: "pending", data: [] };
        }),

    getGoogleRedirect: publicProcedure
        .input(z.object({
            query: z.string(),
            location: z.string(),
        }))
        .query(({ input }) => {
            return {
                url: jobSearchService.getGoogleJobsUrl(input.query, input.location)
            };
        }),
});
