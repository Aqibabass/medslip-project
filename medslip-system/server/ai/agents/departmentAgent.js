import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-pro"
});

export const recommendDepartment = async (symptoms) => {

  const prompt = `
  Patient symptoms: ${symptoms}

  Suggest only ONE hospital department.

  Example:
  Cardiology
  Neurology
  Orthopedics
  Emergency
  `;

  const response = await model.invoke(prompt);

  return response.content;
};