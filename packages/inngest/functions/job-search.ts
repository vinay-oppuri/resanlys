import { inngest } from "../client";
import { db, job_cache } from "@workspace/db";
import { jobSearchService } from "../../trpc/services/job-search"; // We can reuse the service logic or copy it.
// To make it truly "Inngest-native", we should move the API calls into steps.
// But for now, wrapping the service calls in steps is a good first step.

export const searchJobs = inngest.createFunction(
    { id: "job-search" },
    { event: "app/job.search" },
    async ({ event, step }) => {
        const { query, location, queries } = event.data;
        const searchTerms = queries && queries.length > 0 ? queries : [query];

        // Step 1: Search Adzuna for all queries
        console.log(`[JobSearch] Starting search for queries: ${JSON.stringify(searchTerms)} in ${location}`);
        const adzunaJobs = await step.run("fetch-adzuna", async () => {
            const allResults = [];
            for (const q of searchTerms) {
                console.log(`[JobSearch] Fetching Adzuna for: ${q}`);
                const results = await jobSearchService.searchAdzuna(q, location);
                allResults.push(...results);

                // Add 1s delay to respect rate limits (429)
                if (searchTerms.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
            console.log(`[JobSearch] Completed all searches. Found ${allResults.length} total.`);
            return allResults;
        });

        // Step 2: Search RapidAPI (Disabled)
        const rapidApiJobs: any[] = [];

        // Step 3: Aggregate and Save
        const count = await step.run("save-to-cache", async () => {
            const jobs = [...adzunaJobs, ...rapidApiJobs];

            // Deduplicate by ID
            const uniqueJobs = Array.from(new Map(jobs.map(job => [job.id, job])).values());

            if (uniqueJobs.length > 0) {
                await db.insert(job_cache).values({
                    id: crypto.randomUUID(),
                    query, // Cache under the primary query key so frontend polling works
                    location,
                    provider: 'aggregated',
                    data: uniqueJobs,
                });
            }

            return uniqueJobs.length;
        });

        return { success: true, jobsFound: count };
    }
);
