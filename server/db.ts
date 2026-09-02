import {
  LearnerProfile,
  DocumentKnowledgeMap,
  LessonPlan,
  TeachingEvent,
  ConceptNode,
  Flashcard,
  StudyNotes,
  FinalAssessment
} from '../src/types.js';

// Pre-seeded default learner profile
export const defaultLearner: LearnerProfile = {
  id: 'learner_default_101',
  name: 'Aarav Sharma',
  gradeLevel: 'high_school',
  existingKnowledge: 'beginner',
  learningGoal: 'Master Newton\'s Laws & Mechanics for CBSE / JEE Foundation',
  preferredLanguage: 'hinglish',
  teachingStyle: 'analogy',
  targetExam: 'cbse_boards',
  avatarPersona: 'prof_vikram',
  voiceType: 'energetic_mentor',
  speechSpeed: 1.0,
};

// Pre-seeded Teacher Personas
export const teacherPersonas = [
  {
    id: 'prof_vikram',
    name: 'Prof. Vikram Sharma',
    role: 'Senior Physics & STEM Educator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    specialty: 'Physics, Mechanics, Intuitive Analogies & Indian Curriculum',
    accent: 'Indian English / Hindi / Hinglish',
    tone: 'Encouraging, Warm & Intuitive',
    avatarSeed: 'vikram'
  },
  {
    id: 'dr_sarah',
    name: 'Dr. Sarah Chen',
    role: 'AI & Data Science Professor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    specialty: 'Machine Learning, Neural Networks & Mathematics',
    accent: 'Global English / Bilingual',
    tone: 'Structured, Clear & First-Principles',
    avatarSeed: 'sarah'
  },
  {
    id: 'maya_mentor',
    name: 'Maya Patel',
    role: 'Interactive Socratic Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    specialty: 'Conceptual Clarity, Misconception Busting & Socratic Dialogue',
    accent: 'Hindi / Hinglish / English',
    tone: 'Enthusiastic, Engaging & Supportive',
    avatarSeed: 'maya'
  },
  {
    id: 'alex_tech',
    name: 'Alex Rivera',
    role: 'Software Architect & Coding Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    specialty: 'Algorithms, Web Development & System Design',
    accent: 'American English / Spanish',
    tone: 'Pragmatic, Direct & Interactive Code Flow',
    avatarSeed: 'alex'
  }
];

// Pre-seeded Document 1: Physics Textbook Chapter 4 (Newton's Laws of Motion)
export const samplePhysicsDocument: DocumentKnowledgeMap = {
  id: 'doc_ncert_phys_ch4',
  title: 'NCERT Physics Class XI — Chapter 4: Laws of Motion',
  subject: 'Physics',
  filename: 'NCERT_Class11_Physics_Ch04_Laws_of_Motion.pdf',
  fileSize: '4.2 MB',
  totalPages: 28,
  extractedAt: new Date().toISOString(),
  chapters: [
    {
      chapterNum: 4,
      title: 'Laws of Motion',
      sections: [
        '4.1 Introduction to Aristotelian Fallacy',
        '4.2 Newton\'s First Law of Motion (Inertia)',
        '4.3 Momentum and Newton\'s Second Law of Motion',
        '4.4 Newton\'s Third Law of Motion (Action and Reaction)',
        '4.5 Conservation of Linear Momentum',
        '4.6 Equilibrium of a Particle and Free Body Diagrams',
        '4.7 Common Forces in Mechanics and Friction'
      ],
      summary: 'Comprehensive treatment of Newtonian mechanics, dynamic equilibria, inertial reference frames, and force interactions.',
      keyFormulas: [
        'F_net = m * a',
        'p = m * v',
        'F_AB = - F_BA',
        'f_s <= mu_s * N'
      ]
    }
  ],
  conceptMap: [
    { concept: 'Inertia & State of Motion', chapter: 'Chapter 4', importance: 'foundational', prerequisites: [] },
    { concept: 'Net Force & Acceleration (F=ma)', chapter: 'Chapter 4', importance: 'high', prerequisites: ['Inertia & State of Motion'] },
    { concept: 'Action-Reaction Pairs (Newton\'s 3rd Law)', chapter: 'Chapter 4', importance: 'high', prerequisites: ['Net Force & Acceleration (F=ma)'] },
    { concept: 'Conservation of Linear Momentum', chapter: 'Chapter 4', importance: 'high', prerequisites: ['Action-Reaction Pairs (Newton\'s 3rd Law)'] },
    { concept: 'Static & Kinetic Friction', chapter: 'Chapter 4', importance: 'medium', prerequisites: ['Net Force & Acceleration (F=ma)'] }
  ],
  chunks: [
    {
      id: 'chunk_phys_1',
      documentId: 'doc_ncert_phys_ch4',
      chapter: 'Chapter 4: Laws of Motion',
      section: '4.2 Newton\'s First Law',
      page: 90,
      heading: 'The Law of Inertia',
      content: 'Every body continues to be in its state of rest or of uniform motion in a straight line unless compelled by some external unbalanced force to act otherwise. The resistance of a body to change its state of motion is termed Inertia, which directly scales with mass.',
      contentType: 'definition',
      keywords: ['inertia', 'first law', 'unbalanced force', 'rest', 'uniform motion']
    },
    {
      id: 'chunk_phys_2',
      documentId: 'doc_ncert_phys_ch4',
      chapter: 'Chapter 4: Laws of Motion',
      section: '4.3 Momentum & Second Law',
      page: 93,
      heading: 'Newton\'s Second Law of Motion',
      content: 'The rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction in which the force acts. Mathematically, F = dp/dt. For constant mass m, F = m * a. Hence 1 Newton is defined as the force that accelerates a 1kg mass by 1 m/s^2.',
      contentType: 'formula',
      keywords: ['momentum', 'force', 'acceleration', 'F=ma', 'second law', 'derivative']
    },
    {
      id: 'chunk_phys_3',
      documentId: 'doc_ncert_phys_ch4',
      chapter: 'Chapter 4: Laws of Motion',
      section: '4.4 Third Law of Motion',
      page: 96,
      heading: 'Action and Reaction Pairs',
      content: 'To every action, there is always an equal and opposite reaction. Crucial insight: Action and reaction forces act simultaneously on TWO DIFFERENT bodies, never on the same body. Therefore, they never cancel each other out to prevent acceleration.',
      contentType: 'text',
      keywords: ['third law', 'action', 'reaction', 'different bodies', 'opposite directions']
    },
    {
      id: 'chunk_phys_4',
      documentId: 'doc_ncert_phys_ch4',
      chapter: 'Chapter 4: Laws of Motion',
      section: '4.5 Conservation of Momentum',
      page: 99,
      heading: 'Isolated Systems & Momentum Conservation',
      content: 'In an isolated system where net external force is zero, the total vector momentum remains invariant over time: Total Initial Momentum = Total Final Momentum (m1*v1 + m2*v2 = m1*u1 + m2*u2). Explains rocket propulsion and firearm recoil.',
      contentType: 'example',
      keywords: ['conservation', 'momentum', 'isolated system', 'rocket', 'recoil']
    }
  ]
};

// In-memory Database Store
class DatabaseStore {
  private learners: Map<string, LearnerProfile> = new Map();
  private documents: Map<string, DocumentKnowledgeMap> = new Map();
  private lessons: Map<string, LessonPlan> = new Map();
  private events: TeachingEvent[] = [];
  private mastery: Map<string, number> = new Map(); // conceptName -> score
  private flashcards: Flashcard[] = [];
  private notes: StudyNotes[] = [];
  private assessments: Map<string, FinalAssessment> = new Map();

  constructor() {
    this.learners.set(defaultLearner.id, defaultLearner);
    this.documents.set(samplePhysicsDocument.id, samplePhysicsDocument);

    // Initial mastery seed
    this.mastery.set('Inertia & State of Motion', 0.85);
    this.mastery.set('Net Force & Acceleration (F=ma)', 0.50);
    this.mastery.set('Action-Reaction Pairs', 0.30);
    this.mastery.set('Conservation of Momentum', 0.20);
    this.mastery.set('Friction & Equilibrium', 0.10);

    // Initial flashcards
    this.flashcards = [
      {
        id: 'fc_1',
        concept: 'Newton\'s First Law (Inertia)',
        prompt: 'Why do passengers lurch forward when a moving bus suddenly hits the brakes?',
        answer: 'Due to Inertia of Motion: The passengers\' bodies tend to maintain their forward velocity while the bus decelerates.',
        analogyOrTip: 'Think of a skateboard stopping at a curb—you keep gliding forward!',
        masteryLevel: 4,
        nextReviewText: 'In 3 days'
      },
      {
        id: 'fc_2',
        concept: 'Action-Reaction Pairs',
        prompt: 'Why don\'t action and reaction forces cancel each other out to zero?',
        answer: 'Because Action and Reaction act on TWO DIFFERENT objects simultaneously, not the same object!',
        analogyOrTip: 'When you push a wall, the force on the wall pushes the wall; the force on your hands pushes YOU.',
        masteryLevel: 2,
        nextReviewText: 'Today'
      }
    ];
  }

  getLearner(id: string = defaultLearner.id): LearnerProfile {
    return this.learners.get(id) || defaultLearner;
  }

  updateLearner(profile: LearnerProfile): LearnerProfile {
    this.learners.set(profile.id, profile);
    return profile;
  }

  getDocuments(): DocumentKnowledgeMap[] {
    return Array.from(this.documents.values());
  }

  getDocument(id: string): DocumentKnowledgeMap | undefined {
    return this.documents.get(id);
  }

  addDocument(doc: DocumentKnowledgeMap): DocumentKnowledgeMap {
    this.documents.set(doc.id, doc);
    return doc;
  }

  saveLesson(lesson: LessonPlan): LessonPlan {
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  getLesson(id: string): LessonPlan | undefined {
    return this.lessons.get(id);
  }

  logEvent(event: Omit<TeachingEvent, 'id' | 'timestamp'>): TeachingEvent {
    const fullEvent: TeachingEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.events.push(fullEvent);
    return fullEvent;
  }

  getEvents(limit = 100): TeachingEvent[] {
    return this.events.slice(-limit);
  }

  getMastery(): Record<string, number> {
    const res: Record<string, number> = {};
    for (const [k, v] of this.mastery.entries()) {
      res[k] = v;
    }
    return res;
  }

  updateConceptMastery(concept: string, delta: number): number {
    const current = this.mastery.get(concept) ?? 0.3;
    const updated = Math.min(1.0, Math.max(0.0, Number((current + delta).toFixed(2))));
    this.mastery.set(concept, updated);
    return updated;
  }

  getFlashcards(): Flashcard[] {
    return this.flashcards;
  }

  addFlashcards(cards: Flashcard[]) {
    this.flashcards.push(...cards);
  }

  updateFlashcard(id: string, result: 'correct' | 'incorrect') {
    const card = this.flashcards.find(c => c.id === id);
    if (card) {
      card.lastResult = result;
      card.masteryLevel = result === 'correct' ? Math.min(5, card.masteryLevel + 1) : Math.max(0, card.masteryLevel - 1);
      card.nextReviewText = result === 'correct' ? 'In 4 days' : 'Tomorrow';
    }
  }

  getNotes(): StudyNotes[] {
    return this.notes;
  }

  saveNotes(note: StudyNotes) {
    this.notes.unshift(note);
  }

  saveAssessment(assessment: FinalAssessment) {
    this.assessments.set(assessment.id, assessment);
  }

  getAssessment(id: string): FinalAssessment | undefined {
    return this.assessments.get(id);
  }
}

export const db = new DatabaseStore();
