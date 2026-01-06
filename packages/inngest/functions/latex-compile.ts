import { inngest } from "../client"
import { db } from "@workspace/db"
import { resumes, compiled_resumes } from "@workspace/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"


// ---- SECURITY ----
function sanitizeLatex(source: string) {
    const forbidden = [
        "\\write18",
        "\\input",
        "\\include",
        "\\openout",
        "\\read",
    ]

    for (const cmd of forbidden) {
        if (source.includes(cmd)) {
            throw new Error(`Unsafe LaTeX command detected: ${cmd}`)
        }
    }
}



export const compileLatex = inngest.createFunction(
    {
        id: "latex-compile",
        retries: 2,
    },
    { event: "latex/compile.requested" },
    async ({ event, step }) => {
        const { resumeId } = event.data

        // 1️⃣ Load compiled resume record
        const [compiled] = await db
            .select()
            .from(compiled_resumes)
            .where(eq(compiled_resumes.resumeId, resumeId))

        if (!compiled?.latexSource) {
            throw new Error("LaTeX source not found in compiled_resumes queue")
        }

        sanitizeLatex(compiled.latexSource)

        // 2️⃣ Mark compiling
        await db
            .update(compiled_resumes)
            .set({ status: "compiling", updatedAt: new Date() })
            .where(eq(compiled_resumes.resumeId, resumeId))

        // 3️⃣ Compile (retry-safe)
        const pdfUrl = await step.run("compile-and-store", async () => {
            const latexSource =
                typeof compiled.latexSource === "string"
                    ? compiled.latexSource
                    : JSON.stringify(compiled.latexSource)

            const res = await fetch(
                process.env.LATEX_SANDBOX_URL ?? "http://127.0.0.1:8080/compile",
                {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: latexSource,
                    signal: AbortSignal.timeout(30_000),
                }
            )

            if (!res.ok) {
                throw new Error(await res.text())
            }

            const buffer = Buffer.from(await res.arrayBuffer())
            return buffer.toString("base64")
        })

        // 5️⃣ Mark success
        await db
            .update(compiled_resumes)
            .set({
                status: "compiled",
                pdfContent: pdfUrl, // compiled step returns base64 string now
                updatedAt: new Date(),
            })
            .where(eq(compiled_resumes.resumeId, resumeId))
    }
)
