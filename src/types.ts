export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type TeachingLanguage = 'hinglish' | 'en' | 'hi' | 'es' | 'fr' | 'ta' | 'te';

export type GradeLevel = 'middle_school' | 'high_school' | 'undergraduate' | 'competitive_exam';

export type TargetExam = 'cbse_boards' | 'jee_mains' | 'jee_advanced' | 'neet' | 'gate' | 'general_upskilling';

export type TeachingStyle = 'socratic' | 'analogy' | 'first_principles' | 'step_by_step' | 'exam_oriented';

export type SubjectDomain = 'computer_science' | 'physics' | 'biology' | 'mathematics' | 'chemistry' | 'general_stem' | 'general';

export interface LearnerProfile {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  existingKnowledge: DifficultyLevel;
  targetExam: TargetExam;
  preferredLanguage: TeachingLanguage;
  teachingStyle: TeachingStyle;
  speechSpeed: number;
  avatarPersona: string;
  voiceType: string;
  learningGoal: string;
}

export interface TeacherPersona {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  avatarUrl: string;
  voiceName: string;
  accent: string;
  defaultLanguage: TeachingLanguage;
  energyLevel: 'calm' | 'energetic' | 'authoritative' | 'friendly';
  pedagogyFocus: string;
}

export interface DocumentChunk {
  id: string;
  documentId?: string;
  chapter: string;
  section: string;
  text?: string;
  content?: string;
  heading?: string;
  keywords?: string[];
  page?: number;
  contentType?: 'text' | 'code' | 'formula' | 'diagram' | 'table' | 'definition' | 'example';
  embedding?: number[];
}

export interface IngestedDocument {
  id: string;
  title: string;
  filename?: string;
  subject: string;
  totalTokens?: number;
  totalPages?: number;
  extractedAt?: string;
  uploadedAt?: string;
  fileSize?: string;
  mimeType?: string;
  chapters: Array<{
    chapterNum: number;
    title: string;
    sections: string[];
    summary: string;
    keyFormulas?: string[];
  }>;
  chunks: DocumentChunk[];
}

export interface DocumentKnowledgeMap extends IngestedDocument {
  conceptMap: Array<{
    concept: string;
    chapter: string;
    importance: 'high' | 'medium' | 'foundational';
    prerequisites: string[];
  }>;
}

export interface ConceptNode {
  id: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[];
  masteryScore: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'mastered' | 'needs_revision';
}

export interface LearningGraph {
  topic: string;
  domain: string;
  nodes: ConceptNode[];
  edges: Array<{ from: string; to: string; relationship: 'prerequisite' | 'expands' | 'applies' }>;
}

export type VisualType = 'diagram' | 'formula' | 'code' | 'interactive_simulation' | 'chart' | 'concept_map' | 'timeline' | 'step_by_step';

export interface VisualContentData {
  type?: VisualType;
  title: string;
  caption: string;
  codeSnippet?: {
    language: string;
    code: string;
    output?: string;
    highlightLines?: number[];
  };
  mathEquations?: string[];
  diagramData?: {
    kind?: 'force_motion' | 'circuit' | 'cell_structure' | 'binary_tree' | 'algorithm_flow' | 'neural_network' | 'custom_svg' | 'graph_plot';
    parameters?: Record<string, any>;
    labels?: string[];
    svgString?: string;
    nodes?: Array<{ id: string; label: string; type: string }>;
  };
  bulletPoints?: string[];
  keyTakeaway?: string;
  sourceCitation?: {
    documentTitle: string;
    chapter: string;
    page: number;
    snippet: string;
  };
}

export type VisualContent = VisualContentData;

export interface InteractiveQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'short_answer' | 'conceptual' | 'numerical' | 'explain_in_own_words' | 'code_prediction';
  question?: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  diagnosticTarget: string;
  conceptTested?: string;
  difficulty: DifficultyLevel;
}

export interface LessonSegment {
  id: string;
  segmentIndex: number;
  conceptId: string;
  conceptName: string;
  durationSecs: number;
  purpose: string;
  teachingStrategy: 'first_principles' | 'analogy_bridge' | 'visual_derivation' | 'code_walkthrough' | 'socratic_inquiry' | 'real_world_case';
  visualType: VisualType;
  scriptText: string;
  scriptMonologue?: string;
  audioPromptText?: string;
  visualContent: VisualContentData;
  question?: InteractiveQuestion;
  interactiveQuestion?: InteractiveQuestion;
  segmentType?: 'core_concept' | 'checkpoint_question' | 'adaptive_remediation' | 'worked_example';
  isAlternativeExplanation?: boolean;
  adaptedFromMisconception?: string;
}

export interface LessonPlan {
  id: string;
  topic: string;
  subject: string;
  objective: string;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  language: TeachingLanguage;
  targetConceptGraph: LearningGraph;
  segments: LessonSegment[];
  sourceDocumentId?: string;
  documentId?: string;
  createdAt: string;
}

export interface TeachingContext {
  learnerProfile: LearnerProfile;
  activeLanguage: TeachingLanguage;
  sourceDocument?: DocumentKnowledgeMap;
  selectedChapter?: string;
  targetConceptGraph?: LearningGraph;
}

export interface StudentEvaluation {
  correctness: number;
  conceptMastery: number;
  isMisconception: boolean;
  misconceptionTitle?: string;
  misconceptionDiagnosis?: string;
  alternateAnalogy?: string;
  remediation?: {
    analogy?: string;
    action?: string;
  };
  missingConcepts: string[];
  feedback: string;
  recommendedAction: 'CONTINUE' | 'SIMPLIFY' | 'REEXPLAIN_ANALOGY' | 'REEXPLAIN_FIRST_PRINCIPLES' | 'DIAGNOSTIC_QUESTION' | 'DEEPEN_CHALLENGE';
  adaptiveSegment?: LessonSegment;
}

export interface LearningEvent {
  id: string;
  timestamp: string;
  type: string;
  conceptName: string;
  details?: string | Record<string, any>;
  metadata?: Record<string, any>;
}

export type TeachingEvent = LearningEvent;

export interface RecommendationItem {
  id?: string;
  type: string;
  title: string;
  reason: string;
  estimatedMinutes?: number;
  priority?: 'high' | 'medium' | 'low' | string;
}

export interface FinalAssessment {
  id: string;
  lessonId: string;
  topic: string;
  questions?: InteractiveQuestion[];
  items?: InteractiveQuestion[];
  totalQuestions?: number;
  studentAnswers?: Record<string, any>;
  submitted?: boolean;
  scorePercentage?: number;
  finalScore?: number;
  summaryReport?: string;
  strongConcepts?: string[];
  weakConcepts?: string[];
  detectedMisconceptions?: any[];
  recommendedNextSteps?: any[];
  completedAt?: string;
}

export interface Flashcard {
  id: string;
  topic?: string;
  concept: string;
  prompt: string;
  answer: string;
  analogyOrTip?: string;
  nextReviewText: string;
  repetitionCount?: number;
  masteryLevel?: number;
  lastResult?: 'correct' | 'incorrect';
}

export interface StudyNotes {
  id: string;
  topic: string;
  language?: TeachingLanguage;
  generatedDate: string;
  summary: string;
  summaryMarkdown?: string;
  keyConcepts?: any[];
  keyFormulas?: string[];
  commonMisconceptions?: Array<{ mistake: string; correction: string; whyItHappens?: string }>;
  citations?: any[];
}
