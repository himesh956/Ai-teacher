import React from 'react';
import {
  Code2,
  FunctionSquare,
  Network,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { VisualContentData, VisualType } from '../../types';

interface VisualStageProps {
  visualType: VisualType;
  content: VisualContentData;
  conceptName: string;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  visualType,
  content,
  conceptName
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50/80">
        <div className="flex items-center gap-2">
          {visualType === 'code' && <Code2 className="h-4 w-4 text-purple-600" />}
          {visualType === 'formula' && <FunctionSquare className="h-4 w-4 text-blue-600" />}
          {(visualType === 'diagram' || visualType === 'interactive_simulation') && (
            <Network className="h-4 w-4 text-emerald-600" />
          )}
          {visualType === 'concept_map' && <Layers className="h-4 w-4 text-amber-600" />}
          
          <span className="text-xs font-bold text-slate-800">
            {content.title || conceptName}
          </span>
        </div>

        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
          {String(visualType).replace('_', ' ')}
        </span>
      </div>

      {/* Visual Content Display */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Caption */}
        {content.caption && (
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {content.caption}
          </p>
        )}

        {/* 1. Code Snippet Presentation */}
        {visualType === 'code' && content.codeSnippet && (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-100 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-purple-400">{content.codeSnippet.language.toUpperCase()}</span>
              <span>Execution Output Ready</span>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-slate-200">
              <code>{content.codeSnippet.code}</code>
            </pre>
            {content.codeSnippet.output && (
              <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-2 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                <span className="text-slate-500 font-bold">Output:</span>
                <span>{content.codeSnippet.output}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Formula & Mathematics Derivation */}
        {visualType === 'formula' && content.mathEquations && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <FunctionSquare className="h-3.5 w-3.5 text-blue-700" />
              <span>Core Mathematical Expressions</span>
            </div>
            <div className="space-y-2">
              {content.mathEquations.map((eq, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                  <p className="font-mono text-sm font-bold text-blue-900">{eq}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Diagram / Structural Cards */}
        {(visualType === 'diagram' || visualType === 'interactive_simulation' || visualType === 'concept_map') && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            {content.diagramData?.nodes && content.diagramData.nodes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {content.diagramData.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-800">{node.label}</span>
                    <p className="text-[10px] text-purple-600 font-semibold">{node.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Concept Architecture</div>
                <p className="text-xs text-slate-600">{conceptName} structured framework</p>
              </div>
            )}
          </div>
        )}

        {/* Key Takeaways & Bullets */}
        {content.bulletPoints && content.bulletPoints.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Key Focus Points
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {content.bulletPoints.map((bp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{bp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaway Banner */}
        {content.keyTakeaway && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Core Intuition: </span>
              <span>{content.keyTakeaway}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
