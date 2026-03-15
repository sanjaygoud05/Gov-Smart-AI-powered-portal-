
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
  const rawKey = (import.meta.env.VITE_GEMINI_API_KEY) || 
                 (process.env.GEMINI_API_KEY) || 
                 (process.env.API_KEY) || 
                 (window as any).GEMINI_API_KEY ||
                 "";
  
  // Check for manually entered key in localStorage
  const manualKey = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_GEMINI_API_KEY') : null;
  const finalKey = manualKey || rawKey;
  
  // Debug log for troubleshooting (masked)
  const maskedKey = finalKey && finalKey.length > 8 
    ? `${finalKey.substring(0, 4)}...${finalKey.substring(finalKey.length - 4)}` 
    : (finalKey ? "INVALID_FORMAT" : "MISSING");
  console.log("Gov-Smart AI: API Key Detection (Utils):", maskedKey);
                 
  const apiKey = (finalKey === "undefined" || finalKey === "null" || finalKey.includes("TODO")) ? "" : finalKey;
  
  if (!apiKey) {
    console.warn("Gov-Smart AI: Gemini API Key is missing. The chatbot will be offline. Please set GEMINI_API_KEY in Settings and re-publish.");
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any;

  // Try the requested model, then fallback to stable models
  const modelsToTry = [
    params.model, 
    'gemini-3-flash-preview', 
    'gemini-flash-latest',
    'gemini-3.1-flash-lite-preview'
  ].filter((m, i, a) => a && a.indexOf(m) === i);

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
        const errorMessage = error?.message || String(error);
        console.error(`Gemini API Attempt (Model: ${model}, Attempt: ${attempt + 1}) failed:`, error);
        
        // If it's a 403 (Invalid API Key), don't retry, just throw
        if (errorMessage.includes("403") || errorMessage.toLowerCase().includes("api_key_invalid")) {
          throw new Error("API_KEY_INVALID: The Gemini API key is invalid or restricted. Please check your AI Studio settings.");
        }
        
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
