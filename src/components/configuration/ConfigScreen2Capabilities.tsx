import { useState } from 'react';
import {

  FlaskConical,
  GitBranch,


  LayoutDashboard,
  Lightbulb,
  Settings,
  Sparkles,


} from 'lucide-react';
import { type UseCaseItem } from '../../types';

interface ConfigScreen2CapabilitiesProps {
  useCases: UseCaseItem[];
  selectedUseCaseId: string;
  onSelectUseCase: (id: string) => void;
  onSwitchToDataMapping: () => void;
  onConfigureDashboards: () => void; // Navigates to Config Screen 4!
}

export default function ConfigScreen2Capabilities({
  useCases,
  selectedUseCaseId,
  onSelectUseCase,
  onSwitchToDataMapping,
  onConfigureDashboards,
}: ConfigScreen2CapabilitiesProps) {
  const selectedUseCase =
    useCases.find((uc) => uc.id === selectedUseCaseId) || useCases[0];

  const [previewJourneyModal, setPreviewJourneyModal] = useState<boolean>(false);
  const [howItWorksModal, setHowItWorksModal] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Use Case Configuration
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          Configure the digital-twin inputs a use case pulls in — re-point them at your referenced (e.g. BigQuery) twins, supply every input parameter, then validate & activate. The AI agent can propose bindings.
        </p>
      </div>

      {/* Main 2-Column Split: Left USE CASES list, Right Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: USE CASES (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              USE CASES
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {useCases.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
            {useCases.map((uc) => {
              const isSelected = uc.id === selectedUseCaseId;
              return (
                <button
                  key={uc.id}
                  onClick={() => onSelectUseCase(uc.id)}
                  className={`w-full text-left p-3.5 transition-all flex flex-col items-start ${
                    isSelected
                      ? 'bg-blue-50/60 border-l-4 border-l-[#1a237e] text-slate-900 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700 border-l-4 border-l-transparent'
                  }`}
                >
                  <span
                    className={`text-xs font-semibold leading-snug ${
                      isSelected ? 'text-[#1a237e] font-bold' : 'text-slate-800'
                    }`}
                  >
                    {uc.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">
                    active
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Business Capabilities Cards (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          {/* Selected Use Case Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedUseCase.title}
            </h2>
          </div>

          {/* Tabs: Data Mapping vs Business Capabilities (active) */}
          <div className="flex border-b border-slate-200 space-x-6">
            <button
              onClick={onSwitchToDataMapping}
              className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Data Mapping</span>
            </button>
            <button
              className="pb-3 border-b-2 border-[#1a237e] text-[#1a237e] font-bold text-sm flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Business Capabilities</span>
            </button>
          </div>

          {/* Descriptive Subtitle matching image */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Configure the end-user surfaces {selectedUseCase.title} powers. Each opens its builder; the result appears in this use case's menu for business users.
          </p>

          {/* 3 Interactive Cards in a Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Card 1: Dashboards */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1a237e] flex items-center justify-center border border-blue-100">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dashboards</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Read-only visualisations of the KPIs this use case answers.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <button
                  id="btn-configure-dashboards"
                  onClick={onConfigureDashboards}
                  className="px-3 py-1.5 bg-[#1a237e] hover:bg-[#121858] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure dashboards</span>
                </button>
                <button
                  onClick={() => setHowItWorksModal('Dashboards')}
                  className="text-xs text-slate-500 hover:text-slate-800 hover:underline font-medium"
                >
                  How it works
                </button>
              </div>
            </div>

            {/* Card 2: Insights & Priorities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Insights & Priorities</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    What is happening + who to act on, in a single decision brief.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewJourneyModal(true)}
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  Preview journey
                </button>
              </div>
            </div>

            {/* Card 3: Experiments */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Experiments</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    A/B or Bayesian test-and-learn on the decisions the use case recommends.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <button
                  onClick={() => setHowItWorksModal('Experiments')}
                  className="px-3 py-1.5 bg-[#1a237e] hover:bg-[#121858] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure experiments</span>
                </button>
                <button
                  onClick={() => setHowItWorksModal('Experiments')}
                  className="text-xs text-slate-500 hover:text-slate-800 hover:underline font-medium"
                >
                  How it works
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Journey Preview Modal */}
      {previewJourneyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Decision Brief & Journey Preview: {selectedUseCase.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewJourneyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 space-y-1.5">
                <div className="font-bold text-[#1a237e] text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Executive Decision Brief</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Targeting 148,200 commercial banking accounts with deposit growth above 15% YoY but credit card share below 25%. Projected revenue lift: +$3.4M annualized through automated credit line expansion offers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target Cohort</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">148,200</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">+12% vs Q2</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Acceptance Rate</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">24.6%</div>
                  <span className="text-[10px] text-slate-500">Bayesian simulated</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Net ARR Impact</span>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">+$3.42M</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">High confidence</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="font-bold text-slate-800 text-[11px]">Actionable Interventions:</span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Trigger commercial relationship manager outreach for accounts with FICO ≥ 740.</li>
                  <li>Auto-issue high-yield corporate liquidity sweep account offers via mobile app banking portal.</li>
                  <li>Re-allocate underwriting risk buffers using the digital twin real-time balance vector.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewJourneyModal(false)}
                className="px-4 py-1.5 bg-[#1a237e] text-white rounded-lg text-xs font-semibold hover:bg-[#121858] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works modal */}
      {howItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                How {howItWorksModal} Work
              </h3>
              <button
                onClick={() => setHowItWorksModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When business capabilities are configured, TwinX automatically provisions real-time materialized views and subscribes to the digital twin ontology state. Business stakeholders can view self-service analytics directly within this use case&apos;s workspace.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHowItWorksModal(null)}
                className="px-4 py-1.5 bg-[#1a237e] text-white rounded-lg text-xs font-semibold hover:bg-[#121858] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
