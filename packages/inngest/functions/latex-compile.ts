import { inngest } from "../client"
import { db } from "@workspace/db"
import { resumes } from "@workspace/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

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

// ---- STORAGE (local for now) ----
async function storePdf(resumeId: string, buffer: Buffer) {
    const dir = path.join(process.cwd(), "compiled")
    await fs.mkdir(dir, { recursive: true })

    const filePath = path.join(dir, `${resumeId}.pdf`)
    await fs.writeFile(filePath, buffer)

    return `/compiled/${resumeId}.pdf`
}

export const compileLatex = inngest.createFunction(
    {
        id: "latex-compile",
        retries: 3,
    },
    { event: "latex/compile.requested" },
    async ({ event, step }) => {
        const { resumeId } = event.data

        // 1️⃣ Load resume
        const [resume] = await db
            .select()
            .from(resumes)
            .where(eq(resumes.id, resumeId))

        if (!resume?.latexSource) {
            throw new Error("LaTeX source not found")
        }

        sanitizeLatex(resume.latexSource)

        // 2️⃣ Mark compiling
        await db
            .update(resumes)
            .set({ status: "compiling", updatedAt: new Date() })
            .where(eq(resumes.id, resumeId))

        // 3️⃣ Compile (retry-safe)
        const pdfBase64 = await step.run("compile-latex", async () => {
            // ---- TRY DOCKER SANDBOX ----
            try {
                // Use 127.0.0.1 since we are running on host talking to mapped container port
                const res = await fetch("http://127.0.0.1:8080/compile", {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: resume.latexSource!,
                    signal: AbortSignal.timeout(60_000), // increased timeout for install
                })

                if (!res.ok) throw new Error(await res.text())
                return Buffer.from(await res.arrayBuffer()).toString("base64")

            } catch (dockerErr) {
                console.warn("Docker LaTeX failed, falling back", dockerErr)

                // ---- FALLBACK: latex.online ----
                const res = await fetch("https://latex.online/compile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({ text: resume.latexSource! }),
                    signal: AbortSignal.timeout(20_000),
                })

                if (!res.ok) throw new Error(await res.text())
                return Buffer.from(await res.arrayBuffer()).toString("base64")
            }
        })

        // 4️⃣ Store PDF
        const pdfBuffer = Buffer.from(pdfBase64, "base64")
        const pdfUrl = await storePdf(resumeId, pdfBuffer)

        // 5️⃣ Mark success
        await db
            .update(resumes)
            .set({
                status: "compiled",
                parsedData: { pdfUrl },
                updatedAt: new Date(),
            })
            .where(eq(resumes.id, resumeId))
    }
)