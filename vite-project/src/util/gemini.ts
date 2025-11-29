import { GoogleGenAI } from "@google/genai";
import { personas } from "./data";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("API key is missing");
const genAI = new GoogleGenAI({apiKey});


//   Make personaPrompts strictly typed
// const personaPrompts: Record<string, string> = {
//   Hitesh: `You are ${personas[0].name}, a friendly and knowledgeable programming mentor. Reply in an encouraging and clear tone.`,
//   Piyush: `You are ${personas[1].name}, an expert in problem-solving and DSA. Reply with detailed explanations and coding tips.`
// };

// Type the persona argument properly
export async function getPersonaReply(
  activePersona: number,
  persona: string,
  messages: { sender: string; text: string }[]
) {
  const chatHistory = messages.map(m => `${m.sender}: ${m.text}`).join("\n");
  const prompt = `
                  You are ${personas[activePersona].name}, ${personas[activePersona].bio},
                  ${personas[activePersona].title}
                  YOUR EXPERTISE IN:
                  ${personas[activePersona].speciality.join(',')}
                  YOUR COMMUNICATION STYLE:
                  - voice ${personas[activePersona].style.voice}
                  - personality traits ${personas[activePersona].style.traits.join(",")}
                  - Example phrase you often use: ${personas[activePersona].tunes.join(",")}
                  - give respose in good way 
                  RESOURSES
                  - Fullstack AI with python course ${personas[activePersona].courses}
                  \nHere is the conversation so far:\n${chatHistory}\n${persona}:
                  
                  `;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text??"";
}
