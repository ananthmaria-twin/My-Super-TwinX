import { useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,



  X,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'storybook' | 'prompt'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const architectureDoc = `# TCS TwinX™ Platform Demo Specification & Architecture

## Overview
The **TCS TwinX™** platform demo showcases a Digital Twin-Driven Analytics Engine. This build implements a single page in full depth — **Configuration → Business Capabilities → Dashboard Configuration Studio** — a live canvas builder for KPI and chart widgets bound to digital-twin telemetry (e.g. the Twin Health Score widget with configurable Warning/Critical/Target thresholds). Every other left-menu destination is an intentional placeholder screen, kept only to preserve the navigation shell shown in the source screenshots.

### Screen & Navigation Mapping
1. **Configuration → Business Capabilities → Dashboard Configuration Studio** (fully implemented):
   - Use case selector (\`US Bank Wallet D — Relationship Deepening\`), Data Mapping and Capabilities steps, and the Dashboards view.
   - Builder Studio side panel: Widgets / Inspector / Presets tabs, a searchable widget palette (Twin Health Score, Active Simulation Count, KPI Summary Card, KPI Trend Momentum, KPI Performance Radial Gauge, Multi-Metric Cohort Tile, and more).
   - Drag-to-canvas layout, inline-editable widget titles and threshold bounds, Compact/Detailed view toggle, width controls, Export/Import JSON, Live Preview, and Save Dashboard.
2. **Catalog, Pipelines, Studio, Data Sources, Digital Twins, Live Features, Notebooks, Operations** (placeholders):
   - Each renders a simple centered placeholder card with an icon, title, and one line of description — no functional data or interactions. They exist solely so the left-menu navigation matches the uploaded design.

## Design Rules
- Theme: Ultra-clean white enterprise palette (Light gray #f8f9fb background, white cards, border-slate-200, dark navy #1a237e accents). No dark mode.
- High visual fidelity to the uploaded TCS TwinX™ Dashboard Configuration Studio screenshots.
`;

  const storybookDoc = `// Storybook Component Specification
export default {
  title: 'TwinX/PlatformShell',
  component: PlatformShell,
  parameters: {
    layout: 'fullscreen',
    theme: 'light',
  },
};

export const DashboardConfigurationStudio = () => <ConfigurationModule />;

// Everything below is an intentional placeholder — not implemented in this demo.
export const UseCasesCatalog = () => <PlaceholderModule />;
export const PipelinesWorkflowDAG = () => <PlaceholderModule />;
export const StudioNodeEditor = () => <PlaceholderModule />;
export const DigitalTwinsEngine = () => <PlaceholderModule />;
export const LiveFeaturesCache = () => <PlaceholderModule />;
export const AnalyticalNotebooks = () => <PlaceholderModule />;
export const OperationsDriftMonitoring = () => <PlaceholderModule />;
`;

  const promptDoc = `### High-Level Demo Project Prompt for Claude Code:
"Build a Platform Demo Project that implements only the Configuration → Business Capabilities → Dashboard Configuration Studio page, using React, TypeScript, and Tailwind CSS.
The platform must adhere strictly to a clean white theme (no dark mode) and stay faithful to the uploaded design.

Navigation framework:
- Left menu items: Catalog, Configuration, Pipelines, Studio, Data Sources, Digital Twins, Live Features, Notebooks, Operations (Model Drift, Monitoring).
- Clicking Configuration opens the Business Capabilities tab, which loads the Dashboard Configuration Studio.
- All other left-menu destinations render a simple dummy placeholder (icon, title, one-line description) — no functional data or interactions.

Dashboard Configuration Studio (fully implemented):
- Header: 'Dashboard — US Bank Wallet D — Relationship Deepening'.
- Description: 'Live executive intelligence and predictive cohort analytics over the digital-twin mesh.'
- Indicators: Live Kafka Stream Attached, widget count.
- Empty state: 'No Widgets on this Dashboard...' with an 'Add Widgets in Builder' action.
- Controls: Add Widgets in Builder, Edit in Builder, Export JSON, Import JSON, Print/PDF, Export CSV, Live Preview.
- Builder Studio side panel with Widgets / Inspector / Presets tabs and a widget palette (Twin Health Score, Active Simulation Count, KPI Summary Card, KPI Trend Momentum, KPI Performance Radial Gauge, Multi-Metric Cohort Tile, and more).
- Example widget: Twin Health Score showing 94.2% OPTIMAL with configurable Critical/Warning/Target thresholds and inline metrics (Invariants, Sync, P99)."`;

  const activeContent =
    activeTab === 'architecture'
      ? architectureDoc
      : activeTab === 'storybook'
      ? storybookDoc
      : promptDoc;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `twinx-${activeTab}-spec.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a237e] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                TCS TwinX™ Demo Specification & Deliverables
              </h2>
              <p className="text-xs text-slate-500">
                Architecture blueprint, Storybook component specs, and generation prompt
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a237e] hover:bg-[#121858] text-white flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-slate-200 flex space-x-4 text-xs font-medium bg-white">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-[#1a237e] text-[#1a237e] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Architecture Spec
          </button>
          <button
            onClick={() => setActiveTab('storybook')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'storybook'
                ? 'border-[#1a237e] text-[#1a237e] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Storybook / UI Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'prompt'
                ? 'border-[#1a237e] text-[#1a237e] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Generation Prompt
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
