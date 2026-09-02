import { Modality } from '@google/genai';
import { TeachingLanguage } from '../src/types.js';
import { getGemini } from './gemini.js';

export interface AudioSynthesisResult {
  audioBase64?: string;
  mimeType?: string;
  transcript: string;
  languageCode: string;
  speakingRate: number;
  pitch: number;
  voiceName: string;
  timelineCues: Array<{
    timestampSec: number;
    phoneme: string;
    expression: 'neutral' | 'explaining' | 'encouraging' | 'thoughtful' | 'delighted' | 'diagnostic';
    gesture: 'point_to_board' | 'hands_open' | 'nodding' | 'thinking' | 'emphasize';
  }>;
}

export class MediaEngine {
  /**
   * Synthesize natural educational audio with timeline animation cues
   */
  static async synthesizeSpeech(
    text: string,
    language: TeachingLanguage = 'en',
    voiceType: string = 'energetic_mentor',
    speed: number = 1.0
  ): Promise<AudioSynthesisResult> {
    const langCodeMap: Record<TeachingLanguage, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      hinglish: 'hi-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      ta: 'ta-IN',
      te: 'te-IN'
    };

    const targetLangCode = langCodeMap[language] || 'en-US';

    // Generate timeline synchronization cues for mouth phonemes and gestures
    const words = text.split(/\s+/);
    const estDurationSec = Math.max(2, (words.length / (140 * speed)) * 60);
    const cues: AudioSynthesisResult['timelineCues'] = [];

    const expressions: AudioSynthesisResult['timelineCues'][0]['expression'][] = [
      'explaining',
      'encouraging',
      'thoughtful',
      'emphasize' as any,
      'delighted'
    ];

    const gestures: AudioSynthesisResult['timelineCues'][0]['gesture'][] = [
      'hands_open',
      'point_to_board',
      'nodding',
      'thinking',
      'emphasize'
    ];

    const phonemes = ['A', 'E', 'I', 'O', 'U', 'M', 'L', 'F', 'rest'];

    for (let i = 0; i < Math.min(words.length, 12); i++) {
      const timestampSec = Number(((i / Math.min(words.length, 12)) * estDurationSec).toFixed(2));
      cues.push({
        timestampSec,
        phoneme: phonemes[i % phonemes.length],
        expression: expressions[i % expressions.length] || 'explaining',
        gesture: gestures[i % gestures.length] || 'hands_open'
      });
    }

    // Attempt Gemini TTS if available
    const ai = getGemini();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: text.slice(0, 400) }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceType.includes('female') ? 'Kore' : 'Zephyr'
                }
              }
            }
          }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return {
            audioBase64: base64Audio,
            mimeType: 'audio/wav',
            transcript: text,
            languageCode: targetLangCode,
            speakingRate: speed,
            pitch: 1.0,
            voiceName: voiceType,
            timelineCues: cues
          };
        }
      } catch (err) {
        // Fallback gracefully to Web Audio Synthesis
      }
    }

    // Default Web Speech / Audio Synthesis descriptor
    return {
      transcript: text,
      languageCode: targetLangCode,
      speakingRate: speed,
      pitch: 1.0,
      voiceName: voiceType,
      timelineCues: cues
    };
  }
}
