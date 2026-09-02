import { DocumentKnowledgeMap, DocumentChunk } from '../src/types.js';
import { db } from './db.js';

/**
 * Intelligent section-aware document processor and RAG retrieval engine
 */
export class IngestionEngine {
  /**
   * Process raw text or uploaded document into structured chapters, concept maps and chunks
   */
  static processTextDocument(
    title: string,
    rawText: string,
    filename: string,
    fileSize: string = '1.2 MB',
    subject: string = 'General Science'
  ): DocumentKnowledgeMap {
    const lines = rawText.split('\n');
    const chunks: DocumentChunk[] = [];
    const chapters: DocumentKnowledgeMap['chapters'] = [];
    const conceptMap: DocumentKnowledgeMap['conceptMap'] = [];

    let currentChapterNum = 1;
    let currentChapterTitle = 'Introduction & Overview';
    let currentSection = 'General';
    let currentPage = 1;
    let accumulatedText: string[] = [];

    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Simple heuristic parser for educational text with chapter/section headers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check for Chapter Header
      const chapterMatch = line.match(/^(?:chapter|unit|module)\s*(\d+)[:.\-]?\s*(.*)/i);
      if (chapterMatch) {
        if (accumulatedText.length > 0) {
          chunks.push(
            this.createChunk(docId, currentChapterTitle, currentSection, currentPage, accumulatedText.join(' '))
          );
          accumulatedText = [];
        }
        currentChapterNum = parseInt(chapterMatch[1], 10) || (currentChapterNum + 1);
        currentChapterTitle = chapterMatch[2] ? `Chapter ${currentChapterNum}: ${chapterMatch[2]}` : `Chapter ${currentChapterNum}`;
        chapters.push({
          chapterNum: currentChapterNum,
          title: currentChapterTitle,
          sections: [],
          summary: `Section covering fundamental topics of ${currentChapterTitle}.`
        });
        continue;
      }

      // Check for Section Header
      const sectionMatch = line.match(/^(?:\d+\.\d+|\bsection\b|\bpart\b)\s*[:.\-]?\s*(.*)/i);
      if (sectionMatch) {
        if (accumulatedText.length > 0) {
          chunks.push(
            this.createChunk(docId, currentChapterTitle, currentSection, currentPage, accumulatedText.join(' '))
          );
          accumulatedText = [];
        }
        currentSection = line;
        const currentChap = chapters.find(c => c.chapterNum === currentChapterNum);
        if (currentChap && !currentChap.sections.includes(currentSection)) {
          currentChap.sections.push(currentSection);
        }
        continue;
      }

      // Track rough page bounds (every ~300 words is a page)
      if (chunks.length > 0 && chunks.length % 3 === 0) {
        currentPage = Math.floor(chunks.length / 3) + 1;
      }

      accumulatedText.push(line);

      // Create chunk when accumulated enough words
      if (accumulatedText.join(' ').split(' ').length >= 90) {
        chunks.push(
          this.createChunk(docId, currentChapterTitle, currentSection, currentPage, accumulatedText.join(' '))
        );
        accumulatedText = [];
      }
    }

    if (accumulatedText.length > 0) {
      chunks.push(
        this.createChunk(docId, currentChapterTitle, currentSection, currentPage, accumulatedText.join(' '))
      );
    }

    if (chapters.length === 0) {
      chapters.push({
        chapterNum: 1,
        title: title || 'Core Curriculum',
        sections: ['Overview', 'Fundamentals', 'Key Applications'],
        summary: `Synthesized foundational study guide for ${title}.`
      });
    }

    // Auto-extract concepts from chunks
    const extractedConcepts = new Set<string>();
    for (const ch of chunks) {
      for (const kw of ch.keywords) {
        if (kw.length > 4 && !extractedConcepts.has(kw)) {
          extractedConcepts.add(kw);
          conceptMap.push({
            concept: kw.charAt(0).toUpperCase() + kw.slice(1),
            chapter: ch.chapter,
            importance: conceptMap.length === 0 ? 'foundational' : 'high',
            prerequisites: conceptMap.length > 0 ? [conceptMap[conceptMap.length - 1].concept] : []
          });
          if (conceptMap.length >= 6) break;
        }
      }
      if (conceptMap.length >= 6) break;
    }

    const docMap: DocumentKnowledgeMap = {
      id: docId,
      title: title || filename.replace(/\.[^/.]+$/, ''),
      subject,
      filename,
      fileSize,
      totalPages: Math.max(1, currentPage),
      extractedAt: new Date().toISOString(),
      chapters,
      chunks,
      conceptMap
    };

    db.addDocument(docMap);
    return docMap;
  }

  private static createChunk(
    documentId: string,
    chapter: string,
    section: string,
    page: number,
    content: string
  ): DocumentChunk {
    // Extract keywords
    const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const stopWords = new Set(['the', 'and', 'with', 'from', 'this', 'that', 'which', 'will', 'have', 'been', 'were', 'what', 'when', 'then', 'into', 'than', 'some', 'these']);
    const uniqueKeywords = Array.from(new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))).slice(0, 8);

    let contentType: DocumentChunk['contentType'] = 'text';
    if (content.includes('=') || content.includes('dp/dt') || content.includes('^2') || content.includes('\\frac')) {
      contentType = 'formula';
    } else if (content.toLowerCase().includes('for example') || content.toLowerCase().includes('suppose')) {
      contentType = 'example';
    } else if (content.toLowerCase().includes('defined as') || content.toLowerCase().includes('is called')) {
      contentType = 'definition';
    } else if (content.includes('function') || content.includes('const ') || content.includes('class ')) {
      contentType = 'code';
    }

    return {
      id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      documentId,
      chapter,
      section,
      page,
      heading: section.length > 2 ? section : chapter,
      content,
      contentType,
      keywords: uniqueKeywords
    };
  }

  /**
   * Hybrid RAG Retrieval: matches query against chunks with scoring & confidence calculation
   */
  static retrieveContext(query: string, documentId?: string, topK: number = 3): {
    chunks: DocumentChunk[];
    scores: number[];
    confidence: number;
    sourceCitation?: {
      documentTitle: string;
      chapter: string;
      page: number;
      snippet: string;
    };
  } {
    const docs = documentId ? [db.getDocument(documentId)].filter(Boolean) as DocumentKnowledgeMap[] : db.getDocuments();
    if (docs.length === 0) {
      return { chunks: [], scores: [], confidence: 0 };
    }

    const allChunks: { chunk: DocumentChunk; doc: DocumentKnowledgeMap; score: number }[] = [];
    const queryTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);

    for (const doc of docs) {
      for (const chunk of doc.chunks) {
        let score = 0;
        const chunkText = (chunk.content + ' ' + chunk.heading + ' ' + chunk.keywords.join(' ')).toLowerCase();
        
        for (const token of queryTokens) {
          if (chunk.heading.toLowerCase().includes(token)) score += 3.5;
          if (chunk.keywords.includes(token)) score += 2.0;
          if (chunkText.includes(token)) score += 1.0;
        }

        // Boost for exact phrase match
        if (chunkText.includes(query.toLowerCase())) {
          score += 5.0;
        }

        if (score > 0) {
          allChunks.push({ chunk, doc, score });
        }
      }
    }

    // Sort by descending score
    allChunks.sort((a, b) => b.score - a.score);
    const topResults = allChunks.slice(0, topK);

    if (topResults.length === 0) {
      return { chunks: [], scores: [], confidence: 0 };
    }

    const maxScore = topResults[0].score;
    const confidence = Math.min(0.98, Number((maxScore / (queryTokens.length * 3.5 + 2)).toFixed(2)));

    const best = topResults[0];
    return {
      chunks: topResults.map(r => r.chunk),
      scores: topResults.map(r => r.score),
      confidence,
      sourceCitation: {
        documentTitle: best.doc.title,
        chapter: best.chunk.chapter,
        page: best.chunk.page,
        snippet: best.chunk.content.slice(0, 160) + '...'
      }
    };
  }
}
