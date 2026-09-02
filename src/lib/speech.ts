import { TeachingLanguage } from '../types';

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private onSpeakingChangeCallbacks: Set<(isSpeaking: boolean) => void> = new Set();
  private onPhonemeChangeCallbacks: Set<(phoneme: string) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  onSpeakingChange(callback: (isSpeaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.add(callback);
    return () => this.onSpeakingChangeCallbacks.delete(callback);
  }

  onPhonemeChange(callback: (phoneme: string) => void) {
    this.onPhonemeChangeCallbacks.add(callback);
    return () => this.onPhonemeChangeCallbacks.delete(callback);
  }

  private notifySpeaking(speaking: boolean) {
    this.onSpeakingChangeCallbacks.forEach(cb => cb(speaking));
  }

  private notifyPhoneme(phoneme: string) {
    this.onPhonemeChangeCallbacks.forEach(cb => cb(phoneme));
  }

  speak(text: string, language: TeachingLanguage = 'en', speed: number = 1.0, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      this.notifySpeaking(false);
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const langCodeMap: Record<TeachingLanguage, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      hinglish: 'hi-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      ta: 'ta-IN',
      te: 'te-IN'
    };

    utterance.lang = langCodeMap[language] || 'en-US';
    utterance.rate = Math.min(1.3, Math.max(0.7, speed));
    utterance.pitch = 1.05;

    // Pick best available natural voice if loaded
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural')));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    // Phoneme oscillation simulation during speech
    const phonemes = ['A', 'O', 'E', 'M', 'L', 'U'];
    let phonemeInterval: any = null;

    utterance.onstart = () => {
      this.notifySpeaking(true);
      let idx = 0;
      phonemeInterval = setInterval(() => {
        this.notifyPhoneme(phonemes[idx % phonemes.length]);
        idx++;
      }, 140);
    };

    utterance.onend = () => {
      if (phonemeInterval) clearInterval(phonemeInterval);
      this.notifyPhoneme('rest');
      this.notifySpeaking(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (phonemeInterval) clearInterval(phonemeInterval);
      this.notifyPhoneme('rest');
      this.notifySpeaking(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notifyPhoneme('rest');
    this.notifySpeaking(false);
    this.currentUtterance = null;
  }
}

export const speechManager = new SpeechManager();

/**
 * Helper for browser SpeechRecognition (Speech-to-Text)
 */
export function startVoiceRecognition(
  language: TeachingLanguage,
  onResult: (text: string) => void,
  onError: (err: any) => void
): { stop: () => void } {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError(new Error('Speech recognition not supported in this browser. You can type your answer directly!'));
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language === 'hi' || language === 'hinglish' ? 'hi-IN' : 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  };
}
