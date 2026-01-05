// app/api/compile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@workspace/db"
import { resumes } from "@workspace/db/schema"
import { inngest } from "@workspace/inngest/client"
import crypto from "crypto"
import { headers } from "next/headers"
import { auth } from "@workspace/auth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { latexSource, resumeId: legacyResumeId } = await req.json()

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
  const resumeId = crypto.randomUUID()

  // 1️⃣ Insert DB record
  await db.insert(resumes).values({
    id: resumeId,
    userId,
    latexSource,
    fileName: "Generated Resume",
    fileType: "latex",
    status: "queued",
  })

  // 2️⃣ Emit Inngest event
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
