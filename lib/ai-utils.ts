
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

/**
 * Utility to call Gemini API with exponential backoff retry logic.
 * This helps handle "server busy" (503) or rate-limiting (429) errors.
 */
export async function generateContentWithRetry(
  params: GenerateContentParameters,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<GenerateContentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || "";
      
      // Retry on 503 (Service Unavailable), 504 (Gateway Timeout), or 429 (Too Many Requests)
      const shouldRetry = 
        errorMessage.includes("503") || 
        errorMessage.includes("504") || 
        errorMessage.includes("429") ||
        errorMessage.toLowerCase().includes("overwhelmed") ||
        errorMessage.toLowerCase().includes("busy");

      if (shouldRetry && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`Gemini API busy. Retrying in ${delay}ms (Attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If we shouldn't retry or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Similar utility for TTS generation.
 */
export async function generateTTSWithRetry(
  params: GenerateContentParameters,
  maxRetries: number = 2,
  initialDelay: number = 1000
): Promise<GenerateContentResponse> {
  // TTS might be more sensitive to latency, so fewer retries by default
  return generateContentWithRetry(params, maxRetries, initialDelay);
}
