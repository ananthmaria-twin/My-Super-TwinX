import { useState, useEffect } from 'react';
import {

  Boxes,


  Search,

  Sparkles,
  X,

} from 'lucide-react';
import { DIGITAL_TWIN_ENTITIES, LIVE_FEATURES } from '../../data/mockData';
import { type NavModuleId } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavModuleId) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTwins = DIGITAL_TWIN_ENTITIES.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFeatures = LIVE_FEATURES.filter((f) =>
    f.featureName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Type to search entities, features, pipelines, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white focus:outline-none font-mono placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">
              Navigation Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('digitaltwins');
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-colors group"
              >
                <Boxes className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-semibold text-white">Digital Twins</div>
                  <div className="text-[10px] text-slate-400">View 7 twin models</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigate('digitaltwins');
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-colors group"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-semibold text-white">What-If Simulation</div>
                  <div className="text-[10px] text-slate-400">Run counterfactual models</div>
                </div>
              </button>
            </div>
          </div>

          {/* Digital Twin Entities matches */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">
              Digital Twin Entities ({filteredTwins.length})
            </div>
            <div className="space-y-1.5">
              {filteredTwins.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onNavigate('digitaltwins');
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-left flex items-center justify-between transition-colors border border-slate-800/80"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="font-mono text-xs font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">{t.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Features matches */}
          {filteredFeatures.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">
                Live Features ({filteredFeatures.length})
              </div>
              <div className="space-y-1">
                {filteredFeatures.map((f) => (
                  <button
                    key={f.featureName}
                    onClick={() => {
                      onNavigate('livefeatures');
                      onClose();
                    }}
                    className="w-full p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <span className="text-cyan-300">{f.featureName}</span>
                    <span className="text-slate-500">p99: {f.p99LatencyMs}ms</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between items-center">
          <span>
            Use <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">ESC</kbd> to exit
          </span>
          <span className="text-cyan-400">TwinX Semantic Mesh Query</span>
        </div>
      </div>
    </div>
  );
}
