import { GoogleGenAI } from "@google/genai";
console.log("All Vite env vars:", import.meta.env);
console.log("Gemini API Key:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("API key = ",import.meta.env.VITE_GEMINI_API_KEY)

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("API key is missing");
const genAI = new GoogleGenAI({apiKey});

// 1️⃣ Define allowed persona names
type PersonaName = "Hitesh" | "Piyush";

// 2️⃣ Make personaPrompts strictly typed
const personaPrompts: Record<PersonaName, string> = {
  Hitesh: "You are Hitesh Choudhary, a friendly and knowledgeable programming mentor. Reply in an encouraging and clear tone.",
  Piyush: "You are Piyush Garg, an expert in problem-solving and DSA. Reply with detailed explanations and coding tips."
};

// 3️⃣ Type the persona argument properly
export async function getPersonaReply(
  persona: PersonaName,
  messages: { sender: string; text: string }[]
) {
  const chatHistory = messages.map(m => `${m.sender}: ${m.text}`).join("\n");

  const prompt = `${personaPrompts[persona]}\nHere is the conversation so far:\n${chatHistory}\n${persona}:`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text??"";
}
