import { inngest } from "../client";
import { db, resumes } from "@workspace/db";
import { eq } from "drizzle-orm";
import { extractTextFromPdf } from "../lib/pdf-extractor";
import { parseResumeWithGemini } from "../ai/parser";

export const processResume = inngest.createFunction(
    {
        id: "process-resume-with-gemini",
        retries: 2,
    },
    { event: "resume/uploaded" },
    async ({ event, step }) => {
        const { resumeId, fileUrl } = event.data;

        // 1 Fetch resume (Skipped - using direct fileUrl for speed)
        const resume = await step.run("fetch-resume", async () => {
          const res = await db.query.resumes.findFirst({
            where: eq(resumes.id, resumeId),
          });
          if (!res) throw new Error("Resume not found");
          return res;
        });

        // 2 Mark processing
        await step.run("mark-processing", async () => {
            await db
                .update(resumes)
                .set({ status: "processing" })
                .where(eq(resumes.id, resumeId));
        });

        // 3 Extract text
        const rawText = await step.run("extract-text", async () => {
            return extractTextFromPdf(fileUrl);
        });

        // 4 Gemini parsing
        const parsedData = await step.run("gemini-parse", async () => {
            return parseResumeWithGemini(rawText);
        });

        // 5 Save result
        await step.run("save-result", async () => {
            await db
                .update(resumes)
                .set({
                    rawText,
                    parsedData,
                    status: "completed",
                    updatedAt: new Date(),
                })
                .where(eq(resumes.id, resumeId));
        });

        return { success: true };
    }
);