
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,

  Database,
  GitBranch,
  LayoutGrid,
  Lock,
  Network,

  Settings,

  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { type NavModuleId } from '../../types';

interface SidebarProps {
  currentModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  currentModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  // Navigation structure organized exactly like the uploaded TwinX screenshot
  const useCaseGroup = [
    {
      id: 'catalog' as NavModuleId,
      label: 'Catalog',
      icon: LayoutGrid,
    },
    {
      id: 'configuration' as NavModuleId,
      label: 'Configuration',
      icon: Settings,
    },
    {
      id: 'pipelines' as NavModuleId,
      label: 'Pipelines',
      icon: GitBranch,
    },
    {
      id: 'studio' as NavModuleId,
      label: 'Studio',
      icon: Sparkles,
    },
  ];

  const digitalTwinGroup = [
    {
      id: 'datasources' as NavModuleId,
      label: 'Data Sources',
      icon: Database,
    },
    {
      id: 'digitaltwins' as NavModuleId,
      label: 'Digital Twins',
      icon: Network,
    },
    {
      id: 'livefeatures' as NavModuleId,
      label: 'Live Features',
      icon: Zap,
    },
    {
      id: 'notebooks' as NavModuleId,
      label: 'Notebooks',
      icon: BookOpen,
    },
  ];

  const operationsGroup = [
    {
      id: 'operations' as NavModuleId,
      label: 'Model Drift',
      icon: TrendingDown,
      badge: 'SOON',
    },
    {
      id: 'operations' as NavModuleId,
      label: 'Monitoring',
      icon: Activity,
      badge: 'SOON',
    },
  ];

  return (
    <aside
      id="twinx-main-sidebar"
      className={`h-[calc(100vh-4rem)] bg-[#f4f5f8] border-r border-slate-200 flex flex-col justify-between transition-all duration-200 select-none z-20 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Logo Header */}
        <div className="h-14 px-4 flex items-center border-b border-slate-200/80">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            {/* TCS TwinX Blue Cube Logo Icon */}
            <div className="w-7 h-7 rounded-md bg-[#1a237e] flex items-center justify-center shadow-xs shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {!collapsed && (
              <div className="flex items-baseline space-x-1 truncate">
                <span className="font-bold text-[15px] tracking-tight text-slate-900">
                  TCS TwinX
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">™</span>
              </div>
            )}
          </div>
        </div>

        {/* Group 1: USE CASES */}
        <div className="pt-4 pb-2 px-2.5">
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              USE CASES
            </p>
          )}
          <div className="space-y-0.5">
            {useCaseGroup.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectModule(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-0' : 'px-2.5'
                  } py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-200/90 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  />
                  {!collapsed && (
                    <span className="ml-2.5 text-[13px]">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 2: DIGITAL TWIN & DATA 🔒 */}
        <div className="pt-2 pb-2 px-2.5">
          {!collapsed && (
            <div className="px-2 pb-1.5 flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>DIGITAL TWIN & DATA</span>
              <Lock className="w-3 h-3 text-slate-400 inline" />
            </div>
          )}
          <div className="space-y-0.5">
            {digitalTwinGroup.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectModule(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-0' : 'px-2.5'
                  } py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-200/90 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  />
                  {!collapsed && (
                    <span className="ml-2.5 text-[13px]">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 3: OPERATIONS 🔒 */}
        <div className="pt-2 pb-2 px-2.5">
          {!collapsed && (
            <div className="px-2 pb-1.5 flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>OPERATIONS</span>
              <Lock className="w-3 h-3 text-slate-400 inline" />
            </div>
          )}
          <div className="space-y-0.5">
            {operationsGroup.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentModule === 'operations';
              return (
                <button
                  key={idx}
                  id={`nav-item-operations-${idx}`}
                  onClick={() => onSelectModule('operations')}
                  title={collapsed ? `${item.label} (SOON)` : undefined}
                  className={`w-full flex items-center justify-between ${
                    collapsed ? 'justify-center px-0' : 'px-2.5'
                  } py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-200/90 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    />
                    {!collapsed && (
                      <span className="ml-2.5 text-[13px]">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Collapse Button matching screenshot */}
      <div className="p-2 border-t border-slate-200">
        <button
          id="btn-sidebar-collapse"
          onClick={onToggleCollapse}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'px-2.5'
          } py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
