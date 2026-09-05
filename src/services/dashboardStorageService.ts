import { type DashboardDefinition, type DashboardWidget, type WidgetPaletteType } from '../types';
import { INITIAL_DASHBOARDS, WIDGET_PALETTE_ITEMS, type PaletteItemDefinition } from '../data/dashboardMockData';

const STORAGE_KEY = 'twinx_saved_dashboards';
const ACTIVE_DASHBOARD_KEY = 'twinx_active_dashboard_id';

export interface DashboardTemplate {
  id: string;
  name: string;
  category: 'Operations' | 'Finance' | 'Simulation' | 'Executive' | 'Telemetry';
  description: string;
  tag: string;
  badge: string;
  widgetTypes: WidgetPaletteType[];
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'tpl-operational-health',
    name: 'Operational Health & Runtime Sentinel',
    category: 'Operations',
    description: 'Mission-critical telemetry dashboard tracking twin health scores, Kafka event ingress streams, Tier-0 SLA adherence, and DAG pipeline throughput.',
    tag: 'Production Ops',
    badge: '6 Widgets',
    widgetTypes: [
      'kpi-twin-health',
      'telemetry-stream',
      'sla-compliance',
      'pipeline-throughput',
      'anomaly-radar',
      'table',
    ],
  },
  {
    id: 'tpl-financial-forecast',
    name: 'Financial Forecast & Sensitivity Matrix',
    category: 'Finance',
    description: 'Executive revenue and balance cohort analysis featuring a 3x3 scenario elasticity grid, cross-sell funnel conversion, and transaction ledger.',
    tag: 'FinOps & Strategy',
    badge: '5 Widgets',
    widgetTypes: [
      'kpi-card',
      'scenario-sensitivity',
      'funnel',
      'bar',
      'table',
    ],
  },
  {
    id: 'tpl-simulation-overview',
    name: 'Simulation Overview & Monte Carlo Engine',
    category: 'Simulation',
    description: 'Synthetic scenario execution studio tracking active worker concurrency, multi-axis feature vector drift, elasticity scores, and partition load.',
    tag: 'Twin Scenarios',
    badge: '6 Widgets',
    widgetTypes: [
      'kpi-active-simulations',
      'scenario-sensitivity',
      'anomaly-radar',
      'twin-feature-vector',
      'pipeline-throughput',
      'kpi-trend',
    ],
  },
  {
    id: 'tpl-executive-sentinel',
    name: 'Executive Sentinel & SLA Portfolio',
    category: 'Executive',
    description: 'High-level executive briefing summarizing portfolio health indices, Tier-0 SLA uptime, revenue trajectory sparks, and risk cohort donuts.',
    tag: 'C-Suite Briefing',
    badge: '5 Widgets',
    widgetTypes: [
      'kpi-twin-health',
      'kpi-card',
      'sla-compliance',
      'line',
      'donut',
    ],
  },
  {
    id: 'tpl-edge-telemetry',
    name: 'Streaming Telemetry & Pipeline Mesh',
    category: 'Telemetry',
    description: 'Real-time distributed streaming analytics visualizing Kafka partition buffers, transform flow stages, dual-tier vector sync, and low-latency tables.',
    tag: 'Kafka & Flink',
    badge: '5 Widgets',
    widgetTypes: [
      'telemetry-stream',
      'pipeline-throughput',
      'twin-feature-vector',
      'anomaly-radar',
      'table',
    ],
  },
];

type StorageListener = (dashboards: DashboardDefinition[], activeId: string) => void;

class DashboardStorageService {
  private listeners: Set<StorageListener> = new Set();

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const dashboards = this.getDashboards();
    const activeId = this.getActiveDashboardId();
    this.listeners.forEach((listener) => {
      try {
        listener(dashboards, activeId);
      } catch (e) {
        console.error('Error notifying dashboard listener', e);
      }
    });
  }

  public getDashboards(): DashboardDefinition[] {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load dashboards from localStorage', e);
    }
    return INITIAL_DASHBOARDS;
  }

  public saveDashboards(dashboards: DashboardDefinition[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
      this.notify();
    } catch (e) {
      console.error('Failed to save dashboards to localStorage', e);
    }
  }

  public getActiveDashboardId(): string {
    try {
      const active = localStorage.getItem(ACTIVE_DASHBOARD_KEY);
      if (active) {
        const dashboards = this.getDashboards();
        if (dashboards.some((d) => d.id === active)) {
          return active;
        }
      }
    } catch (e) {
      console.error('Failed to read active dashboard id', e);
    }
    const dashboards = this.getDashboards();
    return dashboards[0]?.id || 'dash-wallet-01';
  }

  public setActiveDashboardId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_DASHBOARD_KEY, id);
      this.notify();
    } catch (e) {
      console.error('Failed to save active dashboard id', e);
    }
  }

  public getDashboardById(id: string): DashboardDefinition | null {
    const all = this.getDashboards();
    return all.find((d) => d.id === id) || null;
  }

  public getAllDashboards(): DashboardDefinition[] {
    return this.getDashboards();
  }

  public updateDashboard(updated: DashboardDefinition): void {
    const all = this.getDashboards();
    const idx = all.findIndex((d) => d.id === updated.id);
    let newDashboards: DashboardDefinition[];
    if (idx >= 0) {
      newDashboards = [...all];
      newDashboards[idx] = { ...updated, updatedAt: new Date().toISOString() };
    } else {
      newDashboards = [{ ...updated, updatedAt: new Date().toISOString() }, ...all];
    }
    this.saveDashboards(newDashboards);
  }

  public createWidgetFromPalette(item: PaletteItemDefinition): DashboardWidget {
    const newId = `w-${item.type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    return {
      id: newId,
      type: item.type,
      title: item.title,
      tag: item.tag,
      sourceTwin: item.defaultTwin,
      attribute: item.defaultAttr,
      aggregation: 'AVG',
      refreshRate: '1s',
      value: item.defaultValue,
      secondaryValue: item.defaultSecondary,
      secondaryText: item.defaultSecondary,
      change: item.defaultChange,
      changeType: item.defaultChangeType,
      colorTheme: item.defaultColorTheme,
      width: item.defaultWidth,
      gridColSpan: item.defaultGridColSpan || 2,
      visualMode: 'detailed',
      thresholdTarget: item.thresholdTarget ?? item.defaultGaugeScore ?? 90,
      thresholdWarning: item.thresholdWarning ?? 80,
      thresholdCritical: item.thresholdCritical ?? 65,
      thresholdUnit: item.thresholdUnit ?? (item.type.includes('health') ? '%' : 'units'),
      dataPoints: item.defaultPoints ? [...item.defaultPoints] : undefined,
      funnelStages: item.defaultStages ? [...item.defaultStages] : undefined,
      donutSegments: item.defaultDonut ? [...item.defaultDonut] : undefined,
    };
  }

  public createDashboard(partial: Partial<DashboardDefinition>): DashboardDefinition {
    const newId = `dash-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newDash: DashboardDefinition = {
      id: newId,
      title: partial.title || 'Untitled Dashboard',
      description: partial.description || 'Custom curated layout',
      useCaseId: partial.useCaseId || 'uc-01',
      showInMenu: partial.showInMenu !== undefined ? partial.showInMenu : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: partial.tags || ['Custom'],
      widgets: partial.widgets || [],
      isDefault: false,
    };
    const all = this.getDashboards();
    this.saveDashboards([newDash, ...all]);
    this.setActiveDashboardId(newId);
    return newDash;
  }

  public createFromTemplate(
    template: DashboardTemplate,
    useCaseId: string = 'uc-01'
  ): DashboardDefinition {
    const newId = `dash-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const widgets: DashboardWidget[] = template.widgetTypes
      .map((type) => {
        const item = WIDGET_PALETTE_ITEMS.find((p) => p.type === type);
        return item ? this.createWidgetFromPalette(item) : null;
      })
      .filter(Boolean) as DashboardWidget[];

    const newDash: DashboardDefinition = {
      id: newId,
      title: template.name,
      description: template.description,
      useCaseId,
      showInMenu: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [template.category, template.tag, 'Template'],
      widgets,
    };

    const all = this.getDashboards();
    this.saveDashboards([newDash, ...all]);
    this.setActiveDashboardId(newId);
    return newDash;
  }

  public applyTemplateToDashboard(
    dashboardId: string,
    template: DashboardTemplate
  ): DashboardDefinition | null {
    const target = this.getDashboardById(dashboardId);
    if (!target) return null;

    const widgets: DashboardWidget[] = template.widgetTypes
      .map((type) => {
        const item = WIDGET_PALETTE_ITEMS.find((p) => p.type === type);
        return item ? this.createWidgetFromPalette(item) : null;
      })
      .filter(Boolean) as DashboardWidget[];

    const updated: DashboardDefinition = {
      ...target,
      widgets,
      updatedAt: new Date().toISOString(),
    };

    this.updateDashboard(updated);
    return updated;
  }

  public createDashboardFromTemplate(
    title: string,
    templateId?: string,
    useCaseId: string = 'uc-01'
  ): DashboardDefinition {
    const template = DASHBOARD_TEMPLATES.find((t) => t.id === templateId) || DASHBOARD_TEMPLATES[0];
    const newId = `dash-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const widgets: DashboardWidget[] = template.widgetTypes
      .map((type) => {
        const item = WIDGET_PALETTE_ITEMS.find((p) => p.type === type);
        return item ? this.createWidgetFromPalette(item) : null;
      })
      .filter(Boolean) as DashboardWidget[];

    const newDash: DashboardDefinition = {
      id: newId,
      title: title || template.name,
      description: template.description,
      useCaseId,
      showInMenu: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [template.category, template.tag, 'Custom'],
      widgets,
    };

    const all = this.getDashboards();
    this.saveDashboards([newDash, ...all]);
    this.setActiveDashboardId(newId);
    return newDash;
  }

  public duplicateDashboard(id: string): DashboardDefinition | null {
    const target = this.getDashboardById(id);
    if (!target) return null;

    const dupId = `dash-copy-${Date.now().toString(36)}`;
    const duplicatedWidgets: DashboardWidget[] = target.widgets.map((w) => ({
      ...w,
      id: `w-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      dataPoints: w.dataPoints ? [...w.dataPoints] : undefined,
      funnelStages: w.funnelStages ? [...w.funnelStages] : undefined,
      donutSegments: w.donutSegments ? [...w.donutSegments] : undefined,
      tableRows: w.tableRows ? [...w.tableRows] : undefined,
    }));

    const newDash: DashboardDefinition = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: duplicatedWidgets,
    };

    const all = this.getDashboards();
    this.saveDashboards([newDash, ...all]);
    this.setActiveDashboardId(dupId);
    return newDash;
  }

  public deleteDashboard(id: string): void {
    const all = this.getDashboards();
    const remaining = all.filter((d) => d.id !== id);
    this.saveDashboards(remaining);
    const active = this.getActiveDashboardId();
    if (active === id && remaining.length > 0) {
      this.setActiveDashboardId(remaining[0].id);
    }
  }

  public resetToDefaults(): DashboardDefinition[] {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_DASHBOARD_KEY);
    } catch (e) {
      console.error(e);
    }
    this.saveDashboards(INITIAL_DASHBOARDS);
    this.setActiveDashboardId(INITIAL_DASHBOARDS[0].id);
    return INITIAL_DASHBOARDS;
  }
}

export const dashboardStorageService = new DashboardStorageService();
