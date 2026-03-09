
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
  const rawKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.schemechecker || "";
  const apiKey = (rawKey === "undefined" || rawKey === "null" || rawKey.includes("TODO")) ? "" : rawKey;
  
  if (!apiKey) {
    console.error("Gemini API Key is missing or invalid. Please ensure GEMINI_API_KEY or schemechecker is set in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any;

  // Try the requested model, then fallback to gemini-flash-latest if it fails with 404
  const modelsToTry = [params.model, 'gemini-flash-latest'].filter((m, i, a) => a.indexOf(m) === i);

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: model as string
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errorMessage = error?.message || "";
        console.error(`Gemini API Attempt (Model: ${model}, Attempt: ${attempt + 1}) failed:`, errorMessage);
        
        // If it's a 404 or model not found, don't retry this model, try the next one
        if (errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found")) {
          break; 
        }

        // Retry on 503 (Service Unavailable), 504 (Gateway Timeout), or 429 (Too Many Requests)
        const shouldRetry = 
          errorMessage.includes("503") || 
          errorMessage.includes("504") || 
          errorMessage.includes("429") ||
          errorMessage.toLowerCase().includes("overwhelmed") ||
          errorMessage.toLowerCase().includes("busy");

        if (shouldRetry && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If we shouldn't retry this specific error, throw or move to next model
        if (model === modelsToTry[modelsToTry.length - 1]) {
          throw error;
        }
        break; // Try next model
      }
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
