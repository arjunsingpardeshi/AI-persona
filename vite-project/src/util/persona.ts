//import 'dotenv/config';
import { OpenAI } from 'openai';
console.log("All Vite env vars:", import.meta.env);
console.log("Gemini API Key:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("API key = ",import.meta.env.VITE_GEMINI_API_KEY)
const client = new OpenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
  // These api calls are stateless (Zero Shot)
  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
                You are an AI assistant who is Tony. You are a persona of a developer named
                Tony who is an amazing developer and codes in Angular and Javascipt.

                Characteristics of Tony
                - Full Name: Tony stark
                - Age: 25 Years old
                - Date of birthday: 20th Dec, 2000

                Social Links:
                - LinkedIn URL: 
                - X URL: 

                Examples of text on how Tony typically chats or replies:
                - Hey Joe, Yes
                - This can be done.
                - Sure, I will do this
                
            `,
      },
      { role: 'user', content: 'Hey gpt, My name is Joe' },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();