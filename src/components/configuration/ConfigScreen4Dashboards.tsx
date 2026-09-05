import { useState } from 'react';
import {

  ArrowLeft,
  Calendar,
  Check,

  Compass,

  Crosshair,
  Download,





  LayoutDashboard,

  Pencil,
  Plus,
  RefreshCw,



  Table as TableIcon,
  Trash2,
  X,

} from 'lucide-react';
import { type UseCaseItem, type DashboardDefinition, type DashboardWidget, type CrossFilterState } from '../../types';
import DashboardWidgetRenderer from './DashboardWidgetRenderer';
import DashboardMinimap from './DashboardMinimap';

interface ConfigScreen4DashboardsProps {
  selectedUseCase: UseCaseItem;
  dashboards: DashboardDefinition[];
  activeDashboardId: string;
  onSelectDashboard: (dashboardId: string) => void;
  onBackToCapabilities: () => void;
  onNewDashboard: () => void; // Navigates to Config Screen 5 Builder for new dashboard
  onEditDashboard: (dashboard: DashboardDefinition) => void; // Navigates to Config Screen 5 Builder with current dashboard
  onDeleteDashboard?: (dashboardId: string) => void;
  onUpdateDashboard?: (dashboard: DashboardDefinition, navigateToView?: boolean) => void;
}

export default function ConfigScreen4Dashboards({

  dashboards,
  activeDashboardId,
  onSelectDashboard,
  onBackToCapabilities,
  onNewDashboard,
  onEditDashboard,
  onDeleteDashboard,
  onUpdateDashboard,
}: ConfigScreen4DashboardsProps) {
  // Sub-tabs: 'dashboard' (Active Live Dashboard with Widgets) vs 'explorer' (Data Explorer Cohort Table)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer'>('dashboard');

  // Time-range filter
  const [timeRange, setTimeRange] = useState<string>('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Cross-filtering and Mini-map Navigator states
  const [activeCrossFilter, setActiveCrossFilter] = useState<CrossFilterState | null>(null);
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Explorer tab state
  const [viewMode, setViewMode] = useState<'table' | 'pivot'>('table');
  const [rowCount, setRowCount] = useState<number>(200);
  const [, setPreviewLoaded] = useState<boolean>(true);

  // Active dashboard
  const activeDashboard =
    dashboards.find((d) => d.id === activeDashboardId) || dashboards[0] || null;

  // Handle in-place widget updates from live dashboard (mode, color, threshold, title, values)
  const handleWidgetUpdate = (widgetId: string, updates: Partial<DashboardWidget>) => {
    if (!activeDashboard) return;
    const updatedWidgets = activeDashboard.widgets.map((w) =>
      w.id === widgetId ? { ...w, ...updates } : w
    );
    const updatedDashboard: DashboardDefinition = {
      ...activeDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDashboard?.(updatedDashboard, false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleExport = (type: 'pdf' | 'json' | 'csv') => {
    if (!activeDashboard) return;
    if (type === 'json') {
      const jsonStr = JSON.stringify(activeDashboard, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitized = activeDashboard.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      a.download = `${sanitized || 'dashboard'}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice(`Exported ${activeDashboard.title} as JSON configuration!`);
    } else if (type === 'csv') {
      const headers = ['Widget ID', 'Title', 'Type', 'Value', 'Col Span', 'Refresh Rate'];
      const csvRows = [headers.join(',')];
      activeDashboard.widgets.forEach((w) => {
        csvRows.push(
          [
            w.id,
            `"${w.title.replace(/"/g, '""')}"`,
            w.type,
            `"${(w.value || '').replace(/"/g, '""')}"`,
            w.gridColSpan || (w.width === 'full' ? 4 : 2),
            `"${w.refreshRate}"`,
          ].join(',')
        );
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitized = activeDashboard.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      a.download = `${sanitized || 'dashboard'}-widgets.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice(`Exported ${activeDashboard.title} as CSV!`);
    } else {
      setExportNotice(`Preparing print / PDF view for ${activeDashboard.title}...`);
      window.print?.();
    }
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Sample data rows for Data Explorer tab
  const sampleTableRows = [
    {
      id: 'CUST-89101',
      tier: 'Commercial Platinum',
      balanceAvg: '$842,500',
      fico: 785,
      spendVelocity: '+24.2%',
      logins: 42,
      propensity: '0.94',
    },
    {
      id: 'CUST-89102',
      tier: 'Commercial Gold',
      balanceAvg: '$312,000',
      fico: 742,
      spendVelocity: '+18.5%',
      logins: 28,
      propensity: '0.88',
    },
    {
      id: 'CUST-89103',
      tier: 'Commercial Platinum',
      balanceAvg: '$1,290,000',
      fico: 810,
      spendVelocity: '+31.0%',
      logins: 64,
      propensity: '0.97',
    },
    {
      id: 'CUST-89104',
      tier: 'Commercial Silver',
      balanceAvg: '$145,200',
      fico: 715,
      spendVelocity: '+8.4%',
      logins: 16,
      propensity: '0.73',
    },
    {
      id: 'CUST-89105',
      tier: 'Commercial Gold',
      balanceAvg: '$498,300',
      fico: 760,
      spendVelocity: '+22.1%',
      logins: 35,
      propensity: '0.91',
    },
  ];

  return (
    <div id="screen-4-dashboards-root" className="space-y-6">
      {/* Export notification */}
      {exportNotice && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboards
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Live executive intelligence and predictive cohort analytics over the digital-twin mesh
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToCapabilities}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Capabilities</span>
            </button>

            {/* + New Dashboard Button (Triggers Config Screen 5 Builder) */}
            <button
              id="btn-new-dashboard"
              onClick={onNewDashboard}
              className="px-3.5 py-1.5 bg-[#1a237e] hover:bg-[#121858] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subheader Dashboard Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
        {/* Left: Dashboard Picker Dropdown */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a237e] shrink-0 shadow-2xs">
            <LayoutDashboard className="w-4.5 h-4.5" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-full">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                ACTIVE DASHBOARD:
              </span>
              <select
                id="select-active-dashboard"
                value={activeDashboard?.id || ''}
                onChange={(e) => onSelectDashboard(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 hover:border-[#1a237e] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 w-full sm:w-auto max-w-full sm:max-w-xs md:max-w-sm truncate cursor-pointer transition-colors shadow-2xs"
              >
                {dashboards.map((dash) => (
                  <option key={dash.id} value={dash.id}>
                    {dash.title} ({dash.widgets.length} widgets)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-md lg:max-w-xl">
              {activeDashboard?.description || 'Custom digital-twin dashboard'}
            </p>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pt-2 2xl:pt-0 border-t 2xl:border-t-0 border-slate-100">
          {/* View Mode Tabs: Live Dashboard vs Data Explorer */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#1a237e] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Widgets Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'explorer'
                  ? 'bg-white text-[#1a237e] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Cohort Data Table</span>
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center space-x-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Q3 2026 (Rolling)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Refresh Live Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1a237e]' : ''}`} />
          </button>

          {/* Edit in Builder Button */}
          {activeDashboard && (
            <button
              id="btn-edit-active-dashboard"
              onClick={() => onEditDashboard(activeDashboard)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a237e] border border-blue-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Edit headings, layout, and widgets in builder"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit in Builder</span>
            </button>
          )}

          {/* Delete Dashboard Button */}
          {activeDashboard && !activeDashboard.isDefault && onDeleteDashboard && (
            <button
              onClick={() => onDeleteDashboard(activeDashboard.id)}
              className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Delete Dashboard"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: Live Interactive Widgets Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 relative">
          {activeDashboard ? (
            <div>
              {/* Dashboard Meta Bar */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2 px-1 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">
                    {activeDashboard.widgets.length}{' '}
                    {activeDashboard.widgets.length === 1 ? 'Widget' : 'Widgets'} Active
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Live Kafka Stream Attached</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  {/* Navigator Toggle Button */}
                  {activeDashboard.widgets.length > 0 && (
                    <button
                      id="btn-screen4-toggle-navigator"
                      onClick={() => setShowMinimap(!showMinimap)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center space-x-1.5 cursor-pointer ${
                        showMinimap
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Toggle floating Dashboard Navigator mini-map"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Navigator</span>
                    </button>
                  )}

                  <span>Last synced: Just now</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      id="btn-screen4-export-json"
                      onClick={() => handleExport('json')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                      title="Download JSON configuration of this dashboard"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export JSON</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      Print/PDF
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => handleExport('csv')}
                      className="hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Cross-Filtering Notification & Reset Bar */}
              {activeCrossFilter && (
                <div className="mb-4 p-3 bg-gradient-to-r from-indigo-900 via-[#1a237e] to-blue-900 text-white rounded-xl shadow-md border border-indigo-400/40 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/40 flex items-center justify-center text-amber-300">
                      <Crosshair className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                          Active Cross-Filter Applied
                        </span>
                        <span className="text-[10px] bg-indigo-800/80 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700">
                          Source: {activeCrossFilter.sourceWidgetTitle}
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {activeCrossFilter.dimension}:{' '}
                          <span className="text-amber-300 underline font-black">{activeCrossFilter.value}</span>
                        </span>
                        {activeCrossFilter.countLabel && (
                          <span className="text-xs text-indigo-200">({activeCrossFilter.countLabel})</span>
                        )}
                        {activeCrossFilter.percentage !== undefined && (
                          <span className="text-xs text-emerald-300">({activeCrossFilter.percentage}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveCrossFilter(null)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg border border-white/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                      title="Reset cross-filter and show unfiltered metrics"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear Filter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Widgets Grid */}
              {activeDashboard.widgets.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                  <LayoutDashboard className="w-10 h-10 mx-auto text-slate-300" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No Widgets on this Dashboard</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      This dashboard currently has no widgets configured. Open the builder to add charts and KPIs.
                    </p>
                  </div>
                  <button
                    onClick={() => onEditDashboard(activeDashboard)}
                    className="px-4 py-2 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-bold rounded-lg shadow-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Widgets in Builder</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeDashboard.widgets.map((widget, idx) => (
                    <DashboardWidgetRenderer
                      key={widget.id}
                      widget={widget}
                      index={idx}
                      isEditing={false}
                      activeCrossFilter={activeCrossFilter}
                      onCrossFilterSelect={setActiveCrossFilter}
                      allWidgets={activeDashboard.widgets}
                      onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-sm text-slate-500">No dashboards available.</p>
              <button
                onClick={onNewDashboard}
                className="px-4 py-2 bg-[#1a237e] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Create New Dashboard
              </button>
            </div>
          )}

          {/* Floating Mini-map Navigator in View Screen */}
          {showMinimap && activeDashboard && activeDashboard.widgets.length > 0 && (
            <div className="fixed bottom-6 left-6 z-40 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-3 fade-in duration-200">
              <DashboardMinimap
                widgets={activeDashboard.widgets}
                activeWidgetId={selectedWidgetId}
                onSelectWidget={(id) => {
                  setSelectedWidgetId(id);
                  const el = document.getElementById(`widget-${id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                onClose={() => setShowMinimap(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Data Explorer Cohort Table (from original design in dasg2.png) */}
      {activeTab === 'explorer' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center space-x-4">
              <h2 className="text-sm font-bold text-slate-900">Data Explorer</h2>

              {/* Pivot / Table Pills */}
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('pivot')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'pivot'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pivot
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-[#1a237e] shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Table
                </button>
              </div>

              {/* Show Rows Dropdown */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <span>Show rows</span>
                <select
                  value={rowCount}
                  onChange={(e) => setRowCount(Number(e.target.value))}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-medium"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                COHORT STREAM
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Displaying 5 of {rowCount} cohort records for{' '}
                <code className="text-[#1a237e] font-bold">
                  WalletDBankingCustomer
                </code>
              </span>
              <button
                onClick={() => setPreviewLoaded(true)}
                className="text-xs text-[#1a237e] hover:underline font-medium"
              >
                Refresh Query
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider font-sans">
                    <th className="py-2.5 px-3">CUSTOMER ID</th>
                    <th className="py-2.5 px-3">TIER</th>
                    <th className="py-2.5 px-3">AVG BALANCE (90D)</th>
                    <th className="py-2.5 px-3">FICO SCORE</th>
                    <th className="py-2.5 px-3">SPEND VELOCITY</th>
                    <th className="py-2.5 px-3">APP LOGINS</th>
                    <th className="py-2.5 px-3">EXPANSION PROPENSITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sampleTableRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{row.id}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{row.tier}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{row.balanceAvg}</td>
                      <td className="py-2.5 px-3 text-slate-700">{row.fico}</td>
                      <td className="py-2.5 px-3 text-indigo-700 font-semibold">
                        {row.spendVelocity}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{row.logins}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.propensity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
