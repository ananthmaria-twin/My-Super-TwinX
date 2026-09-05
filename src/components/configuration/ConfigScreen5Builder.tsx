import React, { useState, useEffect } from 'react';
import {


  ArrowLeft,
  BarChart2,

  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,


  Compass,
  Copy,
  Crosshair,

  Download,
  Eye,

  FolderKanban,
  Gauge,
  GripVertical,
  Layers,
  LayoutDashboard,



  Move,
  Plus,

  Save,
  Search,
  Settings,
  Sliders,
  Sparkles,
  Trash2,

  Upload,
  X,
  Zap,
} from 'lucide-react';
import { type UseCaseItem, type DashboardDefinition, type DashboardWidget, type WidgetPaletteType, type CrossFilterState } from '../../types';
import { WIDGET_PALETTE_ITEMS, type PaletteItemDefinition } from '../../data/dashboardMockData';
import DashboardWidgetRenderer from './DashboardWidgetRenderer';
import DashboardMinimap from './DashboardMinimap';
import DashboardTemplateGalleryModal from '../studio/DashboardTemplateGalleryModal';
import { dashboardStorageService, type DashboardTemplate } from '../../services/dashboardStorageService';
import { alertService } from '../../services/alertService';

interface ConfigScreen5BuilderProps {
  selectedUseCase: UseCaseItem;
  existingDashboard?: DashboardDefinition | null;
  onClose: () => void; // Navigates back to Dashboards screen
  onSaveDashboard: (savedDashboard: DashboardDefinition, navigateToView?: boolean) => void;
}

export default function ConfigScreen5Builder({
  selectedUseCase,
  existingDashboard,
  onClose,
  onSaveDashboard,
}: ConfigScreen5BuilderProps) {
  // Persistent Dashboards Management state
  const [allDashboards, setAllDashboards] = useState<DashboardDefinition[]>(() => {
    const list = dashboardStorageService.getDashboards();
    if (existingDashboard && !list.some((d) => d.id === existingDashboard.id)) {
      return [existingDashboard, ...list];
    }
    return list;
  });
  const [activeDashboardId, setActiveDashboardId] = useState<string>(
    existingDashboard?.id || allDashboards[0]?.id || 'dash-custom-01'
  );
  const [isManageDashboardsOpen, setIsManageDashboardsOpen] = useState<boolean>(false);

  // Dashboard metadata state
  const [dashboardTitle, setDashboardTitle] = useState<string>(
    existingDashboard?.title || `Dashboard — ${selectedUseCase.title}`
  );
  const [dashboardDesc, setDashboardDesc] = useState<string>(
    existingDashboard?.description ||
      `Digital-twin driven analytics and prioritization dashboard for ${selectedUseCase.title}.`
  );
  const [showInMenu, setShowInMenu] = useState<boolean>(
    existingDashboard?.showInMenu !== undefined ? existingDashboard.showInMenu : true
  );

  // Cross-filtering active state across all widgets
  const [activeCrossFilter, setActiveCrossFilter] = useState<CrossFilterState | null>(null);

  // Mini-map / Navigator floating overlay state
  const [showMinimap, setShowMinimap] = useState<boolean>(false);

  // Dashboard Template Gallery Modal state
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState<boolean>(false);

  // Mode: edit mode vs live preview mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Builder panel tabs: 'widgets' | 'inspector' | 'presets'
  const [builderTab, setBuilderTab] = useState<'widgets' | 'inspector' | 'presets'>('widgets');
  const [isBuilderCollapsed, setIsBuilderCollapsed] = useState<boolean>(false);

  // Floating movable position for Builder Studio (never shrinks the canvas)
  const [studioPosition, setStudioPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingStudio, setIsDraggingStudio] = useState<boolean>(false);
  const dragStartRef = React.useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Initialize position on right edge of screen
  useEffect(() => {
    if (studioPosition === null && typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 460);
      const defaultY = 135;
      setStudioPosition({ x: defaultX, y: defaultY });
    }
  }, [studioPosition]);

  // Window drag handler for Floating Builder Studio
  useEffect(() => {
    if (!isDraggingStudio) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const panelWidth = 430;
      const maxX = Math.max(10, window.innerWidth - panelWidth - 10);
      const maxY = Math.max(60, window.innerHeight - 100);

      const nextX = Math.max(10, Math.min(maxX, dragStartRef.current.startX + deltaX));
      const nextY = Math.max(60, Math.min(maxY, dragStartRef.current.startY + deltaY));

      setStudioPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDraggingStudio(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStudio]);

  const handleStudioDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a, textarea')) {
      return;
    }
    const currentX =
      studioPosition?.x ?? Math.max(20, typeof window !== 'undefined' ? window.innerWidth - 460 : 800);
    const currentY = studioPosition?.y ?? 135;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentX,
      startY: currentY,
    };
    setIsDraggingStudio(true);
  };

  // Widget palette filter & category
  const [paletteCategory, setPaletteCategory] = useState<'All' | 'KPIs' | 'Charts' | 'Advanced Analytics'>('All');
  const [paletteSearch, setPaletteSearch] = useState<string>('');

  // Active widgets on the canvas
  const [widgets, setWidgets] = useState<DashboardWidget[]>(
    existingDashboard?.widgets && existingDashboard.widgets.length > 0
      ? existingDashboard.widgets
      : []
  );

  // Drag and drop reordering state
  const [draggedWidgetIndex, setDraggedWidgetIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Selected widget for Property Inspector
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(
    existingDashboard?.widgets && existingDashboard.widgets.length > 0
      ? existingDashboard.widgets[0].id
      : null
  );

  // Toast feedback
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Find currently selected widget object
  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId) || null;

  // Listen to storage changes
  useEffect(() => {
    const unsubscribe = dashboardStorageService.subscribe((dashboards) => {
      setAllDashboards(dashboards);
    });
    return unsubscribe;
  }, []);

  // Helper to instantiate new widget from palette definition
  const createWidgetFromPalette = (item: PaletteItemDefinition): DashboardWidget => {
    const newWidgetId = `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    return {
      id: newWidgetId,
      type: item.type,
      title: item.title,
      subtitle: item.description,
      tag: item.tag,
      sourceTwin: item.defaultTwin,
      attribute: item.defaultAttr,
      aggregation: 'SUM',
      refreshRate: 'Real-time (Kafka)',
      value: item.defaultValue,
      secondaryValue: item.defaultSecondary,
      change: item.defaultChange,
      changeType: item.defaultChangeType,
      colorTheme: item.defaultColorTheme,
      width: item.defaultWidth,
      gridColSpan: item.defaultGridColSpan || (item.defaultWidth === 'full' ? 4 : 2),
      visualMode: 'detailed',
      thresholdWarning: item.thresholdWarning,
      thresholdCritical: item.thresholdCritical,
      thresholdTarget: item.thresholdTarget,
      thresholdUnit: item.thresholdUnit,
      dataPoints: item.defaultPoints ? [...item.defaultPoints] : undefined,
      funnelStages: item.defaultStages ? [...item.defaultStages] : undefined,
      donutSegments: item.defaultDonut ? [...item.defaultDonut] : undefined,
      gaugeScore: item.defaultGaugeScore,
      gaugeTarget: item.defaultGaugeScore ? 80 : undefined,
      tableHeaders:
        item.type === 'table'
          ? ['CUSTOMER ID', 'TIER', 'BALANCE', 'FICO', 'PROPENSITY']
          : undefined,
      tableRows:
        item.type === 'table'
          ? [
              { id: 'CUST-89101', tier: 'Commercial Plat', balance: '$842,500', fico: 785, score: '0.94' },
              { id: 'CUST-89102', tier: 'Commercial Gold', balance: '$312,000', fico: 742, score: '0.88' },
              { id: 'CUST-89103', tier: 'Commercial Plat', balance: '$1,290,000', fico: 810, score: '0.97' },
              { id: 'CUST-89104', tier: 'Commercial Silver', balance: '$145,200', fico: 715, score: '0.73' },
              { id: 'CUST-89105', tier: 'Commercial Gold', balance: '$498,300', fico: 760, score: '0.91' },
            ]
          : undefined,
    };
  };

  // Switch between saved dashboards
  const handleSwitchDashboard = (targetId: string) => {
    const target = allDashboards.find((d) => d.id === targetId);
    if (!target) return;
    setActiveDashboardId(target.id);
    setDashboardTitle(target.title);
    setDashboardDesc(target.description);
    setShowInMenu(target.showInMenu !== undefined ? target.showInMenu : true);
    setWidgets(target.widgets || []);
    if (target.widgets && target.widgets.length > 0) {
      setSelectedWidgetId(target.widgets[0].id);
    } else {
      setSelectedWidgetId(null);
    }
    setActiveCrossFilter(null);
    setIsManageDashboardsOpen(false);
    dashboardStorageService.setActiveDashboardId(target.id);
    setToastMessage(`Switched to "${target.title}"`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Create new blank or seeded dashboard
  const handleCreateNewDashboard = () => {
    const newDash = dashboardStorageService.createDashboardFromTemplate(
      `New Dashboard — ${selectedUseCase.title} ${allDashboards.length + 1}`,
      'tpl-operational-health',
      selectedUseCase.id
    );
    setAllDashboards(dashboardStorageService.getDashboards());
    handleSwitchDashboard(newDash.id);
    setToastMessage('Created and switched to new dashboard!');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Duplicate current dashboard
  const handleDuplicateCurrentDashboard = () => {
    const current = getCurrentDashboardDefinition();
    const dup = dashboardStorageService.duplicateDashboard(current.id);
    if (dup) {
      setAllDashboards(dashboardStorageService.getDashboards());
      handleSwitchDashboard(dup.id);
      setToastMessage(`Duplicated as "${dup.title}"`);
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 2500);
    }
  };

  // Delete current dashboard
  const handleDeleteCurrentDashboard = (idToDelete: string) => {
    if (allDashboards.length <= 1) {
      setToastMessage('Cannot delete the only dashboard view');
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 2000);
      return;
    }
    dashboardStorageService.deleteDashboard(idToDelete);
    const remaining = dashboardStorageService.getDashboards();
    setAllDashboards(remaining);
    if (remaining.length > 0) {
      handleSwitchDashboard(remaining[0].id);
    }
    setToastMessage('Dashboard deleted');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  // Apply template from modal
  const handleApplyTemplate = (template: DashboardTemplate, action: 'new' | 'replace' | 'append') => {
    if (action === 'new') {
      const newDash = dashboardStorageService.createDashboardFromTemplate(
        template.name,
        template.id,
        selectedUseCase.id
      );
      setAllDashboards(dashboardStorageService.getDashboards());
      handleSwitchDashboard(newDash.id);
      setIsTemplateGalleryOpen(false);
      setToastMessage(`Created new dashboard from "${template.name}"`);
    } else if (action === 'append') {
      const matchedDefs = template.widgetTypes
        .map((t) => WIDGET_PALETTE_ITEMS.find((p) => p.type === t))
        .filter(Boolean) as PaletteItemDefinition[];
      const appendedWidgets = matchedDefs.map(createWidgetFromPalette);
      setWidgets((prev) => [...prev, ...appendedWidgets]);
      if (appendedWidgets.length > 0) {
        setSelectedWidgetId(appendedWidgets[0].id);
      }
      setIsTemplateGalleryOpen(false);
      setToastMessage(`Appended ${appendedWidgets.length} widgets from "${template.name}" to canvas`);
    } else {
      // replace
      const matchedDefs = template.widgetTypes
        .map((t) => WIDGET_PALETTE_ITEMS.find((p) => p.type === t))
        .filter(Boolean) as PaletteItemDefinition[];
      const newWidgets = matchedDefs.map(createWidgetFromPalette);
      setDashboardTitle(template.name);
      setDashboardDesc(template.description);
      setWidgets(newWidgets);
      if (newWidgets.length > 0) {
        setSelectedWidgetId(newWidgets[0].id);
      }
      setIsTemplateGalleryOpen(false);
      setToastMessage(`Applied "${template.name}" template layout to canvas (${newWidgets.length} widgets)`);
    }
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  // Add widget from palette to canvas (keeps user in palette so they can add multiple widgets effortlessly)
  const handleAddWidget = (item: PaletteItemDefinition) => {
    const newWidget = createWidgetFromPalette(item);
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
    setToastMessage(`Added "${item.title}" to canvas`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  // 1-Click Dashboard Preset Architectures
  const applyPresetLayout = (presetKey: 'executive' | 'telemetry' | 'financial') => {
    let chosenTypes: WidgetPaletteType[] = [];
    if (presetKey === 'executive') {
      chosenTypes = [
        'kpi-twin-health',
        'kpi-active-simulations',
        'telemetry-stream',
        'sla-compliance',
        'kpi-trend',
        'anomaly-radar',
      ];
      setToastMessage('Applied "Executive Operations & Sentinel" preset');
    } else if (presetKey === 'telemetry') {
      chosenTypes = [
        'telemetry-stream',
        'pipeline-throughput',
        'anomaly-radar',
        'twin-feature-vector',
        'table',
      ];
      setToastMessage('Applied "Streaming Ingress & Telemetry" preset');
    } else {
      chosenTypes = [
        'kpi-card',
        'scenario-sensitivity',
        'funnel',
        'bar',
        'table',
      ];
      setToastMessage('Applied "Portfolio & Scenario Sensitivity" preset');
    }

    const matchedDefs = chosenTypes
      .map((t) => WIDGET_PALETTE_ITEMS.find((p) => p.type === t))
      .filter(Boolean) as PaletteItemDefinition[];
    const newWidgets = matchedDefs.map(createWidgetFromPalette);
    setWidgets(newWidgets);
    if (newWidgets.length > 0) {
      setSelectedWidgetId(newWidgets[0].id);
    }
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Drag and Drop Grid Handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedWidgetIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (dropIndex: number, e: React.DragEvent) => {
    e.preventDefault();

    // Check if dropping a palette item dragged from sidebar
    const paletteData = e.dataTransfer.getData('application/json');
    if (paletteData) {
      try {
        const item: PaletteItemDefinition = JSON.parse(paletteData);
        const newWidget = createWidgetFromPalette(item);
        const updated = [...widgets];
        updated.splice(dropIndex, 0, newWidget);
        setWidgets(updated);
        setSelectedWidgetId(newWidget.id);
        setDraggedWidgetIndex(null);
        setDragOverIndex(null);
        return;
      } catch (err) {
        // Fall through to reorder logic
      }
    }

    // Reordering existing widget
    if (draggedWidgetIndex !== null && draggedWidgetIndex !== dropIndex) {
      const updated = [...widgets];
      const [moved] = updated.splice(draggedWidgetIndex, 1);
      // Adjust index if moving down
      const targetIdx = dropIndex > draggedWidgetIndex ? dropIndex - 1 : dropIndex;
      updated.splice(targetIdx, 0, moved);
      setWidgets(updated);
    }
    setDraggedWidgetIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveWidget = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= widgets.length) return;
    const updated = [...widgets];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setWidgets(updated);
  };

  // Update specific properties of a widget (used by both inline canvas edits and Property Inspector)
  const handleUpdateWidget = (id: string, updatedProps: Partial<DashboardWidget>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedProps } : w))
    );
  };

  // Remove widget from canvas
  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    if (selectedWidgetId === id) {
      const remaining = widgets.filter((w) => w.id !== id);
      setSelectedWidgetId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Duplicate widget
  const handleDuplicateWidget = (id: string) => {
    const target = widgets.find((w) => w.id === id);
    if (!target) return;
    const duplicated: DashboardWidget = {
      ...target,
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${target.title} (Copy)`,
    };
    setWidgets((prev) => [...prev, duplicated]);
    setSelectedWidgetId(duplicated.id);
  };

  // Toggle widget width (half vs full)
  const handleToggleWidth = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, width: w.width === 'full' ? 'half' : 'full' } : w
      )
    );
  };

  // Construct current dashboard definition
  const getCurrentDashboardDefinition = (): DashboardDefinition => {
    return {
      id: activeDashboardId || existingDashboard?.id || `dash-${Date.now()}`,
      title: dashboardTitle.trim() || `Dashboard — ${selectedUseCase.title}`,
      description: dashboardDesc.trim() || 'Digital-twin analytics dashboard',
      useCaseId: selectedUseCase.id,
      showInMenu,
      createdAt: existingDashboard?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: existingDashboard?.tags || [selectedUseCase.domainBadge, 'Analytics', 'TwinX'],
      widgets,
    };
  };

  // Auto-sync persistent state to localStorage so refreshes never lose work
  useEffect(() => {
    const def = getCurrentDashboardDefinition();
    dashboardStorageService.updateDashboard(def);
  }, [widgets, dashboardTitle, dashboardDesc, showInMenu]);

  // Export Dashboard & Widgets to JSON configuration file
  const handleExportJSON = () => {
    const def = getCurrentDashboardDefinition();
    const jsonStr = JSON.stringify(def, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = def.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const fileName = `${sanitizedTitle || 'dashboard'}-config.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMessage(`Exported dashboard configuration as ${fileName}`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  // Import Dashboard JSON configuration
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.widgets && Array.isArray(parsed.widgets)) {
          if (parsed.title) setDashboardTitle(parsed.title);
          if (parsed.description) setDashboardDesc(parsed.description);
          if (parsed.showInMenu !== undefined) setShowInMenu(parsed.showInMenu);
          setWidgets(parsed.widgets);
          if (parsed.widgets.length > 0) {
            setSelectedWidgetId(parsed.widgets[0].id);
          }
          setToastMessage(`Successfully imported ${parsed.widgets.length} configured widgets!`);
          setSaveSuccessToast(true);
          setTimeout(() => setSaveSuccessToast(false), 3500);
        } else {
          setToastMessage('Invalid configuration file: missing widgets list.');
          setSaveSuccessToast(true);
          setTimeout(() => setSaveSuccessToast(false), 3500);
        }
      } catch (err) {
        setToastMessage('Could not parse JSON file.');
        setSaveSuccessToast(true);
        setTimeout(() => setSaveSuccessToast(false), 3500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Save Dashboard
  const handleSave = (navigateToView: boolean = false) => {
    const def = getCurrentDashboardDefinition();
    dashboardStorageService.updateDashboard(def);
    setAllDashboards(dashboardStorageService.getDashboards());
    onSaveDashboard(def, navigateToView);
    setToastMessage(`Dashboard "${def.title}" saved successfully!`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  // Filter palette items
  const filteredPalette = WIDGET_PALETTE_ITEMS.filter((item) => {
    const matchesCategory = paletteCategory === 'All' || item.category === paletteCategory;
    const matchesSearch =
      paletteSearch === '' ||
      item.title.toLowerCase().includes(paletteSearch.toLowerCase()) ||
      item.tag.toLowerCase().includes(paletteSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(paletteSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="dashboard-builder-root" className="space-y-6">
      {/* Toast alert */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#1a237e] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 border border-blue-300/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => handleSave(true)}
            className="ml-2 bg-white text-[#1a237e] px-2.5 py-1 rounded font-bold hover:bg-blue-50 transition-colors"
          >
            View Live Now
          </button>
        </div>
      )}

      {/* Breadcrumb Context Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Return to Dashboards"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <LayoutDashboard className="w-4 h-4 text-[#1a237e]" />
            <button onClick={onClose} className="hover:underline hover:text-slate-800 font-medium cursor-pointer">
              Dashboards
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 truncate max-w-sm">
              {dashboardTitle || (existingDashboard ? 'Editing Dashboard' : 'New Dashboard Builder')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Manage Dashboards Dropdown Menu */}
          <div className="relative">
            <button
              id="btn-manage-dashboards-menu"
              onClick={() => setIsManageDashboardsOpen(!isManageDashboardsOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              title="Manage, switch, or create named dashboard views"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#1a237e]" />
              <span>Switch Dashboard</span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {allDashboards.length}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isManageDashboardsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                      Manage Dashboards
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Persistent views for {selectedUseCase.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsManageDashboardsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                  {allDashboards.map((dash) => {
                    const isCurrent = dash.id === activeDashboardId;
                    return (
                      <div
                        key={dash.id}
                        className={`group flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                          isCurrent
                            ? 'bg-indigo-50 border border-indigo-200 font-bold text-indigo-900'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <button
                          onClick={() => handleSwitchDashboard(dash.id)}
                          className="flex-1 text-left flex items-center space-x-2 truncate cursor-pointer"
                        >
                          <LayoutDashboard
                            className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}
                          />
                          <div className="truncate">
                            <span className="block truncate">{dash.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal block">
                              {dash.widgets?.length || 0} widgets · {dash.tags?.[0] || 'Custom'}
                            </span>
                          </div>
                        </button>
                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          {isCurrent && <Check className="w-4 h-4 text-indigo-600 mr-1" />}
                          {allDashboards.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCurrentDashboard(dash.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity cursor-pointer"
                              title="Delete this dashboard"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleCreateNewDashboard}
                    className="w-full py-1.5 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ New View</span>
                  </button>
                  <button
                    onClick={handleDuplicateCurrentDashboard}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">
            Use Case: {selectedUseCase.title}
          </span>
        </div>
      </div>

      {/* Top Action Bar matching TwinX design */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description Inputs */}
        <div className="space-y-1 flex-1 max-w-xl">
          <input
            type="text"
            value={dashboardTitle}
            onChange={(e) => setDashboardTitle(e.target.value)}
            className="w-full text-base font-bold text-slate-900 border border-transparent hover:border-slate-300 focus:border-[#1a237e] rounded px-2 py-1 focus:outline-none transition-colors"
            placeholder="Dashboard Title"
          />
          <input
            type="text"
            value={dashboardDesc}
            onChange={(e) => setDashboardDesc(e.target.value)}
            className="w-full text-xs text-slate-500 border border-transparent hover:border-slate-300 focus:border-[#1a237e] rounded px-2 py-0.5 focus:outline-none placeholder:text-slate-400"
            placeholder="Description for executive stakeholders..."
          />
        </div>

        {/* Right Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Template Gallery Button */}
          <button
            id="btn-open-template-gallery"
            onClick={() => setIsTemplateGalleryOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 hover:border-indigo-300 text-indigo-900 text-xs font-bold rounded-lg transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer active:scale-95"
            title="Browse pre-configured dashboard layout templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Templates</span>
          </button>

          {/* Show in menu checkbox */}
          <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer select-none mr-1">
            <input
              type="checkbox"
              checked={showInMenu}
              onChange={(e) => setShowInMenu(e.target.checked)}
              className="rounded border-slate-300 text-[#1a237e] focus:ring-[#1a237e] w-4 h-4"
            />
            <span>Show in menu</span>
          </label>

          {/* Export JSON configuration */}
          <button
            id="btn-export-dashboard-json"
            onClick={handleExportJSON}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            title="Download complete dashboard and widget settings as JSON configuration"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export JSON</span>
          </button>

          {/* Import JSON configuration */}
          <label
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            title="Upload previously exported JSON dashboard configuration"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          {/* Toggle Live Preview Mode */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border cursor-pointer ${
              isPreviewMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle between canvas editor and clean presentation view"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          {/* Close Button */}
          <button
            id="btn-close-builder"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>

          {/* Save Dashboard Button */}
          <button
            id="btn-save-dashboard"
            onClick={() => handleSave(false)}
            className="px-4 py-1.5 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Dashboard</span>
          </button>

          {/* View Dashboard Button (Saves and navigates to Screen 4) */}
          <button
            id="btn-view-dashboard"
            onClick={() => handleSave(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95"
            title="Save and immediately view the full dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Builder Canvas Area (Always 100% full-width: canvas size is never reduced) */}
      <div className="w-full">
        {/* Full-width Canvas Area */}
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col min-h-[640px] overflow-hidden transition-all">
          {/* Canvas Header */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                LAYOUT · {widgets.length} {widgets.length === 1 ? 'WIDGET' : 'WIDGETS'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                {isPreviewMode ? (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Simulation Presentation Mode</span>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Click heading or values on any widget to edit inline
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Mini-map / Navigator Toggle Button */}
              {widgets.length > 0 && (
                <button
                  id="btn-toggle-navigator"
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
                  <span
                    className={`text-[10px] px-1 rounded font-mono ${
                      showMinimap ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {widgets.length}
                  </span>
                </button>
              )}

              {/* All Compact / All Detailed bulk switcher */}
              {widgets.length > 0 && !isPreviewMode && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => {
                      setWidgets((prev) => prev.map((w) => ({ ...w, visualMode: 'compact' })));
                      setToastMessage('Switched all widgets to Compact Mode');
                      setSaveSuccessToast(true);
                      setTimeout(() => setSaveSuccessToast(false), 2000);
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:text-slate-900 rounded cursor-pointer transition-colors"
                    title="Set all dashboard widgets to Compact view"
                  >
                    All Compact
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => {
                      setWidgets((prev) => prev.map((w) => ({ ...w, visualMode: 'detailed' })));
                      setToastMessage('Switched all widgets to Detailed Mode');
                      setSaveSuccessToast(true);
                      setTimeout(() => setSaveSuccessToast(false), 2000);
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:text-slate-900 rounded cursor-pointer transition-colors"
                    title="Set all dashboard widgets to Detailed view"
                  >
                    All Detailed
                  </button>
                </div>
              )}

              {/* Mode indicator when in Preview Mode */}
              {isPreviewMode && (
                <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Interactive Preview Active</span>
                </div>
              )}

              {/* Status indicator when floating builder studio is active */}
              {!isBuilderCollapsed && !isPreviewMode && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setStudioPosition({
                        x: Math.max(20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 460),
                        y: 135,
                      });
                    }}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-[#1a237e] border border-indigo-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                    title="Floating studio is active. Click to snap to top-right"
                  >
                    <Move className="w-3 h-3 text-indigo-600 animate-pulse" />
                    <span>Movable Studio (Open)</span>
                  </button>
                  <button
                    onClick={() => setIsBuilderCollapsed(true)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    title="Minimize studio to right dock"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {widgets.length > 0 && !isPreviewMode && (
                <button
                  onClick={() => setWidgets([])}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-1.5 py-1"
                >
                  Clear canvas
                </button>
              )}
            </div>
          </div>

          {/* Canvas Body */}
          <div className="flex-1 p-6 bg-slate-50/30">
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
                  <span className="text-xs text-indigo-200 hidden sm:inline">
                    Cross-filtering charts & ledger data
                  </span>
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

            {widgets.length === 0 ? (
              /* Empty state matching user mockup */
              <div className="h-full min-h-[460px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-white space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a237e]">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Your canvas is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Add widgets from the palette to begin building your custom digital-twin analytics dashboard.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <button
                    onClick={() => handleAddWidget(WIDGET_PALETTE_ITEMS[0])}
                    className="px-3.5 py-2 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add KPI Summary</span>
                  </button>
                  <button
                    onClick={() => handleAddWidget(WIDGET_PALETTE_ITEMS[2])}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs transition-all flex items-center space-x-1.5"
                  >
                    <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Add Radial Gauge</span>
                  </button>
                  <button
                    onClick={() => handleAddWidget(WIDGET_PALETTE_ITEMS[8])}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs transition-all flex items-center space-x-1.5"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Bar Chart</span>
                  </button>
                  <button
                    onClick={() => handleAddWidget(WIDGET_PALETTE_ITEMS[11])}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs transition-all flex items-center space-x-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Add Funnel</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Placed Widgets Grid with Drag & Drop System */
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  if (draggedWidgetIndex !== null) {
                    handleDrop(widgets.length - 1, e);
                  }
                }}
              >
                {widgets.map((widget, idx) => {
                  const isSelected = widget.id === selectedWidgetId;
                  return (
                    <DashboardWidgetRenderer
                      key={widget.id}
                      widget={widget}
                      index={idx}
                      isEditing={!isPreviewMode}
                      isSelected={isSelected && !isPreviewMode}
                      isDragging={draggedWidgetIndex === idx}
                      isDragOver={dragOverIndex === idx}
                      activeCrossFilter={activeCrossFilter}
                      onCrossFilterSelect={setActiveCrossFilter}
                      allWidgets={widgets}
                      onSelect={() => {
                        setSelectedWidgetId(widget.id);
                      }}
                      onUpdate={(updated) => handleUpdateWidget(widget.id, updated)}
                      onRemove={() => handleRemoveWidget(widget.id)}
                      onDuplicate={() => handleDuplicateWidget(widget.id)}
                      onToggleWidth={() => handleToggleWidth(widget.id)}
                      onSetColSpan={(newSpan) => {
                        handleUpdateWidget(widget.id, {
                          gridColSpan: newSpan,
                          width: newSpan >= 3 ? 'full' : 'half',
                        });
                      }}
                      onDragStart={(e) => handleDragStart(idx, e)}
                      onDragOver={(e) => handleDragOver(idx, e)}
                      onDragLeave={() => handleDragLeave(idx)}
                      onDrop={(e) => handleDrop(idx, e)}
                      onDragEnd={() => {
                        setDraggedWidgetIndex(null);
                        setDragOverIndex(null);
                      }}
                      onMoveUp={idx > 0 ? () => handleMoveWidget(idx, idx - 1) : undefined}
                      onMoveDown={idx < widgets.length - 1 ? () => handleMoveWidget(idx, idx + 1) : undefined}
                    />
                  );
                })}

                {/* Drop target at end of canvas when dragging */}
                {!isPreviewMode && draggedWidgetIndex !== null && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => handleDrop(widgets.length, e)}
                    className="col-span-full border-2 border-dashed border-indigo-300 rounded-xl p-4 text-center text-xs font-semibold text-indigo-600 bg-indigo-50/50 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Move className="w-4 h-4" />
                    <span>Drop here to move widget to end of dashboard</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Movable BUILDER STUDIO Window (Free-floating above full-width canvas) */}
      {!isPreviewMode && !isBuilderCollapsed && (
        <div
          id="floating-builder-studio"
          style={{
            left: `${studioPosition?.x ?? (typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 460) : 800)}px`,
            top: `${studioPosition?.y ?? 135}px`,
          }}
          className={`fixed z-40 w-[430px] max-w-[calc(100vw-32px)] bg-white/98 backdrop-blur-md rounded-2xl border border-slate-300 shadow-[0_22px_60px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/10 flex flex-col transition-[box-shadow,opacity] ${
            isDraggingStudio ? 'opacity-90 shadow-2xl cursor-grabbing' : 'shadow-xl'
          }`}
        >
          {/* BUILDER Header with Drag Handle & Window Controls */}
          <div
            onMouseDown={handleStudioDragStart}
            className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-t-2xl flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
            title="Click and drag to move Builder Studio anywhere on screen"
          >
            <div className="flex items-center space-x-2.5 pointer-events-none">
              <div className="w-7 h-7 rounded-lg bg-[#1a237e] text-white flex items-center justify-center shadow-xs">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    BUILDER STUDIO
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                    Floating
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
                  <Move className="w-2.5 h-2.5 text-indigo-600" />
                  <span>Drag header to reposition</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setStudioPosition({ x: 24, y: 135 })}
                className="px-1.5 py-1 text-[10px] font-mono font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                title="Snap studio to left side"
              >
                ◀ Left
              </button>
              <button
                type="button"
                onClick={() =>
                  setStudioPosition({
                    x: Math.max(20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 460),
                    y: 135,
                  })
                }
                className="px-1.5 py-1 text-[10px] font-mono font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                title="Snap studio to right side"
              >
                Right ▶
              </button>
              <button
                id="btn-minimize-builder"
                type="button"
                onClick={() => setIsBuilderCollapsed(true)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer ml-1"
                title="Minimize builder to right dock"
              >
                <span>Minimize</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Builder Tabs: Widgets | Inspector | Presets */}
          <div className="flex border-b border-slate-200 bg-white">
            <button
              id="tab-builder-widgets"
              type="button"
              onClick={() => setBuilderTab('widgets')}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                builderTab === 'widgets'
                  ? 'border-[#1a237e] text-[#1a237e] bg-indigo-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Widgets ({WIDGET_PALETTE_ITEMS.length})</span>
            </button>
            <button
              id="tab-builder-inspector"
              type="button"
              onClick={() => setBuilderTab('inspector')}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                builderTab === 'inspector'
                  ? 'border-[#1a237e] text-[#1a237e] bg-indigo-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Inspector</span>
              {selectedWidget && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
            <button
              id="tab-builder-presets"
              type="button"
              onClick={() => setBuilderTab('presets')}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                builderTab === 'presets'
                  ? 'border-[#1a237e] text-[#1a237e] bg-indigo-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>

          {/* Scrollable Tab Body */}
          <div className="max-h-[calc(82vh-110px)] overflow-y-auto">
            {/* TAB 1: Widgets Palette */}
            {builderTab === 'widgets' && (
                  <div className="p-4 space-y-4 max-h-[640px] overflow-y-auto">
                    {/* Search & Category Filter */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={paletteSearch}
                          onChange={(e) => setPaletteSearch(e.target.value)}
                          placeholder="Search widgets & charts..."
                          className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                        />
                      </div>

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-1">
                        {(['All', 'KPIs', 'Charts', 'Advanced Analytics'] as const).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setPaletteCategory(cat)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                              paletteCategory === cat
                                ? 'bg-[#1a237e] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Palette Item List */}
                    <div className="space-y-2 pt-1">
                      {filteredPalette.map((item, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify(item));
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => handleAddWidget(item)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group shadow-2xs flex flex-col space-y-1 cursor-grab active:cursor-grabbing"
                          title="Click to add or drag onto dashboard canvas"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                              <span className="text-[#1a237e] text-xs">◈</span>
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#1a237e]">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800 px-1.5 py-0.5 rounded font-bold">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight pl-5">
                            {item.description}
                          </p>
                        </div>
                      ))}

                      {filteredPalette.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No matching widgets found.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Property Inspector */}
                {builderTab === 'inspector' && (
                  <div className="p-4 space-y-4 max-h-[640px] overflow-y-auto">
                    {selectedWidget ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Configure Widget
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Changes sync real-time to chart canvas
                            </span>
                          </div>
                          <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                            {selectedWidget.tag}
                          </span>
                        </div>

                        {/* Visual Display Mode: Compact vs Detailed */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Widget Visual Mode
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateWidget(selectedWidget.id, { visualMode: 'compact' })
                              }
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                                (selectedWidget.visualMode || 'detailed') === 'compact'
                                  ? 'bg-indigo-50 border-indigo-600 text-[#1a237e] font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span>Compact Mode</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateWidget(selectedWidget.id, { visualMode: 'detailed' })
                              }
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                                (selectedWidget.visualMode || 'detailed') === 'detailed'
                                  ? 'bg-indigo-50 border-indigo-600 text-[#1a237e] font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span>Detailed Mode</span>
                            </button>
                          </div>
                        </div>

                        {/* Widget Title Field */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Widget Title
                          </label>
                          <input
                            type="text"
                            value={selectedWidget.title}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { title: e.target.value })
                            }
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-semibold text-slate-800"
                          />
                        </div>

                        {/* Subtitle Field */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Subtitle / Description
                          </label>
                          <input
                            type="text"
                            value={selectedWidget.subtitle || ''}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { subtitle: e.target.value })
                            }
                            placeholder="Optional descriptive subtext"
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          />
                        </div>

                        {/* Primary Value Field (Two-way sync with chart value!) */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Primary Metric Value (Direct Sync)
                          </label>
                          <input
                            type="text"
                            value={selectedWidget.value}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { value: e.target.value })
                            }
                            placeholder="e.g. $1,245,000"
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-mono font-bold"
                          />
                        </div>

                        {/* Trend / Change Field */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Delta Trend Badge
                          </label>
                          <input
                            type="text"
                            value={selectedWidget.change}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { change: e.target.value })
                            }
                            placeholder="e.g. +14.2% MoM"
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          />
                        </div>

                        {/* Gauge Score if gauge */}
                        {selectedWidget.type === 'kpi-gauge' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Gauge Score (0 - 100)</span>
                              <span className="font-mono font-bold">{selectedWidget.gaugeScore || 85}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={selectedWidget.gaugeScore || 85}
                              onChange={(e) =>
                                handleUpdateWidget(selectedWidget.id, {
                                  gaugeScore: Number(e.target.value),
                                  value: `${e.target.value} / 100`,
                                })
                              }
                              className="w-full accent-[#1a237e]"
                            />
                          </div>
                        )}

                        {/* Donut Chart Segments Editor */}
                        {selectedWidget.donutSegments && (
                          <div className="space-y-1.5 pt-1 border-t border-slate-200">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Donut Chart Segments (Live Data)
                            </label>
                            <div className="space-y-1.5">
                              {selectedWidget.donutSegments.map((seg, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={seg.name}
                                    onChange={(e) => {
                                      const updated = [...(selectedWidget.donutSegments || [])];
                                      updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                                      handleUpdateWidget(selectedWidget.id, { donutSegments: updated });
                                    }}
                                    className="flex-1 text-xs border border-slate-300 rounded px-1.5 py-1 bg-white font-semibold focus:outline-none focus:border-[#1a237e]"
                                    placeholder="Segment name"
                                  />
                                  <div className="flex items-center space-x-1 shrink-0">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={seg.pct}
                                      onChange={(e) => {
                                        const updated = [...(selectedWidget.donutSegments || [])];
                                        const newPct = Number(e.target.value);
                                        updated[sIdx] = {
                                          ...updated[sIdx],
                                          pct: newPct,
                                          count: `${newPct}%`,
                                        };
                                        handleUpdateWidget(selectedWidget.id, { donutSegments: updated });
                                      }}
                                      className="w-14 text-xs font-mono font-bold text-indigo-900 border border-slate-300 rounded px-1.5 py-1 bg-white text-right focus:outline-none focus:border-[#1a237e]"
                                    />
                                    <span className="text-[10px] text-slate-500 font-bold">%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chart Data Points Editor */}
                        {selectedWidget.dataPoints && (
                          <div className="space-y-1.5 pt-1 border-t border-slate-200">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Chart Data Points (Live Data)
                            </label>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {selectedWidget.dataPoints.map((pt, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={pt.label}
                                    onChange={(e) => {
                                      const updated = [...(selectedWidget.dataPoints || [])];
                                      updated[pIdx] = { ...updated[pIdx], label: e.target.value };
                                      handleUpdateWidget(selectedWidget.id, { dataPoints: updated });
                                    }}
                                    className="flex-1 text-xs border border-slate-300 rounded px-1.5 py-1 bg-white font-semibold focus:outline-none focus:border-[#1a237e]"
                                    placeholder="Label"
                                  />
                                  <input
                                    type="number"
                                    value={pt.value}
                                    onChange={(e) => {
                                      const updated = [...(selectedWidget.dataPoints || [])];
                                      updated[pIdx] = { ...updated[pIdx], value: Number(e.target.value) };
                                      handleUpdateWidget(selectedWidget.id, { dataPoints: updated });
                                    }}
                                    className="w-20 text-xs font-mono font-bold text-indigo-900 border border-slate-300 rounded px-1.5 py-1 bg-white text-right focus:outline-none focus:border-[#1a237e]"
                                    placeholder="Value"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Funnel Stages Editor */}
                        {selectedWidget.funnelStages && (
                          <div className="space-y-1.5 pt-1 border-t border-slate-200">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Funnel Stages (Live Data)
                            </label>
                            <div className="space-y-1.5">
                              {selectedWidget.funnelStages.map((stg, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={stg.stage}
                                    onChange={(e) => {
                                      const updated = [...(selectedWidget.funnelStages || [])];
                                      updated[fIdx] = { ...updated[fIdx], stage: e.target.value };
                                      handleUpdateWidget(selectedWidget.id, { funnelStages: updated });
                                    }}
                                    className="flex-1 text-xs border border-slate-300 rounded px-1.5 py-1 bg-white font-semibold focus:outline-none"
                                  />
                                  <input
                                    type="number"
                                    value={stg.pct}
                                    onChange={(e) => {
                                      const updated = [...(selectedWidget.funnelStages || [])];
                                      updated[fIdx] = {
                                        ...updated[fIdx],
                                        pct: Number(e.target.value),
                                      };
                                      handleUpdateWidget(selectedWidget.id, { funnelStages: updated });
                                    }}
                                    className="w-14 text-xs font-mono font-bold text-indigo-900 border border-slate-300 rounded px-1.5 py-1 bg-white text-right"
                                  />
                                  <span className="text-[10px] text-slate-500 font-bold">%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Source Twin Binding */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Target Digital Twin
                          </label>
                          <select
                            value={selectedWidget.sourceTwin}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { sourceTwin: e.target.value })
                            }
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          >
                            <option value="WalletDBankingCustomer">WalletDBankingCustomer</option>
                            <option value="AccountTwin">AccountTwin</option>
                            <option value="Bill_to_accountTwin">Bill_to_accountTwin</option>
                            <option value="AnalyzerPacket">AnalyzerPacket</option>
                          </select>
                        </div>

                        {/* Bound Attribute */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Bound Twin Attribute
                          </label>
                          <select
                            value={selectedWidget.attribute}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { attribute: e.target.value })
                            }
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          >
                            <option value="balance_avg_90d">balance_avg_90d</option>
                            <option value="spend_velocity_30d">spend_velocity_30d</option>
                            <option value="fico_score">fico_score</option>
                            <option value="mileage_bin_category">mileage_bin_category</option>
                            <option value="visit_propensity_score">visit_propensity_score</option>
                            <option value="dealership_priority_rank">dealership_priority_rank</option>
                            <option value="branch_region_uptake">branch_region_uptake</option>
                            <option value="cross_sell_index">cross_sell_index</option>
                          </select>
                        </div>

                        {/* Aggregation Function */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Aggregation Metric
                          </label>
                          <select
                            value={selectedWidget.aggregation}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { aggregation: e.target.value as any })
                            }
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          >
                            <option value="SUM">SUM (Cumulative Vector)</option>
                            <option value="AVG">AVG (Cohort Arithmetic Mean)</option>
                            <option value="COUNT">COUNT (Entity Frequency)</option>
                            <option value="MAX">MAX (Peak Observation)</option>
                            <option value="P95">P95 (95th Percentile)</option>
                          </select>
                        </div>

                        {/* Refresh Interval */}
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Streaming SLA Refresh
                          </label>
                          <select
                            value={selectedWidget.refreshRate}
                            onChange={(e) =>
                              handleUpdateWidget(selectedWidget.id, { refreshRate: e.target.value })
                            }
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                          >
                            <option value="Real-time (Kafka)">Real-time (Kafka Stream)</option>
                            <option value="1 min">1 minute micro-batch</option>
                            <option value="5 mins">5 minutes snapshot</option>
                            <option value="1 hour">1 hour rollup</option>
                          </select>
                        </div>

                        {/* Threshold Settings for KPI / Health / Simulation widgets */}
                        {(selectedWidget.type === 'kpi-twin-health' ||
                          selectedWidget.type === 'kpi-active-simulations' ||
                          selectedWidget.thresholdWarning !== undefined ||
                          selectedWidget.thresholdCritical !== undefined ||
                          selectedWidget.thresholdTarget !== undefined) && (
                          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                                SLA & Threshold Alerts
                              </span>
                              <span className="text-[10px] font-mono text-amber-700">
                                Unit: {selectedWidget.thresholdUnit || ''}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-emerald-800 mb-0.5">
                                  Target
                                </label>
                                <input
                                  type="number"
                                  value={selectedWidget.thresholdTarget ?? ''}
                                  onChange={(e) =>
                                    handleUpdateWidget(selectedWidget.id, {
                                      thresholdTarget: e.target.value === '' ? undefined : Number(e.target.value),
                                    })
                                  }
                                  className="w-full text-xs font-mono border border-emerald-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  placeholder="90"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-amber-800 mb-0.5">
                                  Warning
                                </label>
                                <input
                                  type="number"
                                  value={selectedWidget.thresholdWarning ?? ''}
                                  onChange={(e) =>
                                    handleUpdateWidget(selectedWidget.id, {
                                      thresholdWarning: e.target.value === '' ? undefined : Number(e.target.value),
                                    })
                                  }
                                  className="w-full text-xs font-mono border border-amber-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  placeholder="75"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-rose-800 mb-0.5">
                                  Critical
                                </label>
                                <input
                                  type="number"
                                  value={selectedWidget.thresholdCritical ?? ''}
                                  onChange={(e) =>
                                    handleUpdateWidget(selectedWidget.id, {
                                      thresholdCritical: e.target.value === '' ? undefined : Number(e.target.value),
                                    })
                                  }
                                  className="w-full text-xs font-mono border border-rose-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                                  placeholder="60"
                                />
                              </div>
                            </div>

                            {/* Live Alert Trigger Simulation for Twin Health */}
                            {selectedWidget.type === 'kpi-twin-health' && (
                              <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                                <div className="text-[10px] text-amber-900 leading-tight">
                                  <span className="font-bold block">Test Alert System:</span>
                                  <span className="text-amber-700">Notifies Assistant Drawer immediately</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateWidget(selectedWidget.id, { value: '58.4%' });
                                    alertService.evaluateTwinHealth(
                                      selectedWidget.id,
                                      selectedWidget.title,
                                      selectedWidget.sourceTwin,
                                      58.4,
                                      selectedWidget.thresholdCritical ?? 65,
                                      selectedWidget.thresholdWarning ?? 80
                                    );
                                    setToastMessage('Triggered Critical Alert: Health dropped to 58.4% (<65%)');
                                    setSaveSuccessToast(true);
                                    setTimeout(() => setSaveSuccessToast(false), 2500);
                                  }}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                                >
                                  Test Drop (&lt;65%)
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Width Layout Span */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-semibold text-slate-600">
                              Grid Width / Span
                            </label>
                            <span className="text-[10px] font-mono text-slate-400">
                              {selectedWidget.gridColSpan || (selectedWidget.width === 'full' ? 4 : 2)} of 4 cols
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {([1, 2, 3, 4] as const).map((cols) => {
                              const activeSpan =
                                selectedWidget.gridColSpan || (selectedWidget.width === 'full' ? 4 : 2);
                              const isSelected = activeSpan === cols;
                              return (
                                <button
                                  key={cols}
                                  type="button"
                                  onClick={() =>
                                    handleUpdateWidget(selectedWidget.id, {
                                      gridColSpan: cols,
                                      width: cols >= 3 ? 'full' : 'half',
                                    })
                                  }
                                  className={`py-1.5 text-[11px] font-semibold rounded border transition-colors ${
                                    isSelected
                                      ? 'bg-blue-50 text-[#1a237e] border-blue-300 shadow-2xs font-bold'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title={`Span ${cols} column${cols > 1 ? 's' : ''}`}
                                >
                                  {cols} Col{cols > 1 ? 's' : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                          <button
                            onClick={() => handleDuplicateWidget(selectedWidget.id)}
                            className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={() => handleRemoveWidget(selectedWidget.id)}
                            className="flex-1 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                        <Sliders className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-600">No Widget Selected</p>
                        <p className="max-w-[200px] mx-auto text-slate-400">
                          Click any widget on the canvas to configure its properties here.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Dashboard Layout Presets */}
                {builderTab === 'presets' && (
                  <div className="p-4 space-y-4 max-h-[640px] overflow-y-auto">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 block">
                          Curated Architecture Presets
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsTemplateGalleryOpen(true)}
                          className="text-[11px] text-[#1a237e] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>Browse Gallery</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Instantly seed your canvas with pre-configured, production-grade digital-twin layouts.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsTemplateGalleryOpen(true)}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Open Template Gallery Modal</span>
                    </button>

                    <div className="space-y-3 pt-1">
                      {/* Preset 1: Executive Operations & Sentinel */}
                      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/60 transition-all space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#1a237e] block">
                              Executive Operations & Sentinel
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              6 widgets · Twin Health, Simulations, Ingress, SLA & Drift
                            </span>
                          </div>
                          <span className="text-[9px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[9px] font-mono text-slate-600">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Twin Health KPI</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Active Sim Load</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Live Telemetry</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Tier-0 SLA</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPresetLayout('executive')}
                          className="w-full py-2 bg-[#1a237e] hover:bg-[#121858] text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Apply Executive Preset</span>
                        </button>
                      </div>

                      {/* Preset 2: Streaming Ingress & Telemetry */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              Streaming Telemetry & Pipeline
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              5 widgets · Real-time ingress, DAG throughput & feature vector
                            </span>
                          </div>
                          <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            STREAMING
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[9px] font-mono text-slate-600">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Ingress Stream</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">DAG Pipeline</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Feature Vector</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Stream Table</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPresetLayout('telemetry')}
                          className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Apply Telemetry Preset</span>
                        </button>
                      </div>

                      {/* Preset 3: Portfolio & Scenario Sensitivity */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              Scenario Sensitivity & FinOps
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              5 widgets · Elasticity matrix, funnel & balance cohort
                            </span>
                          </div>
                          <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                            ANALYTICS
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[9px] font-mono text-slate-600">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Scenario Grid</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Funnel Stages</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Balance Cohorts</span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Commercial Ledger</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPresetLayout('financial')}
                          className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                        >
                          <Sliders className="w-3.5 h-3.5 text-blue-600" />
                          <span>Apply Sensitivity Preset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

      {/* Persistent Docked Handle when Builder is Minimized - guarantees user can NEVER lose it */}
      {isBuilderCollapsed && !isPreviewMode && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 shadow-2xl animate-in slide-in-from-right-3">
          <button
            id="btn-dock-open-builder"
            onClick={() => setIsBuilderCollapsed(false)}
            className="group bg-[#1a237e] hover:bg-[#121858] text-white py-4 px-2.5 rounded-l-xl flex flex-col items-center space-y-2.5 cursor-pointer transition-all transform hover:-translate-x-1 shadow-2xl border-l-2 border-y-2 border-indigo-400"
            title="Restore Builder Studio & Widget Palette"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
              BUILDER STUDIO
            </span>
            <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full font-mono font-bold">
              {WIDGET_PALETTE_ITEMS.length}
            </span>
          </button>
        </div>
      )}

      {/* Floating Bottom Quick Action Button to Add Widgets if Collapsed */}
      {isBuilderCollapsed && !isPreviewMode && (
        <div className="fixed bottom-6 right-6 z-30 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => {
              setIsBuilderCollapsed(false);
              setBuilderTab('widgets');
            }}
            className="px-4 py-2.5 bg-[#1a237e] hover:bg-[#121858] text-white rounded-full font-bold text-xs shadow-xl flex items-center space-x-2 cursor-pointer border border-indigo-300 hover:shadow-2xl transition-all"
            title="Open Builder Studio and add new widgets"
          >
            <Plus className="w-4 h-4" />
            <span>Add Widgets ({WIDGET_PALETTE_ITEMS.length})</span>
          </button>
        </div>
      )}

      {/* Dashboard Mini-map / Navigator floating window */}
      {showMinimap && widgets.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-3 fade-in duration-200">
          <DashboardMinimap
            widgets={widgets}
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

      {/* Dashboard Template Gallery Modal */}
      <DashboardTemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        onApplyTemplate={handleApplyTemplate}
        currentDashboardTitle={dashboardTitle}
      />
    </div>
  );
}
