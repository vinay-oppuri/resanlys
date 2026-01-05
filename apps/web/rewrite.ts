import { NextResponse, NextRequest } from "next/server"
import pdf from "pdf-parse"
import mammoth from "mammoth"
import textract from "textract"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file = data.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "No file found" },
      { status: 400 }
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ""

    switch (file.type) {
      case "application/pdf": {
        const result = await pdf(buffer)
        text = result.text
        break
      }

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
        break
      }

      case "application/msword": {
        text = await new Promise<string>((resolve, reject) => {
          textract.fromBufferWithMime(
            "application/msword",
            buffer,
            (error: Error | null, result: string | undefined) => {
              if (error) reject(error)
              else resolve(result ?? "")
            }
          )
        })
        break
      }

      default:
        return NextResponse.json(
          { success: false, message: "Only PDF, DOCX and DOC are supported." },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      text,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Failed text extraction:", error)
    return NextResponse.json(
      { success: false, message: "Failed to extract text" },
      { status: 500 }
    )
  }
}