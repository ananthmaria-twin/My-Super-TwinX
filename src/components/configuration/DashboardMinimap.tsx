import { useState } from 'react';
import {
  Activity,
  BarChart2,

  Compass,



  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  PieChart,
  Search,

  Table as TableIcon,
  X,
  Zap,
} from 'lucide-react';
import { type DashboardWidget } from '../../types';

interface DashboardMinimapProps {
  widgets: DashboardWidget[];
  activeWidgetId?: string | null;
  onSelectWidget?: (widgetId: string) => void;
  isFloating?: boolean;
  onClose?: () => void;
}

export default function DashboardMinimap({
  widgets,
  activeWidgetId,
  onSelectWidget,
  isFloating = false,
  onClose,
}: DashboardMinimapProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const getWidgetIcon = (type: string) => {
    if (type.includes('kpi') || type === 'progress') return <Activity className="w-2.5 h-2.5" />;
    if (type.includes('bar') || type.includes('line') || type.includes('area'))
      return <BarChart2 className="w-2.5 h-2.5" />;
    if (type.includes('donut') || type.includes('pie') || type.includes('funnel'))
      return <PieChart className="w-2.5 h-2.5" />;
    if (type.includes('table')) return <TableIcon className="w-2.5 h-2.5" />;
    if (type.includes('telemetry') || type.includes('pipeline')) return <Zap className="w-2.5 h-2.5" />;
    return <Layers className="w-2.5 h-2.5" />;
  };

  const handleJumpToWidget = (widgetId: string) => {
    onSelectWidget?.(widgetId);

    // Try finding both widget id and prefixed container
    const element =
      document.getElementById(widgetId) ||
      document.getElementById(`widget-card-${widgetId}`) ||
      document.querySelector(`[data-widget-id="${widgetId}"]`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Apply temporary highlight flash
      element.classList.add('ring-4', 'ring-[#1a237e]', 'ring-offset-2', 'transition-all');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-[#1a237e]', 'ring-offset-2');
      }, 2000);
    }
  };

  const handleJumpToBoundary = (position: 'top' | 'bottom') => {
    if (position === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const filteredWidgets = widgets.filter(
    (w) =>
      !filterQuery.trim() ||
      w.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      w.type.toLowerCase().includes(filterQuery.toLowerCase()) ||
      w.tag.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div
      className={`${
        isFloating
          ? 'fixed bottom-5 left-5 z-40 w-80 bg-white/95 backdrop-blur-md rounded-xl border border-indigo-200 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3'
          : 'w-full bg-slate-50/90 rounded-xl border border-slate-200 p-3.5 space-y-3'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-[#1a237e] text-white flex items-center justify-center shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Dashboard Navigator
              </span>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                {widgets.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Interactive Grid Mini-map
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <button
            type="button"
            onClick={() => handleJumpToBoundary('top')}
            className="px-1.5 py-0.5 text-[9px] font-semibold hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
            title="Jump to Top of Dashboard"
          >
            Top ↑
          </button>
          <button
            type="button"
            onClick={() => handleJumpToBoundary('bottom')}
            className="px-1.5 py-0.5 text-[9px] font-semibold hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
            title="Jump to Bottom of Dashboard"
          >
            Bottom ↓
          </button>

          {isFloating && (
            <>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                title={isMinimized ? 'Expand mini-map' : 'Minimize mini-map'}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                  title="Close Mini-map"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-2.5 pt-1">
          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Find section or widget..."
              className="w-full text-[11px] pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Interactive Proportional 4-Column Grid Canvas */}
          <div className="bg-slate-900/95 p-2 rounded-lg border border-slate-800 space-y-1.5 max-h-56 overflow-y-auto">
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pb-1 border-b border-slate-800/80 px-1">
              <span>GRID LAYOUT (4-COLS)</span>
              <span className="text-emerald-400 font-bold">CLICK TO JUMP</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {filteredWidgets.map((w) => {
                const span = w.gridColSpan || (w.width === 'full' ? 4 : 2);
                const isSelected = activeWidgetId === w.id;
                const colClass =
                  {
                    1: 'col-span-1',
                    2: 'col-span-2',
                    3: 'col-span-3',
                    4: 'col-span-4',
                  }[span] || 'col-span-2';

                let colorBorder = 'border-slate-700 bg-slate-800/90 text-slate-200';
                if (isSelected) {
                  colorBorder = 'border-indigo-400 bg-indigo-900/80 text-white ring-1 ring-indigo-400';
                } else if (w.type.includes('health') || w.type.includes('sla')) {
                  colorBorder = 'border-emerald-800/80 bg-emerald-950/40 text-emerald-200 hover:border-emerald-400';
                } else if (w.type.includes('anomaly') || w.type.includes('telemetry')) {
                  colorBorder = 'border-purple-800/80 bg-purple-950/40 text-purple-200 hover:border-purple-400';
                } else if (w.type.includes('sensitivity')) {
                  colorBorder = 'border-blue-800/80 bg-blue-950/40 text-blue-200 hover:border-blue-400';
                }

                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleJumpToWidget(w.id)}
                    className={`${colClass} p-1.5 rounded text-left transition-all group relative cursor-pointer border hover:scale-[1.02] active:scale-95 ${colorBorder}`}
                    title={`${w.title} (${w.tag}) — Click to jump`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="shrink-0 opacity-70 group-hover:opacity-100">
                        {getWidgetIcon(w.type)}
                      </span>
                      <span className="text-[10px] font-bold font-mono truncate block">
                        {w.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-slate-400">
                      <span className="truncate">{w.tag}</span>
                      <span className="text-slate-300 font-bold">{w.value || span + 'x'}</span>
                    </div>

                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#1a237e]" />
              <span>Click any tile to auto-scroll</span>
            </span>
            <span className="text-slate-400 font-bold">{widgets.length} items</span>
          </div>
        </div>
      )}
    </div>
  );
}
