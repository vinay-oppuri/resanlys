import { gemini } from "./llm";
import { RESUME_JSON_SCHEMA } from "./resume";


export async function parseResumeWithGemini(rawText: string) {
    const prompt = `
    You are an ATS resume parser.

    ${RESUME_JSON_SCHEMA}

    Resume text:
    """
    ${rawText.slice(0, 12000)}
    """
    `;

    const model = gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const result = await model;
    const text = result.text as string;

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("Gemini returned invalid JSON");
    }
}