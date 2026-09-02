import React from 'react';
import { AlertTriangle, Sparkles, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';
import { StudentEvaluation } from '../../types';

interface MisconceptionBannerProps {
  evaluation: StudentEvaluation;
  onReteachWithAnalogy: () => void;
  isLoadingReteach?: boolean;
}

export const MisconceptionBanner: React.FC<MisconceptionBannerProps> = ({
  evaluation,
  onReteachWithAnalogy,
  isLoadingReteach = false
}) => {
  if (!evaluation.isMisconception && (!evaluation.remediation || evaluation.correctness >= 0.8)) {
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-5 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-amber-900 font-bold">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-950">
              {evaluation.misconceptionTitle || 'Diagnostic Insight Detected'}
            </span>
            <p className="text-[11px] text-amber-800">
              AI Teacher spotted a common conceptual hurdle.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 uppercase">
          Adaptive Re-teaching
        </span>
      </div>

      {/* Misconception Diagnostic Text */}
      <div className="rounded-xl bg-white/80 border border-amber-200/80 p-3.5 space-y-1.5 text-xs text-amber-950">
        <p className="font-semibold">{evaluation.feedback}</p>
        {evaluation.remediation?.analogy && (
          <div className="pt-1.5 flex items-start gap-2 text-amber-900 border-t border-amber-100">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Analogy Bridge: </span>
              <span>{evaluation.remediation.analogy}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button: Re-explain with Analogy */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onReteachWithAnalogy}
          disabled={isLoadingReteach}
          className="flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-98 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>{isLoadingReteach ? 'Synthesizing...' : 'Explain with Analogy Bridge'}</span>
        </button>
      </div>

    </div>
  );
};
