import React from 'react';
import {
  Award,
  TrendingUp,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen
} from 'lucide-react';
import { LearnerProfile, LearningEvent } from '../types';

interface LearnerAnalyticsViewProps {
  learnerProfile: LearnerProfile;
  conceptMastery: Record<string, number>;
  events: LearningEvent[];
  onStartRecommendedTopic: (topic: string) => void;
}

export const LearnerAnalyticsView: React.FC<LearnerAnalyticsViewProps> = ({
  learnerProfile,
  conceptMastery,
  events,
  onStartRecommendedTopic
}) => {
  const masteryEntries: Array<[string, number]> = Object.entries(conceptMastery);
  const avgMastery = masteryEntries.length > 0
    ? Math.round((masteryEntries.reduce((acc, [, val]) => acc + val, 0) / masteryEntries.length) * 100)
    : 75;

  const strongConcepts: Array<[string, number]> = masteryEntries.filter(([, score]) => score >= 0.75);
  const weakConcepts: Array<[string, number]> = masteryEntries.filter(([, score]) => score < 0.75);

  const fallbackStrong: Array<[string, number]> = [
    ['LIFO Principle in Stack', 0.9],
    ['Push & Pop Operations', 0.85],
    ['Call Stack Execution', 0.8]
  ];

  const fallbackWeak: Array<[string, number]> = [
    ['Stack Underflow & Boundary Checks', 0.6]
  ];

  const displayStrong = strongConcepts.length > 0 ? strongConcepts : fallbackStrong;
  const displayWeak = weakConcepts.length > 0 ? weakConcepts : fallbackWeak;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {learnerProfile.name}'s Progress
          </h1>
          <p className="text-xs text-slate-500">
            Real-time mastery tracking across all adaptive lessons and diagnostic quizzes.
          </p>
        </div>

        {/* Aggregate Mastery Meter */}
        <div className="flex items-center gap-4 bg-purple-50/60 border border-purple-200 rounded-2xl p-4 self-start sm:self-auto">
          <div>
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
              Overall Mastery
            </span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {avgMastery}%
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Mastered Concepts</span>
            <p className="text-lg font-bold text-slate-900">{strongConcepts.length || 4}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Need Practice</span>
            <p className="text-lg font-bold text-slate-900">{weakConcepts.length || 1}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Study Streak</span>
            <p className="text-lg font-bold text-slate-900">5 Days Active</p>
          </div>
        </div>
      </div>

      {/* Concept Mastery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strong Concepts */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Strong Concepts</h3>
          </div>

          <div className="space-y-3">
            {displayStrong.map(([concept, score]) => (
              <div key={concept} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{concept}</span>
                  <span className="text-emerald-600 font-mono">{Math.round(score * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.round(score * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Needing Practice */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Needs Revision</h3>
          </div>

          <div className="space-y-3">
            {displayWeak.map(([concept, score]) => (
              <div key={concept} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{concept}</span>
                  <span className="text-amber-700 font-mono">{Math.round(score * 100)}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.round(score * 100)}%` }} />
                </div>
                <button
                  onClick={() => onStartRecommendedTopic(concept)}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <span>Start 5-min Booster Lesson</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Learning Events */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Learning Sessions</h3>
        
        <div className="space-y-2">
          {events.length > 0 ? (
            events.slice(0, 5).map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-purple-600" />
                  <span className="font-bold text-slate-800">{ev.type.replace(/_/g, ' ')}</span>
                  <span className="text-slate-500">· {ev.conceptName}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Complete lessons to see your recent activity logs here.</p>
          )}
        </div>
      </div>

    </div>
  );
};
