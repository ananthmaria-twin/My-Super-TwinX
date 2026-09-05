import { useState, useEffect } from 'react';
import {








  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  Wrench,
  X,

} from 'lucide-react';
import { alertService, type TwinHealthAlert } from '../../services/alertService';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  isAlert?: boolean;
}

export default function AssistantDrawer({ isOpen, onClose }: AssistantDrawerProps) {
  const [alerts, setAlerts] = useState<TwinHealthAlert[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your TCS TwinX™ Copilot. I actively monitor runtime digital twin invariants, DAG pipelines, and telemetry health thresholds. If any Twin Health Score breaches critical bounds, I will alert you here immediately.',
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosingAlertId, setDiagnosingAlertId] = useState<string | null>(null);

  // Subscribe to alertService for live updates
  useEffect(() => {
    const unsubscribe = alertService.subscribe((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });
    return () => unsubscribe();
  }, []);

  const samplePrompts = [
    'Explain active Twin Health Score alerts',
    'Run diagnostic on telematics ingestion lag',
    'How does Automotive Campaign map to AccountTwin?',
    'Show Redis Tier-0 serving latency stats',
  ];

  const handleRunDiagnostic = (alert: TwinHealthAlert) => {
    setDiagnosingAlertId(alert.id);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Diagnose and remediate Twin Health Score drop (${alert.currentScore}%) for ${alert.twinName}`,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const diagSnippet = `[TwinX Diagnostics Agent v4.2]
Entity: ${alert.twinName} | Widget: ${alert.widgetTitle}
Trigger: Health Score ${alert.currentScore}% < Critical Gate ${alert.criticalThreshold}%

Root Cause Breakdown:
1. Telematics Ingress Buffer: Lag spiked to 4.2s on Kafka topic 'telematics.vehicle.prod'.
2. Feature Vector Staleness: 14% of vehicle twins missing updated odo_miles within 60s.
3. Redis Cache Hit Ratio: Dropped to 94.1% during shard rebalancing.

Remediation Step Completed:
✓ Auto-flushed Kafka backpressure consumer pool.
✓ Re-synchronized dual-tier Redis Enterprise partition.
✓ Re-scored LightGBM propensity model invariants.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: `**Automated Health Diagnostic & Stream Remediation Completed** for **${alert.twinName}**.\n\nI isolated the root cause to a temporary buffer lag on the real-time telematics stream and auto-reconciled the Redis tier-0 cache partitions. Invariant freshness is restored to **98.4%**.`,
          timestamp: 'Just now',
          codeSnippet: diagSnippet,
        },
      ]);
      setDiagnosingAlertId(null);
      setIsTyping(false);
      alertService.acknowledgeAlert(alert.id);
    }, 1200);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let snippet: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('alert') || lower.includes('health') || lower.includes('threshold')) {
        const activeAlerts = alerts.filter((a) => !a.acknowledged);
        if (activeAlerts.length > 0) {
          reply = `There is currently **${activeAlerts.length} Active Critical Alert**:\n\n• **${activeAlerts[0].widgetTitle}** on **${activeAlerts[0].twinName}**: Current score **${activeAlerts[0].currentScore}%** is below the critical threshold gate of **${activeAlerts[0].criticalThreshold}%**.\n\nKey degraded factors:\n1. Telematics Freshness (Lag > 4.2s)\n2. Identity Graph Completeness\n3. LightGBM inference drift index\n\nYou can click **Run Diagnostic** above to trigger instant self-healing reconciliation.`;
          snippet = `// Current Health Vector:\nhealth_score = ${activeAlerts[0].currentScore}%\ncritical_threshold = ${activeAlerts[0].criticalThreshold}%\nstatus = 'CRITICAL_INVARIANT_BREACH'`;
        } else {
          reply = `All Digital Twin Health Scores are currently **Optimal**! Invariants are within specified threshold limits across all active use cases. Target: ≥90%, Warning: 80%, Critical: 65%.`;
        }
      } else if (lower.includes('automotive') || lower.includes('mileage')) {
        reply =
          'The **Automotive Campaign — Targeting & Priority** use case connects vehicle telematics and service records to `AccountTwin`. It categorizes vehicles through the **Mileage Bin** transform node into 4 intervals [BIN_0_10K, BIN_10_30K, BIN_30_60K, BIN_60K_PLUS] and computes LightGBM-based `visit_propensity_score` to prioritize dealer service booking offers.';
        snippet = `// Automotive DAG Mapping:\nvehicle_telematics_stream -> Mileage Binning -> Visit Propensity Inference -> Priority Decision Matrix -> Campaign Sink`;
      } else if (lower.includes('redis') || lower.includes('latency') || lower.includes('tier-0')) {
        reply =
          '**TwinX Dual-Tier Architecture** writes live features simultaneously to **Redis Enterprise Tier-0** for online serving (mean latency 1.15ms, p99 < 1.45ms, 99.8% cache hit rate) and **Google BigQuery / Apache Iceberg** for historical offline training and longitudinal drift diagnostics.';
      } else if (lower.includes('sufficiency') || lower.includes('config')) {
        reply =
          'The **Use Case Configuration** workflow consists of three steps:\n1. **Data Mapping**: Align twin schema attributes to use case inputs.\n2. **Sufficiency Check**: Validates field completeness (92.4%), freshness (98.1%), and overall score (94.2%).\n3. **Validate & Activate**: Executes dry-run test against 100 sample twins, checks contract compliance, and activates streaming execution.';
      } else if (lower.includes('sql') || lower.includes('query')) {
        reply =
          'Here is the production SQL expression for inspecting elevated churn risks in `AccountTwin`:';
        snippet = `SELECT account_id, account_arr, churn_probability, support_tier, active_users_30d\nFROM AccountTwin\nWHERE churn_probability > 0.35\nORDER BY account_arr DESC\nLIMIT 10;`;
      } else {
        reply = `I have analyzed your request regarding "${text}". In the TCS TwinX mesh, use case capabilities bind directly to dynamic digital twin state vectors, ensuring sub-second inference synchronization across all connected enterprise systems.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: 'Just now',
          codeSnippet: snippet,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="fixed bottom-4 right-4 w-[430px] max-w-[calc(100vw-2rem)] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Drawer Header */}
      <div className="px-4 py-3 bg-[#1a237e] text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold tracking-tight">TCS TwinX™ Assistant</h3>
              {unacknowledgedAlerts.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-xs">
                  {unacknowledgedAlerts.length} ALERT
                </span>
              )}
            </div>
            <p className="text-[10px] text-blue-200">Twin Architect & Runtime Sentinel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition-colors cursor-pointer"
          title="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* High-Priority Active Alert Sentinel Banner */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-rose-50 border-b border-rose-200 p-3 space-y-2 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Threshold Alert · Twin Health Score
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
              CRITICAL BREACH
            </span>
          </div>

          {unacknowledgedAlerts.map((alt) => (
            <div
              key={alt.id}
              className="bg-white rounded-lg p-2.5 border border-rose-200 shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{alt.widgetTitle}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Target Twin: <strong className="text-slate-700">{alt.twinName}</strong>
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-rose-600 font-black text-sm">{alt.currentScore}%</div>
                  <div className="text-[9px] text-slate-400">Critical: &lt;{alt.criticalThreshold}%</div>
                </div>
              </div>

              {/* Degraded Sub-vectors breakdown */}
              <div className="space-y-1 bg-rose-50/60 p-2 rounded border border-rose-100 text-[10px] font-mono">
                {alt.subVectorDegradations.map((deg, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-600">
                    <span className="truncate max-w-[200px]">{deg.name}:</span>
                    <span className="font-semibold text-rose-700">{deg.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  onClick={() => handleRunDiagnostic(alt)}
                  disabled={diagnosingAlertId === alt.id}
                  className="flex-1 px-2.5 py-1.5 bg-[#1a237e] hover:bg-[#121858] disabled:opacity-50 text-white rounded text-[11px] font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {diagnosingAlertId === alt.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Running Healing...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3 h-3 text-cyan-300" />
                      <span>Run Auto-Diagnostic</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => alertService.acknowledgeAlert(alt.id)}
                  className="px-2 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-[11px] font-medium transition-colors"
                  title="Acknowledge and dismiss banner"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f8f9fb]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.codeSnippet && (
                <pre className="mt-2 p-2 bg-slate-900 text-cyan-300 rounded text-[11px] font-mono overflow-x-auto">
                  {msg.codeSnippet}
                </pre>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400 w-24 shadow-xs">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {samplePrompts.slice(0, 2).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask TwinX Copilot or check health..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim()}
          className="p-2 bg-[#1a237e] hover:bg-[#121858] disabled:opacity-40 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

