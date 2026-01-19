
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Strictly following initialization guidelines
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const summarizeProjectStatus = async (projectName: string, checklist: any[]) => {
  const completed = checklist.filter(c => c.isCompleted).map(c => c.label).join(', ');
  const pending = checklist.filter(c => !c.isCompleted).map(c => c.label).join(', ');

  const prompt = `Summarize the status of project "${projectName}". 
  Completed tasks: ${completed}. 
  Remaining tasks: ${pending}. 
  Provide a short, punchy studio-style status update for a creative entrepreneur.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Status updated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ready for the next session.";
  }
};

export const generateConversationSummary = async (messages: Message[]) => {
  if (messages.length === 0) return "No conversation history logged yet.";

  const conversationString = messages
    .map(m => `[${m.platform}] ${m.sender}: ${m.text}`)
    .join('\n');

  const prompt = `Analyze this conversation between a creative producer and a client. 
  Create a bulleted summary of:
  1. Key creative decisions made.
  2. Next immediate steps.
  3. Client's general mood/energy.
  
  Conversation:
  ${conversationString}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Summary analysis pending.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights currently processing.";
  }
};
