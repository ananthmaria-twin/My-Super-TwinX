import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,


  CornerDownLeft,
  Database,
  Download,


  LayoutDashboard,
  Moon,

  Play,
  PlusCircle,


  Sparkles,


  Zap,
} from 'lucide-react';
import { type NavModuleId } from '../../types';
import { themeService } from '../../services/themeService';

export interface QuickActionItem {
  id: string;
  title: string;
  category: 'Digital Twins' | 'Dashboards & Studio' | 'Live Telemetry' | 'Platform Ops';
  description: string;
  icon: React.ElementType;
  shortcutBadge?: string;
  action: () => void;
}

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavModuleId) => void;
  onOpenCopilot?: () => void;
  onOpenDocs?: () => void;
}

export default function QuickActionsModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenCopilot,
  onOpenDocs,
}: QuickActionsModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: QuickActionItem[] = [
    {
      id: 'create-twin',
      title: 'Create New Twin Entity',
      category: 'Digital Twins',
      description: 'Define a new dynamic twin entity contract with dual-tier state bindings',
      icon: PlusCircle,
      shortcutBadge: '⌘N',
      action: () => {
        onNavigate('digitaltwins');
        onClose();
      },
    },
    {
      id: 'run-simulation',
      title: 'Run Simulation Engine',
      category: 'Digital Twins',
      description: 'Execute Monte-Carlo what-if scenario simulations across twin instances',
      icon: Play,
      shortcutBadge: '⌘S',
      action: () => {
        onNavigate('digitaltwins');
        onClose();
      },
    },
    {
      id: 'export-twin-state',
      title: 'Export Twin Entity State',
      category: 'Digital Twins',
      description: 'Download active digital twin state and schemas as CSV or JSON',
      icon: Download,
      shortcutBadge: '⌘E',
      action: () => {
        onNavigate('digitaltwins');
        onClose();
      },
    },
    {
      id: 'sql-sandbox',
      title: 'Open SQL Analytics Sandbox',
      category: 'Digital Twins',
      description: 'Execute analytical SQL queries directly across hot and cold twin state',
      icon: Database,
      shortcutBadge: '⌘Q',
      action: () => {
        onNavigate('digitaltwins');
        onClose();
      },
    },
    {
      id: 'open-builder',
      title: 'Open Dashboard Builder Studio',
      category: 'Dashboards & Studio',
      description: 'Configure and arrange widgets on the live responsive canvas mesh',
      icon: LayoutDashboard,
      shortcutBadge: '⌘B',
      action: () => {
        onNavigate('configuration');
        onClose();
      },
    },
    {
      id: 'browse-templates',
      title: 'Browse Dashboard Template Gallery',
      category: 'Dashboards & Studio',
      description: 'Select from 5 architecture presets with pre-configured schemas & Kafka streams',
      icon: Sparkles,
      shortcutBadge: '⌘T',
      action: () => {
        onNavigate('configuration');
        onClose();
      },
    },
    {
      id: 'live-telemetry',
      title: 'View Streaming Telemetry Stream',
      category: 'Live Telemetry',
      description: 'Monitor real-time sub-millisecond Tier-0 cache latency and event ingress',
      icon: Zap,
      shortcutBadge: '⌘L',
      action: () => {
        onNavigate('livefeatures');
        onClose();
      },
    },
    {
      id: 'simulate-surge',
      title: 'Simulate Telemetry Ingress Surge',
      category: 'Live Telemetry',
      description: 'Inject real-time Kafka event spike to test stream and SLA alerts',
      icon: Activity,
      shortcutBadge: '⌘K',
      action: () => {
        onNavigate('livefeatures');
        onClose();
      },
    },
    {
      id: 'inspect-alerts',
      title: 'Inspect Critical Health Alerts',
      category: 'Platform Ops',
      description: 'Open AI Copilot to diagnose Twin Health Score drift & DAG lag',
      icon: AlertTriangle,
      shortcutBadge: '⌘A',
      action: () => {
        if (onOpenCopilot) onOpenCopilot();
        onClose();
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle System Theme (Light / Dark / Contrast)',
      category: 'Platform Ops',
      description: 'Cycle system-wide theme between Light, Dark, and High Contrast mode',
      icon: Moon,
      shortcutBadge: '⌘M',
      action: () => {
        const cur = themeService.getTheme();
        const next = cur === 'light' ? 'dark' : cur === 'dark' ? 'contrast' : 'light';
        themeService.setTheme(next);
        onClose();
      },
    },
    {
      id: 'open-docs',
      title: 'Open Platform Architecture Specs',
      category: 'Platform Ops',
      description: 'Review interactive Storybook specifications, diagrams, and SLAs',
      icon: BookOpen,
      shortcutBadge: '⌘D',
      action: () => {
        if (onOpenDocs) onOpenDocs();
        onClose();
      },
    },
  ];

  const filteredActions = actions.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? (filteredActions.length || 1) - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="twinx-quick-actions-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a237e] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Quick Actions (e.g. 'Create Twin', 'Run Simulation', 'Theme')..."
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <kbd className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300 font-mono">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching quick actions found for "{search}"
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200/80 text-indigo-950'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#1a237e] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    {item.shortcutBadge && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">
                        {item.shortcutBadge}
                      </kbd>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3 font-mono text-[10px]">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-700">
            TwinX™ Quick Command Dispatch
          </span>
        </div>
      </div>
    </div>
  );
}
