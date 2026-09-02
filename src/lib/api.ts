import {
  LearnerProfile,
  DocumentKnowledgeMap,
  LessonPlan,
  LessonSegment,
  StudentEvaluation,
  InteractiveQuestion,
  FinalAssessment,
  StudyNotes,
  Flashcard,
  TeacherPersona,
  TeachingLanguage
} from '../types';

/**
 * Safe fetch wrapper with hard timeout to guarantee no infinite hanging
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 25000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

export const api = {
  // Learner Profile & Analytics
  async getProfile(): Promise<LearnerProfile> {
    try {
      const res = await fetchWithTimeout('/api/learner/profile', {}, 10000);
      if (!res.ok) throw new Error('Failed to load profile');
      return await res.json();
    } catch (err) {
      console.warn('Using default learner profile:', err);
      return {
        id: 'learner_default',
        name: 'Aarav Sharma',
        gradeLevel: 'high_school',
        existingKnowledge: 'beginner',
        targetExam: 'cbse_boards',
        preferredLanguage: 'hinglish',
        teachingStyle: 'analogy',
        speechSpeed: 1.0,
        avatarPersona: 'prof_vikram',
        voiceType: 'energetic_mentor',
        learningGoal: 'Master Data Structures and STEM Concepts'
      };
    }
  },

  async updateProfile(profile: LearnerProfile): Promise<LearnerProfile> {
    try {
      const res = await fetchWithTimeout('/api/learner/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      }, 10000);
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch (err) {
      console.warn('Failed to persist profile remotely, returning local update:', err);
      return profile;
    }
  },

  async getAnalytics(): Promise<any> {
    try {
      const res = await fetchWithTimeout('/api/learner/analytics', {}, 10000);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback analytics:', err);
      return {
        overallMastery: 0.72,
        conceptMastery: { 'LIFO Principle': 0.85, 'Push & Pop': 0.78, 'Stack Underflow': 0.65 },
        recentEvents: [],
        totalFlashcards: 6,
        totalNotes: 2,
        learningStreakDays: 5
      };
    }
  },

  async getTeacherPersonas(): Promise<TeacherPersona[]> {
    try {
      const res = await fetchWithTimeout('/api/teacher/personas', {}, 10000);
      if (!res.ok) throw new Error('Failed to fetch personas');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  // Documents & RAG
  async getDocuments(): Promise<DocumentKnowledgeMap[]> {
    try {
      const res = await fetchWithTimeout('/api/documents', {}, 10000);
      if (!res.ok) throw new Error('Failed to fetch documents');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async uploadDocument(formData: FormData): Promise<{ success: boolean; document: DocumentKnowledgeMap }> {
    const res = await fetchWithTimeout('/api/documents/upload', {
      method: 'POST',
      body: formData
    }, 30000);
    if (!res.ok) throw new Error('Upload failed on server');
    return await res.json();
  },

  async loadSampleDocument(sampleType: string = 'physics_ncert'): Promise<{ success: boolean; document: DocumentKnowledgeMap }> {
    const res = await fetchWithTimeout('/api/documents/sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sampleType })
    }, 10000);
    if (!res.ok) throw new Error('Failed to load sample');
    return await res.json();
  },

  // Lesson Planning
  async planLesson(params: {
    topic: string;
    subject?: string;
    durationMinutes: number;
    difficulty?: string;
    language?: TeachingLanguage;
    documentId?: string;
    chapterTitle?: string;
  }): Promise<LessonPlan> {
    const res = await fetchWithTimeout('/api/lessons/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 30000);
    if (!res.ok) throw new Error('Failed to generate lesson plan');
    return await res.json();
  },

  // Interactive Teaching & Evaluation
  async evaluateAnswer(params: {
    question: InteractiveQuestion;
    studentAnswer: string;
    language: TeachingLanguage;
    topicContext?: string;
  }): Promise<StudentEvaluation> {
    const res = await fetchWithTimeout('/api/lessons/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 20000);
    if (!res.ok) throw new Error('Evaluation failed');
    return await res.json();
  },

  async getAdaptiveReteachSegment(params: {
    conceptName: string;
    misconceptionTitle: string;
    analogy: string;
    language: TeachingLanguage;
  }): Promise<LessonSegment> {
    const res = await fetchWithTimeout('/api/lessons/reteach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 20000);
    if (!res.ok) throw new Error('Reteach failed');
    return await res.json();
  },

  async askDoubt(params: {
    studentQuestion: string;
    currentConcept: string;
    lessonTopic: string;
    documentId?: string;
    language: TeachingLanguage;
  }): Promise<{ answerText: string; groundedCitation?: any; relatesToCurrentTopic: boolean }> {
    const res = await fetchWithTimeout('/api/lessons/interrupt-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 20000);
    if (!res.ok) throw new Error('Doubt handling failed');
    return await res.json();
  },

  // Assessments
  async generateAssessment(lesson: LessonPlan, language: TeachingLanguage): Promise<FinalAssessment> {
    const res = await fetchWithTimeout('/api/lessons/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson, language })
    }, 25000);
    if (!res.ok) throw new Error('Failed to generate assessment');
    return await res.json();
  },

  async submitAssessment(assessmentId: string, answers: Record<string, string>, language?: TeachingLanguage): Promise<FinalAssessment> {
    const res = await fetchWithTimeout('/api/lessons/assessment-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId, answers, language })
    }, 15000);
    if (!res.ok) throw new Error('Failed to submit assessment');
    return await res.json();
  },

  // Notes & Flashcards
  async generateNotes(topic: string, language: TeachingLanguage): Promise<StudyNotes> {
    const res = await fetchWithTimeout('/api/lessons/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, language })
    }, 15000);
    if (!res.ok) throw new Error('Failed to generate notes');
    return await res.json();
  },

  async getFlashcards(): Promise<Flashcard[]> {
    try {
      const res = await fetchWithTimeout('/api/flashcards', {}, 10000);
      if (!res.ok) throw new Error('Failed to fetch flashcards');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async generateFlashcards(topic: string, weakConcepts: string[] = []): Promise<Flashcard[]> {
    const res = await fetchWithTimeout('/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, weakConcepts })
    }, 15000);
    if (!res.ok) throw new Error('Failed to generate flashcards');
    return await res.json();
  },

  async reviewFlashcard(id: string, result: 'correct' | 'incorrect'): Promise<{ success: boolean; flashcards: Flashcard[] }> {
    const res = await fetchWithTimeout('/api/flashcards/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, result })
    }, 10000);
    if (!res.ok) throw new Error('Failed to review flashcard');
    return await res.json();
  },

  // Observability & Events
  async getObservabilityEvents(): Promise<{ events: any[]; masteryMap: Record<string, number> }> {
    const res = await fetchWithTimeout('/api/observability/events', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch events');
    return await res.json();
  }
};
