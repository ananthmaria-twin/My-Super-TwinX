import React, { useState, useEffect } from 'react';
import {
  Activity,

  AlertTriangle,



  Check,
  ChevronDown,
  ChevronUp,
  Copy,




  GripVertical,



  Pencil,


  Settings,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,

  Trash2,

  TrendingUp,
  X,
  Zap,

  Crosshair,
} from 'lucide-react';
import { type DashboardWidget, type CrossFilterState } from '../../types';
import { alertService } from '../../services/alertService';
import DashboardMinimap from './DashboardMinimap';

export const THEME_PALETTES: Record<
  'indigo' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate',
  {
    name: string;
    primary: string;
    secondary: string;
    lightBg: string;
    borderLight: string;
    textAccent: string;
    badge: string;
    gradient: string;
    gradientFill: [string, string];
    ring: string;
    chip: string;
  }
> = {
  indigo: {
    name: 'Digital Indigo',
    primary: '#4f46e5',
    secondary: '#818cf8',
    lightBg: 'bg-indigo-50/70',
    borderLight: 'border-indigo-200',
    textAccent: 'text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gradient: 'from-indigo-600 to-blue-500',
    gradientFill: ['#4f46e5', '#818cf8'],
    ring: 'ring-indigo-500',
    chip: 'bg-indigo-600',
  },
  blue: {
    name: 'Hyper Blue',
    primary: '#2563eb',
    secondary: '#60a5fa',
    lightBg: 'bg-blue-50/70',
    borderLight: 'border-blue-200',
    textAccent: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    gradient: 'from-blue-600 to-cyan-500',
    gradientFill: ['#2563eb', '#60a5fa'],
    ring: 'ring-blue-500',
    chip: 'bg-blue-600',
  },
  emerald: {
    name: 'Cyber Emerald',
    primary: '#059669',
    secondary: '#34d399',
    lightBg: 'bg-emerald-50/70',
    borderLight: 'border-emerald-200',
    textAccent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-600 to-teal-500',
    gradientFill: ['#059669', '#34d399'],
    ring: 'ring-emerald-500',
    chip: 'bg-emerald-600',
  },
  purple: {
    name: 'Electric Purple',
    primary: '#9333ea',
    secondary: '#c084fc',
    lightBg: 'bg-purple-50/70',
    borderLight: 'border-purple-200',
    textAccent: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    gradient: 'from-purple-600 to-pink-500',
    gradientFill: ['#9333ea', '#c084fc'],
    ring: 'ring-purple-500',
    chip: 'bg-purple-600',
  },
  amber: {
    name: 'Solar Amber',
    primary: '#d97706',
    secondary: '#fbbf24',
    lightBg: 'bg-amber-50/70',
    borderLight: 'border-amber-200',
    textAccent: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    gradient: 'from-amber-500 to-orange-500',
    gradientFill: ['#d97706', '#fbbf24'],
    ring: 'ring-amber-500',
    chip: 'bg-amber-500',
  },
  rose: {
    name: 'Neon Rose',
    primary: '#e11d48',
    secondary: '#fb7185',
    lightBg: 'bg-rose-50/70',
    borderLight: 'border-rose-200',
    textAccent: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    gradient: 'from-rose-600 to-red-500',
    gradientFill: ['#e11d48', '#fb7185'],
    ring: 'ring-rose-500',
    chip: 'bg-rose-500',
  },
  slate: {
    name: 'Stealth Slate',
    primary: '#475569',
    secondary: '#94a3b8',
    lightBg: 'bg-slate-100/70',
    borderLight: 'border-slate-300',
    textAccent: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    gradient: 'from-slate-700 to-slate-900',
    gradientFill: ['#475569', '#94a3b8'],
    ring: 'ring-slate-500',
    chip: 'bg-slate-700',
  },
};

export const getScoreFromValue = (val?: string | number, defaultScore = 76): number => {
  if (val === undefined || val === null) return defaultScore;
  const str = String(val).trim();
  const match = str.match(/^(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?/);
  if (match) {
    if (match[2]) {
      const num = parseFloat(match[1]);
      const den = parseFloat(match[2]);
      if (den > 0) return Math.min(Math.round((num / den) * 100), 100);
    }
    const num = parseFloat(match[1]);
    if (num <= 100) return Math.min(Math.round(num), 100);
  }
  return defaultScore;
};

interface DashboardWidgetRendererProps {
  key?: React.Key;
  widget: DashboardWidget;
  index?: number;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updated: Partial<DashboardWidget>) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  onToggleWidth?: () => void;
  onSetColSpan?: (span: 1 | 2 | 3 | 4) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  activeCrossFilter?: CrossFilterState | null;
  onCrossFilterSelect?: (filter: CrossFilterState | null) => void;
  allWidgets?: DashboardWidget[];
}

export default function DashboardWidgetRenderer({
  widget,

  isEditing = false,
  isSelected = false,
  onSelect,
  onUpdate,
  onRemove,
  onDuplicate,

  onSetColSpan,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  isDragging = false,
  isDragOver = false,
  activeCrossFilter = null,
  onCrossFilterSelect,
  allWidgets = [],
}: DashboardWidgetRendererProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentVisualMode, setCurrentVisualMode] = useState<'compact' | 'detailed'>(
    widget.visualMode || 'detailed'
  );
  const [currentColorTheme, setCurrentColorTheme] = useState<
    'indigo' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate'
  >(widget.colorTheme || 'indigo');

  useEffect(() => {
    if (widget.visualMode) {
      setCurrentVisualMode(widget.visualMode);
    }
  }, [widget.visualMode]);

  useEffect(() => {
    if (widget.colorTheme) {
      setCurrentColorTheme(widget.colorTheme);
    }
  }, [widget.colorTheme]);

  const handleVisualModeChange = (mode: 'compact' | 'detailed') => {
    setCurrentVisualMode(mode);
    onUpdate?.({ visualMode: mode });
  };

  const handleColorThemeChange = (
    themeName: 'indigo' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate'
  ) => {
    setCurrentColorTheme(themeName);
    onUpdate?.({ colorTheme: themeName });
  };

  const theme = THEME_PALETTES[currentColorTheme] || THEME_PALETTES.indigo;

  // Evaluate twin health alert automatically
  useEffect(() => {
    if (widget.type === 'kpi-twin-health') {
      const numScore = parseFloat(String(widget.value).replace('%', '')) || 94.2;
      const critVal = widget.thresholdCritical ?? 65;
      const warnVal = widget.thresholdWarning ?? 80;
      alertService.evaluateTwinHealth(
        widget.id,
        widget.title,
        widget.sourceTwin,
        numScore,
        critVal,
        warnVal
      );
    }
  }, [
    widget.id,
    widget.value,
    widget.thresholdCritical,
    widget.thresholdWarning,
    widget.title,
    widget.sourceTwin,
    widget.type,
  ]);

  // Handle direct title editing
  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  // Handle direct value editing
  const handleValueChange = (newVal: string) => {
    const derivedScore = getScoreFromValue(newVal, widget.gaugeScore ?? 76);
    onUpdate?.({
      value: newVal,
      ...(widget.type === 'kpi-gauge' || widget.type === 'progress'
        ? { gaugeScore: derivedScore }
        : {}),
    });
  };

  // Handle direct change text editing
  const handleChangeTextChange = (newChange: string) => {
    onUpdate?.({ change: newChange });
  };


  // Determine column span class based on gridColSpan or width
  const span = widget.gridColSpan || (widget.width === 'full' ? 4 : 2);
  const colSpanClass =
    {
      1: 'col-span-1 md:col-span-1 lg:col-span-1',
      2: 'col-span-1 md:col-span-2 lg:col-span-2',
      3: 'col-span-1 md:col-span-2 lg:col-span-3',
      4: 'col-span-1 md:col-span-2 lg:col-span-4',
    }[span] || 'col-span-1 md:col-span-2 lg:col-span-2';

  return (
    <div
      draggable={isEditing}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={() => {
        if (isEditing) {
          onSelect?.();
        }
      }}
      className={`bg-white rounded-xl border transition-all relative group flex flex-col overflow-hidden ${
        isSelected
          ? 'border-[#1a237e] ring-2 ring-[#1a237e]/20 shadow-md z-10'
          : isDragOver
          ? 'border-indigo-500 ring-2 ring-indigo-400/50 bg-indigo-50/20 scale-[1.01]'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      } ${isDragging ? 'opacity-40 border-dashed border-indigo-400 shadow-none' : ''} ${
        isEditing ? 'cursor-pointer' : ''
      } ${colSpanClass}`}
    >
      {/* Dynamic Theme Top Accent Line */}
      <div
        className="h-1 w-full transition-colors duration-300 shrink-0"
        style={{ backgroundColor: theme.primary }}
      />

      {/* Widget Header */}
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 rounded-t-xl space-y-1.5">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center space-x-1.5 flex-1 min-w-0">
            {/* Drag Handle & Reorder in Edit Mode */}
            {isEditing && (
              <div
                className="flex items-center space-x-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  draggable
                  onDragStart={onDragStart}
                  className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                  title="Drag to visually reorder this widget in grid"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                {onMoveUp && (
                  <button
                    type="button"
                    onClick={onMoveUp}
                    className="p-0.5 text-slate-300 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                    title="Move widget backward"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                )}
                {onMoveDown && (
                  <button
                    type="button"
                    onClick={onMoveDown}
                    className="p-0.5 text-slate-300 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                    title="Move widget forward"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Editable Tag */}
            {isEditingTag ? (
              <input
                type="text"
                value={widget.tag}
                onChange={(e) => onUpdate?.({ tag: e.target.value.toUpperCase() })}
                onBlur={() => setIsEditingTag(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTag(false)}
                autoFocus
                className="text-[10px] font-mono uppercase bg-white border border-[#1a237e] text-slate-800 px-1.5 py-0.5 rounded font-bold shrink-0 w-20 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTag(true);
                }}
                title="Click to edit widget tag directly"
                className="text-[10px] font-mono uppercase bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0 cursor-pointer transition-colors"
              >
                {widget.tag}
              </span>
            )}

            {/* Direct Editable Heading & Subtitle */}
            <div className="flex-1 min-w-0">
              {isEditing || isEditingTitle ? (
                <div className="flex items-center space-x-1 group/title" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={widget.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    autoFocus={isEditingTitle}
                    placeholder="Widget Heading"
                    title="Click to edit heading directly"
                    className="w-full text-xs font-bold text-slate-800 bg-white border border-[#1a237e] rounded px-1.5 py-0.5 focus:outline-none transition-colors truncate shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(false)}
                    className="p-0.5 text-emerald-600 hover:text-emerald-800 cursor-pointer"
                    title="Done editing heading"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  className="group/title flex items-center space-x-1 cursor-pointer hover:text-indigo-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  title="Click to edit heading directly"
                >
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover/title:text-[#1a237e] transition-colors">
                    {widget.title}
                  </h4>
                  <Pencil className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                </div>
              )}

              {/* Subtitle direct edit */}
              {isEditingSubtitle ? (
                <div className="flex items-center space-x-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={widget.subtitle || ''}
                    onChange={(e) => onUpdate?.({ subtitle: e.target.value })}
                    onBlur={() => setIsEditingSubtitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingSubtitle(false)}
                    autoFocus
                    placeholder="Widget Subtitle"
                    className="w-full text-[10px] text-slate-600 bg-white border border-indigo-400 rounded px-1 py-0.2 focus:outline-none"
                  />
                </div>
              ) : (
                <div
                  className="group/sub flex items-center space-x-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingSubtitle(true);
                  }}
                  title="Click to edit subtitle"
                >
                  <p className="text-[10px] text-slate-400 truncate group-hover/sub:text-slate-600">
                    {widget.subtitle || <span className="italic opacity-60">+ Add subtitle</span>}
                  </p>
                  <Pencil className="w-2 h-2 text-slate-300 opacity-0 group-hover/sub:opacity-100 shrink-0" />
                </div>
              )}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
            {/* Active Cross-Filter Indicator for this widget */}
            {activeCrossFilter && activeCrossFilter.sourceWidgetId === widget.id && (
              <div className="flex items-center space-x-1 bg-indigo-50 border border-indigo-200 text-[#1a237e] px-1.5 py-0.5 rounded text-[9px] font-bold">
                <Crosshair className="w-2.5 h-2.5 animate-spin" />
                <span className="truncate max-w-[70px]">Filter: {activeCrossFilter.value}</span>
                <button
                  type="button"
                  onClick={() => onCrossFilterSelect?.(null)}
                  className="text-slate-400 hover:text-rose-600 ml-0.5 font-bold cursor-pointer"
                  title="Clear cross-filter"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Visual Mode Compact vs Detailed Toggle */}
            <div
              className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-[9px] font-semibold shrink-0"
              title="Toggle widget visual layout mode (Compact vs Detailed)"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisualModeChange('compact');
                }}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  currentVisualMode === 'compact'
                    ? 'bg-[#1a237e] text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Compact Mode (condensed executive layout)"
              >
                Compact
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisualModeChange('detailed');
                }}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  currentVisualMode === 'detailed'
                    ? 'bg-[#1a237e] text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Detailed Mode (full telemetry and threshold analytics)"
              >
                Detailed
              </button>
            </div>

            {/* Direct Data Values Editor Toggle */}
            {(widget.dataPoints ||
              widget.funnelStages ||
              widget.donutSegments ||
              widget.tableRows ||
              widget.type === 'donut' ||
              widget.type === 'kpi-gauge' ||
              widget.type === 'bar' ||
              widget.type === 'line' ||
              widget.type === 'area') && (
              <button
                type="button"
                onClick={() => setShowDataEditor(!showDataEditor)}
                className={`p-1 rounded text-[10px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer shrink-0 ${
                  showDataEditor
                    ? 'bg-blue-50 text-[#1a237e] border border-blue-200 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title="Directly edit chart points and values"
              >
                <Sliders className="w-3 h-3 text-indigo-600" />
                <span className="hidden sm:inline">Edit Data</span>
              </button>
            )}

            {/* Widget Header Settings Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${
                isSettingsOpen ? 'bg-indigo-50 text-[#1a237e] border border-indigo-200' : ''
              }`}
              title="Widget Header Settings & Thresholds"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Duplicate Widget */}
            {isEditing && onDuplicate && (
              <button
                type="button"
                onClick={onDuplicate}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Duplicate Widget"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}

            {/* Remove Widget */}
            {isEditing && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Delete Widget"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Edit Mode Sub-Bar: Column Span Resizer (Avoids Overlapping Header Controls) */}
        {isEditing && (
          <div
            className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-1.5 text-slate-500">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Width:</span>
              <div className="flex items-center space-x-0.5 bg-white p-0.5 rounded border border-slate-200 shadow-2xs">
                {([1, 2, 3, 4] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onSetColSpan?.(s);
                      onUpdate?.({ gridColSpan: s, width: s >= 3 ? 'full' : 'half' });
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors cursor-pointer ${
                      span === s
                        ? 'bg-[#1a237e] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={`Span ${s} of 4 columns (${s === 1 ? '1/4 width' : s === 2 ? '1/2 width' : s === 3 ? '3/4 width' : 'Full width'})`}
                  >
                    {s === 4 ? 'Full' : `${s}x`}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">
              ID: {widget.id.replace('w-', '')}
            </span>
          </div>
        )}
      </div>

      {/* Widget Header Settings Drawer Panel */}
      {isSettingsOpen && (
        <div
          className="bg-slate-50 border-b border-slate-200 p-3 text-xs space-y-3 animate-in fade-in slide-in-from-top-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-xs">
              <Settings className="w-3.5 h-3.5 text-[#1a237e]" />
              <span>Widget Header Settings & Styling</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Visual Mode Selector and Revamped Color Theme Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Visual Layout Mode Selector */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">
                    Visual Layout Mode
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      currentVisualMode === 'compact'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {currentVisualMode} mode
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleVisualModeChange('compact')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      currentVisualMode === 'compact'
                        ? 'border-[#1a237e] bg-indigo-50/80 ring-2 ring-[#1a237e]/30 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-bold text-slate-900">Compact</span>
                      {currentVisualMode === 'compact' && (
                        <Check className="w-3.5 h-3.5 text-[#1a237e]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                      Streamlined executive KPI view with condensed charts & minimal height
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVisualModeChange('detailed')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      currentVisualMode === 'detailed'
                        ? 'border-[#1a237e] bg-indigo-50/80 ring-2 ring-[#1a237e]/30 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-bold text-slate-900">Detailed</span>
                      {currentVisualMode === 'detailed' && (
                        <Check className="w-3.5 h-3.5 text-[#1a237e]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                      Full analytical breakdown, thresholds, and gauges
                    </span>
                  </button>
                </div>
              </div>

              {/* Revamped Color Theme & Accent Selection */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">
                    Color Theme & Chart Accent
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-2xs flex items-center space-x-1"
                    style={{
                      backgroundColor: theme.primary + '15',
                      color: theme.primary,
                      borderColor: theme.primary + '35',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span>{theme.name}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'indigo', name: 'Digital Indigo', bg: 'bg-[#4f46e5]', hex: '#4f46e5' },
                      { id: 'blue', name: 'Hyper Blue', bg: 'bg-[#2563eb]', hex: '#2563eb' },
                      { id: 'emerald', name: 'Cyber Emerald', bg: 'bg-[#059669]', hex: '#059669' },
                      { id: 'purple', name: 'Electric Purple', bg: 'bg-[#9333ea]', hex: '#9333ea' },
                      { id: 'amber', name: 'Solar Amber', bg: 'bg-[#d97706]', hex: '#d97706' },
                      { id: 'rose', name: 'Neon Rose', bg: 'bg-[#e11d48]', hex: '#e11d48' },
                      { id: 'slate', name: 'Stealth Slate', bg: 'bg-[#475569]', hex: '#475569' },
                    ] as const
                  ).map((col) => {
                    const isColActive = currentColorTheme === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleColorThemeChange(col.id)}
                        className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-2xs ${col.bg} ${
                          isColActive
                            ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-md'
                            : 'hover:scale-105 hover:opacity-90 opacity-80'
                        }`}
                        title={`${col.name} (${col.hex})`}
                      >
                        {isColActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500">
                  Instantly reskins vectors, gradients, chart bars, and KPI highlights for this widget.
                </p>
              </div>
            </div>

            {/* Threshold & Alert Management (Specifically for Twin Health Score) */}
            {widget.type === 'kpi-twin-health' && (
              <div className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-800 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Threshold Alert Sentinels</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    Copilot Linked
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <label className="block text-slate-500 font-medium">Critical (&lt;)</label>
                    <input
                      type="number"
                      value={widget.thresholdCritical ?? 65}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdate?.({ thresholdCritical: val });
                      }}
                      className="w-full mt-0.5 px-1.5 py-1 border border-rose-300 rounded font-bold font-mono text-rose-700 bg-rose-50/40"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium">Warning (&lt;)</label>
                    <input
                      type="number"
                      value={widget.thresholdWarning ?? 80}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdate?.({ thresholdWarning: val });
                      }}
                      className="w-full mt-0.5 px-1.5 py-1 border border-amber-300 rounded font-bold font-mono text-amber-700 bg-amber-50/40"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium">Target (≥)</label>
                    <input
                      type="number"
                      value={widget.thresholdTarget ?? 90}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdate?.({ thresholdTarget: val });
                      }}
                      className="w-full mt-0.5 px-1.5 py-1 border border-emerald-300 rounded font-bold font-mono text-emerald-700 bg-emerald-50/40"
                    />
                  </div>
                </div>

                {/* Interactive Alert Simulator */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate?.({ value: '61.4%' });
                      alertService.evaluateTwinHealth(
                        widget.id,
                        widget.title,
                        widget.sourceTwin,
                        61.4,
                        widget.thresholdCritical ?? 65,
                        widget.thresholdWarning ?? 80
                      );
                    }}
                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                    title="Simulate dropping score below critical to verify Assistant Drawer notification"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Test Drop Below 65%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate?.({ value: '94.2%' });
                      alertService.evaluateTwinHealth(
                        widget.id,
                        widget.title,
                        widget.sourceTwin,
                        94.2,
                        widget.thresholdCritical ?? 65,
                        widget.thresholdWarning ?? 80
                      );
                    }}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                    title="Restore healthy score above target threshold"
                  >
                    <Check className="w-3 h-3" />
                    <span>Restore to 94.2%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const btn = document.getElementById('btn-trigger-assistant-copilot');
                        btn?.click();
                      }
                    }}
                    className="px-2 py-1 bg-indigo-50 text-[#1a237e] hover:bg-indigo-100 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                    title="Open the TwinX Assistant Copilot Drawer"
                  >
                    <Sparkles className="w-3 h-3 text-[#1a237e]" />
                    <span>View in Copilot</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline Data Values Editor Drawer (revealed when user clicks Edit Data) */}
      {showDataEditor && (
        <div
          className="bg-blue-50/80 border-b border-blue-200 p-3 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#1a237e]">
            <div className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-700" />
              <span>Direct Values & Labels Editor (Instant Live Preview)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDataEditor(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded"
              title="Close Data Editor"
            >
              ✕
            </button>
          </div>

          {/* Primary Metric Direct Edit if not in table */}
          <div className="bg-white rounded-lg p-2 border border-blue-200 flex items-center justify-between gap-2 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase">Primary Value</span>
            <input
              type="text"
              value={widget.value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="px-2 py-0.5 text-xs font-bold text-slate-900 border border-slate-300 rounded font-mono focus:border-indigo-600 focus:outline-none"
              placeholder="Primary Metric Value"
            />
            <span className="text-[10px] font-bold text-slate-600 uppercase">Subtext / Change</span>
            <input
              type="text"
              value={widget.change || widget.secondaryText || ''}
              onChange={(e) => handleChangeTextChange(e.target.value)}
              className="px-2 py-0.5 text-xs text-slate-700 border border-slate-300 rounded font-mono focus:border-indigo-600 focus:outline-none"
              placeholder="e.g. +4.12% or Subtext"
            />
          </div>

          {/* Gauge Score / Progress Percentage Editor */}
          {(['kpi-gauge', 'progress'].includes(widget.type) || widget.gaugeScore !== undefined) && (
            <div className="bg-white rounded-lg p-2 border border-blue-200 flex items-center justify-between gap-3 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Gauge / Target Arc (0-100%)</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={widget.gaugeScore !== undefined ? widget.gaugeScore : getScoreFromValue(widget.value, 85)}
                  onChange={(e) => {
                    const score = Math.min(Math.max(Number(e.target.value), 0), 100);
                    onUpdate?.({ gaugeScore: score });
                  }}
                  className="w-20 px-2 py-0.5 text-xs font-bold text-slate-900 border border-slate-300 rounded font-mono focus:border-indigo-600 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
            </div>
          )}

          {/* Data Points for Bar / Line / Area */}
          {(['bar', 'line', 'line-step', 'area', 'area-stacked', 'stacked-bar'].includes(widget.type) || widget.dataPoints) && (() => {
            const currentPoints = widget.dataPoints || [
              { label: 'Midwest', value: 420 },
              { label: 'Northeast', value: 610 },
              { label: 'South', value: 780 },
              { label: 'West', value: 540 },
              { label: 'Pacific', value: 890 },
            ];
            return (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Chart Data Points</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {currentPoints.map((pt, idx) => (
                    <div key={idx} className="bg-white rounded p-1.5 border border-blue-200 shadow-2xs space-y-1">
                      <input
                        type="text"
                        value={pt.label}
                        onChange={(e) => {
                          const updated = [...currentPoints];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          onUpdate?.({ dataPoints: updated });
                        }}
                        className="w-full text-[10px] font-bold text-slate-700 border-b border-slate-200 focus:outline-none bg-transparent"
                        placeholder="Label"
                      />
                      <input
                        type="number"
                        value={pt.value}
                        onChange={(e) => {
                          const updated = [...currentPoints];
                          updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                          onUpdate?.({ dataPoints: updated });
                        }}
                        className="w-full text-xs font-bold text-indigo-900 border-b border-slate-200 focus:border-[#1a237e] focus:outline-none bg-transparent"
                        placeholder="Value"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Funnel Stages */}
          {(widget.type === 'funnel' || widget.funnelStages) && (() => {
            const currentStages = widget.funnelStages || [
              { stage: 'Eligible', count: '148,200', pct: 45, color: '#10b981' },
              { stage: 'Scored', count: '115,200', pct: 35, color: '#2563eb' },
              { stage: 'Engaged', count: '65,800', pct: 20, color: '#f59e0b' },
            ];
            return (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Funnel Stages</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentStages.map((stg, idx) => (
                    <div key={idx} className="bg-white rounded p-1.5 border border-blue-200 shadow-2xs space-y-1">
                      <input
                        type="text"
                        value={stg.stage}
                        onChange={(e) => {
                          const updated = [...currentStages];
                          updated[idx] = { ...updated[idx], stage: e.target.value };
                          onUpdate?.({ funnelStages: updated });
                        }}
                        className="w-full text-[10px] font-bold text-slate-700 border-b border-slate-200 focus:outline-none bg-transparent"
                        placeholder="Stage Name"
                      />
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={stg.count}
                          onChange={(e) => {
                            const updated = [...currentStages];
                            updated[idx] = { ...updated[idx], count: e.target.value };
                            onUpdate?.({ funnelStages: updated });
                          }}
                          className="w-16 text-xs font-bold text-slate-800 border-b border-slate-200 focus:border-[#1a237e] focus:outline-none bg-transparent"
                          placeholder="Count"
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                        <input
                          type="number"
                          value={stg.pct}
                          onChange={(e) => {
                            const updated = [...currentStages];
                            updated[idx] = { ...updated[idx], pct: Number(e.target.value) };
                            onUpdate?.({ funnelStages: updated });
                          }}
                          className="w-12 text-xs font-bold text-slate-800 border-b border-slate-200 focus:border-[#1a237e] focus:outline-none bg-transparent"
                          placeholder="Pct"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Donut Segments */}
          {(widget.type === 'donut' || widget.donutSegments) && (() => {
            const currentSegments = widget.donutSegments || [
              { name: 'Checking', pct: 48, count: '48%', color: theme.primary },
              { name: 'Savings', pct: 28, count: '28%', color: theme.secondary },
              { name: 'Credit Lines', pct: 16, count: '16%', color: '#f59e0b' },
              { name: 'Wealth', pct: 8, count: '8%', color: '#10b981' },
            ];
            return (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Donut Segments</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentSegments.map((seg, idx) => (
                    <div key={idx} className="bg-white rounded p-1.5 border border-blue-200 shadow-2xs space-y-1">
                      <input
                        type="text"
                        value={seg.name}
                        onChange={(e) => {
                          const updated = [...currentSegments];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          onUpdate?.({ donutSegments: updated });
                        }}
                        className="w-full text-[10px] font-bold text-slate-700 border-b border-slate-200 focus:outline-none bg-transparent"
                        placeholder="Segment Name"
                      />
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={seg.pct}
                          onChange={(e) => {
                            const updated = [...currentSegments];
                            updated[idx] = { ...updated[idx], pct: Number(e.target.value) };
                            onUpdate?.({ donutSegments: updated });
                          }}
                          className="w-14 text-xs font-bold text-slate-800 border-b border-slate-200 focus:border-[#1a237e] focus:outline-none bg-transparent"
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Table Rows Direct Edit */}
          {widget.tableRows && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Table Rows (3 First Rows)</span>
              <div className="space-y-1.5">
                {widget.tableRows.slice(0, 3).map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-1.5 bg-white p-1.5 rounded border border-blue-200">
                    <input
                      type="text"
                      value={row.id || ''}
                      onChange={(e) => {
                        const updated = [...widget.tableRows!];
                        updated[rIdx] = { ...updated[rIdx], id: e.target.value };
                        onUpdate?.({ tableRows: updated });
                      }}
                      placeholder="ID"
                      className="text-[10px] font-mono border-b border-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={row.tier || ''}
                      onChange={(e) => {
                        const updated = [...widget.tableRows!];
                        updated[rIdx] = { ...updated[rIdx], tier: e.target.value };
                        onUpdate?.({ tableRows: updated });
                      }}
                      placeholder="Tier"
                      className="text-[10px] font-mono border-b border-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={row.balance || ''}
                      onChange={(e) => {
                        const updated = [...widget.tableRows!];
                        updated[rIdx] = { ...updated[rIdx], balance: e.target.value };
                        onUpdate?.({ tableRows: updated });
                      }}
                      placeholder="Balance"
                      className="text-[10px] font-mono border-b border-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={row.fico || ''}
                      onChange={(e) => {
                        const updated = [...widget.tableRows!];
                        updated[rIdx] = { ...updated[rIdx], fico: e.target.value };
                        onUpdate?.({ tableRows: updated });
                      }}
                      placeholder="FICO"
                      className="text-[10px] font-mono border-b border-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={row.score || ''}
                      onChange={(e) => {
                        const updated = [...widget.tableRows!];
                        updated[rIdx] = { ...updated[rIdx], score: e.target.value };
                        onUpdate?.({ tableRows: updated });
                      }}
                      placeholder="Score"
                      className="text-[10px] font-mono border-b border-slate-200 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Widget Body */}
      <div
        className={`flex-1 flex flex-col justify-between transition-all ${
          currentVisualMode === 'compact' ? 'p-3' : 'p-4'
        }`}
      >
        {/* TYPE: KPI Twin Health Score */}
        {widget.type === 'kpi-twin-health' && (() => {
          const targetVal = widget.thresholdTarget ?? 90;
          const warnVal = widget.thresholdWarning ?? 80;
          const critVal = widget.thresholdCritical ?? 65;
          const numScore = parseFloat(String(widget.value).replace('%', '')) || 94.2;

          let statusBadge = {
            label: 'OPTIMAL',
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            color: '#10b981',
            message: 'Healthy Operational Invariants',
          };
          if (numScore < critVal) {
            statusBadge = {
              label: 'CRITICAL',
              bg: 'bg-rose-50 text-rose-700 border-rose-200',
              color: '#f43f5e',
              message: 'Critical Invariant Breach',
            };
          } else if (numScore < warnVal) {
            statusBadge = {
              label: 'WARNING',
              bg: 'bg-amber-50 text-amber-700 border-amber-200',
              color: '#f59e0b',
              message: 'Approaching SLA Margin',
            };
          } else if (numScore < targetVal) {
            statusBadge = {
              label: 'ACCEPTABLE',
              bg: 'bg-blue-50 text-blue-700 border-blue-200',
              color: '#3b82f6',
              message: 'Acceptable Twin Invariants',
            };
          }

          return (
            <div className={currentVisualMode === 'compact' ? 'space-y-2' : 'space-y-3'}>
              {/* Metric Header & Direct Editing */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  {isEditing ? (
                    <div
                      className="flex items-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={widget.value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="text-2xl font-black text-slate-900 font-mono tracking-tight bg-transparent hover:bg-slate-50 focus:bg-slate-50 border-b border-dashed border-slate-300 focus:border-[#1a237e] focus:outline-none w-28 px-1"
                        title="Click to edit health score value"
                      />
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      {widget.value}
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    Twin:{' '}
                    <span className="font-mono text-slate-600 font-bold">
                      {widget.sourceTwin || 'TwinX'}
                    </span>
                  </span>
                </div>

                {/* Reactive Status Badge */}
                <div
                  className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${statusBadge.bg}`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* Visual Health Gauge Bar with Colored Threshold Zones */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span className="text-rose-600 font-bold">Crit &lt;{critVal}%</span>
                  <span className="text-amber-600 font-bold">Warn &lt;{warnVal}%</span>
                  <span className="text-emerald-600 font-bold">Target ≥{targetVal}%</span>
                  <span>100%</span>
                </div>

                {/* Meter Track */}
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${critVal}%` }}
                    className="bg-rose-200/70 h-full border-r border-rose-300"
                    title="Critical Zone"
                  />
                  <div
                    style={{ width: `${Math.max(0, warnVal - critVal)}%` }}
                    className="bg-amber-200/70 h-full border-r border-amber-300"
                    title="Warning Zone"
                  />
                  <div
                    style={{ width: `${Math.max(0, targetVal - warnVal)}%` }}
                    className="bg-blue-100 h-full border-r border-blue-300"
                    title="Acceptable Zone"
                  />
                  <div
                    style={{ width: `${Math.max(0, 100 - targetVal)}%` }}
                    className="bg-emerald-200/70 h-full"
                    title="Optimal Target Zone"
                  />

                  {/* Score Needle indicator styled with Theme */}
                  <div
                    style={{
                      left: `${Math.min(99, Math.max(1, numScore))}%`,
                      backgroundColor: theme.primary,
                    }}
                    className="absolute top-0 bottom-0 w-2 ring-2 ring-white -ml-1 transition-all duration-300 rounded-full shadow-md z-10"
                    title={`Current Score: ${numScore}%`}
                  />
                </div>
              </div>

              {/* COMPACT VIEW: Condensed Telemetry Line | DETAILED VIEW: Full Inline Thresholds */}
              {currentVisualMode === 'compact' ? (
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono border-t border-slate-100">
                  <span className="text-slate-400">Executive KPI</span>
                  <div className="flex items-center space-x-2">
                    <span>Invariants: <strong className="text-emerald-600">99.4%</strong></span>
                    <span>P99: <strong className="text-slate-700">1.2ms</strong></span>
                  </div>
                </div>
              ) : (
                /* INLINE EDITABLE THRESHOLDS SECTION (Detailed Mode) */
                <div
                  className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1.5">
                      <Sliders className="w-3 h-3 text-indigo-600" />
                      <span>Inline Threshold Bounds</span>
                    </div>
                    {isEditing && (
                      <span className="text-indigo-600 font-medium normal-case">Click numbers to edit</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Critical Threshold */}
                    <div className="bg-white rounded p-1.5 border border-rose-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-rose-600 uppercase">Critical</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={critVal}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdCritical: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-rose-300 focus:border-rose-600 focus:outline-none bg-transparent"
                            title="Edit Critical Threshold (%)"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{critVal}%</span>
                      )}
                    </div>

                    {/* Warning Threshold */}
                    <div className="bg-white rounded p-1.5 border border-amber-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-amber-600 uppercase">Warning</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={warnVal}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdWarning: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-amber-300 focus:border-amber-600 focus:outline-none bg-transparent"
                            title="Edit Warning Threshold (%)"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{warnVal}%</span>
                      )}
                    </div>

                    {/* Target Threshold */}
                    <div className="bg-white rounded p-1.5 border border-emerald-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-emerald-600 uppercase">Target</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={targetVal}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdTarget: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-emerald-300 focus:border-emerald-600 focus:outline-none bg-transparent"
                            title="Edit Target Threshold (%)"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{targetVal}%</span>
                      )}
                    </div>
                  </div>

                  {/* Sub-Invariant Telemetry Breakdown */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-mono">
                    <span>Invariants: <strong className="text-emerald-600">99.4%</strong></span>
                    <span>Sync: <strong className="text-blue-600">98.8%</strong></span>
                    <span>P99: <strong className="text-slate-700">1.2ms</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TYPE: KPI Active Simulation Count */}
        {widget.type === 'kpi-active-simulations' && (() => {
          const targetCap = widget.thresholdTarget ?? 60;
          const warnLimit = widget.thresholdWarning ?? 45;
          const critLimit = widget.thresholdCritical ?? 55;
          const simCount = parseInt(String(widget.value).replace(/[^0-9]/g, ''), 10) || 48;
          const utilPct = Math.min(100, Math.round((simCount / (targetCap || 1)) * 100));

          let simStatus = {
            label: 'NOMINAL LOAD',
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            barColor: '#10b981',
          };
          if (simCount >= critLimit) {
            simStatus = {
              label: 'OVERLOAD SPIKE',
              bg: 'bg-rose-50 text-rose-700 border-rose-200',
              barColor: '#f43f5e',
            };
          } else if (simCount >= warnLimit) {
            simStatus = {
              label: 'NEAR CAPACITY',
              bg: 'bg-amber-50 text-amber-700 border-amber-200',
              barColor: '#f59e0b',
            };
          }

          return (
            <div className={currentVisualMode === 'compact' ? 'space-y-2' : 'space-y-3'}>
              {/* Top Value & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  {isEditing ? (
                    <div
                      className="flex items-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={widget.value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="text-2xl font-black text-slate-900 font-mono tracking-tight bg-transparent hover:bg-slate-50 focus:bg-slate-50 border-b border-dashed border-slate-300 focus:border-[#1a237e] focus:outline-none w-24 px-1"
                        title="Click to edit active simulation count"
                      />
                      <span className="text-xs text-slate-500 font-semibold">simulations</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline space-x-1.5">
                      <span>{widget.value}</span>
                      <span className="text-xs font-semibold text-slate-500 font-sans">Active Runs</span>
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    Worker Pool:{' '}
                    <span className="font-mono text-slate-600 font-bold">twinx-ray-pool-01</span>
                  </span>
                </div>

                {/* Load Status Badge */}
                <div
                  className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${simStatus.bg}`}
                >
                  <Activity className="w-3 h-3" />
                  <span>{simStatus.label}</span>
                </div>
              </div>

              {/* Concurrency Utilization Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">
                    Concurrency:{' '}
                    <strong className="text-slate-800">
                      {simCount} / {targetCap}
                    </strong>
                  </span>
                  <span className="font-bold text-slate-700">{utilPct}% Quota</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${utilPct}%`, backgroundColor: theme.primary }}
                    className="h-full rounded-full transition-all duration-300 shadow-xs"
                  />
                </div>
              </div>

              {/* COMPACT VIEW: Condensed Telemetry Line | DETAILED VIEW: Inline Capacity & Thresholds */}
              {currentVisualMode === 'compact' ? (
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono border-t border-slate-100">
                  <span>Quota: <strong className="text-slate-800">{utilPct}%</strong></span>
                  <span>Monte Carlo: <strong className="text-slate-700">22</strong></span>
                  <span>Stress: <strong className="text-slate-700">14</strong></span>
                </div>
              ) : (
                /* INLINE EDITABLE THRESHOLDS & CONCURRENCY LIMITS (Detailed Mode) */
                <div
                  className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1.5">
                      <Sliders className="w-3 h-3 text-indigo-600" />
                      <span>Inline Capacity & Thresholds</span>
                    </div>
                    {isEditing && (
                      <span className="text-indigo-600 font-medium normal-case">Direct edit</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Max Capacity */}
                    <div className="bg-white rounded p-1.5 border border-indigo-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-indigo-700 uppercase">Max Quota</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="1"
                            value={targetCap}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdTarget: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-indigo-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                            title="Edit Max Simulation Quota"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{targetCap}</span>
                      )}
                    </div>

                    {/* Warning Level */}
                    <div className="bg-white rounded p-1.5 border border-amber-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-amber-600 uppercase">Warn Level</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="1"
                            value={warnLimit}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdWarning: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-amber-300 focus:border-amber-600 focus:outline-none bg-transparent"
                            title="Edit Warning Limit"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{warnLimit}</span>
                      )}
                    </div>

                    {/* Critical Level */}
                    <div className="bg-white rounded p-1.5 border border-rose-200 shadow-2xs">
                      <span className="block text-[9px] font-bold text-rose-600 uppercase">Crit Spike</span>
                      {isEditing ? (
                        <div className="flex items-center space-x-0.5 mt-0.5">
                          <input
                            type="number"
                            min="1"
                            value={critLimit}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdate?.({ thresholdCritical: val });
                            }}
                            className="w-full text-xs font-bold text-slate-800 border-b border-rose-300 focus:border-rose-600 focus:outline-none bg-transparent"
                            title="Edit Overload Critical Spike Limit"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{critLimit}</span>
                      )}
                    </div>
                  </div>

                  {/* Simulation Type Breakdown */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-mono">
                    <span>Monte Carlo: <strong className="text-slate-800">22</strong></span>
                    <span>Stress Test: <strong className="text-slate-800">14</strong></span>
                    <span>Drift: <strong className="text-slate-800">12</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TYPE 1: KPI Summary Card */}
        {widget.type === 'kpi-card' && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              {isEditing ? (
                <div className="flex-1 max-w-[200px] group/val relative">
                  <input
                    type="text"
                    value={widget.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    title="Click to edit metric value directly"
                    className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight bg-transparent hover:bg-slate-50 focus:bg-slate-50 border-b border-dashed border-slate-300 focus:border-[#1a237e] focus:outline-none w-full px-1 py-0.5"
                  />
                  <Pencil className="w-3 h-3 text-slate-300 absolute right-1 top-2 pointer-events-none group-hover/val:text-slate-500 opacity-0 group-hover/val:opacity-100" />
                </div>
              ) : (
                <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {widget.value}
                </div>
              )}

              {/* Trend Badge (Editable in Edit Mode) */}
              {isEditing ? (
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-emerald-600 font-bold">▲</span>
                  <input
                    type="text"
                    value={widget.change}
                    onChange={(e) => handleChangeTextChange(e.target.value)}
                    className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-24 text-center"
                  />
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>{widget.change}</span>
                </div>
              )}
            </div>

            {/* Sparkline & Secondary Metric */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="text-[11px] font-medium text-slate-400">
                {widget.secondaryValue || `Twin: ${widget.sourceTwin}`}
              </span>
              {/* Mini Sparkline Curve styled with Theme */}
              <svg className="w-20 h-6 shrink-0" viewBox="0 0 100 30" style={{ color: theme.primary }}>
                <path
                  d="M0,25 Q25,5 50,18 T100,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* TYPE 2: KPI Momentum / Trend */}
        {widget.type === 'kpi-trend' && (
          <div className={currentVisualMode === 'compact' ? 'space-y-1.5' : 'space-y-2.5'}>
            <div className="flex items-baseline justify-between">
              {isEditing ? (
                <input
                  type="text"
                  value={widget.value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-2xl font-extrabold text-slate-900 font-mono bg-transparent hover:bg-slate-50 focus:bg-slate-50 border-b border-dashed border-slate-300 focus:border-[#1a237e] focus:outline-none w-32 px-1"
                />
              ) : (
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {widget.value}
                </span>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={widget.change}
                  onChange={(e) => handleChangeTextChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 focus:outline-none w-28 text-right"
                />
              ) : (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: theme.primary + '15',
                    color: theme.primary,
                    borderColor: theme.primary + '35',
                  }}
                >
                  {widget.change}
                </span>
              )}
            </div>

            {/* Trajectory Vector with Dynamic Theme */}
            <div
              className={`w-full bg-slate-50/70 rounded-lg p-1.5 flex items-end ${
                currentVisualMode === 'compact' ? 'h-8' : 'h-12'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <path
                  d="M0,35 Q40,30 80,15 T160,20 T200,5"
                  fill="none"
                  stroke={theme.primary}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="5" r="4" fill={theme.primary} />
              </svg>
            </div>
          </div>
        )}

        {/* TYPE 3: Radial Target Gauge */}
        {widget.type === 'kpi-gauge' && (() => {
          const effectiveGaugeScore = widget.gaugeScore !== undefined
            ? widget.gaugeScore
            : getScoreFromValue(widget.value, 85);

          return (
            <div className={currentVisualMode === 'compact' ? 'space-y-1.5' : 'space-y-2'}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {isEditing ? (
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={widget.value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="text-xl font-extrabold text-slate-900 font-mono bg-transparent border-b border-dashed border-slate-300 focus:border-[#1a237e] focus:outline-none w-28"
                      />
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-slate-900 font-mono">{widget.value}</div>
                  )}
                  <div className="text-[11px] text-slate-500 font-medium">
                    {widget.secondaryValue || 'Target Benchmark: 80+'}
                  </div>
                </div>

                {/* Radial Arc Gauge SVG */}
                <div
                  className={`relative flex items-center justify-center shrink-0 ${
                    currentVisualMode === 'compact' ? 'w-12 h-12' : 'w-16 h-16'
                  }`}
                >
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      style={{ stroke: theme.primary }}
                      className="transition-all duration-500"
                      strokeDasharray={`${effectiveGaugeScore}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {effectiveGaugeScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="font-semibold">{widget.change}</span>
                <span className="font-mono font-bold">P99 High Confidence</span>
              </div>
            </div>
          );
        })()}

        {/* TYPE 4: Multi-Metric Cohort Tile */}
        {widget.type === 'kpi-multimetric' && (
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Entities</span>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">4,820</div>
              <span className="text-[9px] text-emerald-600 font-semibold">+12% MoM</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Mean ARR</span>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">$1.24M</div>
              <span className="text-[9px] text-indigo-600 font-semibold">+18.4%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium">SLA Health</span>
              <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">99.8%</div>
              <span className="text-[9px] text-slate-400">1.4ms P99</span>
            </div>
          </div>
        )}

        {/* TYPE 5: Progress Milestone */}
        {widget.type === 'progress' && (() => {
          const effectiveProgress = widget.gaugeScore !== undefined
            ? widget.gaugeScore
            : getScoreFromValue(widget.value, 78);

          return (
            <div className="space-y-2.5 py-1">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    type="text"
                    value={widget.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xl font-bold text-slate-900 font-mono w-24 border-b border-dashed border-slate-300"
                  />
                ) : (
                  <span className="text-xl font-bold text-slate-900 font-mono">{widget.value}</span>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  {widget.secondaryValue || 'Goal: 100%'}
                </span>
              </div>

              {/* Milestone Bar styled with Theme Gradient */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${effectiveProgress}%`,
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>0% Baseline</span>
                <span className="text-emerald-600 font-semibold">{widget.change}</span>
                <span>100% Attained</span>
              </div>
            </div>
          );
        })()}

        {/* TYPE 6: Line Chart & Step Chart with Theme Colors and Responsive Height */}
        {(widget.type === 'line' || widget.type === 'line-step') && (() => {
          const linePts = (widget.dataPoints && widget.dataPoints.length > 0)
            ? widget.dataPoints
            : [
                { label: 'T-30d', value: 120 },
                { label: 'T-20d', value: 145 },
                { label: 'T-10d', value: 138 },
                { label: 'T-5d', value: 210 },
                { label: 'T-1d', value: 195 },
                { label: 'Current', value: 280 },
              ];
          const vals = linePts.map((p) => Number(p.value) || 0);
          const minVal = Math.min(...vals);
          const maxVal = Math.max(...vals);
          const range = maxVal - minVal || 1;
          const coords = linePts.map((pt, i) => {
            const x = linePts.length <= 1 ? 100 : (i / (linePts.length - 1)) * 200;
            const y = 44 - (((Number(pt.value) || 0) - minVal) / range) * 36;
            return { x, y, pt };
          });
          const linePathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
          const stepPathD = coords.map((c, i) => (i === 0 ? `M ${c.x.toFixed(1)},${c.y.toFixed(1)}` : `H ${c.x.toFixed(1)} V ${c.y.toFixed(1)}`)).join(' ');

          return (
            <div className="space-y-1.5">
              <div
                className={`w-full bg-slate-50/60 rounded-lg p-2 flex flex-col justify-between border border-slate-100 ${
                  currentVisualMode === 'compact' ? 'h-20' : 'h-28'
                }`}
              >
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Peak: {widget.value}</span>
                  <span className="text-emerald-600 font-bold">{widget.change}</span>
                </div>
                <svg
                  className={`w-full overflow-visible ${
                    currentVisualMode === 'compact' ? 'h-10' : 'h-16'
                  }`}
                  viewBox="0 0 200 50"
                >
                  {widget.type === 'line' ? (
                    <>
                      <path
                        d={linePathD}
                        fill="none"
                        stroke={theme.primary}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                      {/* Dynamic Points */}
                      {coords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r={i === coords.length - 1 ? 4 : 3}
                          fill={i === coords.length - 1 ? theme.secondary : theme.primary}
                          className="transition-all duration-300"
                        >
                          <title>{`${c.pt.label}: ${c.pt.value}`}</title>
                        </circle>
                      ))}
                    </>
                  ) : (
                    <path
                      d={stepPathD}
                      fill="none"
                      stroke={theme.primary}
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />
                  )}
                </svg>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  {linePts.map((pt, i) => (
                    <span key={i} className="truncate max-w-[42px] text-center">{pt.label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TYPE 7: Area Chart with Dynamic Theme Gradients and Dynamic Values */}
        {(widget.type === 'area' || widget.type === 'area-stacked') && (() => {
          const areaPts = (widget.dataPoints && widget.dataPoints.length > 0)
            ? widget.dataPoints
            : [
                { label: 'Week 1', value: 45 },
                { label: 'Week 2', value: 70 },
                { label: 'Week 3', value: 55 },
                { label: 'Week 4', value: 85 },
                { label: 'Week 5', value: 110 },
              ];
          const vals = areaPts.map((p) => Number(p.value) || 0);
          const minVal = Math.min(...vals);
          const maxVal = Math.max(...vals);
          const range = maxVal - minVal || 1;
          const coords = areaPts.map((pt, i) => {
            const x = areaPts.length <= 1 ? 100 : (i / (areaPts.length - 1)) * 200;
            const y = 44 - (((Number(pt.value) || 0) - minVal) / range) * 36;
            return { x, y, pt };
          });
          const linePathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
          const areaFillD = `${linePathD} L 200,50 L 0,50 Z`;

          return (
            <div className="space-y-1.5">
              <div
                className={`w-full bg-slate-50/60 rounded-lg p-2 flex flex-col justify-between overflow-hidden border border-slate-100 ${
                  currentVisualMode === 'compact' ? 'h-20' : 'h-28'
                }`}
              >
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Volume: {widget.value}</span>
                  <span className="text-emerald-600 font-bold">{widget.change}</span>
                </div>
                <svg
                  className={`w-full ${currentVisualMode === 'compact' ? 'h-10' : 'h-16'}`}
                  viewBox="0 0 200 50"
                >
                  <defs>
                    <linearGradient id={`grad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.primary} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  <path
                    d={areaFillD}
                    fill={`url(#grad-${widget.id})`}
                    className="transition-all duration-300"
                  />
                  <path
                    d={linePathD}
                    fill="none"
                    stroke={theme.primary}
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />
                  {coords.map((c, i) => (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r="3"
                      fill={theme.primary}
                      className="transition-all duration-300"
                    >
                      <title>{`${c.pt.label}: ${c.pt.value}`}</title>
                    </circle>
                  ))}
                </svg>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  {areaPts.map((pt, i) => (
                    <span key={i} className="truncate max-w-[42px] text-center">{pt.label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TYPE 8: Bar Chart & Stacked Bar with Dynamic Theme & Cross-Filtering */}
        {(widget.type === 'bar' || widget.type === 'stacked-bar') && (
          <div className="space-y-1.5">
            <div
              className={`w-full bg-slate-50/60 rounded-lg p-2.5 flex items-end justify-between space-x-2 border border-slate-100 ${
                currentVisualMode === 'compact' ? 'h-20' : 'h-28'
              }`}
            >
              {(
                widget.dataPoints || [
                  { label: 'Midwest', value: 420 },
                  { label: 'Northeast', value: 610 },
                  { label: 'South', value: 780 },
                  { label: 'West', value: 540 },
                  { label: 'Pacific', value: 890 },
                ]
              ).map((pt, idx) => {
                const maxVal = Math.max(
                  ...(widget.dataPoints?.map((d) => d.value) || [890]),
                  1
                );
                const heightPct = Math.min(Math.max((pt.value / maxVal) * 100, 15), 100);
                const isFiltered = activeCrossFilter && activeCrossFilter.value === pt.label;
                const isAnyFilterActive = Boolean(activeCrossFilter);

                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFiltered) {
                        onCrossFilterSelect?.(null);
                      } else {
                        onCrossFilterSelect?.({
                          sourceWidgetId: widget.id,
                          sourceWidgetTitle: widget.title,
                          dimension: 'Cohort Region',
                          value: pt.label,
                          countLabel: `${pt.value}`,
                        });
                      }
                    }}
                    className={`flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer transition-all ${
                      isFiltered
                        ? 'scale-105 z-10'
                        : isAnyFilterActive
                        ? 'opacity-35 hover:opacity-85'
                        : 'opacity-100 hover:scale-102'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-mono font-bold transition-colors mb-1 ${
                        isFiltered
                          ? 'text-[#1a237e] text-[10px] scale-110'
                          : 'text-slate-700 opacity-80 group-hover/bar:opacity-100'
                      }`}
                    >
                      {pt.value}
                    </span>
                    <div
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: isFiltered
                          ? '#f59e0b'
                          : idx % 2 === 0
                          ? theme.primary
                          : theme.secondary,
                      }}
                      className={`w-full rounded-t transition-all ${
                        isFiltered
                          ? 'ring-2 ring-slate-800 ring-offset-1 shadow-md'
                          : ''
                      } hover:brightness-110`}
                      title={`${pt.label}: ${pt.value} records · ${
                        isFiltered
                          ? 'Active cross-filter (Click to reset)'
                          : 'Click to cross-filter across all dashboard widgets'
                      }`}
                    ></div>
                    <span
                      className={`text-[9px] font-mono mt-1 truncate max-w-full transition-colors ${
                        isFiltered ? 'font-bold underline' : 'text-slate-500'
                      }`}
                      style={{ color: isFiltered ? theme.primary : undefined }}
                    >
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span className="flex items-center space-x-1">
                <Crosshair className="w-2.5 h-2.5" style={{ color: theme.primary }} />
                <span>Click any bar to cross-filter</span>
              </span>
              <span className="font-semibold" style={{ color: theme.primary }}>
                {widget.change}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 9: Donut Distribution Ring with Dynamic Theme & Cross-Filtering */}
        {widget.type === 'donut' && (() => {
          const donutSegList = (widget.donutSegments && widget.donutSegments.length > 0)
            ? widget.donutSegments
            : [
                { name: 'Checking', pct: 48, count: '48%', color: theme.primary },
                { name: 'Savings', pct: 28, count: '28%', color: theme.secondary },
                { name: 'Credit Lines', pct: 16, count: '16%', color: '#f59e0b' },
                { name: 'Wealth', pct: 8, count: '8%', color: '#10b981' },
              ];
          const donutTotal = donutSegList.reduce((sum, s) => sum + (Number(s.pct) || 0), 0) || 100;

          let runningPct = 0;
          const segmentsWithOffset = donutSegList.map((seg, i) => {
            const rawPct = Math.max(0, Number(seg.pct) || 0);
            const normalizedPct = (rawPct / donutTotal) * 100;
            const offset = runningPct;
            runningPct += normalizedPct;
            const segColor = i === 0 ? theme.primary : i === 1 ? theme.secondary : seg.color || '#6366f1';
            return {
              ...seg,
              segColor,
              normalizedPct,
              offset,
            };
          });

          return (
            <div className={`space-y-2 ${currentVisualMode === 'compact' ? 'py-1' : 'py-2'}`}>
              <div className="flex items-center justify-around">
                {/* Donut Graphic */}
                <div
                  className={`relative shrink-0 ${
                    currentVisualMode === 'compact' ? 'w-16 h-16' : 'w-20 h-20'
                  }`}
                >
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Track */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="4.5"
                    />
                    {segmentsWithOffset.map((seg, i) => {
                      const dashLength = seg.normalizedPct;
                      const gapLength = Math.max(0, 100 - dashLength);
                      return (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={seg.segColor}
                          strokeWidth="4.5"
                          pathLength="100"
                          strokeDasharray={`${dashLength.toFixed(2)} ${gapLength.toFixed(2)}`}
                          strokeDashoffset={(-seg.offset).toFixed(2)}
                          strokeLinecap="butt"
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-800 font-mono">
                      {Math.round(donutTotal)}%
                    </span>
                  </div>
                </div>

                {/* Segment Legend with Cross-filtering */}
                <div className="space-y-1 text-xs">
                  {segmentsWithOffset.map((seg, i) => {
                    const isSegFiltered = activeCrossFilter && activeCrossFilter.value === seg.name;
                    const isAnyActive = Boolean(activeCrossFilter);
                    return (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSegFiltered) {
                            onCrossFilterSelect?.(null);
                          } else {
                            onCrossFilterSelect?.({
                              sourceWidgetId: widget.id,
                              sourceWidgetTitle: widget.title,
                              dimension: 'Holding Segment',
                              value: seg.name,
                              percentage: seg.pct,
                            });
                          }
                        }}
                        className={`flex items-center space-x-2 cursor-pointer p-0.5 rounded transition-all ${
                          isSegFiltered
                            ? 'bg-indigo-50 ring-1 ring-[#1a237e] font-bold'
                            : isAnyActive
                            ? 'opacity-40 hover:opacity-100'
                            : 'hover:bg-slate-50'
                        }`}
                        title={`${seg.name}: ${seg.pct}% · ${
                          isSegFiltered ? 'Click to clear filter' : 'Click to cross-filter dashboard'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: seg.segColor }}
                        ></span>
                        <span className="text-slate-600 text-[11px] font-medium">{seg.name}</span>
                        <span className="text-slate-900 font-mono font-bold text-[11px]">
                          {seg.pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TYPE 10: Conversion Funnel Pipeline with Cross-filtering */}
        {widget.type === 'funnel' && (
          <div className="space-y-3 py-1">
            {/* Segmented Horizontal Bar */}
            <div className="h-9 w-full rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
              {(
                widget.funnelStages || [
                  { stage: 'Eligible', count: '148,200', pct: 45, color: '#10b981' },
                  { stage: 'Scored', count: '115,200', pct: 35, color: '#2563eb' },
                  { stage: 'Engaged', count: '65,800', pct: 20, color: '#f59e0b' },
                ]
              ).map((stg, i) => {
                const isStgFiltered = activeCrossFilter && activeCrossFilter.value === stg.stage;
                const isAnyActive = Boolean(activeCrossFilter);
                return (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isStgFiltered) {
                        onCrossFilterSelect?.(null);
                      } else {
                        onCrossFilterSelect?.({
                          sourceWidgetId: widget.id,
                          sourceWidgetTitle: widget.title,
                          dimension: 'Funnel Stage',
                          value: stg.stage,
                          countLabel: stg.count,
                          percentage: stg.pct,
                        });
                      }
                    }}
                    style={{
                      width: `${Math.max(stg.pct, 12)}%`,
                      backgroundColor: stg.color || '#2563eb',
                    }}
                    className={`hover:brightness-110 transition-all flex items-center justify-center text-white text-xs font-bold truncate px-1 cursor-pointer ${
                      isStgFiltered
                        ? 'ring-2 ring-indigo-900 ring-offset-1 scale-105 z-10 shadow-md'
                        : isAnyActive
                        ? 'opacity-40 hover:opacity-90'
                        : ''
                    }`}
                    title={`${stg.stage}: ${stg.count} (${stg.pct}%) · ${
                      isStgFiltered ? 'Click to reset filter' : 'Click to cross-filter'
                    }`}
                  >
                    {stg.pct}%
                  </div>
                );
              })}
            </div>

            {/* Stages Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
              {(
                widget.funnelStages || [
                  { stage: 'Eligible', count: '148,200', pct: 100, color: '#10b981' },
                  { stage: 'Scored', count: '115,200', pct: 77.7, color: '#2563eb' },
                  { stage: 'Engaged', count: '65,800', pct: 44.4, color: '#f59e0b' },
                  { stage: 'Deepened', count: '24,600', pct: 16.6, color: '#1a237e' },
                ]
              ).map((stg, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: stg.color }}
                    ></span>
                    <span className="text-slate-600 text-[10px] font-medium truncate">
                      {stg.stage}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 font-mono text-xs">{stg.count}</div>
                  <p className="text-[10px] text-slate-400 font-mono">{stg.pct}% conversion</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE 11: Radar Attribute Spider */}
        {widget.type === 'radar' && (
          <div className="py-2 flex items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background grid concentric polygons */}
                <polygon points="50,10 90,38 75,82 25,82 10,38" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="50,25 75,42 65,70 35,70 25,42" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                {/* Data Polygon */}
                <polygon
                  points="50,18 82,40 70,78 30,75 18,36"
                  fill="#1a237e"
                  fillOpacity="0.25"
                  stroke="#1a237e"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}

        {/* TYPE 12: Embedded Streaming Data Table with Row Cross-Filtering */}
        {widget.type === 'table' && (
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">TIER</th>
                  <th className="p-2">BALANCE</th>
                  <th className="p-2">FICO</th>
                  <th className="p-2">PROPENSITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(
                  widget.tableRows || [
                    { id: 'CUST-89101', tier: 'Commercial Plat', balance: '$842,500', fico: 785, score: '0.94' },
                    { id: 'CUST-89102', tier: 'Commercial Gold', balance: '$312,000', fico: 742, score: '0.88' },
                    { id: 'CUST-89103', tier: 'Commercial Plat', balance: '$1,290,000', fico: 810, score: '0.97' },
                  ]
                ).map((row, idx) => {
                  const isRowFiltered = activeCrossFilter && (activeCrossFilter.value === row.id || activeCrossFilter.value === row.tier);
                  return (
                    <tr
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isRowFiltered) {
                          onCrossFilterSelect?.(null);
                        } else {
                          onCrossFilterSelect?.({
                            sourceWidgetId: widget.id,
                            sourceWidgetTitle: widget.title,
                            dimension: 'Entity Account',
                            value: String(row.id),
                            countLabel: String(row.balance),
                          });
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        isRowFiltered
                          ? 'bg-indigo-100/90 font-bold border-l-4 border-[#1a237e]'
                          : 'hover:bg-slate-50/80'
                      }`}
                      title={`Account: ${row.id} · ${
                        isRowFiltered ? 'Click to clear cross-filter' : 'Click to cross-filter entire dashboard'
                      }`}
                    >
                      <td className="p-2 font-bold text-slate-800">{row.id}</td>
                      <td className="p-2 font-sans text-slate-600">{row.tier}</td>
                      <td className="p-2 text-emerald-700 font-bold">{row.balance}</td>
                      <td className="p-2 text-slate-700">{row.fico}</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                          {row.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TYPE 13: Real-Time Ingress Telemetry Stream */}
        {widget.type === 'telemetry-stream' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline space-x-2">
                  <span>{widget.value || '4,850 msgs/s'}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    LIVE INGRESS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Kafka Partition Lag: 18ms (Nominal)'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Streaming</span>
              </div>
            </div>

            {/* Live Packet Ingress Graphic */}
            <div className="bg-slate-900 rounded-lg p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>BUFFER INGRESS PIPELINE</span>
                <span className="text-emerald-400">4.2% Occupancy</span>
              </div>
              <div className="grid grid-cols-12 gap-1 py-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 rounded-xs transition-all duration-300 ${
                      i % 4 === 0
                        ? 'bg-emerald-400 animate-pulse'
                        : i % 3 === 0
                        ? 'bg-blue-400'
                        : 'bg-slate-700'
                    }`}
                    title={`Partition buffer ${i}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                <span>TCP Drop: 0.00%</span>
                <span>Worker Sync: 100%</span>
                <span>P99: 1.15ms</span>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 14: Twin Drift & PSI Anomaly Radar */}
        {widget.type === 'anomaly-radar' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {widget.value || 'PSI: 0.082'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Baseline: 2026-Q1 Production Reference'}
                </span>
              </div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                <ShieldCheck className="w-3 h-3" />
                <span>Minimal Drift</span>
              </div>
            </div>

            {/* Drift Gauge Track */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Safe (&lt;0.10)</span>
                <span className="text-amber-600">Moderate (0.10-0.20)</span>
                <span className="text-rose-600">Significant (&gt;0.20)</span>
              </div>
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-1/2 bg-emerald-200 h-full border-r border-emerald-300" />
                <div className="w-1/4 bg-amber-200 h-full border-r border-amber-300" />
                <div className="w-1/4 bg-rose-200 h-full" />
                <div
                  style={{ left: '27%' }}
                  className="absolute top-0 bottom-0 w-2 bg-purple-700 ring-1 ring-white rounded-full -ml-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono pt-1">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">KS STAT</span>
                <span className="font-bold text-slate-800">0.038</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">TOP FEATURE</span>
                <span className="font-bold text-slate-800 truncate block">balance_90d</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">STATUS</span>
                <span className="font-bold text-emerald-600">Pass</span>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 15: DAG Pipeline Throughput & Buffer */}
        {widget.type === 'pipeline-throughput' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {widget.value || '18,400 rec/s'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Buffer Queue Depth: 4.2% | Drop Rate: 0.00%'}
                </span>
              </div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                <Zap className="w-3 h-3 text-indigo-600" />
                <span>82% Quota</span>
              </div>
            </div>

            {/* Transform Flow Stage Nodes */}
            <div className="grid grid-cols-4 gap-1.5 py-1 text-center font-mono text-[10px]">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded p-1.5">
                <span className="text-slate-400 block text-[9px]">INGEST</span>
                <strong className="text-indigo-900">22.4k/s</strong>
              </div>
              <div className="bg-blue-50/80 border border-blue-200 rounded p-1.5">
                <span className="text-slate-400 block text-[9px]">CLEANSE</span>
                <strong className="text-blue-900">21.8k/s</strong>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200 rounded p-1.5">
                <span className="text-slate-400 block text-[9px]">VECTOR</span>
                <strong className="text-emerald-900">18.4k/s</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-1.5">
                <span className="text-slate-400 block text-[9px]">SINK</span>
                <strong className="text-slate-800">18.4k/s</strong>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 16: Scenario Matrix & Elasticity Grid with Cross-Filtering */}
        {widget.type === 'scenario-sensitivity' && (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                  {widget.value || '9 Scenario States Scored'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Highest Sensitivity: Mileage Bin Tier 3 (+24.2%)'}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                3x3 MATRIX
              </span>
            </div>

            {/* 3x3 Elasticity Heatmap Matrix with interactive cross-filtering */}
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
              {[
                { label: '-10% Rate', val: '-14.2%', style: 'bg-rose-50 border-rose-200 text-rose-700' },
                { label: 'Baseline', val: '0.0%', style: 'bg-slate-50 border-slate-200 text-slate-700' },
                { label: '+10% Rate', val: '+18.5%', style: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { label: 'Eco Tier 1', val: '+4.1%', style: 'bg-amber-50 border-amber-200 text-amber-700' },
                { label: 'Eco Tier 2', val: '+12.8%', style: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { label: 'Eco Tier 3', val: '+24.2%', style: 'bg-emerald-100 border-emerald-300 text-emerald-900 font-black' },
              ].map((cell, idx) => {
                const isCellFiltered = activeCrossFilter && activeCrossFilter.value === cell.label;
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCellFiltered) {
                        onCrossFilterSelect?.(null);
                      } else {
                        onCrossFilterSelect?.({
                          sourceWidgetId: widget.id,
                          sourceWidgetTitle: widget.title,
                          dimension: 'Scenario State',
                          value: cell.label,
                          countLabel: cell.val,
                        });
                      }
                    }}
                    className={`border rounded p-2 cursor-pointer transition-all ${cell.style} ${
                      isCellFiltered ? 'ring-2 ring-[#1a237e] scale-105 shadow-sm' : 'hover:scale-[1.02]'
                    }`}
                    title={`${cell.label}: ${cell.val} · ${
                      isCellFiltered ? 'Click to clear filter' : 'Click to cross-filter dashboard'
                    }`}
                  >
                    <span className="text-[9px] block text-slate-400">{cell.label}</span>
                    <strong className="text-sm font-black">{cell.val}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TYPE 17: Tier-0 SLA Compliance & Latency Tile */}
        {widget.type === 'sla-compliance' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {widget.value || '99.994%'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Mean Latency: 1.15ms | P99: 1.42ms'}
                </span>
              </div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                <span>Tier-0 SLA Met</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 block">MEAN LATENCY</span>
                <span className="text-xs font-bold text-slate-800">1.15ms</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 block">P99 LATENCY</span>
                <span className="text-xs font-bold text-indigo-700">1.42ms</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 block">CACHE HIT</span>
                <span className="text-xs font-bold text-emerald-700">99.8%</span>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 18: Live Twin State Feature Vector */}
        {widget.type === 'twin-feature-vector' && (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-black text-slate-900 font-mono tracking-tight">
                  {widget.value || '6 Features Synchronized'}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {widget.secondaryText || 'Dual-tier write: Redis + BigQuery'}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                VECTOR DIM: 6
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px]">
              {[
                { name: 'balance_norm_90d', val: '0.884', pct: 88, color: 'bg-indigo-600' },
                { name: 'credit_fico_score', val: '0.785', pct: 78, color: 'bg-blue-600' },
                { name: 'txn_velocity_7d', val: '0.942', pct: 94, color: 'bg-emerald-600' },
                { name: 'digital_propensity', val: '0.910', pct: 91, color: 'bg-purple-600' },
              ].map((feat) => (
                <div key={feat.name} className="space-y-0.5">
                  <div className="flex justify-between text-slate-600">
                    <span>{feat.name}</span>
                    <strong className="text-slate-900">{feat.val}</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${feat.pct}%` }}
                      className={`h-full rounded-full ${feat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE: Embedded Dashboard Mini-Map & Navigator Widget */}
        {widget.type === 'mini-map-navigator' && (
          <div className="py-1">
            <DashboardMinimap
              widgets={allWidgets}
              activeWidgetId={widget.id}
              onSelectWidget={(selectedId) => {
                const el = document.getElementById(selectedId) || document.getElementById(`widget-card-${selectedId}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('ring-4', 'ring-indigo-500');
                  setTimeout(() => {
                    el.classList.remove('ring-4', 'ring-indigo-500');
                  }, 1800);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Widget Footer Info */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 rounded-b-xl flex items-center justify-between text-[10px] text-slate-400 font-mono relative">
        <span className="truncate max-w-[180px]">
          {widget.sourceTwin} · {widget.attribute}
        </span>
        <div className="flex items-center space-x-2">
          <span className="shrink-0">{widget.refreshRate}</span>

          {/* Quick corner resize handle */}
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextSpan = ((span % 4) + 1) as 1 | 2 | 3 | 4;
                onSetColSpan?.(nextSpan);
                onUpdate?.({ gridColSpan: nextSpan, width: nextSpan >= 3 ? 'full' : 'half' });
              }}
              className="text-slate-300 hover:text-indigo-600 p-0.5 rounded cursor-se-resize transition-colors"
              title={`Click to cycle resize (${span} of 4 columns)`}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 6 6" fill="currentColor">
                <circle cx="5" cy="5" r="0.75" />
                <circle cx="3" cy="5" r="0.75" />
                <circle cx="5" cy="3" r="0.75" />
                <circle cx="1" cy="5" r="0.75" />
                <circle cx="3" cy="3" r="0.75" />
                <circle cx="5" cy="1" r="0.75" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
