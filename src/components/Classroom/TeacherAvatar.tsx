import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, User, Mic, Play, Pause, RotateCcw } from 'lucide-react';
import { LearnerProfile, TeacherPersona } from '../../types';
import { speechManager } from '../../lib/speech';

interface TeacherAvatarProps {
  learnerProfile: LearnerProfile;
  isSpeaking: boolean;
  scriptText: string;
  onReplaySpeech: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  personaSeed?: string;
  emotion?: 'explaining' | 'encouraging' | 'thoughtful' | 'delighted' | 'diagnostic';
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  learnerProfile,
  isSpeaking,
  scriptText,
  onReplaySpeech,
  isMuted,
  onToggleMute,
  emotion = 'explaining'
}) => {
  const personaMap: Record<string, { name: string; title: string; image: string; voice: string }> = {
    prof_vikram: {
      name: 'Prof. Vikram',
      title: 'Senior STEM Educator',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      voice: 'Energetic Mentor'
    },
    dr_sarah: {
      name: 'Dr. Sarah',
      title: 'AI & Data Professor',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      voice: 'First-Principles Scholar'
    },
    maya_mentor: {
      name: 'Maya Patel',
      title: 'Socratic Mentor',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      voice: 'Interactive Socratic Dialogue'
    },
    alex_tech: {
      name: 'Alex Rivera',
      title: 'Coding Systems Mentor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      voice: 'Pragmatic Engineering Flow'
    }
  };

  const persona = personaMap[learnerProfile.avatarPersona] || personaMap.prof_vikram;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      
      {/* Teacher Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
          <span className="text-xs font-bold text-slate-800">{persona.name}</span>
          <span className="text-[11px] text-slate-400">· {persona.title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700 capitalize">
            {emotion}
          </span>
          <button
            id="avatar-mute-btn"
            onClick={onToggleMute}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-500" /> : <Volume2 className="h-3.5 w-3.5 text-purple-600" />}
          </button>
        </div>
      </div>

      {/* Teacher Visual & Speech Monologue */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
        
        {/* Avatar Image + Live Speaking Waveform */}
        <div className="relative shrink-0 flex flex-col items-center gap-2 mx-auto sm:mx-0">
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-xs">
            <img
              src={persona.image}
              alt={persona.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isSpeaking && (
              <div className="absolute inset-0 bg-purple-600/15 ring-2 ring-purple-500/40 rounded-2xl animate-pulse" />
            )}
          </div>

          {/* Voice Wave Visualizer */}
          <div className="flex items-center justify-center gap-1 h-5 px-2 bg-purple-50 rounded-full border border-purple-100 w-20">
            {isSpeaking ? (
              <>
                <div className="w-1 bg-purple-600 rounded-full animate-voice-bar" style={{ animationDelay: '0ms' }} />
                <div className="w-1 bg-purple-600 rounded-full animate-voice-bar" style={{ animationDelay: '150ms' }} />
                <div className="w-1 bg-purple-600 rounded-full animate-voice-bar" style={{ animationDelay: '300ms' }} />
                <div className="w-1 bg-purple-600 rounded-full animate-voice-bar" style={{ animationDelay: '450ms' }} />
              </>
            ) : (
              <span className="text-[9px] font-bold text-slate-400 uppercase">Idle</span>
            )}
          </div>
        </div>

        {/* Spoken Script Bubble */}
        <div className="flex-1 space-y-2">
          <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <p className="font-medium">{scriptText}</p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Spoken explanation</span>
            <button
              onClick={onReplaySpeech}
              className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Replay Voice</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
