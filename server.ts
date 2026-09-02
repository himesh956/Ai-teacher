import express from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db, teacherPersonas, samplePhysicsDocument } from './server/db.js';
import { IngestionEngine } from './server/ingestion.js';
import { LessonPlanner } from './server/planner.js';
import { TeachingEngine } from './server/teacher.js';
import { AssessmentEngine } from './server/assessment.js';
import { MediaEngine } from './server/media.js';
import { DomainEngine } from './server/domainEngine.js';

const upload = multer({
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '2.5.0', service: 'AI Teacher Engine' });
  });

  // Learner Profile & Analytics
  app.get('/api/learner/profile', (req, res) => {
    const profile = db.getLearner();
    res.json(profile);
  });

  app.post('/api/learner/profile', (req, res) => {
    const updated = db.updateLearner(req.body);
    res.json(updated);
  });

  app.get('/api/learner/analytics', (req, res) => {
    const profile = db.getLearner();
    const mastery = db.getMastery();
    const events = db.getEvents(50);
    const flashcards = db.getFlashcards();
    const notes = db.getNotes();

    // Compute aggregate mastery
    const masteryValues = Object.values(mastery);
    const avgMastery = masteryValues.length > 0
      ? Number((masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length).toFixed(2))
      : 0.65;

    res.json({
      profile,
      overallMastery: avgMastery,
      conceptMastery: mastery,
      recentEvents: events,
      totalFlashcards: flashcards.length,
      totalNotes: notes.length,
      learningStreakDays: 5
    });
  });

  // Teacher Personas
  app.get('/api/teacher/personas', (req, res) => {
    res.json(teacherPersonas);
  });

  // Documents & RAG
  app.get('/api/documents', (req, res) => {
    res.json(db.getDocuments());
  });

  app.get('/api/documents/:id', (req, res) => {
    const doc = db.getDocument(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  });

  app.post('/api/documents/upload', upload.single('file'), (req, res) => {
    try {
      const file = req.file;
      const { title, subject, rawText } = req.body;

      const textContent = rawText || (file ? file.buffer.toString('utf-8') : '');
      const filename = file ? file.originalname : 'manual_upload.txt';
      const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '0.5 MB';

      const docMap = IngestionEngine.processTextDocument(
        title || filename,
        textContent,
        filename,
        fileSize,
        subject || 'General STEM'
      );

      res.json({ success: true, document: docMap });
    } catch (err: any) {
      console.error('Error in document upload:', err);
      res.status(500).json({ error: err.message || 'Failed to process document' });
    }
  });

  app.post('/api/documents/sample', (req, res) => {
    const { sampleType } = req.body;
    if (sampleType === 'physics_ncert') {
      res.json({ success: true, document: samplePhysicsDocument });
    } else {
      res.json({ success: true, document: samplePhysicsDocument });
    }
  });

  // Lesson Planning with Multi-Domain Support
  app.post('/api/lessons/plan', async (req, res) => {
    try {
      const { topic, subject, durationMinutes, difficulty, language, documentId, chapterTitle } = req.body;
      const learnerProfile = db.getLearner();

      const lesson = await LessonPlanner.planLesson({
        topic: topic || 'Stack in C++',
        subject,
        durationMinutes: Number(durationMinutes) || 20,
        difficulty,
        language: language || learnerProfile.preferredLanguage,
        learnerProfile,
        documentId,
        chapterTitle
      });

      db.logEvent({
        type: 'LESSON_STARTED',
        conceptName: lesson.topic,
        details: {
          lessonId: lesson.id,
          durationMinutes: lesson.durationMinutes,
          difficulty: lesson.difficulty,
          language: lesson.language
        }
      });

      res.json(lesson);
    } catch (err: any) {
      console.error('Error planning lesson:', err);
      res.status(500).json({ error: err.message || 'Failed to plan lesson' });
    }
  });

  app.get('/api/lessons/:id', (req, res) => {
    const lesson = db.getLesson(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  });

  // Interactive Question Answer & Misconception Evaluation
  app.post('/api/lessons/evaluate-answer', async (req, res) => {
    try {
      const { question, studentAnswer, language, topicContext } = req.body;
      const learnerProfile = db.getLearner();

      const evaluation = await TeachingEngine.evaluateAnswer({
        question,
        studentAnswer,
        learnerProfile,
        language: language || learnerProfile.preferredLanguage,
        topicContext
      });

      res.json(evaluation);
    } catch (err: any) {
      console.error('Error evaluating answer:', err);
      res.status(500).json({ error: err.message || 'Failed to evaluate answer' });
    }
  });

  // Adaptive Re-teaching Segment
  app.post('/api/lessons/reteach', async (req, res) => {
    try {
      const { conceptName, misconceptionTitle, analogy, language } = req.body;
      const learnerProfile = db.getLearner();

      const segment = await TeachingEngine.generateAdaptiveReteachSegment({
        conceptName,
        misconceptionTitle,
        analogy,
        language: language || learnerProfile.preferredLanguage,
        learnerProfile
      });

      db.logEvent({
        type: 'REEXPLANATION_TRIGGERED',
        conceptName,
        details: {
          misconception: misconceptionTitle,
          strategy: 'analogy_bridge'
        }
      });

      res.json(segment);
    } catch (err: any) {
      console.error('Error generating reteach segment:', err);
      res.status(500).json({ error: err.message || 'Failed to generate reteach segment' });
    }
  });

  // Student Interruption / Doubt Handling
  app.post('/api/lessons/interrupt-question', async (req, res) => {
    try {
      const { studentQuestion, currentConcept, lessonTopic, documentId, language } = req.body;
      const learnerProfile = db.getLearner();

      const response = await TeachingEngine.handleStudentInterruption({
        studentQuestion,
        currentConcept: currentConcept || 'Core Concepts',
        lessonTopic: lessonTopic || 'Lesson Topic',
        documentId,
        language: language || learnerProfile.preferredLanguage
      });

      res.json(response);
    } catch (err: any) {
      console.error('Error handling student doubt:', err);
      res.status(500).json({ error: err.message || 'Failed to answer doubt' });
    }
  });

  // Final Assessment & Feedback
  app.post('/api/lessons/assessment', async (req, res) => {
    try {
      const { lesson, language } = req.body;
      const learnerProfile = db.getLearner();
      const assessment = await AssessmentEngine.generateAssessmentAsync(lesson, language || learnerProfile.preferredLanguage);
      res.json(assessment);
    } catch (err: any) {
      console.error('Error generating assessment:', err);
      res.status(500).json({ error: err.message || 'Failed to generate assessment' });
    }
  });

  app.post('/api/lessons/assessment-submit', (req, res) => {
    try {
      const { assessmentId, answers, language } = req.body;
      const learnerProfile = db.getLearner();
      const evaluated = AssessmentEngine.evaluateAssessmentSubmission(
        assessmentId,
        answers,
        language || learnerProfile.preferredLanguage
      );
      res.json(evaluated);
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      res.status(500).json({ error: err.message || 'Failed to evaluate assessment' });
    }
  });

  // Study Notes & Flashcards
  app.post('/api/lessons/notes', (req, res) => {
    try {
      const { topic } = req.body;
      const learnerProfile = db.getLearner();
      const notes = AssessmentEngine.generateStudyNotes(topic || 'Core Subject', learnerProfile);
      db.saveNotes(notes);
      res.json(notes);
    } catch (err: any) {
      console.error('Error generating notes:', err);
      res.status(500).json({ error: err.message || 'Failed to generate notes' });
    }
  });

  app.get('/api/flashcards', (req, res) => {
    res.json(db.getFlashcards());
  });

  app.post('/api/flashcards/generate', (req, res) => {
    const { topic, weakConcepts } = req.body;
    const cards = AssessmentEngine.generateFlashcards(topic || 'Core Topic', weakConcepts || []);
    db.addFlashcards(cards);
    res.json(cards);
  });

  app.post('/api/flashcards/review', (req, res) => {
    const { id, result } = req.body;
    db.updateFlashcard(id, result);
    res.json({ success: true, flashcards: db.getFlashcards() });
  });

  // Speech & Audio Synthesis
  app.post('/api/tts/synthesize', async (req, res) => {
    try {
      const { text, language, voiceType, speed } = req.body;
      const result = await MediaEngine.synthesizeSpeech(
        text,
        language || 'en',
        voiceType || 'energetic_mentor',
        speed || 1.0
      );
      res.json(result);
    } catch (err: any) {
      console.error('Error in TTS:', err);
      res.status(500).json({ error: err.message || 'Speech synthesis failed' });
    }
  });

  // Developer & Judge Observability Events
  app.get('/api/observability/events', (req, res) => {
    res.json({
      events: db.getEvents(100),
      masteryMap: db.getMastery()
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
