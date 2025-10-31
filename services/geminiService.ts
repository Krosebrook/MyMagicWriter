import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { GenerativePart, Suggestion, RephraseSuggestion } from '../types';

if (!process.env.API_KEY) {
  console.warn("API key not found. Please set the process.env.API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateInitialDraft = async (prompt: string, files: GenerativePart[]): Promise<string> => {
  try {
    // FIX: Use gemini-2.5-pro for complex text tasks.
    const model = 'gemini-2.5-pro';
    
    const contentParts: GenerativePart[] = [];
    if (files.length > 0) {
        contentParts.push(...files);
    }
    contentParts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contentParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating initial draft:", error);
    return "Sorry, I encountered an error while generating the draft. Please check the console for details.";
  }
};

export const iterateOnSelection = async (selection: string, instruction: string): Promise<string> => {
  try {
    const model = 'gemini-flash-latest';
    const fullPrompt = `Here is a piece of text:\n\n---\n${selection}\n---\n\nPlease apply the following instruction to it: "${instruction}". Remember to only return the modified text.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error iterating on selection:", error);
    return `Error: Could not process the request. Original text: "${selection}"`;
  }
};

export const getProactiveSuggestion = async (text: string): Promise<Suggestion | null> => {
    if (text.trim().split(' ').length < 20) { // Don't run on very short texts
        return null;
    }

    try {
        const model = 'gemini-flash-latest';
        const prompt = `Analyze the following text. Identify a single, specific sentence or phrase that could be improved for clarity, tone, or impact. Return a JSON object with three keys: 'snippet' containing the exact original text to be replaced, 'suggestion' with your proposed improvement, and 'reason' explaining why the change is an improvement in one short sentence. If no obvious improvements are needed, return null.

Text to analyze:
---
${text}
---
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        snippet: { type: Type.STRING },
                        suggestion: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        if (!jsonString || jsonString.toLowerCase() === 'null') return null;
        
        return JSON.parse(jsonString) as Suggestion;
    } catch (error) {
        console.error("Error getting proactive suggestion:", error);
        return null;
    }
};

export const rephraseSelection = async (selection: string): Promise<RephraseSuggestion[]> => {
  try {
    const model = 'gemini-flash-latest';
    const prompt = `Here is a piece of text:\n\n---\n${selection}\n---\n\nPlease provide exactly 3 alternative ways to phrase this text. Each alternative should have a slightly different nuance. Return a JSON array of objects, where each object has two keys: 'phrasing' (the alternative text) and 'nuance' (a very short, one-to-three word description of the nuance, e.g., "More formal", "More casual", "More direct").`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phrasing: { type: Type.STRING },
              nuance: { type: Type.STRING }
            },
            required: ['phrasing', 'nuance'],
          }
        }
      }
    });

    const jsonString = response.text.trim();
    if (!jsonString) return [];

    return JSON.parse(jsonString) as RephraseSuggestion[];
  } catch (error) {
    console.error("Error rephrasing selection:", error);
    return [];
  }
};

export const getCreativePrompts = async (): Promise<string[]> => {
  try {
    const model = 'gemini-flash-latest';
    const prompt = "You are a creative muse. Suggest 3 interesting and unique creative writing prompts for a short story. Be concise. Return a JSON array of strings.";

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonString = response.text.trim();
    if (!jsonString) return [];
    
    const prompts = JSON.parse(jsonString);
    return Array.isArray(prompts) && prompts.length > 0 ? prompts : ["A map that leads to a place that doesn't exist.", "The last two people on Earth meet by accident."];

  } catch (error) {
    console.error("Error getting creative prompts:", error);
    return ["A map that leads to a place that doesn't exist.", "The last two people on Earth meet by accident.", "A chef who can cook emotions into food."]; // fallback
  }
};

export const generateStorybookImage = async (paragraph: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const prompt = `A beautiful, vibrant, and whimsical watercolor-style illustration for a children's storybook. The illustration should depict the following scene: ${paragraph}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating storybook image:", error);
    return null;
  }
};

export const generateForInsertion = async (prompt: string): Promise<string> => {
  try {
    // FIX: Use gemini-2.5-pro for complex text tasks.
    const model = 'gemini-2.5-pro';
    const fullPrompt = `Based on the following request, generate a piece of text that would be suitable to insert into a larger document. Only return the generated text, with no preamble.\n\nRequest: "${prompt}"`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating for insertion:", error);
    return `\n---\nSorry, I couldn't generate the content. Please try again.\n---\n`;
  }
};