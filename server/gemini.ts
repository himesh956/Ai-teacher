import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

const DEFAULT_CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

/**
 * Executes a generateContent call with hard per-call timeout, automatic retry on 503/429,
 * and cascading fallback to alternate valid models.
 */
export async function generateContentWithRetry(
  params: GenerateContentParameters,
  options: {
    maxRetries?: number;
    fallbackModels?: string[];
    timeoutMs?: number;
    overallDeadlineMs?: number;
  } = {}
): Promise<GenerateContentResponse | null> {
  const ai = getGemini();
  if (!ai) {
    return null;
  }

  const {
    maxRetries = 1,
    fallbackModels = DEFAULT_CANDIDATE_MODELS,
    timeoutMs = 7000,
    overallDeadlineMs = 8500
  } = options;

  const startTime = Date.now();
  const modelsToTry = Array.from(new Set([params.model, ...fallbackModels])).filter(Boolean) as string[];

  for (let mIndex = 0; mIndex < modelsToTry.length; mIndex++) {
    // Check if overall deadline exceeded
    if (Date.now() - startTime >= overallDeadlineMs) {
      break;
    }

    const currentModel = modelsToTry[mIndex];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (Date.now() - startTime >= overallDeadlineMs) {
        break;
      }

      try {
        // Execute generateContent with a hard timeout promise
        const callPromise = ai.models.generateContent({
          ...params,
          model: currentModel
        });

        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error(`Call to model ${currentModel} timed out after ${timeoutMs}ms`)), timeoutMs);
        });

        const response = await Promise.race([callPromise, timeoutPromise]) as GenerateContentResponse | null;
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        const errorMsg = err?.message || String(err);
        const is503 = errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE') || errorMsg.includes('high demand');
        const is429 = errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');
        const isTimeout = errorMsg.includes('timed out');
        const isTransient = is503 || is429 || isTimeout || errorMsg.includes('fetch failed') || errorMsg.includes('ECONNRESET');

        if (isTransient && attempt < maxRetries && Date.now() - startTime < overallDeadlineMs - 1500) {
          const delayMs = 400 + Math.random() * 300;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        // If timed out or failed, try next model
        break;
      }
    }
  }

  return null;
}

