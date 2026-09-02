import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  UploadCloud,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Brain,
  Layers,
  Award,
  Zap,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import { LearnerProfile, TeachingLanguage } from '../types';

interface LandingHeroProps {
  onStartTopic: (topic: string, subject?: string, duration?: number) => void;
  onNavigateUpload: () => void;
  onNavigateProgress: () => void;
  onNavigateRevision: () => void;
  learnerProfile: LearnerProfile;
  recentTopic?: string;
  conceptMasteryCount?: number;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartTopic,
  onNavigateUpload,
  onNavigateProgress,
  onNavigateRevision,
  learnerProfile,
  recentTopic,
  conceptMasteryCount = 4
}) => {
  const [inputTopic, setInputTopic] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTopic.trim()) {
      onStartTopic(inputTopic.trim(), undefined, selectedDuration);
    }
  };

  const sampleTopics = [
    { label: 'Stack in C++', subject: 'Computer Science', topic: 'Stack Data Structure in C++' },
    { label: 'Photosynthesis', subject: 'Biology', topic: 'Photosynthesis & Cellular Energetics' },
    { label: 'Calculus Derivatives', subject: 'Mathematics', topic: 'Derivative Rules in Calculus' },
    { label: 'Newton\'s Laws', subject: 'Physics', topic: 'Newton\'s Laws of Motion' },
    { label: 'Database Indexing', subject: 'Computer Science', topic: 'B-Tree Indexing in Databases' }
  ];

  const recommendations = [
    {
      title: 'Stack Data Structure in C++',
      subject: 'Computer Science',
      category: 'Data Structures',
      desc: 'Master LIFO access, push/pop operations, and real-world memory call stacks.',
      duration: '15 min',
      color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Photosynthesis & Light Reactions',
      subject: 'Biology',
      category: 'Cellular Energetics',
      desc: 'Understand photolysis of water, Calvin cycle in stroma, and energy conversion.',
      duration: '15 min',
      color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Power Rule & Derivatives',
      subject: 'Mathematics',
      category: 'Calculus',
      desc: 'Intuitive geometric slope derivation, rate of change, and practice problems.',
      duration: '15 min',
      color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      
      {/* Hero Header & Search */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3.5 py-1 text-xs font-bold text-purple-700">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Your Personal AI Teacher</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Learn anything, <span className="text-purple-600">your way</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
          Tell me what you're learning. I'll explain it, ask questions, spot where you're stuck, and adapt to you.
        </p>

        {/* Learning Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-md focus-within:border-purple-500 focus-within:ring-3 focus-within:ring-purple-100 transition-all">
            <input
              id="main-topic-input"
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              placeholder="e.g. Teach me Stack in C++ from basics"
              className="w-full px-4 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="px-3 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border-none outline-none cursor-pointer"
                title="Lesson Duration"
              >
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
              </select>
              <button
                id="start-learning-btn"
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-medium text-slate-400">Try asking:</span>
            {sampleTopics.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onStartTopic(item.topic, item.subject, 15)}
                className="px-3 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>

        {/* Secondary Upload Action */}
        <div className="pt-2">
          <button
            id="hero-upload-material-btn"
            onClick={onNavigateUpload}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 px-4 py-2 rounded-xl transition-colors border border-slate-200"
          >
            <UploadCloud className="h-4 w-4 text-purple-600" />
            <span>Or upload your own notes / PDF textbook</span>
          </button>
        </div>

      </div>

      {/* Continue Learning Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Active Workspace</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {recentTopic || 'Stack Data Structure in C++'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive session with concept visualizer, diagnostic questions, and analogy bridges.
            </p>
          </div>
          <button
            id="continue-learning-btn"
            onClick={() => onStartTopic(recentTopic || 'Stack Data Structure in C++', undefined, 15)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Launch Lesson</span>
          </button>
        </div>

        {/* Key Learner Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-medium text-slate-500">Learner</span>
            <p className="text-sm font-bold text-slate-800">{learnerProfile.name}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-medium text-slate-500">Language</span>
            <p className="text-sm font-bold text-slate-800 capitalize">{learnerProfile.preferredLanguage}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-medium text-slate-500">Concepts Mastered</span>
            <p className="text-sm font-bold text-emerald-600">{conceptMasteryCount} Concepts</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-medium text-slate-500">Study Streak</span>
            <p className="text-sm font-bold text-purple-600">5 Days Active</p>
          </div>
        </div>
      </div>

      {/* Recommended for You (Max 3 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recommended for You</h3>
          <span className="text-xs font-medium text-slate-500">Tailored to your curriculum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((item) => (
            <div
              key={item.title}
              onClick={() => onStartTopic(item.title, item.subject, 15)}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 shadow-xs cursor-pointer ${item.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.badgeColor}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold opacity-70">
                    <Clock className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                <span>Start Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards: Progress & Revision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={onNavigateProgress}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 shadow-xs cursor-pointer transition-all hover:bg-purple-50/20"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Your Learning Progress</h4>
              <p className="text-xs text-slate-500">Track concept mastery, strengths, and study streak</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>

        <div
          onClick={onNavigateRevision}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 shadow-xs cursor-pointer transition-all hover:bg-purple-50/20"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Revision & Flashcards</h4>
              <p className="text-xs text-slate-500">Review weak areas and test yourself with spaced cards</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>

    </div>
  );
};
