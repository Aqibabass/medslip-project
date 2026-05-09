import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-pro"
});

export const detectEmergency = async (symptoms) => {

  const prompt = `
  Symptoms: ${symptoms}

  Determine if this is:
  NORMAL
  URGENT
  EMERGENCY

  Return only one word.
  `;

  const response = await model.invoke(prompt);

  return response.content;
};