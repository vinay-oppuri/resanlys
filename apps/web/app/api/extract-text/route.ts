
import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Extract text using pdf-parse
        // Note: For doc/docx we might need different parsers like mammoth or textract, 
        // but for now we'll stick to PDF or try basic extraction if possible.
        // Since pdf-parse works specifically for PDFs, let's verify type.
        // For this MVP, we will only robustly support PDF text extraction here. 
        // If the user uploads DOCX, this might fail or need a different lib.
        // Given dependencies, we only have pdf-parse.

        let text = "";

        if (file.type === "application/pdf") {
            const data = await pdf(buffer);
            text = data.text;
        } else {
            // Fallback or todo for other types. 
            // Ideally we shouldn't allow doc/docx upload if we can't parse them locally easily without more libs.
            // But let's return a "not supported" or try to handle.
            return NextResponse.json({ success: false, message: 'Only PDF supported for direct extraction currently' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            text,
            fileName: file.name,
            fileSize: file.size,
            fileType: "pdf"
        });

    } catch (error) {
        console.error("Extraction error:", error);
        return NextResponse.json({ success: false, message: 'Failed to extract text' }, { status: 500 });
    }
}
