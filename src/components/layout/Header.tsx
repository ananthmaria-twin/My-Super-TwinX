import { useState } from 'react';
import {
  ChevronDown,
  Layers,
  Search,
  BookOpen,
  CheckCircle2,


  Zap,
} from 'lucide-react';
import { type NavModuleId } from '../../types';

interface HeaderProps {
  currentModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  onOpenSearch: () => void;
  onOpenDocs: () => void;
  onOpenQuickActions?: () => void;
  activeTwinCount: number;
}

export default function Header({
  currentModule,
  onOpenSearch,
  onOpenDocs,
  onOpenQuickActions,
  activeTwinCount,
}: HeaderProps) {
  const [scope, setScope] = useState<'Platform' | 'BFSI Domain' | 'Automotive Mesh' | 'Telecom SLA'>('Platform');
  const [showScopeMenu, setShowScopeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Exact breadcrumbs and subtitles according to TwinX navigation
  const moduleTitles: Record<NavModuleId, { title: string; subtitle: string }> = {
    catalog: {
      title: 'Catalog',
      subtitle: 'Placeholder — not part of this demo.',
    },
    configuration: {
      title: 'Use Case Configuration',
      subtitle: 'Data mapping, sufficiency check, validate & activate.',
    },
    pipelines: {
      title: 'Pipelines',
      subtitle: 'Placeholder — not part of this demo.',
    },
    studio: {
      title: 'Studio',
      subtitle: 'Placeholder — not part of this demo.',
    },
    datasources: {
      title: 'Data Sources',
      subtitle: 'Placeholder — not part of this demo.',
    },
    digitaltwins: {
      title: 'Digital Twins',
      subtitle: 'Placeholder — not part of this demo.',
    },
    livefeatures: {
      title: 'Live Features',
      subtitle: 'Placeholder — not part of this demo.',
    },
    notebooks: {
      title: 'Notebooks',
      subtitle: 'Placeholder — not part of this demo.',
    },
    operations: {
      title: 'Operations',
      subtitle: 'Placeholder — not part of this demo.',
    },
  };

  const currentInfo = moduleTitles[currentModule];

  return (
    <header
      id="twinx-main-header"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs"
    >
      {/* Left: Breadcrumbs / Title & Subtitle matching the screenshot */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[15px] font-bold text-slate-900 leading-tight">
          {currentInfo.title}
        </h1>
        <p className="text-[12px] text-slate-500 leading-normal">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Center: Search Trigger */}
      <div className="hidden md:flex items-center">
        <button
          id="btn-global-search"
          onClick={onOpenSearch}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors w-72 justify-between"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Quick search (⌘K)...</span>
          </div>
          <kbd className="text-[10px] bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions matching screenshot */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions (Cmd+J) */}
        {onOpenQuickActions && (
          <button
            id="btn-quick-actions"
            onClick={onOpenQuickActions}
            className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 shadow-2xs cursor-pointer"
            title="Open Quick Actions Menu (⌘J)"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Actions</span>
            <kbd className="text-[10px] bg-white text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200 font-mono font-bold">
              ⌘J
            </kbd>
          </button>
        )}

        {/* Exportable Storybook/Markdown Documentation */}
        <button
          id="btn-open-documentation"
          onClick={onOpenDocs}
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
          title="View Platform Demo Documentation & Storybook Spec"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Demo Specs</span>
        </button>

        {/* SCOPE Platform ⌄ Pill Badge matching screenshot */}
        <div className="relative">
          <button
            id="btn-scope-selector"
            onClick={() => setShowScopeMenu(!showScopeMenu)}
            className="bg-[#124e43] hover:bg-[#0e3e35] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="tracking-wide">SCOPE</span>
            <span className="font-normal text-emerald-100">·</span>
            <span>{scope}</span>
            <ChevronDown className="w-3 h-3 text-emerald-200 ml-0.5" />
          </button>

          {showScopeMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 text-xs z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase text-[10px] border-b border-slate-100">
                Active Tenant Scope
              </div>
              {(['Platform', 'BFSI Domain', 'Automotive Mesh', 'Telecom SLA'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScope(s);
                    setShowScopeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    scope === s ? 'text-[#124e43] font-bold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{s}</span>
                  {scope === s && <CheckCircle2 className="w-3.5 h-3.5 text-[#124e43]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar US Circle with subtle border */}
        <div className="relative">
          <button
            id="btn-user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold font-mono transition-colors"
            title="User: sathish (US)"
          >
            US
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 text-xs z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">sathish</p>
                <p className="text-[11px] text-slate-500">Lead Enterprise Architect</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-medium border border-emerald-200">
                  Role: Platform Admin
                </span>
              </div>
              <div className="py-1">
                <div className="px-3 py-1 text-[11px] text-slate-500 flex justify-between">
                  <span>Twin Mesh State</span>
                  <span className="text-emerald-600 font-semibold">Nominal</span>
                </div>
                <div className="px-3 py-1 text-[11px] text-slate-500 flex justify-between">
                  <span>Active Twins</span>
                  <span className="font-semibold text-slate-800">{activeTwinCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
