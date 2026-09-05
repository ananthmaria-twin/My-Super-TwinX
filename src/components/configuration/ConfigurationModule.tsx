import React, { useState, useEffect } from 'react';
import {


  CheckCircle2,




  RefreshCw,
  Terminal,
  Zap,
} from 'lucide-react';
import { type NavModuleId, type DashboardDefinition } from '../../types';
import { USE_CASES_DATA } from '../../data/mockData';
import { INITIAL_DASHBOARDS } from '../../data/dashboardMockData';
import ConfigScreen1DataMapping from './ConfigScreen1DataMapping';
import ConfigScreen2Capabilities from './ConfigScreen2Capabilities';
import ConfigScreen4Dashboards from './ConfigScreen4Dashboards';
import ConfigScreen5Builder from './ConfigScreen5Builder';
import ThemeCustomizationPanel from './ThemeCustomizationPanel';

export type ConfigStep =
  | 'screen-1-data-mapping'
  | 'screen-2-capabilities'
  | 'screen-4-dashboards'
  | 'screen-5-builder';

interface ConfigurationModuleProps {
  key?: React.Key;
  onNavigateToModule?: (module: NavModuleId) => void;
  resetKey?: number;
}

export default function ConfigurationModule({

  resetKey,
}: ConfigurationModuleProps) {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<ConfigStep>('screen-1-data-mapping');
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>('uc-01'); // US Bank Wallet D
  const [validationModalOpen, setValidationModalOpen] = useState<boolean>(false);
  const [dryRunRunning, setDryRunRunning] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [dryRunLogs, setDryRunLogs] = useState<string[]>([
    '[INIT 00:00:01] Binding contract: WalletDBankingCustomer -> US Bank Wallet D (Relationship Deepening)',
    '[PASS 00:00:02] Schema contract: 6 fields mapped to Kafka topic stream: `prod.banking.walletd.events`',
    '[PASS 00:00:03] Latency check: P99 latency is 1.4ms (SLA threshold < 50ms)',
    '[READY 00:00:04] Ready for live activation',
  ]);

  // Dashboards persistence & management
  const [dashboards, setDashboards] = useState<DashboardDefinition[]>(() => {
    try {
      const stored = localStorage.getItem('twinx_saved_dashboards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored dashboards', e);
    }
    return INITIAL_DASHBOARDS;
  });

  const [activeDashboardId, setActiveDashboardId] = useState<string>(
    INITIAL_DASHBOARDS[0]?.id || 'dash-wallet-01'
  );

  // Dashboard being edited in Screen 5 (null = new dashboard)
  const [editingDashboard, setEditingDashboard] = useState<DashboardDefinition | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twinx_saved_dashboards', JSON.stringify(dashboards));
    } catch (e) {
      console.error('Failed to save dashboards to localStorage', e);
    }
  }, [dashboards]);

  // When resetKey changes (e.g. user clicks "Configuration" in the left menu), reset to Screen 1
  useEffect(() => {
    setCurrentStep('screen-1-data-mapping');
  }, [resetKey]);

  const selectedUseCase =
    USE_CASES_DATA.find((uc) => uc.id === selectedUseCaseId) || USE_CASES_DATA[0];

  // Save Dashboard from Screen 5
  const handleSaveDashboard = (saved: DashboardDefinition, navigateToView: boolean = false) => {
    setDashboards((prev) => {
      const existsIndex = prev.findIndex((d) => d.id === saved.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = saved;
        return updated;
      } else {
        return [saved, ...prev];
      }
    });

    setActiveDashboardId(saved.id);
    setEditingDashboard(saved);

    if (navigateToView) {
      setCurrentStep('screen-4-dashboards');
    }
  };

  // Delete dashboard
  const handleDeleteDashboard = (dashboardId: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== dashboardId));
    if (activeDashboardId === dashboardId) {
      const remaining = dashboards.filter((d) => d.id !== dashboardId);
      if (remaining.length > 0) {
        setActiveDashboardId(remaining[0].id);
      }
    }
  };

  const handleExecuteDryRun = () => {
    setDryRunRunning(true);
    setDryRunLogs([
      '[INIT 00:00:01] Preparing test harness for WalletDBankingCustomer...',
      '[STATUS 00:00:02] Ingesting 100 sample customer vectors from partition 0...',
    ]);

    setTimeout(() => {
      setDryRunLogs((prev) => [
        ...prev,
        '[PASS 00:00:03] Schema validation passed: 100/100 twin instances conform to contract.',
        '[PASS 00:00:04] Feature transformation: balance_avg_90d and fico_score computed in 0.8ms.',
        '[WARN 00:00:04] 2 accounts had missing app_logins_last_month; fallback default 0 applied.',
        '[SUCCESS 00:00:05] Dry-run completed with zero fatal schema errors.',
      ]);
      setDryRunRunning(false);
      setIsActivated(true);
    }, 1200);
  };

  return (
    <div id="configuration-module-root" className="space-y-6">
      {/* Screen 1: Data Mapping Tab Open */}
      {currentStep === 'screen-1-data-mapping' && (
        <ConfigScreen1DataMapping
          useCases={USE_CASES_DATA}
          selectedUseCaseId={selectedUseCaseId}
          onSelectUseCase={(id) => setSelectedUseCaseId(id)}
          onSwitchToCapabilities={() => setCurrentStep('screen-2-capabilities')}
          onValidateAndActivate={() => setValidationModalOpen(true)}
        />
      )}

      {/* Screen 2: Business Capabilities Tab Open */}
      {currentStep === 'screen-2-capabilities' && (
        <ConfigScreen2Capabilities
          useCases={USE_CASES_DATA}
          selectedUseCaseId={selectedUseCaseId}
          onSelectUseCase={(id) => setSelectedUseCaseId(id)}
          onSwitchToDataMapping={() => setCurrentStep('screen-1-data-mapping')}
          onConfigureDashboards={() => setCurrentStep('screen-4-dashboards')}
        />
      )}

      {/* Screen 4: Dashboards View */}
      {currentStep === 'screen-4-dashboards' && (
        <ConfigScreen4Dashboards
          selectedUseCase={selectedUseCase}
          dashboards={dashboards}
          activeDashboardId={activeDashboardId}
          onSelectDashboard={(id) => setActiveDashboardId(id)}
          onBackToCapabilities={() => setCurrentStep('screen-2-capabilities')}
          onNewDashboard={() => {
            setEditingDashboard(null);
            setCurrentStep('screen-5-builder');
          }}
          onEditDashboard={(dash) => {
            setEditingDashboard(dash);
            setCurrentStep('screen-5-builder');
          }}
          onDeleteDashboard={handleDeleteDashboard}
          onUpdateDashboard={handleSaveDashboard}
        />
      )}

      {/* Screen 5: Dashboard Builder */}
      {currentStep === 'screen-5-builder' && (
        <ConfigScreen5Builder
          selectedUseCase={selectedUseCase}
          existingDashboard={editingDashboard}
          onClose={() => setCurrentStep('screen-4-dashboards')}
          onSaveDashboard={handleSaveDashboard}
        />
      )}

      {/* Global Theme & Accessibility Customization Panel */}
      {currentStep !== 'screen-5-builder' && (
        <ThemeCustomizationPanel />
      )}

      {/* Validate & Activate Modal */}
      {validationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Production Validation: {selectedUseCase.title}
                </h3>
              </div>
              <button
                onClick={() => setValidationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Execute a dry-run test against 100 live replica twin instances to verify contract integrity before enabling real-time event streaming.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Validation Terminal:</span>
                </span>
                <span>Replica Sample: 100 records</span>
              </div>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1 max-h-48 overflow-y-auto shadow-inner">
                {dryRunLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('[SUCCESS]') || log.includes('[PASS]')
                        ? 'text-emerald-400'
                        : log.includes('[WARN]')
                        ? 'text-amber-400'
                        : log.includes('[STATUS]')
                        ? 'text-cyan-300 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={handleExecuteDryRun}
                disabled={dryRunRunning}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dryRunRunning ? 'animate-spin' : ''}`} />
                <span>{dryRunRunning ? 'Validating...' : 'Run Test Suite'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setValidationModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsActivated(true);
                    setValidationModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isActivated ? 'Activated' : 'Activate Live Stream'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
