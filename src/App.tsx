import React, { useState, useEffect } from 'react';
import { Navbar, MainTabType } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { LearnHub } from './components/LearnHub';
import { AIClassroom } from './components/Classroom/AIClassroom';
import { FinalAssessmentView } from './components/FinalAssessmentView';
import { LearnerAnalyticsView } from './components/LearnerAnalyticsView';
import { RevisionCenter } from './components/RevisionCenter';
import { LearnerProfileModal } from './components/LearnerProfileModal';
import { ObservabilityModal } from './components/ObservabilityModal';
import {
  LearnerProfile,
  LessonPlan,
  FinalAssessment,
  Flashcard,
  StudyNotes,
  DocumentKnowledgeMap,
  LearningEvent,
  TeachingLanguage,
  DifficultyLevel
} from './types';
import { api } from './lib/api';
import { speechManager } from './lib/speech';
import { Sparkles, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<MainTabType>('home');
  const [learnInitialMode, setLearnInitialMode] = useState<'topic' | 'upload'>('topic');

  // Core Lesson & Quiz State
  const [activeLesson, setActiveLesson] = useState<LessonPlan | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<FinalAssessment | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [lessonLoadingError, setLessonLoadingError] = useState<string | null>(null);

  // Learner & Teacher Data
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>({
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
    learningGoal: 'Master Data Structures & STEM'
  });
  const [currentLanguage, setCurrentLanguage] = useState<TeachingLanguage>('hinglish');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Persistence & Hub Data
  const [documents, setDocuments] = useState<DocumentKnowledgeMap[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentKnowledgeMap | null>(null);
  const [conceptMastery, setConceptMastery] = useState<Record<string, number>>({
    'LIFO Principle': 0.85,
    'Push & Pop': 0.8,
    'Stack Underflow': 0.65
  });
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyNotes, setStudyNotes] = useState<StudyNotes | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isObservabilityModalOpen, setIsObservabilityModalOpen] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    async function initApp() {
      try {
        const [profile, docs, cards, analytics] = await Promise.all([
          api.getProfile(),
          api.getDocuments(),
          api.getFlashcards(),
          api.getAnalytics()
        ]);

        if (profile) {
          setLearnerProfile(profile);
          setCurrentLanguage(profile.preferredLanguage || 'hinglish');
        }
        if (docs) {
          setDocuments(docs);
          if (docs.length > 0) setSelectedDocument(docs[0]);
        }
        if (cards) setFlashcards(cards);
        if (analytics?.conceptMastery) setConceptMastery(analytics.conceptMastery);
      } catch (err) {
        console.error('App init error:', err);
      }
    }
    initApp();
  }, []);

  // Handle Audio Mute
  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    speechManager.setMuted(nextMuted);
  };

  // Start a new lesson
  const handleStartLesson = async (config: {
    topic: string;
    subject?: string;
    durationMinutes: number;
    difficulty?: DifficultyLevel;
    language?: TeachingLanguage;
    documentId?: string;
  }) => {
    setIsLoadingLesson(true);
    setLessonLoadingError(null);
    setActiveAssessment(null);

    try {
      const plan = await api.planLesson({
        topic: config.topic,
        subject: config.subject,
        durationMinutes: config.durationMinutes || 15,
        difficulty: config.difficulty || 'beginner',
        language: config.language || currentLanguage,
        documentId: config.documentId
      });

      setActiveLesson(plan);
      setCurrentTab('learn');

      // Auto-generate flashcards in background
      api.generateFlashcards(plan.topic).then(newCards => {
        if (newCards && newCards.length > 0) {
          setFlashcards(prev => [...newCards, ...prev]);
        }
      }).catch(err => console.warn('Flashcard generation notice:', err));

      // Auto-generate notes in background
      api.generateNotes(plan.topic, config.language || currentLanguage).then(notes => {
        if (notes) setStudyNotes(notes);
      }).catch(err => console.warn('Notes generation notice:', err));

    } catch (err: any) {
      console.error('Failed to start lesson:', err);
      setLessonLoadingError(err.message || 'Unable to generate lesson right now. Please retry.');
    } finally {
      setIsLoadingLesson(false);
    }
  };

  // Finish lesson and generate quiz
  const handleFinishLesson = async (completedLesson: LessonPlan) => {
    setIsLoadingLesson(true);
    try {
      const assessment = await api.generateAssessment(completedLesson, currentLanguage);
      setActiveAssessment(assessment);
      setActiveLesson(null);
    } catch (err) {
      console.error('Failed to generate assessment:', err);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  // Submit assessment
  const handleSubmitAssessment = async (answers: Record<string, string>): Promise<FinalAssessment> => {
    if (!activeAssessment) throw new Error('No active assessment');
    const result = await api.submitAssessment(activeAssessment.id, answers, currentLanguage);
    setActiveAssessment(result);

    // Refresh analytics
    const analytics = await api.getAnalytics();
    if (analytics?.conceptMastery) {
      setConceptMastery(analytics.conceptMastery);
    }
    return result;
  };

  // Flashcard review
  const handleReviewFlashcard = async (id: string, result: 'correct' | 'incorrect') => {
    try {
      const res = await api.reviewFlashcard(id, result);
      if (res.success && res.flashcards) {
        setFlashcards(res.flashcards);
      }
    } catch (err) {
      console.error('Failed to review flashcard:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'learn' && !activeLesson && !activeAssessment) {
            setLearnInitialMode('topic');
          }
          setCurrentTab(tab);
        }}
        learnerProfile={learnerProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenObservability={() => setIsObservabilityModalOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        currentLanguage={currentLanguage}
        onChangeLanguage={(lang) => {
          setCurrentLanguage(lang);
          setLearnerProfile(prev => ({ ...prev, preferredLanguage: lang }));
        }}
        isLearningActive={!!activeLesson}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Loading Spinner Overlay when generating lesson/quiz */}
        {isLoadingLesson && (
          <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4 animate-in fade-in duration-200">
            <div className="relative">
              <div className="h-16 w-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-md animate-pulse">
                <Sparkles className="h-8 w-8" />
              </div>
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin absolute -top-1 -right-1" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">AI Teacher is preparing your lesson...</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Structuring concepts, formulating visual models, and setting up diagnostic checks.
              </p>
            </div>
          </div>
        )}

        {/* Error Banner if lesson planning fails */}
        {!isLoadingLesson && lessonLoadingError && (
          <div className="mx-auto max-w-md my-8 p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-rose-950">Lesson Preparation Notice</h4>
            <p className="text-xs text-rose-800">{lessonLoadingError}</p>
            <button
              onClick={() => handleStartLesson({ topic: 'Stack Data Structure in C++', durationMinutes: 15 })}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Retry with Fallback Lesson
            </button>
          </div>
        )}

        {/* View Routing */}
        {!isLoadingLesson && !lessonLoadingError && (
          <>
            {/* Tab 1: Home */}
            {currentTab === 'home' && (
              <LandingHero
                onStartTopic={(topic, subject, duration) =>
                  handleStartLesson({ topic, subject, durationMinutes: duration || 15 })
                }
                onNavigateUpload={() => {
                  setLearnInitialMode('upload');
                  setCurrentTab('learn');
                }}
                onNavigateProgress={() => setCurrentTab('progress')}
                onNavigateRevision={() => setCurrentTab('revision')}
                learnerProfile={learnerProfile}
                recentTopic={activeLesson?.topic}
                conceptMasteryCount={Object.keys(conceptMastery).length}
              />
            )}

            {/* Tab 2: Learn */}
            {currentTab === 'learn' && (
              activeLesson ? (
                <AIClassroom
                  lesson={activeLesson}
                  learnerProfile={learnerProfile}
                  isAudioMuted={isAudioMuted}
                  onToggleMute={handleToggleAudio}
                  onFinishLesson={handleFinishLesson}
                  onExitLesson={() => setActiveLesson(null)}
                />
              ) : activeAssessment ? (
                <FinalAssessmentView
                  assessment={activeAssessment}
                  onSubmitAssessment={handleSubmitAssessment}
                  onNavigateRevision={() => setCurrentTab('revision')}
                  onNavigateNotes={() => setCurrentTab('revision')}
                  onRestartLesson={() => {
                    setActiveAssessment(null);
                    setCurrentTab('home');
                  }}
                />
              ) : (
                <LearnHub
                  onStartLesson={handleStartLesson}
                  documents={documents}
                  selectedDocument={selectedDocument}
                  onSelectDocument={setSelectedDocument}
                  onUploadSuccess={(doc) => {
                    setDocuments(prev => [doc, ...prev]);
                    setSelectedDocument(doc);
                  }}
                  learnerProfile={learnerProfile}
                  initialMode={learnInitialMode}
                />
              )
            )}

            {/* Tab 3: Progress */}
            {currentTab === 'progress' && (
              <LearnerAnalyticsView
                learnerProfile={learnerProfile}
                conceptMastery={conceptMastery}
                events={events}
                onStartRecommendedTopic={(topic) =>
                  handleStartLesson({ topic, durationMinutes: 15 })
                }
              />
            )}

            {/* Tab 4: Revision */}
            {currentTab === 'revision' && (
              <RevisionCenter
                flashcards={flashcards}
                onReviewCard={handleReviewFlashcard}
                onGenerateBoosterLesson={(weak) =>
                  handleStartLesson({ topic: weak[0] || 'Core Revision', durationMinutes: 5 })
                }
                studyNotes={studyNotes}
                onGenerateNotes={async (topic) => {
                  const notes = await api.generateNotes(topic, currentLanguage);
                  if (notes) setStudyNotes(notes);
                }}
                currentLanguage={currentLanguage}
              />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <LearnerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={learnerProfile}
        personas={[]}
        onSaveProfile={async (updated) => {
          setLearnerProfile(updated);
          await api.updateProfile(updated);
        }}
      />

      <ObservabilityModal
        isOpen={isObservabilityModalOpen}
        onClose={() => setIsObservabilityModalOpen(false)}
      />

    </div>
  );
}

export default App;
