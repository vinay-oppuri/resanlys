import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export const runtime = "nodejs"; // IMPORTANT

export async function POST(req: NextRequest) {
    let latexSource = "";

    try {
        const body = await req.json();
        latexSource = body.latexSource;

        if (!latexSource || typeof latexSource !== "string") {
            return NextResponse.json(
                { error: "No LaTeX source provided" },
                { status: 400 }
            );
        }

        // External LaTeX compilation
        const response = await fetch("https://latex.online/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ text: latexSource }),
            signal: AbortSignal.timeout(15_000),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="preview.pdf"',
            },
        });
    } catch (err) {
        console.error("Compilation failed, using fallback:", err);

        // FALLBACK PDF
        try {
            const doc = new jsPDF({ compress: true });

            doc.setTextColor(255, 0, 0);
            doc.setFontSize(14);
            doc.text("PREVIEW UNAVAILABLE", 10, 15);

            doc.setFontSize(10);
            doc.text("Showing raw LaTeX source", 10, 22);

            doc.setTextColor(0, 0, 0);
            doc.setFont("courier", "normal");

            const lines = doc.splitTextToSize(latexSource, 180);
            let y = 30;

            for (const line of lines) {
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, 10, y);
                y += 5;
            }

            const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

            return new NextResponse(pdfBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "X-Compilation-Status": "fallback",
                },
            });
        } catch (fallbackErr) {
            console.error("Fallback failed:", fallbackErr);
            return NextResponse.json(
                { error: "PDF generation failed" },
                { status: 500 }
            );
        }
    }
}
