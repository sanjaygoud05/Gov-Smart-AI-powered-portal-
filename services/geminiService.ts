
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_SCHEMES } from "../constants";

/**
 * Searches for relevant schemes using Gemini AI.
 * Uses semantic understanding to map vague user queries to technical scheme categories.
 */
export const searchSchemesAI = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search Query: "${query}"`,
      config: {
        systemInstruction: `You are the "Gov-Smart Search Optimizer". 
        Your task is to identify the most relevant government schemes from the provided database based on a user's intent.
        
        DATABASE: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ 
          id: s.id, 
          title: s.title, 
          description: s.description, 
          category: s.category 
        })))}
        
        RULES:
        1. Analyze keywords, sector intent (e.g., "farming" -> Agriculture), and benefit types.
        2. Return a JSON array containing ONLY the string IDs of the relevant schemes.
        3. Prioritize relevance. If no schemes are relevant, return an empty array [].`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || '[]';
    const relevantIds = JSON.parse(text);
    return MOCK_SCHEMES.filter(s => relevantIds.includes(s.id));
  } catch (error) {
    console.error("AI Search Error:", error);
    // Robust fallback: simple keyword match
    return MOCK_SCHEMES.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Generates personalized scheme recommendations by evaluating citizen demographics
 * against strict and soft eligibility criteria.
 */
export const getAIRecommendations = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CITIZEN PROFILE: ${JSON.stringify(profile)}`,
      config: {
        systemInstruction: `You are the "Gov-Smart Eligibility Engine". 
        Your objective is to match a citizen's demographic profile to government welfare schemes they are likely ELIGIBLE for.

        SCHEME ELIGIBILITY DATA: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ 
          id: s.id, 
          title: s.title, 
          category: s.category,
          level: s.level,
          eligibility: s.eligibility 
        })))}

        EVALUATION STEPS:
        1. Compare citizen's 'state' against 'level' (State schemes only match their specific state).
        2. Compare 'occupation' and 'income' against the eligibility requirements.
        3. Match 'age' and 'gender' where applicable (e.g., Sukanya Samriddhi for girl children).
        4. Match 'caste category' (General/OBC/SC/ST) against specific reservations.
        
        OUTPUT:
        Return a JSON array of scheme IDs that are high-probability matches.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || '[]';
    const recommendedIds = JSON.parse(text);
    
    // Sort results: matches first, then fill with popular if too few matches found
    const matches = MOCK_SCHEMES.filter(s => recommendedIds.includes(s.id));
    
    if (matches.length === 0) {
      // Return a balanced mix of popular categories as fallback
      return MOCK_SCHEMES.slice(0, 4);
    }
    
    return matches;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return MOCK_SCHEMES.slice(0, 4); // Fallback to featured popular schemes
  }
};
