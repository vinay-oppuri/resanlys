import { NextRequest, NextResponse } from "next/server"
import { db } from "@workspace/db"
import { resumes, compiled_resumes } from "@workspace/db/schema"
import { inngest } from "@workspace/inngest/client"
import crypto from "crypto"
import { headers } from "next/headers"
import { auth } from "@workspace/auth"
import { eq } from "drizzle-orm"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { latexSource, resumeId: providedResumeId } = await req.json()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!latexSource || typeof latexSource !== "string") {
    return NextResponse.json(
      { error: "Invalid LaTeX source" },
      { status: 400 }
    )
  }

  const userId = session.user.id
  let resumeId = providedResumeId

  if (resumeId) {
    // 1️⃣ Update existing compilation record (upsert logic manually since no unique constraint on resumeId yet)
    const [existing] = await db
      .select()
      .from(compiled_resumes)
      .where(eq(compiled_resumes.resumeId, resumeId))

    if (existing) {
      await db
        .update(compiled_resumes)
        .set({
          latexSource,
          status: "queued",
          updatedAt: new Date(),
        })
        .where(eq(compiled_resumes.resumeId, resumeId))
    } else {
      // Edge case: Resume exists but no compiled record? Or provided ID is invalid? 
      // Assuming valid ID for now, create compiled record.
      await db.insert(compiled_resumes).values({
        id: crypto.randomUUID(),
        resumeId,
        latexSource,
        status: "queued",
      })
    }
  } else {
    // 2️⃣ Create NEW resume
    resumeId = crypto.randomUUID()

    // Insert Base Resume (Original)
    await db.insert(resumes).values({
      id: resumeId,
      userId,
      latexSource, // Initial source
      fileName: "Generated Resume",
      fileType: "latex",
      status: "queued",
    })

    // Insert Compiled Resume Entry
    await db.insert(compiled_resumes).values({
      id: crypto.randomUUID(),
      resumeId,
      latexSource, // Initial source to compile
      status: "queued",
    })
  }

  // 3️⃣ Emit Inngest event
  await inngest.send({
    name: "latex/compile.requested",
    data: {
      resumeId,
      userId,
    },
  })

  return NextResponse.json({
    resumeId,
    status: "queued",
  })
}
