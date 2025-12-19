
import { GoogleGenAI } from "@google/genai";
import { GeminiResponse, GroundingSource } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async askQuestion(question: string): Promise<GeminiResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are an advanced NLP-based Question Answering assistant. Provide clear, concise, and accurate answers. Use markdown for formatting. Always prioritize accuracy and cite your reasoning if complex."
        },
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingSource[] = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          uri: chunk.web!.uri,
          title: chunk.web!.title || 'Source'
        }));

      // Filter unique sources by URI
      const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

      return {
        text,
        sources: uniqueSources
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get an answer from the NLP engine.");
    }
  }
}

export const geminiService = new GeminiService();
