
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating upload dir:", e);
    }

    // Create unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name);
    const filename = file.name.replace(ext, '') + '-' + uniqueSuffix + ext;

    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // Construct public URL
    // NOTE: This assumes localhost:3000 for now. In prod, use env var.
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
}
