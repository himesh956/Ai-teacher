import React, { useEffect, useState } from 'react';
import { Terminal, X, RefreshCw, Layers, ShieldCheck, Activity, Brain } from 'lucide-react';
import { api } from '../lib/api';

interface ObservabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ObservabilityModal: React.FC<ObservabilityModalProps> = ({
  isOpen,
  onClose
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [masteryMap, setMasteryMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchObservability = async () => {
    setIsLoading(true);
    try {
      const data = await api.getObservabilityEvents();
      setEvents(data.events || []);
      setMasteryMap(data.masteryMap || {});
    } catch (err) {
      console.error('Failed to fetch observability:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchObservability();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Developer & Observability Inspector</h3>
              <p className="text-xs text-slate-500">Telemetry, real-time events, and mastery engine metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchObservability}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          
          {/* Active Mastery Map */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              In-Memory Mastery Vector
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(masteryMap).map(([concept, score]) => (
                <div key={concept} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{concept}:</span>
                  <span className="font-mono font-bold text-purple-700">{Math.round(score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Stream */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Event Telemetry Stream ({events.length})
            </span>
            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              {events.length > 0 ? (
                events.map((ev, i) => (
                  <div key={ev.id || i} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between text-purple-400 font-bold mb-1">
                      <span>[{ev.type}]</span>
                      <span className="text-[10px] text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{ev.conceptName} — {JSON.stringify(ev.metadata || {})}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No events logged yet in current session.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
