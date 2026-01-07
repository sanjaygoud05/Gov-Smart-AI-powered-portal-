
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_SCHEMES } from "../constants";

/**
 * Searches for relevant schemes using Gemini AI to understand intent.
 */
export const searchSchemesAI = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a government scheme expert. Given the following schemes: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ id: s.id, title: s.title, description: s.description })))}. 
      The user is searching for: "${query}". 
      Return a JSON array of scheme IDs that are most relevant to the search query. Return only the IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const relevantIds = JSON.parse(response.text || '[]');
    return MOCK_SCHEMES.filter(s => relevantIds.includes(s.id));
  } catch (error) {
    console.error("AI Search Error:", error);
    // Simple fallback
    return MOCK_SCHEMES.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Generates personalized scheme recommendations based on a user profile.
 */
export const getAIRecommendations = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Demographics: ${JSON.stringify(profile)}.
      Database of Schemes: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ id: s.id, title: s.title, eligibility: s.eligibility })))}.
      Compare the demographics against the eligibility criteria. Recommend schemes the user is likely eligible for. Return a JSON array of scheme IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || '[]');
    return MOCK_SCHEMES.filter(s => recommendedIds.includes(s.id));
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return MOCK_SCHEMES.slice(0, 4); // Fallback to featured
  }
};
