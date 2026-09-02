import React, { useState } from 'react';
import { HelpCircle, X, Send, Sparkles, BookOpen, MessageSquareQuote } from 'lucide-react';
import { TeachingLanguage } from '../../types';
import { api } from '../../lib/api';

interface InterruptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConcept: string;
  lessonTopic: string;
  documentId?: string;
  language: TeachingLanguage;
}

export const InterruptionModal: React.FC<InterruptionModalProps> = ({
  isOpen,
  onClose,
  currentConcept,
  lessonTopic,
  documentId,
  language
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    answerText: string;
    groundedCitation?: any;
    relatesToCurrentTopic: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.askDoubt({
        studentQuestion: question,
        currentConcept,
        lessonTopic,
        documentId,
        language
      });
      setResponse(res);
    } catch (err) {
      console.error('Doubt resolution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <MessageSquareQuote className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ask a Doubt</h3>
              <p className="text-[11px] text-slate-500">Live interruption grounded strictly in "{currentConcept}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAsk} className="space-y-3">
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about what we just covered... e.g. Why does peek() not delete elements?"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all font-medium placeholder-slate-400"
          />

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400">Response tailored to your level</span>
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isLoading ? 'Teacher is thinking...' : 'Ask Teacher'}</span>
            </button>
          </div>
        </form>

        {/* Response Box */}
        {response && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Teacher's Clarification</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {response.answerText}
            </p>

            {response.groundedCitation && (
              <div className="flex items-center gap-1.5 text-[11px] text-purple-700 pt-2 border-t border-purple-100">
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                  Source: {response.groundedCitation.chapter} · Page {response.groundedCitation.page}
                </span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
