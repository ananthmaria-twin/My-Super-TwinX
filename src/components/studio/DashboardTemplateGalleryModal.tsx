import { useState } from 'react';
import {



  Check,




  LayoutDashboard,

  Plus,

  Search,

  Sparkles,
  X,

} from 'lucide-react';
import { DASHBOARD_TEMPLATES, type DashboardTemplate } from '../../services/dashboardStorageService';
import { WIDGET_PALETTE_ITEMS } from '../../data/dashboardMockData';

interface DashboardTemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: DashboardTemplate, action: 'new' | 'replace' | 'append') => void;
  onApplyTemplate?: (template: DashboardTemplate, action: 'new' | 'replace' | 'append') => void;
  currentDashboardTitle?: string;
}

export default function DashboardTemplateGalleryModal({
  isOpen,
  onClose,
  onSelectTemplate,
  onApplyTemplate,
  currentDashboardTitle,
}: DashboardTemplateGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(DASHBOARD_TEMPLATES[0].id);

  const handleApply = (template: DashboardTemplate, action: 'new' | 'replace' | 'append') => {
    if (onApplyTemplate) {
      onApplyTemplate(template, action);
    } else if (onSelectTemplate) {
      onSelectTemplate(template, action);
    }
    onClose();
  };

  if (!isOpen) return null;

  const categories = ['All', 'Operations', 'Finance', 'Simulation', 'Executive', 'Telemetry'];

  const filteredTemplates = DASHBOARD_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeTemplate =
    DASHBOARD_TEMPLATES.find((t) => t.id === activeTemplateId) || DASHBOARD_TEMPLATES[0];

  const getWidgetDetails = (type: string) => {
    return WIDGET_PALETTE_ITEMS.find((p) => p.type === type);
  };

  return (
    <div
      id="dashboard-template-gallery-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a237e] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Dashboard Template Gallery
                </h3>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  {DASHBOARD_TEMPLATES.length} Architecture Presets
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Select a curated digital-twin layout. You can apply it directly to your current canvas or create a brand-new dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1a237e] text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content Body (2 Columns) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Templates list (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
            {filteredTemplates.map((tpl) => {
              const isSelected = activeTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setActiveTemplateId(tpl.id)}
                  onDoubleClick={() => handleApply(tpl, 'replace')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-white border-[#1a237e] ring-2 ring-[#1a237e]/15 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      {tpl.widgetTypes.length} Widgets
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-400">{tpl.tag}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(tpl, 'replace');
                        }}
                        className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded border border-indigo-200 flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Immediately load this template on the builder canvas"
                      >
                        <Check className="w-3 h-3 text-indigo-600" />
                        <span>Use in Canvas</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Template Detail & Preview Panel (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-6 space-y-5 bg-white">
            {/* Active Template Banner with Quick Use Buttons */}
            <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {activeTemplate.category}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-600 font-mono">{activeTemplate.tag}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeTemplate.name}
                </h3>
              </div>

              {/* Instant Use Button */}
              <button
                type="button"
                onClick={() => handleApply(activeTemplate, 'replace')}
                className="px-4 py-2 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                title="Apply this template directly to the active canvas"
              >
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Use in Canvas Now</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeTemplate.description}
            </p>

            {/* Wireframe Schematic Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  Wireframe Schematic ({activeTemplate.widgetTypes.length} Widgets)
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  4-Column Responsive Grid
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>CANVAS TOPOLOGY</span>
                  <span className="text-emerald-400 font-bold">PRE-WIRED TELEMETRY MESH</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {activeTemplate.widgetTypes.map((type, idx) => {
                    const item = getWidgetDetails(type);
                    const span = item?.defaultGridColSpan || 2;
                    const colClass =
                      {
                        1: 'col-span-1',
                        2: 'col-span-2',
                        3: 'col-span-3',
                        4: 'col-span-4',
                      }[span] || 'col-span-2';

                    return (
                      <div
                        key={idx}
                        className={`${colClass} bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-slate-200 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono uppercase bg-indigo-950 text-indigo-300 px-1 py-0.2 rounded border border-indigo-800 font-bold">
                            {item?.tag || 'WIDGET'}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">{span}x Col</span>
                        </div>
                        <span className="text-[11px] font-bold text-white block truncate">
                          {item?.title || type}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono mt-1 block truncate">
                          {item?.defaultTwin || 'TwinX'} · Stream
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Included Components Detailed Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">
                Included Components ({activeTemplate.widgetTypes.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTemplate.widgetTypes.map((type, idx) => {
                  const item = getWidgetDetails(type);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start space-x-2"
                    >
                      <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {item?.title || type}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {item?.category || 'Analytics'} on {item?.defaultAttr || 'telemetry'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Target Canvas:{' '}
              <strong className="text-slate-900">
                {currentDashboardTitle || 'Active Builder Canvas'}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Option 1: Apply / Replace on Current Canvas */}
            <button
              type="button"
              id="btn-apply-template-canvas"
              onClick={() => handleApply(activeTemplate, 'replace')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              title="Replace current canvas with this template layout"
            >
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Use in Canvas</span>
            </button>

            {/* Option 2: Append Widgets to Current Canvas */}
            <button
              type="button"
              id="btn-append-template-canvas"
              onClick={() => handleApply(activeTemplate, 'append')}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95"
              title="Keep existing widgets and append this template's widgets to the canvas"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Append to Canvas</span>
            </button>

            {/* Option 3: Create as Brand-New Dashboard */}
            <button
              type="button"
              id="btn-create-new-dashboard-template"
              onClick={() => handleApply(activeTemplate, 'new')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              title="Create a new persistent dashboard document from this template"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-300" />
              <span>Create New Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
