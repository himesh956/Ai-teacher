import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Send,
  RotateCcw
} from 'lucide-react';
import { InteractiveQuestion, StudentEvaluation } from '../../types';

interface QuestionCardProps {
  question: InteractiveQuestion;
  evaluation: StudentEvaluation | null;
  isEvaluating: boolean;
  onSubmitAnswer: (answer: string) => void;
  onNextSegment: () => void;
  isLastSegment: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  evaluation,
  isEvaluating,
  onSubmitAnswer,
  onNextSegment,
  isLastSegment
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const answer = question.type === 'mcq' ? selectedOption : textInput;
    if (!answer.trim()) return;
    onSubmitAnswer(answer);
  };

  const isAnswered = evaluation !== null;
  const isCorrect = evaluation?.correctness && evaluation.correctness >= 0.8;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Your Turn · Diagnostic Check</span>
        </div>

        {question.hint && !isAnswered && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Question Prompt */}
        <p className="text-sm font-bold text-slate-900 leading-relaxed">
          {question.prompt}
        </p>

        {/* Hint Display */}
        {showHint && question.hint && !isAnswered && (
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-800 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="font-medium">{question.hint}</p>
          </div>
        )}

        {/* Option Selection: MCQ */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';

              if (isAnswered) {
                if (opt === question.correctAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-600';
                }
              } else if (isSelected) {
                btnStyle = 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-100';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered || isEvaluating}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && opt === question.correctAnswer && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Free text answer */}
        {question.type !== 'mcq' && !isAnswered && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your answer in your own words..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isEvaluating}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Submit or Next Action Button */}
        {!isAnswered ? (
          question.type === 'mcq' && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!selectedOption || isEvaluating}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>{isEvaluating ? 'Evaluating...' : 'Submit Answer'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        ) : (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              {isCorrect ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Great job! Concept understood.
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Notice where you were stuck — see explanation above.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onNextSegment}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
            >
              <span>{isLastSegment ? 'Complete Lesson' : 'Next Concept'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
