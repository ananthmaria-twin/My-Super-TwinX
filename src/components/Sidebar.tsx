import { motion } from 'framer-motion';
import {
  Boxes,
  Radio,
  FolderKanban,
  Workflow,
  Paintbrush,
  TrendingDown,
  Radar,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { navItems } from '../data/navigation';
import type { SectionId } from '../types';
import clsx from 'clsx';

const icons: Record<SectionId, ComponentType<{ size?: number; className?: string }>> = {
  'digital-twins': Boxes,
  'live-features': Radio,
  'use-cases': FolderKanban,
  pipelines: Workflow,
  studio: Paintbrush,
  'model-drift': TrendingDown,
  monitoring: Radar,
};

interface SidebarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ active, onSelect, collapsed, onToggleCollapse }: SidebarProps) {
  const groups = ['Platform', 'Operations'] as const;

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="glass-panel relative z-20 flex h-full flex-col border-r border-(--border-soft) py-5"
    >
      <div className={clsx('flex items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-twin-blue via-twin-teal to-twin-purple shadow-lg shadow-blue-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="whitespace-nowrap text-sm font-semibold tracking-tight text-(--text-primary)">TwinX</p>
            <p className="whitespace-nowrap text-[11px] text-(--text-muted)">Digital Twin Platform</p>
          </div>
        )}
      </div>

      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto px-3">
        {groups.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
                {group}
              </p>
            )}
            <ul className="space-y-1">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = icons[item.id];
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={item.soon}
                        onClick={() => onSelect(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={clsx(
                          'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                          collapsed && 'justify-center px-0',
                          item.soon
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer hover:bg-white/5',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500/15 via-teal-500/10 to-purple-500/15 text-(--text-primary)'
                            : 'text-(--text-secondary)',
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active-glow"
                            className="absolute inset-0 rounded-xl ring-1 ring-blue-400/40 shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)]"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <Icon
                          size={18}
                          className={clsx(
                            'relative shrink-0 transition-all duration-300',
                            isActive
                              ? 'text-twin-blue drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]'
                              : 'group-hover:text-twin-teal group-hover:drop-shadow-[0_0_6px_rgba(20,184,166,0.6)]',
                          )}
                        />
                        {!collapsed && (
                          <span className="relative flex flex-1 items-center justify-between whitespace-nowrap">
                            {item.label}
                            {item.soon && (
                              <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-(--text-muted)">
                                SOON
                              </span>
                            )}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="mx-3 mt-4 flex items-center justify-center gap-2 rounded-xl border border-(--border-soft) py-2 text-(--text-muted) transition-colors hover:text-twin-blue"
      >
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>
    </motion.aside>
  );
}
