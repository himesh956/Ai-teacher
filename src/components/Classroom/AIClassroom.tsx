import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  RotateCcw,
  BookOpen,
  MessageSquareQuote,
  Award
} from 'lucide-react';
import {
  LessonPlan,
  LessonSegment,
  LearnerProfile,
  StudentEvaluation,
  InteractiveQuestion,
  TeachingLanguage
} from '../../types';
import { TeacherAvatar } from './TeacherAvatar';
import { VisualStage } from './VisualStage';
import { QuestionCard } from './QuestionCard';
import { MisconceptionBanner } from './MisconceptionBanner';
import { InterruptionModal } from './InterruptionModal';
import { speechManager } from '../../lib/speech';
import { api } from '../../lib/api';

interface AIClassroomProps {
  lesson: LessonPlan;
  learnerProfile: LearnerProfile;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  onFinishLesson: (completedLesson: LessonPlan) => void;
  onExitLesson: () => void;
}

export const AIClassroom: React.FC<AIClassroomProps> = ({
  lesson,
  learnerProfile,
  isAudioMuted,
  onToggleMute,
  onFinishLesson,
  onExitLesson
}) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segments, setSegments] = useState<LessonSegment[]>(lesson.segments);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState<StudentEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isReteaching, setIsReteaching] = useState(false);
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<TeachingLanguage>(
    lesson.language || learnerProfile.preferredLanguage
  );

  const activeSegment = segments[currentSegmentIndex] || segments[0];

  // Auto-speak on segment transition
  useEffect(() => {
    if (activeSegment) {
      setEvaluation(null);
      speechManager.speak(activeSegment.scriptMonologue, activeLanguage, learnerProfile.speechSpeed);
    }
    const unsubSpeaking = speechManager.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      speechManager.stop();
      unsubSpeaking();
    };
  }, [currentSegmentIndex, segments, activeLanguage]);

  const handleReplaySpeech = () => {
    if (activeSegment) {
      speechManager.speak(activeSegment.scriptMonologue, activeLanguage, learnerProfile.speechSpeed);
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!activeSegment.interactiveQuestion) return;

    setIsEvaluating(true);
    try {
      const evalResult = await api.evaluateAnswer({
        question: activeSegment.interactiveQuestion,
        studentAnswer: answer,
        language: activeLanguage,
        topicContext: lesson.topic
      });
      setEvaluation(evalResult);

      // AI Teacher speaks diagnostic feedback
      speechManager.speak(evalResult.feedback, activeLanguage, learnerProfile.speechSpeed);
    } catch (err) {
      console.error('Answer evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReteachWithAnalogy = async () => {
    if (!evaluation) return;
    setIsReteaching(true);
    try {
      const reteachSegment = await api.getAdaptiveReteachSegment({
        conceptName: activeSegment.conceptName,
        misconceptionTitle: evaluation.misconceptionTitle || 'Clarification',
        analogy: evaluation.remediation?.analogy || 'Analogy Bridge',
        language: activeLanguage
      });

      // Insert adaptive segment right after current segment
      const updated = [...segments];
      updated.splice(currentSegmentIndex + 1, 0, reteachSegment);
      setSegments(updated);
      setCurrentSegmentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Reteach failed:', err);
    } finally {
      setIsReteaching(false);
    }
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    } else {
      onFinishLesson(lesson);
    }
  };

  const progressPercentage = Math.round(((currentSegmentIndex + 1) / segments.length) * 100);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Classroom Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onExitLesson}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Exit Classroom"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                {lesson.subject}
              </span>
              <h2 className="text-base font-extrabold text-slate-900">{lesson.topic}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {currentSegmentIndex + 1} of {segments.length}: <span className="font-semibold text-slate-700">{activeSegment.conceptName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="classroom-ask-doubt-btn"
            onClick={() => setIsDoubtOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 shadow-2xs transition-colors"
          >
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>Ask a Doubt</span>
          </button>

          <button
            onClick={() => onFinishLesson(lesson)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Take Quiz</span>
          </button>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Primary Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Teacher Visual + Audio Monologue */}
        <div className="lg:col-span-5 space-y-6">
          <TeacherAvatar
            learnerProfile={learnerProfile}
            isSpeaking={isSpeaking}
            scriptText={activeSegment.scriptMonologue}
            onReplaySpeech={handleReplaySpeech}
            isMuted={isAudioMuted}
            onToggleMute={onToggleMute}
            emotion={evaluation?.isMisconception ? 'diagnostic' : isSpeaking ? 'explaining' : 'encouraging'}
          />

          {/* Diagnostic Misconception Alert if triggered */}
          {evaluation && (
            <MisconceptionBanner
              evaluation={evaluation}
              onReteachWithAnalogy={handleReteachWithAnalogy}
              isLoadingReteach={isReteaching}
            />
          )}
        </div>

        {/* Right Column: Educational Visual Stage + Interactive Question */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Concept Presentation */}
          <VisualStage
            visualType={activeSegment.visualType}
            content={activeSegment.visualContent}
            conceptName={activeSegment.conceptName}
          />

          {/* Interactive Question Card */}
          {activeSegment.interactiveQuestion && (
            <QuestionCard
              question={activeSegment.interactiveQuestion}
              evaluation={evaluation}
              isEvaluating={isEvaluating}
              onSubmitAnswer={handleSubmitAnswer}
              onNextSegment={handleNextSegment}
              isLastSegment={currentSegmentIndex === segments.length - 1}
            />
          )}

        </div>

      </div>

      {/* Live Doubt Resolution Modal */}
      <InterruptionModal
        isOpen={isDoubtOpen}
        onClose={() => setIsDoubtOpen(false)}
        currentConcept={activeSegment.conceptName}
        lessonTopic={lesson.topic}
        documentId={lesson.sourceDocumentId}
        language={activeLanguage}
      />

    </div>
  );
};
