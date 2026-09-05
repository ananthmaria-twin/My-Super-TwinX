import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,

  CheckCircle2,



  GitBranch,
  LayoutDashboard,
  Plus,


  Sparkles,
  Trash2,

} from 'lucide-react';
import { type UseCaseItem } from '../../types';

interface InputRow {
  id: string;
  alias: string;
  twin: string;
  attribute: string;
  join: string;
  agentConfidence: string;
}

interface ConfigScreen1DataMappingProps {
  useCases: UseCaseItem[];
  selectedUseCaseId: string;
  onSelectUseCase: (id: string) => void;
  onSwitchToCapabilities: () => void;
  onValidateAndActivate?: () => void;
}

export default function ConfigScreen1DataMapping({
  useCases,
  selectedUseCaseId,
  onSelectUseCase,
  onSwitchToCapabilities,
  onValidateAndActivate,
}: ConfigScreen1DataMappingProps) {
  const selectedUseCase =
    useCases.find((uc) => uc.id === selectedUseCaseId) || useCases[0];

  const [baseEntity, setBaseEntity] = useState<string>('WalletDBankingCustomer');
  const [showSufficiencyModal, setShowSufficiencyModal] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [inputRows, setInputRows] = useState<InputRow[]>([
    {
      id: 'row-1',
      alias: 'cust_id',
      twin: 'WalletDBankingCustomer',
      attribute: 'customer_id',
      join: 'PRIMARY KEY',
      agentConfidence: '✦ AI Proposed (99%)',
    },
    {
      id: 'row-2',
      alias: 'deposit_growth',
      twin: 'WalletDBankingCustomer',
      attribute: 'balance_avg_90d',
      join: 'DIRECT',
      agentConfidence: '✦ AI Proposed (98%)',
    },
    {
      id: 'row-3',
      alias: 'credit_score',
      twin: 'WalletDBankingCustomer',
      attribute: 'fico_score',
      join: 'DIRECT',
      agentConfidence: '✦ AI Proposed (96%)',
    },
    {
      id: 'row-4',
      alias: 'card_spend_trend',
      twin: 'WalletDBankingCustomer',
      attribute: 'spend_velocity_30d',
      join: 'DIRECT',
      agentConfidence: '✦ AI Proposed (95%)',
    },
    {
      id: 'row-5',
      alias: 'digital_activity',
      twin: 'WalletDBankingCustomer',
      attribute: 'app_logins_last_month',
      join: 'DIRECT',
      agentConfidence: '✦ AI Proposed (97%)',
    },
    {
      id: 'row-6',
      alias: 'product_holdings',
      twin: 'WalletDBankingCustomer',
      attribute: 'active_accounts_count',
      join: 'DIRECT',
      agentConfidence: '✦ AI Proposed (99%)',
    },
  ]);

  const handleAddRow = () => {
    const newId = `row-${Date.now()}`;
    setInputRows((prev) => [
      ...prev,
      {
        id: newId,
        alias: `input_${prev.length + 1}`,
        twin: baseEntity,
        attribute: 'transaction_frequency_7d',
        join: 'DIRECT',
        agentConfidence: '✦ AI Proposed (94%)',
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setInputRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAnalyzeWithAgent = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSaveToast('AI Agent discovered 2 high-confidence telemetry attributes for Wallet D.');
      setTimeout(() => setSaveToast(null), 4000);
    }, 1200);
  };

  const handleSave = () => {
    setSaveToast('Use case mapping configuration saved successfully.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Use Case Configuration
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          Configure the digital-twin inputs a use case pulls in — re-point them at your referenced (e.g. BigQuery) twins, supply every input parameter, then validate & activate. The AI agent can propose bindings.
        </p>
      </div>

      {/* Main 2-Column Split: Left USE CASES list, Right Config Form */}
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

        {/* Right Column: Configuration Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          {/* Selected Use Case Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedUseCase.title}
            </h2>
          </div>

          {/* Tabs: Data Mapping (active) vs Business Capabilities */}
          <div className="flex border-b border-slate-200 space-x-6">
            <button
              className="pb-3 border-b-2 border-[#1a237e] text-[#1a237e] font-bold text-sm flex items-center space-x-2"
            >
              <GitBranch className="w-4 h-4" />
              <span>Data Mapping</span>
            </button>
            <button
              onClick={onSwitchToCapabilities}
              className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Business Capabilities</span>
            </button>
          </div>

          {/* Draft Notification Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                DRAFT
              </span>
              <span>
                Mapping editable — bind inputs to your customer data, run the sufficiency check, then Validate & Activate to publish (locks it).
              </span>
            </div>
            <button
              onClick={() => setShowSufficiencyModal(true)}
              className="text-[#1a237e] hover:underline font-semibold whitespace-nowrap self-start sm:self-auto flex items-center space-x-1"
            >
              <span>Discover sources</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Check Sufficiency Trigger Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSufficiencyModal(true)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center space-x-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Check sufficiency</span>
            </button>
          </div>

          {/* Base Entity Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Base entity (entity_twin)
            </label>
            <input
              type="text"
              value={baseEntity}
              onChange={(e) => setBaseEntity(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white shadow-2xs"
            />
          </div>

          {/* Twin Inputs Table */}
          <div className="space-y-3">
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">TWIN INPUTS ALIAS (AS)</th>
                    <th className="py-2.5 px-3">TWIN / ENTITY</th>
                    <th className="py-2.5 px-3">ATTRIBUTE</th>
                    <th className="py-2.5 px-3">JOIN</th>
                    <th className="py-2.5 px-3">AGENT</th>
                    <th className="py-2.5 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {inputRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">
                        {row.alias}
                      </td>
                      <td className="py-2.5 px-3 text-[#1a237e] font-semibold">
                        {row.twin}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {row.attribute}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            row.join === 'PRIMARY KEY'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.join}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                          <span>{row.agentConfidence}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove input"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add input button */}
            <button
              onClick={handleAddRow}
              className="text-xs font-semibold text-[#1a237e] hover:text-blue-800 flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add input</span>
            </button>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAnalyzeWithAgent}
                disabled={isAnalyzing}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2 shadow-2xs disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing schema...' : '✦ Analyze with agent'}</span>
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Save configuration
              </button>
            </div>

            <button
              onClick={() => {
                if (onValidateAndActivate) {
                  onValidateAndActivate();
                } else {
                  setSaveToast('Contract validated and activated for production.');
                  setTimeout(() => setSaveToast(null), 3000);
                }
              }}
              className="px-4 py-2 bg-[#1a237e] hover:bg-[#121858] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Validate & Activate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sufficiency Check Modal */}
      {showSufficiencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Data Sufficiency Check — {selectedUseCase.title}
                </h3>
              </div>
              <button
                onClick={() => setShowSufficiencyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Sufficiency</span>
                <div className="text-xl font-extrabold text-emerald-900 mt-0.5">94.2%</div>
                <p className="text-[10px] text-emerald-700">Pass (≥ 85%)</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Freshness</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">98.1%</div>
                <p className="text-[10px] text-slate-500">&lt; 60s SLA</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Completeness</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">92.4%</div>
                <p className="text-[10px] text-slate-500">Non-null values</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Twin Coverage</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">95.0%</div>
                <p className="text-[10px] text-slate-500">Active cohort</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Advisory Notice</span>
              </div>
              <p className="text-amber-800 text-[11px]">
                All required attributes meet latency SLAs. <code>WalletDBankingCustomer</code> online store has a 99.8% cache hit rate.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSufficiencyModal(false)}
                className="px-4 py-1.5 bg-[#1a237e] text-white rounded-lg text-xs font-semibold hover:bg-[#121858] transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
