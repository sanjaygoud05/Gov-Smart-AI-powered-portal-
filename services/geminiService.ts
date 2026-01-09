
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_SCHEMES } from "../constants";

/**
 * Searches for relevant schemes using Gemini AI.
 * Focuses on active, non-expired official schemes.
 */
export const searchSchemesAI = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search Query: "${query}". Identify all relevant active official government schemes.`,
      config: {
        systemInstruction: `You are the "Gov-Smart Navigator". 
        Your task is to identify relevant official government schemes from the provided database.
        
        DATABASE: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ 
          id: s.id, 
          title: s.title, 
          description: s.description, 
          category: s.category,
          updatedAt: s.updatedAt
        })))}
        
        RULES:
        1. Return schemes that match the user's intent or keywords.
        2. Ensure they are currently active and official.
        3. Return a JSON array of matched scheme objects with their IDs.
        4. If no exact match found, provide the closest relevant programs.
        5. Output MUST be valid JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text || '[]';
    const results = JSON.parse(text);
    
    const finalResults = results
      .map((res: any) => MOCK_SCHEMES.find(s => s.id === res.id))
      .filter(Boolean);
    
    return finalResults.length > 0 ? finalResults : MOCK_SCHEMES.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("AI Search Error:", error);
    return MOCK_SCHEMES.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Generates personalized recommendations by rigorously matching user profile 
 * against all active scheme criteria in the database.
 */
export const getAIRecommendations = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CITIZEN PROFILE: ${JSON.stringify(profile)}. Find every official scheme they qualify for.`,
      config: {
        systemInstruction: `You are the "Gov-Smart Eligibility Engine". 
        Your goal is to match this citizen to ALL official government welfare programs they qualify for.

        DATABASE (SCHEME ELIGIBILITY CRITERIA): ${JSON.stringify(MOCK_SCHEMES.map(s => ({ 
          id: s.id, 
          title: s.title, 
          category: s.category,
          eligibility: s.eligibility,
          updatedAt: s.updatedAt
        })))}

        STRICT MATCHING RULES:
        1. Evaluate EVERY scheme in the database against the profile (Age, State, Occupation, Income).
        2. Age 70+: Match universal Ayushman Bharat.
        3. Farmer: Match PM-KISAN, MGNREGA.
        4. Students: Match PM-Vidyalaxmi, Sukanya Samriddhi (if applicable).
        5. Low Income: Match PMAY, Ayushman Bharat, MGNREGA.
        6. SHG Women: Match Lakhpati Didi.
        7. Only return schemes that the user LIKELY qualifies for based on the criteria.
        8. Return a JSON array of scheme IDs.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || '[]';
    const recommendedIds = JSON.parse(text);
    
    const matches = MOCK_SCHEMES.filter(s => recommendedIds.includes(s.id));
    // If AI fails or returns empty, fallback to basic keyword/logic filter
    if (matches.length === 0) {
      return MOCK_SCHEMES.filter(s => {
        const desc = (s.title + s.description + s.eligibility.join(' ')).toLowerCase();
        const occ = (profile.occupation || '').toLowerCase();
        return occ && desc.includes(occ);
      }).slice(0, 4);
    }
    return matches;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return MOCK_SCHEMES.slice(0, 4);
  }
};
