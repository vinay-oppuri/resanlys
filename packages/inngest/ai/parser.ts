import { gemini } from "./llm";
import { RESUME_JSON_SCHEMA } from "./resume";

interface ResumeData {
    name: string;
    email: string | null;
    phone: string | null;
    skills: string[];
    experience: Array<{
        company: string;
        role: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        year: string;
    }>;
    projects: Array<{
        title: string;
        description: string;
        tech: string[];
    }>;
    [key: string]: any;
}

interface JobDescriptionData {
    role_title: string;
    seniority_level: string;
    required_skills: string[];
    preferred_skills: string[];
    tools_and_technologies: string[];
    responsibilities: string[];
    experience_requirements: string;
    keywords: string[];
    [key: string]: any;
}

interface AnalysisResult {
    missing_keywords: string[];
    weak_or_underrepresented_skills: string[];
    bullet_point_improvements: Array<{
        original: string;
        improved: string;
    }>;
    section_level_suggestions: string[];
    overall_match_feedback: string;
    [key: string]: any;
}

export async function parseResumeWithGemini(rawText: string): Promise<ResumeData> {
    const prompt = `
    You are an ATS resume parser.

    ${RESUME_JSON_SCHEMA}

    Resume text:
    """
    ${rawText.slice(0, 12000)}
    """
    
    OUTPUT MUST BE VALID JSON.
    `;

    try {
        const model = gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const result = await model;
        const text = result.text;

        if (!text) {
            throw new Error("Gemini returned empty text response");
        }

        // Clean up markdown code blocks if present (even with JSON mode, sometimes it wraps)
        const cleanedText = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error parsing resume with Gemini:", error);
        throw new Error("Gemini returned invalid JSON or failed to parse resume.");
    }
}

export async function jsonDescWithGemini(jobDescription: string): Promise<JobDescriptionData> {
    const prompt = `
        You are an expert technical recruiter and ATS system.

        Your task is to analyze a job description and extract structured, machine-readable information.
        Only use information that is explicitly stated or clearly implied in the job description.
        Do NOT infer technologies, skills, or experience that are not mentioned.

        ----------------------------------
        Job Description Text:
        ${jobDescription}
        ----------------------------------

        Extract and return the following information:

        1. role_title
        - The job title or role name.

        2. seniority_level
        - One of: intern, junior, mid, senior, lead, manager, unspecified

        3. required_skills
        - Skills or technologies explicitly marked as required or must-have.

        4. preferred_skills
        - Skills or technologies marked as preferred, good-to-have, or optional.

        5. tools_and_technologies
        - Frameworks, languages, platforms, databases, cloud services, or tools mentioned.

        6. responsibilities
        - Key responsibilities or duties listed in the job description.
        - Keep them concise and factual.

        7. experience_requirements
        - Years of experience or level expectations if mentioned.
        - Example: "2–4 years", "fresh graduates", "5+ years"

        8. keywords
        - Important ATS keywords and phrases relevant to this role.
        - Include role-specific terms, methodologies, and domain keywords.

        ----------------------------------
        Output Rules:
        - Output MUST be valid JSON
        - Do NOT include markdown
        - Do NOT include explanations
        - Do NOT hallucinate or add missing info
        - If a field is not found, return an empty array or null
        ----------------------------------

        Expected Output Format:
        {
        "role_title": "",
        "seniority_level": "",
        "required_skills": [],
        "preferred_skills": [],
        "tools_and_technologies": [],
        "responsibilities": [],
        "experience_requirements": "",
        "keywords": []
        }
    `

    try {
        const model = gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const result = await model;
        const text = result.text;

        if (!text) {
            throw new Error("Gemini returned empty text response");
        }

        const cleanedText = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error parsing job description:", error);
        throw new Error("Gemini returned invalid JSON");
    }
}

export async function enhanceResumeWithGemini(parsedData: any, jobTitle: string, jobDescription: any): Promise<AnalysisResult> {
    const prompt = `
        You are an expert ATS resume reviewer and hiring manager.

        Your task is to suggest improvements to a resume so that it better matches a given job description.
        You must ONLY use the information present in the resume JSON.
        DO NOT invent experience, skills, tools, or companies that are not already present.

        You are given:
        1. Parsed Resume JSON
        2. Job Title
        3. Parsed Job Description JSON

        ----------------------------------
        Parsed Resume JSON:
        ${JSON.stringify(parsedData)}
        ----------------------------------
        Job Title:
        ${jobTitle}
        ----------------------------------
        Parsed Job Description JSON:
        ${JSON.stringify(jobDescription)}
        ----------------------------------

        Analyze the resume against the job description and provide enhancement suggestions under the following sections:

        1. missing_keywords
        - List important skills, tools, or keywords present in the job description but missing from the resume.
        - Only include keywords that could realistically be added based on existing resume content.

        2. weak_or_underrepresented_skills
        - Skills that exist in the resume but are not emphasized enough compared to the job description.
        - Explain briefly how they could be strengthened.

        3. bullet_point_improvements
        - Suggest rewritten versions of existing bullet points to better align with the job description.
        - Do NOT add new responsibilities.
        - Focus on clarity, impact, and ATS optimization.
        - Use strong action verbs and measurable outcomes where possible.

        4. section_level_suggestions
        - Suggestions like:
        - Add a "Skills" section
        - Reorder sections
        - Rename section headers for ATS clarity
        - Keep suggestions minimal and practical.

        5. overall_match_feedback
        - Short summary (2–3 lines) explaining:
        - Why the resume matches or does not match the role
        - The biggest improvement opportunity

        ----------------------------------
        Output Rules:
        - Output MUST be valid JSON
        - Do NOT include markdown
        - Do NOT include explanations outside JSON
        - Do NOT hallucinate experience
        - Be concise, practical, and honest
        ----------------------------------

        Expected Output Format:
        {
        "missing_keywords": [],
        "weak_or_underrepresented_skills": [],
        "bullet_point_improvements": [
            {
            "original": "",
            "improved": ""
            }
        ],
        "section_level_suggestions": [],
        "overall_match_feedback": ""
        }
    `;

    try {
        const model = gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const result = await model;
        const enhancedTest = result.text;

        if (!enhancedTest) {
            throw new Error("Gemini returned empty text response");
        }

        const cleanedText = enhancedTest.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error enhancing resume:", error);
        throw new Error("Gemini returned invalid JSON for resume enhancement.");
    }
}

export const latexGenerator = async (resume: any): Promise<string> => {
    const prompt = `
    You are an expert LaTeX resume generator.

    ${RESUME_JSON_SCHEMA}

    Resume JSON:
    """
    ${JSON.stringify(resume)}
    """
    
    Output ONLY the raw LaTeX code. Do not include markdown formatting like \`\`\`latex or \`\`\`.
    `;

    try {
        const model = gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            // Note: We do NOT use responseMimeType: "application/json" here because we want raw text (LaTeX)
        });

        const result = await model;
        const text = result.text;

        if (!text) {
            throw new Error("Gemini returned empty text response");
        }

        // Clean up potential markdown code blocks if the prompt instruction fails
        const cleanedText = text.replace(/^```latex\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

        return cleanedText;
    } catch (error) {
        console.error("Error generating LaTeX:", error);
        throw new Error("Failed to generate LaTeX resume.");
    }
}

export const jobQueryGenerator = async (resume: any, jobTitle: string, jobDescription: any): Promise<string[]> => {
    const prompt = `
        You are a job search optimization engine.

        INPUT:
        - Job title (user intent): ${jobTitle}
        - Resume JSON: ${JSON.stringify(resume)}
        - Job description JSON: ${JSON.stringify(jobDescription)}

        TASK:
        Generate 3 to 5 optimized job search queries that would return
        the most relevant job listings.

        RULES:
        - Each query must be 5–10 words
        - Include role + core skills
        - Prefer entry-level wording if experience < 2 years (based on resume)
        - Do NOT include company names
        - Do NOT include explanations
        - Do NOT include numbering or bullets
        - OUTPUT MUST BE A VALID JSON ARRAY OF STRINGS: ["query 1", "query 2", ...]

        OUTPUT:
    `;

    try {
        const model = gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const result = await model;
        const text = result.text;

        if (!text) {
            return [];
        }

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

        const queries = JSON.parse(cleanedText);

        if (Array.isArray(queries)) {
            return queries.filter(q => typeof q === "string" && q.length > 0);
        }

        return [];
    } catch (error) {
        console.error("Error generating job queries:", error);
        return [];
    }
}