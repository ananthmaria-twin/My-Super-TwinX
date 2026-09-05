import React, { useState } from 'react';
import {
  ChevronRight,
  Home,
  LayoutGrid,
  Settings,
  GitBranch,
  Sparkles,
  Database,
  Network,
  Zap,
  BookOpen,
  Activity,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { type NavModuleId } from '../../types';

interface BreadcrumbTrailProps {
  currentModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  subPath?: string;
}

interface ModuleMeta {
  label: string;
  category: 'Use Cases' | 'Digital Twin' | 'Operations';
  icon: React.ElementType;
  badge?: string;
  contextDesc: string;
}

const MODULE_REGISTRY: Record<NavModuleId, ModuleMeta> = {
  catalog: {
    label: 'Catalog',
    category: 'Use Cases',
    icon: LayoutGrid,
    contextDesc: 'Placeholder — not part of this demo',
  },
  configuration: {
    label: 'Dashboard Configuration Studio',
    category: 'Use Cases',
    icon: Settings,
    contextDesc: 'Canvas Builder & Multi-Dashboard Engine',
  },
  pipelines: {
    label: 'Pipelines',
    category: 'Use Cases',
    icon: GitBranch,
    contextDesc: 'Placeholder — not part of this demo',
  },
  studio: {
    label: 'Studio',
    category: 'Use Cases',
    icon: Sparkles,
    contextDesc: 'Placeholder — not part of this demo',
  },
  datasources: {
    label: 'Data Sources',
    category: 'Digital Twin',
    icon: Database,
    contextDesc: 'Placeholder — not part of this demo',
  },
  digitaltwins: {
    label: 'Digital Twins',
    category: 'Digital Twin',
    icon: Network,
    contextDesc: 'Placeholder — not part of this demo',
  },
  livefeatures: {
    label: 'Live Features',
    category: 'Digital Twin',
    icon: Zap,
    contextDesc: 'Placeholder — not part of this demo',
  },
  notebooks: {
    label: 'Notebooks',
    category: 'Digital Twin',
    icon: BookOpen,
    contextDesc: 'Placeholder — not part of this demo',
  },
  operations: {
    label: 'Operations',
    category: 'Operations',
    icon: Activity,
    contextDesc: 'Placeholder — not part of this demo',
  },
};

export default function BreadcrumbTrail({
  currentModule,
  onSelectModule,
  subPath,
}: BreadcrumbTrailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const current = MODULE_REGISTRY[currentModule];
  const CurrentIcon = current.icon;

  const allModules: NavModuleId[] = [
    'digitaltwins',
    'livefeatures',
    'configuration',
    'catalog',
    'pipelines',
    'studio',
    'datasources',
    'notebooks',
    'operations',
  ];

  return (
    <nav
      id="twinx-breadcrumb-trail"
      aria-label="Breadcrumb"
      className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs"
    >
      {/* Left Trail */}
      <ol className="flex items-center flex-wrap gap-1 text-slate-500">
        {/* Platform Root */}
        <li className="flex items-center">
          <button
            onClick={() => onSelectModule('digitaltwins')}
            className="flex items-center space-x-1.5 font-semibold text-slate-600 hover:text-[#1a237e] transition-colors py-0.5 px-1.5 rounded hover:bg-slate-100 cursor-pointer"
            title="Return to TwinX Platform Overview"
          >
            <Home className="w-3.5 h-3.5 text-indigo-700" />
            <span>TwinX Platform</span>
          </button>
        </li>

        <li className="flex items-center text-slate-300">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>

        {/* Category Hierarchy Level */}
        <li className="flex items-center">
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-slate-600 font-medium bg-slate-100/80">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>{current.category}</span>
          </span>
        </li>

        <li className="flex items-center text-slate-300">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>

        {/* Active Module with Quick-Switch Dropdown */}
        <li className="relative flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1.5 font-bold text-slate-900 bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 px-2 py-1 rounded-lg hover:bg-indigo-100/70 transition-all cursor-pointer shadow-2xs"
            title="Switch module"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-indigo-700" />
            <span>{current.label}</span>
            <ChevronDown
              className={`w-3 h-3 text-indigo-700 ml-0.5 transition-transform ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Quick-switch dropdown menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 animate-in fade-in slide-in-from-top-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Navigate Platform Modules
                </div>
                <div className="max-h-72 overflow-y-auto space-y-0.5">
                  {allModules.map((modId) => {
                    const meta = MODULE_REGISTRY[modId];
                    const Icon = meta.icon;
                    const isCurrent = modId === currentModule;
                    return (
                      <button
                        key={modId}
                        onClick={() => {
                          onSelectModule(modId);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200/60'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isCurrent ? 'text-indigo-700' : 'text-slate-400'
                          }`}
                        />
                        <div className="flex-1 truncate">
                          <span className="block truncate">{meta.label}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {meta.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </li>

        {/* Optional Active Sub-Path */}
        {subPath && (
          <>
            <li className="flex items-center text-slate-300">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {subPath}
              </span>
            </li>
          </>
        )}
      </ol>

      {/* Right Context / Location Indicator */}
      <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-slate-500">{current.contextDesc}</span>
      </div>
    </nav>
  );
}
