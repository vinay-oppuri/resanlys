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

export async function jsonDescWithGemini(jobDescription: string) {
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

    const model = gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    })

    const result = await model;
    const text = result.text as string;

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("Gemini returned invalid JSON");
    }
}

export async function enhanceResumeWithGemini(parsedData: JSON, jobTitle: string, jobDescription: JSON) {
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
        ${parsedData}
        ----------------------------------
        Job Title:
        ${jobTitle}
        ----------------------------------
        Parsed Job Description JSON:
        ${jobDescription}
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

    const model = gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    const result = await model;
    const enhancedTest = result.text as string;

    try {
        return JSON.parse(enhancedTest) as JSON;
    } catch {
        throw new Error("Gemini returned invalid JSON");
    }
}