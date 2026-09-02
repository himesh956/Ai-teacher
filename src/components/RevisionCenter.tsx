import React, { useState } from 'react';
import {
  Repeat,
  FileText,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Download,
  Printer
} from 'lucide-react';
import { Flashcard, StudyNotes, TeachingLanguage } from '../types';

interface RevisionCenterProps {
  flashcards: Flashcard[];
  onReviewCard: (id: string, result: 'correct' | 'incorrect') => void;
  onGenerateBoosterLesson: (weakConcepts: string[]) => void;
  studyNotes: StudyNotes | null;
  onGenerateNotes: (topic: string) => void;
  currentLanguage: TeachingLanguage;
}

export const RevisionCenter: React.FC<RevisionCenterProps> = ({
  flashcards,
  onReviewCard,
  onGenerateBoosterLesson,
  studyNotes,
  onGenerateNotes,
  currentLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeCard = flashcards[currentCardIndex] || flashcards[0];

  const handleCardFeedback = (result: 'correct' | 'incorrect') => {
    if (!activeCard) return;
    onReviewCard(activeCard.id, result);
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
            <Repeat className="h-3.5 w-3.5" />
            <span>Spaced Revision Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Revision & Flashcards
          </h1>
          <p className="text-xs text-slate-500">
            Reinforce key concepts, review formulas, and retain knowledge with spaced repetition.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>Flashcards ({flashcards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Study Notes</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {flashcards.length > 0 && activeCard ? (
            <div className="space-y-4">
              
              {/* Flashcard Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[260px] cursor-pointer rounded-3xl border-2 border-purple-200 bg-white p-8 shadow-xs flex flex-col justify-between transition-all hover:border-purple-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                    {activeCard.concept}
                  </span>
                  <span className="font-semibold">
                    Card {currentCardIndex + 1} of {flashcards.length} · Tap to {isFlipped ? 'see question' : 'reveal answer'}
                  </span>
                </div>

                {/* Content */}
                <div className="py-6 text-center space-y-3">
                  {!isFlipped ? (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Question / Concept
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                        {activeCard.prompt}
                      </h3>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                        Answer & Key Takeaway
                      </span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                        {activeCard.answer}
                      </p>
                      {activeCard.analogyOrTip && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-900 font-medium">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                          <span>Analogy: {activeCard.analogyOrTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Next review: {activeCard.nextReviewText}</span>
                  <span className="text-purple-600 font-semibold">
                    {isFlipped ? 'Flip Back' : 'Flip to Answer'}
                  </span>
                </div>
              </div>

              {/* Review Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => handleCardFeedback('incorrect')}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-2xl shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <XCircle className="h-4 w-4 text-amber-600" />
                  <span>Need Practice</span>
                </button>

                <button
                  onClick={() => handleCardFeedback('correct')}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-2xl shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Remembered</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">No flashcards generated yet.</p>
              <p className="text-xs text-slate-400">Complete any lesson to automatically generate spaced repetition cards.</p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Study Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {studyNotes ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{studyNotes.topic}</h2>
                  <p className="text-xs text-slate-500">Personalized Revision Notes · {studyNotes.generatedDate}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Summary</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {studyNotes.summary}
                </p>
              </div>

              {/* Formulas & Rules */}
              {studyNotes.keyFormulas && studyNotes.keyFormulas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Formulas & Rules</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {studyNotes.keyFormulas.map((f, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 font-mono text-xs font-bold text-blue-900">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Misconception Traps */}
              {studyNotes.commonMisconceptions && studyNotes.commonMisconceptions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Common Misconception Traps</h4>
                  <div className="space-y-2">
                    {studyNotes.commonMisconceptions.map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 text-xs">
                        <div className="font-bold text-amber-950">⚠️ Trap: {m.mistake}</div>
                        <div className="text-amber-900 font-medium">✓ Correction: {m.correction}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">No notes generated yet.</p>
              <button
                onClick={() => onGenerateNotes('Stack Data Structure in C++')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Generate Notes for Stack
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
