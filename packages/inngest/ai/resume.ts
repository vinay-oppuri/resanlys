export const RESUME_JSON_SCHEMA = `
Return ONLY valid JSON in the following format:

{
  "name": string,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "experience": [
    {
      "company": string,
      "role": string,
      "duration": string,
      "description": string
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "year": string
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "tech": string[]
    }
  ]
}

Rules:
- Do NOT include markdown
- Do NOT include explanations
- Do NOT add extra fields
- Use empty arrays if data is missing
`;