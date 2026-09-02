import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Repeat,
  FileText,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FinalAssessment, InteractiveQuestion } from '../types';

interface FinalAssessmentViewProps {
  assessment: FinalAssessment;
  onSubmitAssessment: (answers: Record<string, string>) => Promise<FinalAssessment>;
  onNavigateRevision: () => void;
  onNavigateNotes: () => void;
  onRestartLesson: () => void;
}

export const FinalAssessmentView: React.FC<FinalAssessmentViewProps> = ({
  assessment,
  onSubmitAssessment,
  onNavigateRevision,
  onNavigateNotes,
  onRestartLesson
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [evaluatedAssessment, setEvaluatedAssessment] = useState<FinalAssessment | null>(
    assessment.submitted ? assessment : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: InteractiveQuestion[] = assessment.questions || assessment.items || [];

  const handleSelectOption = (questionId: string, option: string) => {
    if (evaluatedAssessment) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onSubmitAssessment(selectedAnswers);
      setEvaluatedAssessment(result);

      if ((result.scorePercentage || 0) >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompleted = !!evaluatedAssessment;
  const scorePercent = evaluatedAssessment?.scorePercentage || 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
            <Award className="h-3.5 w-3.5 text-purple-600" />
            <span>Lesson Mastery Assessment</span>
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {assessment.topic}
          </h1>
          <p className="text-xs text-slate-500">
            Answer the questions below to verify what you've learned.
          </p>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-200 rounded-2xl p-4 self-start sm:self-auto">
            <div>
              <span className="text-[11px] text-purple-700 font-bold block uppercase tracking-wider">Score</span>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {scorePercent}%
              </span>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold ${
              scorePercent >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {scorePercent >= 75 ? '✓' : '!'}
            </div>
          </div>
        )}
      </div>

      {/* Summary Report & Recommendations */}
      {isCompleted && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Teacher's Evaluation</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {evaluatedAssessment?.summaryReport}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strong Concepts */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Understood Well</span>
              </span>
              {evaluatedAssessment?.strongConcepts && evaluatedAssessment.strongConcepts.length > 0 ? (
                <ul className="space-y-1">
                  {evaluatedAssessment.strongConcepts.map((c, i) => (
                    <li key={i} className="text-xs text-emerald-950 font-medium">✓ {c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-800">Complete review recommended</p>
              )}
            </div>

            {/* Weak Concepts */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Needs Practice</span>
              </span>
              {evaluatedAssessment?.weakConcepts && evaluatedAssessment.weakConcepts.length > 0 ? (
                <ul className="space-y-1">
                  {evaluatedAssessment.weakConcepts.map((c, i) => (
                    <li key={i} className="text-xs text-amber-950 font-medium">• {c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-semibold">No critical misconceptions detected!</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onNavigateRevision}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
            >
              <Repeat className="h-3.5 w-3.5" />
              <span>Review in Flashcards</span>
            </button>

            <button
              onClick={onNavigateNotes}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-purple-600" />
              <span>View Study Notes</span>
            </button>

            <button
              onClick={onRestartLesson}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions Form */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isQCorrect = isCompleted && selected === q.correctAnswer;

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Question {idx + 1} of {questions.length}
                </span>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {q.diagnosticTarget}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {q.prompt}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt, oIdx) => {
                  const isSelected = selected === opt;
                  let style = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';

                  if (isCompleted) {
                    if (opt === q.correctAnswer) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !isQCorrect) {
                      style = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                    } else {
                      style = 'border-slate-200 bg-slate-50 opacity-60 text-slate-600';
                    }
                  } else if (isSelected) {
                    style = 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-100';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isCompleted}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left ${style}`}
                    >
                      <span>{opt}</span>
                      {isCompleted && opt === q.correctAnswer && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isCompleted && q.explanation && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <span className="font-bold text-slate-800">Explanation: </span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isCompleted && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <span>{isSubmitting ? 'Evaluating Test...' : 'Submit Answers'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
};
