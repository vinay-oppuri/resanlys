import * as pdfParseLib from "pdf-parse";
// @ts-ignore
const pdf = pdfParseLib.default ?? pdfParseLib;

export async function extractTextFromPdf(fileUrl: string) {
    // If the URL is relative (e.g. from local upload without host), we might need to handle it. 
    // But our upload API returns absolute URLs.
    // If running in Docker/Container, localhost might fail, but for local dev it's fine.

    console.log(`Extracting text from: ${fileUrl}`);
    const res = await fetch(fileUrl);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch PDF from ${fileUrl}: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const data = await pdf(buffer);

    return data.text;
}
