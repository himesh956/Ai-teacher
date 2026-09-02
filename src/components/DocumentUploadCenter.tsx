import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Search,
  FileCode,
  Compass,
  File
} from 'lucide-react';
import { DocumentKnowledgeMap } from '../types';

interface DocumentUploadCenterProps {
  documents: DocumentKnowledgeMap[];
  selectedDocument: DocumentKnowledgeMap | null;
  onSelectDocument: (doc: DocumentKnowledgeMap) => void;
  onUploadSuccess: (doc: DocumentKnowledgeMap) => void;
  onTeachDocument: (doc: DocumentKnowledgeMap) => void;
}

export const DocumentUploadCenter: React.FC<DocumentUploadCenterProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onUploadSuccess,
  onTeachDocument
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'sample' | 'paste'>('sample');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteSubject, setPasteSubject] = useState('Physics & Science');
  const [pasteContent, setPasteContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
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
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('title', pasteTitle || 'Custom Study Notes');
      formData.append('subject', pasteSubject);
      formData.append('rawText', pasteContent);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.document) {
        onUploadSuccess(data.document);
        setPasteContent('');
        setPasteTitle('');
      }
    } catch (err) {
      console.error('Paste processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const activeDoc = selectedDocument || (documents.length > 0 ? documents[0] : null);

  const filteredChunks = activeDoc
    ? activeDoc.chunks.filter(
        c =>
          c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Multi-Format Ingestion & RAG Indexing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Document Knowledge Base</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Section-aware semantic chunking with chapter metadata & zero-hallucination citation grounding.
          </p>
        </div>

        {activeDoc && (
          <button
            id="teach-selected-doc-btn"
            onClick={() => onTeachDocument(activeDoc)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start md:self-auto"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Teach "{activeDoc.title.slice(0, 24)}..." Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Upload & Library Source (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              id="tab-sample-btn"
              onClick={() => setActiveTab('sample')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sample' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Curated Textbooks
            </button>
            <button
              id="tab-upload-btn"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload PDF / Doc
            </button>
            <button
              id="tab-paste-btn"
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Text / Notes
            </button>
          </div>

          {/* Sample Preloaded Textbooks */}
          {activeTab === 'sample' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pre-indexed Textbook Materials
              </h3>

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  id={`doc-card-${doc.id}`}
                  onClick={() => onSelectDocument(doc)}
                  className={`group cursor-pointer rounded-xl border p-3.5 transition-all ${
                    activeDoc?.id === doc.id
                      ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.subject} · {doc.totalPages} Pages · {doc.chunks.length} Semantic Chunks
                        </p>
                      </div>
                    </div>
                    {activeDoc?.id === doc.id && (
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drag and Drop File Upload */}
          {activeTab === 'upload' && (
            <div
              id="dropzone-box"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/40'
                  : 'border-slate-700 bg-slate-900/40 hover:border-indigo-500/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Drag and drop your learning material here
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supports PDF, DOCX, PPTX, TXT (up to 15MB)
                  </p>
                </div>

                <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-all">
                  <span>Browse Files</span>
                  <input
                    id="file-input-native"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {isProcessing && (
                  <p className="text-xs text-indigo-400 animate-pulse mt-2">
                    Extracting semantic chunks and creating knowledge map...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Paste Raw Text Tab */}
          {activeTab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <input
                id="paste-title-input"
                type="text"
                placeholder="Topic / Document Title (e.g. Newton's Third Law)"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
              <textarea
                id="paste-content-textarea"
                rows={6}
                placeholder="Paste textbook sections, definitions, formulas, or lecture notes..."
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
              <button
                type="submit"
                id="process-pasted-text-btn"
                disabled={isProcessing}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing & Indexing...' : 'Index & Chunk Content'}
              </button>
            </form>
          )}

        </div>

        {/* Right Side: Document Knowledge Map & Semantic Chunks (7 cols) */}
        <div className="lg:col-span-7">
          {activeDoc ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
              
              {/* Document Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-3">
                <div>
                  <h2 className="text-base font-bold text-white">{activeDoc.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeDoc.filename} · {activeDoc.fileSize} · Extracted {new Date(activeDoc.extractedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                    {activeDoc.chunks.length} Chunks
                  </span>
                  <span className="rounded-md bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                    {activeDoc.chapters.length} Chapters
                  </span>
                </div>
              </div>

              {/* Chapters & Concept Map */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Extracted Chapters & Syllabus Structure
                </h3>
                <div className="space-y-2">
                  {activeDoc.chapters.map((ch, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300">
                          {ch.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {ch.sections.length} Sections
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{ch.summary}</p>
                      {ch.keyFormulas && ch.keyFormulas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {ch.keyFormulas.map((f, i) => (
                            <code key={i} className="rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                              {f}
                            </code>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Chunk Inspector with Search */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Semantic Chunk Inspector (RAG Grounding)
                  </h3>
                  <div className="relative w-48">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      id="search-chunks-input"
                      type="text"
                      placeholder="Search chunks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                  {filteredChunks.length > 0 ? (
                    filteredChunks.map((chunk) => (
                      <div
                        key={chunk.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 transition-colors hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-200">
                              {chunk.heading}
                            </span>
                            <span className="rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                              Page {chunk.page}
                            </span>
                          </div>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            chunk.contentType === 'formula'
                              ? 'bg-purple-950 border border-purple-800 text-purple-300'
                              : chunk.contentType === 'definition'
                              ? 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                              : 'bg-slate-900 text-slate-400'
                          }`}>
                            {chunk.contentType}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {chunk.content}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {chunk.keywords.map((kw, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">
                      No chunks match your search query.
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <p className="text-xs text-slate-400">Select or upload a document to inspect its knowledge map.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
