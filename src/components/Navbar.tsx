import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Compass,
  Repeat,
  BarChart2,
  Volume2,
  VolumeX,
  Languages,
  UserCheck,
  Sparkles,
  Terminal,
  Home,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { LearnerProfile, TeachingLanguage } from '../types';

export type MainTabType = 'home' | 'learn' | 'progress' | 'revision';

interface NavbarProps {
  currentTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  learnerProfile: LearnerProfile;
  onOpenProfile: () => void;
  onOpenObservability: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  currentLanguage: TeachingLanguage;
  onChangeLanguage: (lang: TeachingLanguage) => void;
  isLearningActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  learnerProfile,
  onOpenProfile,
  onOpenObservability,
  isAudioMuted,
  onToggleAudio,
  currentLanguage,
  onChangeLanguage,
  isLearningActive = false
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languageLabels: Record<TeachingLanguage, { name: string; short: string; flag: string }> = {
    en: { name: 'English', short: 'EN', flag: '🇬🇧' },
    hi: { name: 'हिंदी (Hindi)', short: 'HI', flag: '🇮🇳' },
    hinglish: { name: 'Hinglish (Hindi + English)', short: 'HING', flag: '🇮🇳' },
    es: { name: 'Español', short: 'ES', flag: '🇪🇸' },
    fr: { name: 'Français', short: 'FR', flag: '🇫🇷' },
    ta: { name: 'தமிழ் (Tamil)', short: 'TA', flag: '🇮🇳' },
    te: { name: 'తెలుగు (Telugu)', short: 'TE', flag: '🇮🇳' }
  };

  const navItems: Array<{ id: MainTabType; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'revision', label: 'Revision', icon: Repeat }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div
          id="brand-logo-btn"
          onClick={() => onSelectTab('home')}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">AI Teacher</span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                Adaptive
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Understands · Explains · Spots Misconceptions · Adapts
            </p>
          </div>
        </div>

        {/* Primary 4-Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'learn' && isLearningActive && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
              title="Change Language"
            >
              <Languages className="h-3.5 w-3.5 text-purple-600" />
              <span className="font-semibold text-slate-800">
                {languageLabels[currentLanguage]?.short || 'EN'}
              </span>
            </button>

            {isLangOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsLangOpen(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Teaching Language
                </div>
                {(['hinglish', 'hi', 'en', 'ta', 'te'] as TeachingLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onChangeLanguage(lang)}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      currentLanguage === lang
                        ? 'bg-purple-50 text-purple-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{languageLabels[lang].name}</span>
                    {currentLanguage === lang && <CheckCircle className="h-3.5 w-3.5 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Mute/Unmute */}
          <button
            id="global-audio-toggle-btn"
            onClick={onToggleAudio}
            className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors shadow-xs ${
              isAudioMuted
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title={isAudioMuted ? 'Unmute AI Teacher Voice' : 'Mute AI Teacher Voice'}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-purple-600" />}
          </button>

          {/* Learner Profile Button */}
          <button
            id="learner-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              {learnerProfile.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-slate-800 font-medium max-w-[90px] truncate">
              {learnerProfile.name}
            </span>
          </button>

          {/* Discrete Developer / Observability Modal Button */}
          <button
            id="open-observability-btn"
            onClick={onOpenObservability}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Developer & Observability Inspector"
          >
            <Terminal className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold ${
                isActive ? 'text-purple-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
