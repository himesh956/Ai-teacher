import {
  LearnerProfile,
  LessonPlan,
  LessonSegment,
  LearningGraph,
  DifficultyLevel,
  TeachingLanguage,
  TeachingContext
} from '../src/types.js';
import { IngestionEngine } from './ingestion.js';
import { db } from './db.js';
import { generateContentWithRetry } from './gemini.js';
import { DomainEngine } from './domainEngine.js';

export class LessonPlanner {
  /**
   * Plan an adaptive lesson based on topic or uploaded document, tailored to learner profile and duration
   */
  static async planLesson(params: {
    topic: string;
    subject?: string;
    durationMinutes: number;
    difficulty?: DifficultyLevel;
    language?: TeachingLanguage;
    learnerProfile: LearnerProfile;
    documentId?: string;
    chapterTitle?: string;
  }): Promise<LessonPlan> {
    const {
      topic,
      subject,
      durationMinutes = 20,
      difficulty = params.learnerProfile.existingKnowledge === 'advanced' ? 'advanced' : 'beginner',
      language = params.learnerProfile.preferredLanguage || 'hinglish',
      learnerProfile,
      documentId,
      chapterTitle
    } = params;

    // 1. Classify domain & topic metadata
    const meta = DomainEngine.classifyTopic(topic, subject);

    // 2. Retrieve RAG grounded context if documentId is provided or if relevant document exists
    const retrieved = IngestionEngine.retrieveContext(topic + (chapterTitle ? ' ' + chapterTitle : ''), documentId, 4);
    const contextText = retrieved.chunks.map(c => `[${c.chapter} | Page ${c.page}]: ${c.content}`).join('\n\n');

    // 3. Try generating through Gemini API with auto-retry and model cascading
    try {
      const prompt = `You are a world-class AI Master Educator creating an adaptive, multimodal lesson.
Learner: ${learnerProfile.name}
Grade Level: ${learnerProfile.gradeLevel}
Current Knowledge: ${learnerProfile.existingKnowledge}
Learning Style: ${learnerProfile.teachingStyle}
Language requested: ${language} (If Hindi or Hinglish, write natural conversational Hinglish/Hindi that students love!)
Subject Domain: "${meta.domain}"
Specific Topic: "${topic}"
Duration: ${durationMinutes} minutes
Target Difficulty: ${difficulty}
Key Expected Concepts: ${meta.keyConcepts.join(', ')}

${contextText ? `GROUNDED SOURCE CONTEXT FROM UPLOADED TEXTBOOK/NOTES:\n${contextText}\n(Prioritize this source text and cite chapter/page)` : ''}

CRITICAL CONTEXT LOCK RULE:
The lesson MUST be 100% strictly about "${topic}" in the domain of "${meta.domain}".
Do NOT output unrelated physics, biology, or other subjects unless explicitly requested.

Generate a structured JSON lesson plan adhering strictly to:
- Time allocated (${durationMinutes} mins)
- Between 2 to 4 logical segments
- For each segment include:
  1. conceptId and conceptName
  2. durationSecs (total summing up to approx ${durationMinutes * 60} seconds)
  3. purpose & teachingStrategy ('first_principles' | 'analogy_bridge' | 'visual_derivation' | 'code_walkthrough' | 'real_world_case')
  4. visualType ('code' | 'formula' | 'diagram' | 'interactive_simulation' | 'concept_map')
  5. scriptText: Spoken monologue by the teacher in ${language}, friendly, engaging, high pedagogical clarity.
  6. visualContent: title, caption, bulletPoints, keyTakeaway, mathEquations (array of LaTeX strings if math/physics), codeSnippet ({ language, code, output } if programming), and diagramData.
  7. question: For interactive segments, include an interactive question with MCQ options, correctAnswer, explanation, hint, diagnosticTarget, and difficulty.

Return strictly JSON adhering to the LessonPlan schema.`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an expert adaptive pedagogy engine. Output strictly valid JSON matching the LessonPlan schema with realistic, high-depth educational content locked strictly to the requested topic.'
        }
      }, {
        maxRetries: 1,
        timeoutMs: 6500,
        overallDeadlineMs: 7500
      });

      if (response && response.text) {
        try {
          const parsed = JSON.parse(response.text);
          const segmentsText = JSON.stringify(parsed.segments || '');
          const relevanceCheck = DomainEngine.validateTopicRelevance(topic, meta.domain, segmentsText);

          if (relevanceCheck.isRelevant && Array.isArray(parsed.segments) && parsed.segments.length > 0) {
            const fullPlan: LessonPlan = {
              id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              topic,
              subject: meta.domain === 'computer_science' ? 'Computer Science & DSA' : meta.domain === 'biology' ? 'Biology' : meta.domain === 'mathematics' ? 'Mathematics' : meta.domain === 'physics' ? 'Physics' : subject || 'General Science',
              objective: parsed.objective || `Master key principles and applications of ${topic}`,
              durationMinutes,
              difficulty,
              language,
              targetConceptGraph: parsed.targetConceptGraph || DomainEngine.buildLearningGraph(topic, meta),
              segments: parsed.segments,
              sourceDocumentId: documentId,
              createdAt: new Date().toISOString()
            };
            db.saveLesson(fullPlan);
            return fullPlan;
          } else {
            console.warn('Relevance guard rejected LLM output:', relevanceCheck.reason || 'Keyword alignment check');
          }
        } catch (parseErr) {
          console.warn('Failed to parse LLM lesson response JSON, using domain generator');
        }
      }
    } catch (err) {
      console.log('Using domain-specific structured lesson generator');
    }

    // 4. Fallback High-Quality Deterministic Generator (Guaranteed instant response & 100% demo-ready)
    return this.buildDeterministicLesson(topic, meta, durationMinutes, difficulty, language, learnerProfile, documentId, retrieved.sourceCitation);
  }

  private static buildDeterministicLesson(
    topic: string,
    meta: any,
    durationMinutes: number,
    difficulty: DifficultyLevel,
    language: TeachingLanguage,
    profile: LearnerProfile,
    documentId?: string,
    sourceCitation?: any
  ): LessonPlan {
    const graph = DomainEngine.buildLearningGraph(topic, meta);
    const segments = DomainEngine.buildDomainSegments(
      topic,
      meta,
      durationMinutes,
      language,
      difficulty,
      profile.teachingStyle,
      sourceCitation
    );

    const plan: LessonPlan = {
      id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      topic,
      subject: meta.domain === 'computer_science' ? 'Computer Science & DSA' : meta.domain === 'biology' ? 'Biology' : meta.domain === 'mathematics' ? 'Mathematics' : meta.domain === 'physics' ? 'Physics' : 'General Science',
      objective: `Master fundamental intuition, practical mechanisms, and common misconceptions in ${topic}`,
      durationMinutes,
      difficulty,
      language,
      targetConceptGraph: graph,
      segments,
      sourceDocumentId: documentId,
      createdAt: new Date().toISOString()
    };

    db.saveLesson(plan);
    return plan;
  }
}
