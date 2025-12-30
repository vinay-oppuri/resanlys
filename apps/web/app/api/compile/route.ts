
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { latexSource } = body;

        if (!latexSource) {
            return NextResponse.json(
                { error: "No LaTeX source provided" },
                { status: 400 }
            );
        }

        // MOCK COMPILATION:
        // Since we don't have a full LaTeX engine in Node/Bun environment easily,
        // we will generate a PDF that simply displays the source code or basic text.
        // In a real app, this would call an external API (e.g. Overleaf, LaTeX.online).

        const doc = new jsPDF();

        // Simple naive "rendering" - just splitting by newlines
        const lines = latexSource.split("\n");
        let y = 10;

        doc.setFontSize(10);
        lines.forEach((line: string) => {
            if (y > 280) {
                doc.addPage();
                y = 10;
            }
            doc.text(line, 10, y);
            y += 5;
        });

        const pdfBuffer = doc.output("arraybuffer");

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="preview.pdf"',
            },
        });

    } catch (error) {
        console.error("Compilation error:", error);
        return NextResponse.json(
            { error: "Failed to compile LaTeX" },
            { status: 500 }
        );
    }
}
