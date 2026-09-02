import React, { useState } from 'react';
import {
  Compass,
  Clock,
  Zap,
  Sparkles,
  ArrowRight,
  GitFork,
  BookOpen,
  Atom,
  Binary,
  Calculator,
  Dna,
  History as HistoryIcon
} from 'lucide-react';
import { DifficultyLevel, TeachingLanguage, LearnerProfile } from '../types';

interface TopicExplorerProps {
  onStartLesson: (config: {
    topic: string;
    subject: string;
    durationMinutes: number;
    difficulty: DifficultyLevel;
    language: TeachingLanguage;
  }) => void;
  learnerProfile: LearnerProfile;
}

export const TopicExplorer: React.FC<TopicExplorerProps> = ({
  onStartLesson,
  learnerProfile
}) => {
  const [topic, setTopic] = useState('Newton\'s Laws of Motion');
  const [subject, setSubject] = useState('Physics');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [language, setLanguage] = useState<TeachingLanguage>(learnerProfile.preferredLanguage || 'hinglish');
  const [isPlanning, setIsPlanning] = useState(false);

  const curatedTopics = [
    { title: 'Newton\'s Laws of Motion', subject: 'Physics', icon: Atom, desc: 'Inertia, F=ma, Action-Reaction pairs & Friction' },
    { title: 'Neural Networks & Backpropagation', subject: 'Computer Science', icon: Binary, desc: 'Gradient descent, loss functions, activation curves' },
    { title: 'Calculus: Derivatives from First Principles', subject: 'Mathematics', icon: Calculator, desc: 'Limits, instantaneous rates of change, tangent slopes' },
    { title: 'DNA Replication & Protein Synthesis', subject: 'Biology', icon: Dna, desc: 'Helicase, transcription, translation & ribosome cycle' }
  ];

  const handleStart = () => {
    setIsPlanning(true);
    onStartLesson({
      topic,
      subject,
      durationMinutes,
      difficulty,
      language
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20 mb-2">
          <Compass className="h-3.5 w-3.5" />
          <span>Topic-Based Zero-to-One Learning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configure Your Personalized Lesson
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specify any topic or curriculum objective. The AI Teacher constructs a custom prerequisite DAG and multimodal delivery plan.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            What Topic Would You Like To Learn?
          </label>
          <input
            id="custom-topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Explain Quantum Entanglement, or Teach me React State Management"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Quick Pick Curated Topics */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Or select a popular high-yield topic:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {curatedTopics.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  id={`curated-topic-${i}`}
                  onClick={() => {
                    setTopic(t.title);
                    setSubject(t.subject);
                  }}
                  className={`cursor-pointer rounded-xl border p-3 transition-all flex items-start gap-3 ${
                    topic === t.title
                      ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <p className="text-[11px] text-slate-400">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duration & Time-Awareness Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Available Time Budget</span>
            </label>
            <span className="text-xs text-indigo-400 font-bold">
              {durationMinutes === 7 ? '7-Day Multi-Day Plan' : `${durationMinutes} Minutes Session`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { mins: 5, label: '5 Mins', tag: 'Core Essence' },
              { mins: 10, label: '10 Mins', tag: 'Focused Prep' },
              { mins: 20, label: '20 Mins', tag: 'Interactive Standard' },
              { mins: 60, label: '60 Mins', tag: 'Deep Masterclass' },
              { mins: 7, label: '7 Days', tag: 'Multi-Day Plan' }
            ].map((d) => (
              <button
                key={d.mins}
                type="button"
                id={`duration-btn-${d.mins}`}
                onClick={() => setDurationMinutes(d.mins)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  durationMinutes === d.mins
                    ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{d.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{d.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty & Language Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Depth / Difficulty
            </label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="foundation">Foundation (Class 8 / Intuitive basics only)</option>
              <option value="beginner">Beginner (Class 10-11 / Standard conceptual)</option>
              <option value="intermediate">Intermediate (JEE / College / Applied)</option>
              <option value="advanced">Advanced (Rigorous mathematical derivation)</option>
              <option value="expert">Expert (Research & Edge Cases)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Teaching Language
            </label>
            <select
              id="topic-language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as TeachingLanguage)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="hinglish">Hinglish (हिंग्लिश — Hindi + English)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English (Global)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        {/* Launch Lesson Button */}
        <div className="border-t border-slate-800 pt-6">
          <button
            id="start-planned-lesson-btn"
            onClick={handleStart}
            disabled={isPlanning || !topic.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Generate Adaptive Lesson Plan & Enter Classroom</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
