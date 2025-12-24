import dotenv from "dotenv";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Explicitly load .env from package root
// process.cwd() is likely "apps/web" when running the app
// So we look for "../../packages/inngest/.env"
const envPath = path.resolve(process.cwd(), "../../packages/inngest/.env");
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("❌ GOOGLE_API_KEY is missing in process.env!");
    console.error("Checked path:", envPath);
    console.error("CWD:", process.cwd());
} else {
    console.log("✅ GOOGLE_API_KEY loaded successfully");
}

export const gemini = new GoogleGenAI({ apiKey });