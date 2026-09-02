import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  Code,
  Atom,
  Dna,
  Calculator,
  Compass,
  File,
  Clock,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { DocumentKnowledgeMap, LearnerProfile, TeachingLanguage, DifficultyLevel } from '../types';

interface LearnHubProps {
  onStartLesson: (config: {
    topic: string;
    subject?: string;
    durationMinutes: number;
    difficulty: DifficultyLevel;
    language: TeachingLanguage;
    documentId?: string;
  }) => void;
  documents: DocumentKnowledgeMap[];
  selectedDocument: DocumentKnowledgeMap | null;
  onSelectDocument: (doc: DocumentKnowledgeMap) => void;
  onUploadSuccess: (doc: DocumentKnowledgeMap) => void;
  learnerProfile: LearnerProfile;
  initialMode?: 'topic' | 'upload';
}

export const LearnHub: React.FC<LearnHubProps> = ({
  onStartLesson,
  documents,
  selectedDocument,
  onSelectDocument,
  onUploadSuccess,
  learnerProfile,
  initialMode = 'topic'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'topic' | 'upload'>(initialMode);
  
  // Topic search state
  const [topicInput, setTopicInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedLanguage, setSelectedLanguage] = useState<TeachingLanguage>(learnerProfile.preferredLanguage || 'hinglish');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<DocumentKnowledgeMap | null>(
    selectedDocument || (documents.length > 0 ? documents[0] : null)
  );
  const [selectedDocTopic, setSelectedDocTopic] = useState('');
  const [pasteNotes, setPasteNotes] = useState('');
  const [isPasting, setIsPasting] = useState(false);

  // Subject catalogues
  const subjectsCatalog = [
    {
      name: 'Computer Science',
      icon: Code,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      topics: ['Stack Data Structure in C++', 'Binary Search Algorithm', 'Recursion & Call Stacks', 'Hash Tables & Collisions']
    },
    {
      name: 'Biology',
      icon: Dna,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      topics: ['Photosynthesis & Calvin Cycle', 'Cellular Respiration & ATP', 'DNA Replication & Helicase', 'Meiosis vs Mitosis']
    },
    {
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      topics: ['Derivative Rules & Slopes', 'Integration by Substitution', 'Probability & Bayes Theorem', 'Matrix Multiplication']
    },
    {
      name: 'Physics',
      icon: Atom,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      topics: ['Newton\'s Laws of Motion', 'Conservation of Momentum', 'Work-Energy Theorem', 'Doppler Effect & Waves']
    }
  ];

  const handleStartTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onStartLesson({
      topic: topicInput.trim(),
      subject: selectedSubject,
      durationMinutes: selectedDuration,
      difficulty: selectedDifficulty,
      language: selectedLanguage
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('subject', 'Uploaded Courseware');

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.document) {
        onUploadSuccess(data.document);
        setUploadedDoc(data.document);
        setSelectedDocTopic(data.document.chapters[0]?.title || data.document.title);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteNotes.trim()) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', 'My Custom Study Notes');
      formData.append('subject', 'Notes & Review');
      formData.append('rawText', pasteNotes);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.document) {
        onUploadSuccess(data.document);
        setUploadedDoc(data.document);
        setSelectedDocTopic(data.document.chapters[0]?.title || data.document.title);
        setIsPasting(false);
        setPasteNotes('');
      }
    } catch (err) {
      console.error('Paste processing failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartDocLesson = () => {
    if (!uploadedDoc) return;
    onStartLesson({
      topic: selectedDocTopic || uploadedDoc.chapters[0]?.title || uploadedDoc.title,
      subject: uploadedDoc.subject,
      durationMinutes: selectedDuration,
      difficulty: selectedDifficulty,
      language: selectedLanguage,
      documentId: uploadedDoc.id
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-center">
        <div className="flex p-1 bg-slate-200/80 rounded-2xl border border-slate-300/60 shadow-2xs">
          <button
            id="tab-select-topic-btn"
            onClick={() => setActiveSubTab('topic')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'topic'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Choose a Topic</span>
          </button>

          <button
            id="tab-select-upload-btn"
            onClick={() => setActiveSubTab('upload')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'upload'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Learn from Your Material</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Topic Mode */}
      {activeSubTab === 'topic' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Main Topic Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold text-slate-900">What would you like to learn?</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter any topic or choose from the curated curriculum below. The AI Teacher will plan an adaptive lesson for you.
              </p>
            </div>

            <form onSubmit={handleStartTopicSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Topic Title
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus-within:border-purple-500 focus-within:bg-white transition-all">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    id="topic-explorer-input"
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Stack in C++, Photosynthesis, Newton's 2nd Law..."
                    className="w-full bg-transparent border-none outline-none text-slate-900 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Lesson Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                  >
                    <option value="beginner">Beginner (Foundations & Intuition)</option>
                    <option value="intermediate">Intermediate (Applications & Derivations)</option>
                    <option value="advanced">Advanced (Complex Problems)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as TeachingLanguage)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                  >
                    <option value="hinglish">Hinglish (Hindi + English)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                  >
                    <option value={5}>5 min (Quick Concept)</option>
                    <option value={15}>15 min (Standard Lesson)</option>
                    <option value={30}>30 min (In-depth Mastery)</option>
                    <option value={60}>60 min (Full Chapter Workshop)</option>
                  </select>
                </div>

              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="launch-topic-lesson-btn"
                  type="submit"
                  disabled={!topicInput.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <span>Start Lesson</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Curated Catalog */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Curated Curriculum Topics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectsCatalog.map((subj) => {
                const Icon = subj.icon;
                return (
                  <div key={subj.name} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${subj.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{subj.name}</h4>
                    </div>

                    <div className="space-y-1.5">
                      {subj.topics.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTopicInput(t);
                            setSelectedSubject(subj.name);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <span>{t}</span>
                          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Upload Material */}
      {activeSubTab === 'upload' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Learn from your own material</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload your notes, textbook, slides or PDF and I'll turn them into an interactive lesson.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            {!isPasting ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <p className="text-sm font-bold text-slate-800 text-center">
                  Drag and drop your file here, or{' '}
                  <label className="text-purple-600 hover:text-purple-700 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      accept=".pdf,.docx,.pptx,.txt"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: PDF, DOCX, PPTX, TXT (up to 15MB)
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 w-full text-center">
                  <button
                    onClick={() => setIsPasting(true)}
                    className="text-xs font-semibold text-slate-600 hover:text-purple-700"
                  >
                    Or paste raw notes as text →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasteSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Paste Your Notes / Text Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPasting(false)}
                    className="text-xs text-purple-600 font-semibold hover:underline"
                  >
                    Back to File Upload
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={pasteNotes}
                  onChange={(e) => setPasteNotes(e.target.value)}
                  placeholder="Paste textbook chapter, notes, or code concepts here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-purple-500 font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasting(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!pasteNotes.trim() || isUploading}
                    className="px-5 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {isUploading ? 'Processing...' : 'Process Notes'}
                  </button>
                </div>
              </form>
            )}

            {/* Document Understanding Card */}
            {uploadedDoc && (
              <div className="bg-purple-50/50 rounded-2xl border border-purple-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{uploadedDoc.title}</h4>
                      <p className="text-xs text-slate-500">
                        {uploadedDoc.fileSize} · {uploadedDoc.chapters.length} Chapters Found · Status: Ready
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Indexed
                  </span>
                </div>

                {/* Topics detected */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Got it. I found these topics in your material:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedDoc.chapters.map((ch) => (
                      <button
                        key={ch.title}
                        type="button"
                        onClick={() => setSelectedDocTopic(ch.title)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                          selectedDocTopic === ch.title
                            ? 'bg-white border-purple-500 text-purple-800 shadow-xs'
                            : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${selectedDocTopic === ch.title ? 'text-purple-600' : 'text-slate-400'}`} />
                          <span>{ch.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Ch. {ch.chapterNum}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Teaching Preferences & Launch */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600">Level</span>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600">Language</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as TeachingLanguage)}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="hinglish">Hinglish</option>
                      <option value="hi">Hindi</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600">Time</span>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="start-doc-lesson-btn"
                    type="button"
                    onClick={handleStartDocLesson}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
                  >
                    <span>Start Lesson from Material</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
