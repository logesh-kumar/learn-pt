
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Fun facts will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getFunFact(elementName: string): Promise<string> {
  if (!API_KEY) {
    return "Fun facts are currently unavailable. Please configure your API key.";
  }

  try {
    const prompt = `Generate one short, fun, and interesting fact about the element ${elementName} suitable for a student learning chemistry. Make it sound exciting and easy to understand. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching fun fact from Gemini:", error);
    return "Could not load a fun fact at this time. Please try again later.";
  }
}
