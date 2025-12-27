import { db, jobs, resumes } from "@workspace/db";
import { enhanceResumeWithGemini, jsonDescWithGemini } from "../ai/parser";
import { inngest } from "../client";
import { eq } from "drizzle-orm";


export const insertJob = inngest.createFunction(
    {
        id: "insert-job-and-enhance-resume",
        retries: 2,
    },
    { event: "resume/enhance" },
    async ({ event, step }) => {
        const { resumeId, jobId, jobTitle, jobDescription } = event.data;

        // getting parsed data from resume
        const parsedData = await step.run("get-parsed-data", async () => {
            const [resume] = await db
                .select()
                .from(resumes)
                .where(eq(resumes.id, resumeId))
                .limit(1);

            if (!resume) {
                throw new Error("Resume not found");
            }

            return resume.parsedData as JSON | any;
        })

        // getting json description from job description
        const jsonDesc = await step.run("json-description", async () => {
            return jsonDescWithGemini(jobDescription)
        })

        // enhancing resume with gemini
        const enhancedResume = await step.run("gemini-enhance", async () => {
            return enhanceResumeWithGemini(parsedData, jobTitle, jsonDesc)
        })

        // saving enhanced resume
        await step.run("save-jobs", async () => {
            await db
                .update(jobs)
                .set({
                    parsedData: jsonDesc,
                    enhancedData: enhancedResume,
                })
                .where(eq(jobs.id, jobId));
        })
    }
)