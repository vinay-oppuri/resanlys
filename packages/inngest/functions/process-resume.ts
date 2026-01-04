import { inngest } from "../client";
import { db, resumes } from "@workspace/db";
import { eq } from "drizzle-orm";
import { latexGenerator, parseResumeWithGemini } from "../ai/parser";

export const processResume = inngest.createFunction(
    {
        id: "process-resume-with-gemini",
        retries: 2,
    },
    { event: "resume/uploaded" },
    async ({ event, step }) => {
        const { resumeId, rawText } = event.data;

        // 1 Mark processing
        await step.run("mark-processing", async () => {
            await db
                .update(resumes)
                .set({ status: "processing" })
                .where(eq(resumes.id, resumeId));
        });

        // 2 Gemini parsing
        const parsedData = await step.run("gemini-parse", async () => {
            return parseResumeWithGemini(rawText);
        });

        // 3 Gemini latex generation
        const latexSource = await step.run("gemini-latex", async () => {
            return latexGenerator(parsedData);
        });

        // 4 Save result
        await step.run("save-result", async () => {
            await db
                .update(resumes)
                .set({
                    parsedData: parsedData,
                    latexSource: latexSource,
                    status: "uploaded",
                    updatedAt: new Date(),
                })
                .where(eq(resumes.id, resumeId));
        });

        return { success: true };
    }
);