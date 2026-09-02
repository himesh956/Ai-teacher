import React, { useState } from 'react';
import {
  User,
  X,
  Languages,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import {
  LearnerProfile,
  TeacherPersona,
  TeachingLanguage,
  GradeLevel,
  TargetExam,
  TeachingStyle
} from '../types';

interface LearnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LearnerProfile;
  personas: TeacherPersona[];
  onSaveProfile: (updated: LearnerProfile) => void;
}

export const LearnerProfileModal: React.FC<LearnerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  personas,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<LearnerProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Learner Profile</h3>
              <p className="text-xs text-slate-500">Personalize AI Teacher persona and preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Learner Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-purple-500"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Preferred Teaching Language
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as TeachingLanguage })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-purple-500"
            >
              <option value="hinglish">Hinglish (Hindi + English)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Teaching Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pedagogical Style
            </label>
            <select
              value={formData.teachingStyle}
              onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value as TeachingStyle })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-purple-500"
            >
              <option value="analogy">Intuitive Analogies & Real-World Bridges</option>
              <option value="socratic">Socratic Questioning & Self-Discovery</option>
              <option value="first_principles">First-Principles Scientific Derivation</option>
              <option value="step_by_step">Structured Step-by-Step Breakdown</option>
            </select>
          </div>

          {/* AI Teacher Persona */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teacher Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'prof_vikram', name: 'Prof. Vikram', desc: 'Energetic STEM mentor' },
                { id: 'dr_sarah', name: 'Dr. Sarah', desc: 'First-principles scholar' },
                { id: 'maya_mentor', name: 'Maya Patel', desc: 'Socratic dialogue' },
                { id: 'alex_tech', name: 'Alex Rivera', desc: 'Software systems mentor' }
              ].map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarPersona: persona.id })}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    formData.avatarPersona === persona.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold">{persona.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{persona.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Speed Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Speech Speed
              </label>
              <span className="text-xs font-mono font-bold text-purple-700">
                {formData.speechSpeed}x
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.1"
              value={formData.speechSpeed}
              onChange={(e) => setFormData({ ...formData, speechSpeed: parseFloat(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Preferences
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
